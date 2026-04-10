"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    ym: (...args: unknown[]) => void;
  }
}

interface YandexMetrikaProps {
  id: string;
}

export function YandexMetrika({ id }: YandexMetrikaProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.ym !== "undefined") {
      window.ym(
        Number(id),
        "hit",
        pathname +
          (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      );
    }
  }, [id, pathname, searchParams]);

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${id}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
      `}
    </Script>
  );
}
