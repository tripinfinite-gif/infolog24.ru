import { companyInfo } from "@/content/company";
import { SITE_URL } from "@/lib/utils/base-url";

/* ── Helper ────────────────────────────────────────────────────────────────── */

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ── LocalBusiness ─────────────────────────────────────────────────────────── */

export function LocalBusinessJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: companyInfo.name,
        legalName: companyInfo.legal.legalNameShort,
        description: companyInfo.description,
        telephone: companyInfo.contacts.phone,
        email: companyInfo.contacts.email,
        url: SITE_URL,
        priceRange: "₽₽",
        taxID: companyInfo.legal.inn,
        vatID: companyInfo.legal.inn,
        identifier: [
          { "@type": "PropertyValue", propertyID: "ИНН", value: companyInfo.legal.inn },
          { "@type": "PropertyValue", propertyID: "КПП", value: companyInfo.legal.kpp },
          { "@type": "PropertyValue", propertyID: "ОГРН", value: companyInfo.legal.ogrn },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Москва",
          addressCountry: "RU",
          streetAddress: companyInfo.contacts.physicalAddress,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: companyInfo.contacts.coordinates.lat,
          longitude: companyInfo.contacts.coordinates.lng,
        },
        foundingDate: String(companyInfo.foundedYear),
        areaServed: {
          "@type": "City",
          name: "Москва",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "20:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "150",
          bestRating: "5",
        },
      }}
    />
  );
}

/* ── Service ───────────────────────────────────────────────────────────────── */

interface ServiceJsonLdProps {
  name: string;
  description: string;
  price: number;
  priceUnit?: string;
  url?: string;
}

export function ServiceJsonLd({
  name,
  description,
  price,
  priceUnit = "за одно ТС",
  url,
}: ServiceJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        provider: {
          "@type": "Organization",
          name: companyInfo.name,
          url: SITE_URL,
        },
        areaServed: {
          "@type": "City",
          name: "Москва",
        },
        ...(url && { url: `${SITE_URL}${url}` }),
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "RUB",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price,
            priceCurrency: "RUB",
            unitText: priceUnit,
          },
        },
      }}
    />
  );
}

/* ── FAQPage ───────────────────────────────────────────────────────────────── */

interface FaqJsonLdProps {
  items: { question: string; answer: string }[];
}

export function FaqJsonLd({ items }: FaqJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

/* ── Article ───────────────────────────────────────────────────────────────── */

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  image?: string;
}

export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  url,
  image,
}: ArticleJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        datePublished,
        url: `${SITE_URL}${url}`,
        ...(image && { image }),
        author: {
          "@type": "Organization",
          name: companyInfo.name,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: companyInfo.name,
          url: SITE_URL,
        },
      }}
    />
  );
}

/* ── AggregateRating + Reviews ─────────────────────────────────────────────── */

interface ReviewJsonLdProps {
  reviews: {
    name: string;
    text: string;
    rating: number;
    date?: string;
  }[];
  ratingValue: string;
  reviewCount: string;
}

export function ReviewsJsonLd({
  reviews,
  ratingValue,
  reviewCount,
}: ReviewJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: companyInfo.name,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue,
          reviewCount,
          bestRating: "5",
        },
        review: reviews.map((r) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: r.name,
          },
          reviewBody: r.text,
          reviewRating: {
            "@type": "Rating",
            ratingValue: String(r.rating),
            bestRating: "5",
          },
          ...(r.date && { datePublished: r.date }),
        })),
      }}
    />
  );
}

/* ── BreadcrumbList ────────────────────────────────────────────────────────── */

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${item.href}`,
        })),
      }}
    />
  );
}
