/**
 * Скрипт проверки 301-редиректов миграции
 * Запуск: pnpm exec tsx migration/check-redirects.ts [base_url]
 * По умолчанию: https://test.inlog24.ru (staging)
 * Для прода: pnpm exec tsx migration/check-redirects.ts https://inlog24.ru
 */

const BASE_URL = process.argv[2] || "https://test.inlog24.ru";

interface RedirectCheck {
  old_url: string;
  expected_new_path: string;
  actual_status: number;
  actual_location: string;
  target_status: number;
  passed: boolean;
  error?: string;
}

// Карта редиректов: старый путь → ожидаемый новый путь
const REDIRECT_MAP: [string, string][] = [
  // Каталог услуг Joomla
  ["/propusk", "/services"],
  ["/propusk/propusk-na-mkad-dlya-gruzovykh-mashin", "/services/propusk-mkad"],
  ["/propusk/propusk-ttk", "/services/propusk-ttk"],
  ["/propusk/propusk-sk", "/services/propusk-sk"],
  ["/propusk/dnevnoj-propusk-na-mkad", "/services/vremennyj-propusk"],
  ["/propusk/razovyj-propusk-v-moskvu", "/services/vremennyj-propusk"],
  ["/propusk/zakazat-propusk", "/services"],

  // Лендинги Joomla
  ["/propuskm", "/ip-perevozchik"],
  ["/propuskk", "/malye-tk"],
  ["/prop-v-moskwu", "/services"],

  // Инфостраницы
  ["/proverit-propusk", "/check-status"],
  ["/sotrudnichestvo", "/partners"],
  ["/otzivy", "/reviews"],

  // Укороченные дубли
  ["/sotrud", "/partners"],
  ["/cont", "/contacts"],

  // Новости → блог
  ["/novosti", "/blog"],
  ["/novosti/4-osnovnye-prichiny-annulirovaniya-propuskov-v-2020-godu", "/blog/rnis-annulirovanie-propuska-za-chto"],
  ["/novosti/10-kak-oformit-propusk-dlya-gruzovykh-mashin-pyat-oshibok-novichkov", "/blog/kak-oformit-propusk-mkad-samostoyatelno-2026"],
  ["/novosti/11-moskovskij-portal", "/blog/goslog-vmesto-mos-ru-novyy-portal"],
  ["/novosti/14-sboi-iz-za-dk", "/blog/otkazali-v-propuske-chto-delat"],
  ["/novosti/13-registratsiya-ts-v-rnis", "/blog/shtrafy-rnis-chto-eto-kak-obzhalovat"],
  ["/novosti/5-v-ezd-na-ttk-na-gazeli", "/blog/propusk-ttk-sadovoe-otlichie-mkad"],

  // Joomla-артефакты
  ["/index.php", "/"],

  // Legacy-пути
  ["/uslugi", "/services"],
  ["/ceny", "/services"],
  ["/o-kompanii", "/about"],
  ["/kontakty", "/contacts"],
  ["/propusk-mkad", "/services/propusk-mkad"],
  ["/propusk-ttk", "/services/propusk-ttk"],
  ["/propusk-sk", "/services/propusk-sk"],
  ["/vremennyj-propusk", "/services/vremennyj-propusk"],
  ["/godovoj-propusk", "/services/propusk-mkad"],
  ["/otzyvy", "/reviews"],
];

async function checkRedirect(oldPath: string, expectedNewPath: string): Promise<RedirectCheck> {
  const url = `${BASE_URL}${oldPath}`;
  const expectedUrl = `${BASE_URL}${expectedNewPath}`;

  try {
    // Запрос без follow redirect
    const res = await fetch(url, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";
    const actualStatus = res.status;

    // Проверяем что целевая страница отдаёт 200
    let targetStatus = 0;
    if (actualStatus === 301 || actualStatus === 308) {
      try {
        const targetRes = await fetch(location, { redirect: "manual" });
        targetStatus = targetRes.status;
      } catch {
        targetStatus = -1;
      }
    }

    // Нормализуем location для сравнения
    const normalizedLocation = location.replace(/\/$/, "");
    const normalizedExpected = expectedUrl.replace(/\/$/, "");

    const passed =
      actualStatus === 301 &&
      normalizedLocation === normalizedExpected &&
      targetStatus === 200;

    return {
      old_url: oldPath,
      expected_new_path: expectedNewPath,
      actual_status: actualStatus,
      actual_location: location,
      target_status: targetStatus,
      passed,
    };
  } catch (e) {
    return {
      old_url: oldPath,
      expected_new_path: expectedNewPath,
      actual_status: -1,
      actual_location: "",
      target_status: -1,
      passed: false,
      error: String(e),
    };
  }
}

async function main() {
  console.log(`\n🔍 Проверка редиректов на ${BASE_URL}\n`);
  console.log(`Всего редиректов: ${REDIRECT_MAP.length}\n`);

  const results: RedirectCheck[] = [];

  // Проверяем по 5 параллельно
  for (let i = 0; i < REDIRECT_MAP.length; i += 5) {
    const batch = REDIRECT_MAP.slice(i, i + 5);
    const batchResults = await Promise.all(
      batch.map(([old, expected]) => checkRedirect(old, expected))
    );
    results.push(...batchResults);
  }

  // Вывод
  let passed = 0;
  let failed = 0;

  for (const r of results) {
    if (r.passed) {
      passed++;
      console.log(`  ✅ ${r.old_url} → ${r.expected_new_path}`);
    } else {
      failed++;
      console.log(`  ❌ ${r.old_url}`);
      console.log(`     Ожидали: 301 → ${r.expected_new_path}`);
      console.log(`     Получили: ${r.actual_status} → ${r.actual_location || "(нет)"}`);
      if (r.target_status && r.target_status !== 200) {
        console.log(`     Целевая страница: ${r.target_status}`);
      }
      if (r.error) console.log(`     Ошибка: ${r.error}`);
    }
  }

  console.log(`\n📊 Результат: ${passed}/${results.length} прошли, ${failed} провалились\n`);

  // Сохраняем CSV
  const csv = [
    "old_url,expected_new_path,actual_status,actual_location,target_status,passed",
    ...results.map(
      (r) =>
        `"${r.old_url}","${r.expected_new_path}",${r.actual_status},"${r.actual_location}",${r.target_status},${r.passed ? "Y" : "N"}`
    ),
  ].join("\n");

  const fs = await import("fs");
  fs.writeFileSync("migration/redirects_test_report.csv", csv);
  console.log("📄 Отчёт: migration/redirects_test_report.csv\n");

  process.exit(failed > 0 ? 1 : 0);
}

main();
