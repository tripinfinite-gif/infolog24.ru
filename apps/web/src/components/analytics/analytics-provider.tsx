import { Suspense } from "react";

import { YandexMetrika } from "./yandex-metrika";
import { GoogleAnalytics } from "./google-analytics";

export function AnalyticsProvider() {
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <Suspense fallback={null}>
      {ymId && <YandexMetrika id={ymId} />}
      {gaId && <GoogleAnalytics id={gaId} />}
    </Suspense>
  );
}
