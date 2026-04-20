PWA icons
==================

Временные SVG-иконки (vector, масштабируются под любой размер):

  icon.svg           — основная (purpose: any)
  icon-maskable.svg  — для Android home-screen (purpose: maskable, полезная область 80%)

SVG-иконки работают в современных браузерах + Android Chrome (PWA install).
iOS Safari для Add-to-Home-Screen требует PNG apple-touch-icon — он отдаётся
через `src/app/apple-icon.tsx` (Next.js ImageResponse, runtime PNG).

Когда появится финальный логотип от дизайнера — заменить icon.svg (bounds 512×512)
и добавить PNG-версии по размерам 192 и 512 для старых браузеров.
