import type { Metadata } from "next";

import { listReviewsForAdmin } from "@/lib/dal/reviews";

import {
  ReviewsAdminClient,
  type SerializedReview,
} from "./_components/reviews-admin-client";

export const metadata: Metadata = {
  title: "Отзывы",
};

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const [pending, approved, rejected] = await Promise.all([
    listReviewsForAdmin({ status: "pending" }),
    listReviewsForAdmin({ status: "approved" }),
    listReviewsForAdmin({ status: "rejected" }),
  ]);

  const serialize = (rows: typeof pending): SerializedReview[] =>
    rows.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      company: r.company,
      rating: r.rating,
      content: r.content,
      status: r.status,
      orderId: r.orderId,
      submittedAt: r.submittedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    }));

  return (
    <ReviewsAdminClient
      pending={serialize(pending)}
      approved={serialize(approved)}
      rejected={serialize(rejected)}
    />
  );
}
