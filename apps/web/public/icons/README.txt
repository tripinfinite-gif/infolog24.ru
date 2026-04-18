PWA icons — TODO
==================

Эта папка должна содержать PNG-иконки для Progressive Web App,
на которые ссылается /public/manifest.json.

Нужны файлы (PNG, все с прозрачным фоном или однотонным brand-фоном #7c3aed):

  icon-72.png   — 72×72
  icon-96.png   — 96×96
  icon-128.png  — 128×128
  icon-144.png  — 144×144
  icon-152.png  — 152×152
  icon-192.png  — 192×192   (purpose: any maskable — safe zone 80% от размера)
  icon-384.png  — 384×384
  icon-512.png  — 512×512   (purpose: any maskable — safe zone 80% от размера)

Откуда взять:

  1. Дизайнер экспортирует мастер-SVG из фирстиля → через
     https://realfavicongenerator.net/ или https://maskable.app/
     (последний специально для maskable — проверяет safe-zone).

  2. Быстрый автогенератор из существующего /icon.tsx (ImageResponse 32×32):
     — отрендерить в Figma/Inkscape до 1024×1024, затем прогнать через
       https://progressier.com/pwa-icons-and-ios-icons-generator или
       https://www.pwabuilder.com/imageGenerator

  3. Командная строка (если есть исходный SVG или PNG 1024×1024):
       brew install imagemagick
       for size in 72 96 128 144 152 192 384 512; do
         magick convert source.png -resize ${size}x${size} icon-${size}.png
       done

Maskable icons:
  Для 192 и 512 нужен вариант, у которого полезная область занимает
  центральные 80% (safe zone). Системы Android обрезают углы в зависимости
  от маски устройства, поэтому логотип должен быть компактнее обычного.

Пока этих файлов нет, manifest.json отдаёт битые ссылки на иконки — PWA
устанавливается, но иконка на home screen будет дефолтной (скриншот страницы).
Это ожидаемое временное состояние до замены этого README реальными PNG.
