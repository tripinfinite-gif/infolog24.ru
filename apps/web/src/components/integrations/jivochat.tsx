import Script from "next/script";

export function JivoChat() {
  const widgetId = process.env.NEXT_PUBLIC_JIVO_WIDGET_ID;
  if (!widgetId) return null;

  return (
    <Script
      src={`//code.jivosite.com/widget/${widgetId}`}
      strategy="lazyOnload"
    />
  );
}
