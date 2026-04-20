#!/usr/bin/env bash
# verify-migration.sh — проверяет, что переезд infolog24.ru на Next.js прошёл
# корректно. Запускается после DNS-свитча и redeploy-а Coolify.
#
# Usage:  bash scripts/verify-migration.sh
# Exit:   0 если всё OK, 1 если хоть одна критичная проверка провалилась.

set -u
DOMAIN="infolog24.ru"
FAIL=0
OK=0

pass() { echo "  ✅ $1"; OK=$((OK+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

section() { echo; echo "━━━ $1 ━━━"; }

section "1. DNS → 109.69.18.80"
for DNS in 8.8.8.8 77.88.8.8 1.1.1.1; do
  IP=$(dig +short @$DNS "$DOMAIN" A 2>/dev/null | head -1)
  if [[ "$IP" == "109.69.18.80" ]]; then
    pass "$DNS видит $DOMAIN → $IP"
  else
    fail "$DNS видит $DOMAIN → $IP (ожидался 109.69.18.80)"
  fi
done

section "2. HTTP/HTTPS"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/")
[[ "$CODE" == "200" ]] && pass "GET https://$DOMAIN/ → 200" || fail "GET https://$DOMAIN/ → $CODE"

CODE_WWW=$(curl -s -o /dev/null -w "%{http_code}" -L "https://www.$DOMAIN/")
[[ "$CODE_WWW" == "200" ]] && pass "GET https://www.$DOMAIN/ (follow) → 200" || fail "GET https://www.$DOMAIN/ → $CODE_WWW"

# www должен редиректить на non-www
WWW_REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" "https://www.$DOMAIN/")
if [[ "$WWW_REDIRECT" =~ ^30[12] ]]; then
  pass "www.$DOMAIN → 301/302 (редирект на non-www)"
else
  fail "www.$DOMAIN → $WWW_REDIRECT (ожидался 301/302)"
fi

section "3. SSL-сертификат (Let's Encrypt)"
CERT_INFO=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null)
echo "$CERT_INFO" | grep -q "Let's Encrypt" && pass "Выдан Let's Encrypt" || fail "Сертификат НЕ от Let's Encrypt: $CERT_INFO"
echo "$CERT_INFO" | grep -q "CN = $DOMAIN" && pass "CN = $DOMAIN" || fail "CN не совпадает: $(echo "$CERT_INFO" | grep subject)"

section "4. Security headers"
HEADERS=$(curl -sI "https://$DOMAIN/")
for H in "strict-transport-security" "x-frame-options" "x-content-type-options" "content-security-policy" "referrer-policy"; do
  if echo "$HEADERS" | grep -iq "^$H:"; then
    pass "$H присутствует"
  else
    fail "$H отсутствует"
  fi
done

# Проверить, что CSP содержит нужные правки
echo "$HEADERS" | grep -i "content-security-policy" | grep -q "worker-src 'self' blob:" && pass "CSP: worker-src blob" || fail "CSP: worker-src blob отсутствует"
echo "$HEADERS" | grep -i "content-security-policy" | grep -q "wss://mc.yandex.ru" && pass "CSP: wss mc.yandex.ru" || fail "CSP: wss mc.yandex.ru отсутствует"

section "5. robots.txt и sitemap.xml"
ROBOTS=$(curl -s "https://$DOMAIN/robots.txt")
if echo "$ROBOTS" | grep -q "Disallow: /$"; then
  fail "robots.txt закрывает от индексации (Disallow: /). Проверь NEXT_PUBLIC_APP_URL"
else
  pass "robots.txt разрешает индексацию"
fi
echo "$ROBOTS" | grep -q "Sitemap: https://$DOMAIN/sitemap.xml" && pass "Sitemap указан" || fail "Sitemap не указан в robots"

SITEMAP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/sitemap.xml")
[[ "$SITEMAP_CODE" == "200" ]] && pass "sitemap.xml → 200" || fail "sitemap.xml → $SITEMAP_CODE"

SITEMAP=$(curl -s "https://$DOMAIN/sitemap.xml")
if echo "$SITEMAP" | grep -q "https://$DOMAIN/"; then
  pass "sitemap содержит $DOMAIN URLs"
else
  fail "sitemap не содержит $DOMAIN (возможно SITE_URL = inlog24.ru)"
fi
if echo "$SITEMAP" | grep -q "https://test.inlog24.ru"; then
  fail "sitemap всё ещё содержит test.inlog24.ru!"
fi

section "6. 301-редиректы со старых Joomla-URLs"
REDIRECTS=(
  "/propusk:/services"
  "/propusk/propusk-na-mkad-dlya-gruzovykh-mashin:/services/propusk-mkad"
  "/propusk/propusk-ttk:/services/propusk-ttk"
  "/propusk/propusk-sk:/services/propusk-sk"
  "/propusk/dnevnoj-propusk-na-mkad:/services/vremennyj-propusk"
  "/propusk/propusk-na-gazel-v-tsentr:/services/propusk-sk"
  "/propuskm:/ip-perevozchik"
  "/propuskk:/malye-tk"
  "/otzivy:/reviews"
  "/proverit-propusk:/check-status"
  "/sotrudnichestvo:/partners"
  "/cont:/contacts"
  "/index.php:/"
  "/novosti:/blog"
)
for pair in "${REDIRECTS[@]}"; do
  FROM="${pair%%:*}"
  TO_EXPECTED="${pair##*:}"
  LOC=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "https://$DOMAIN$FROM")
  CODE="${LOC%% *}"
  REDIR="${LOC#* }"
  if [[ "$CODE" == "301" ]] && echo "$REDIR" | grep -q "$TO_EXPECTED"; then
    pass "$FROM → 301 → ...$TO_EXPECTED"
  else
    fail "$FROM → $CODE $REDIR (ожидался 301 → ...$TO_EXPECTED)"
  fi
done

section "7. Критичные формы — HTTP 200 и наличие полей"
declare -A FORM_PAGES=(
  ["/"]="phone"
  ["/contacts"]="name"
  ["/etrn"]="name"
  ["/goslog"]="name"
  ["/regulatorika/kalendar"]="email"
  ["/calculator"]="Оформить"
)
for path in "${!FORM_PAGES[@]}"; do
  NEEDLE="${FORM_PAGES[$path]}"
  BODY=$(curl -s "https://$DOMAIN$path")
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN$path")
  if [[ "$CODE" == "200" ]] && echo "$BODY" | grep -q "$NEEDLE"; then
    pass "$path → 200, содержит \"$NEEDLE\""
  else
    fail "$path → $CODE (ожидается 200 + строка \"$NEEDLE\")"
  fi
done

section "8. API endpoints отвечают"
for api_test in \
  "POST /api/contacts 400 {}" \
  "GET /api/ping 200 -" \
  ; do
    # Простая проверка, что /api/contacts валидирует
    RESP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://$DOMAIN/api/contacts" -H "Content-Type: application/json" -d '{}')
    [[ "$RESP" == "400" || "$RESP" == "422" ]] && pass "POST /api/contacts с пустым body → $RESP (валидация работает)" || fail "POST /api/contacts → $RESP"
    break
done

section "9. Canonical и og:url на главной"
HEAD=$(curl -s "https://$DOMAIN/" | tr '\n' ' ')
if echo "$HEAD" | grep -qE "rel=\"canonical\"[^>]*href=\"https://$DOMAIN"; then
  pass "<link rel=canonical> → https://$DOMAIN"
elif echo "$HEAD" | grep -qE "rel=\"canonical\"[^>]*href=\"https://inlog24"; then
  fail "<link rel=canonical> → inlog24.ru (старый fallback)"
else
  fail "<link rel=canonical> не найден или указывает на другой домен"
fi
if echo "$HEAD" | grep -qE "property=\"og:url\"[^>]*content=\"https://$DOMAIN"; then
  pass "og:url → https://$DOMAIN"
else
  fail "og:url не найден или указывает на другой домен"
fi

section "РЕЗУЛЬТАТ"
echo "  ✅ Пройдено: $OK"
echo "  ❌ Провалено: $FAIL"
if [[ $FAIL -eq 0 ]]; then
  echo "  🎉 Всё отлично — переезд корректный."
  exit 0
else
  echo "  ⚠️  Есть проблемы — см. ❌ выше."
  exit 1
fi
