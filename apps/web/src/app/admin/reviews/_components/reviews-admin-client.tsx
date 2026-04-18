"use client";

import { Check, Loader2, Star, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { moderateReviewAction } from "../_actions";

export interface SerializedReview {
  id: string;
  authorName: string;
  company: string | null;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  orderId: string | null;
  submittedAt: string | null;
  createdAt: string;
}

interface Props {
  pending: SerializedReview[];
  approved: SerializedReview[];
  rejected: SerializedReview[];
}

function StatusBadge({ status }: { status: SerializedReview["status"] }) {
  if (status === "approved") {
    return (
      <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
        одобрен
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-red-500/10 text-red-700 border-red-500/30">
        отклонён
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30">
      ожидает
    </Badge>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`${rating} из 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating ? "fill-accent text-accent" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewRow({
  review,
  showActions,
}: {
  review: SerializedReview;
  showActions: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [, startTransition] = useTransition();

  async function act(action: "approve" | "reject") {
    setLoading(action);
    const result = await moderateReviewAction({ reviewId: review.id, action });
    setLoading(null);
    if (result.ok) {
      startTransition(() => router.refresh());
    } else {
      alert(result.error);
    }
  }

  const submittedLabel = review.submittedAt
    ? new Date(review.submittedAt).toLocaleString("ru-RU")
    : new Date(review.createdAt).toLocaleString("ru-RU");

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.authorName}</span>
              <StatusBadge status={review.status} />
            </div>
            {review.company && (
              <div className="text-sm text-muted-foreground">
                {review.company}
              </div>
            )}
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>{submittedLabel}</div>
            <div className="mt-1">
              <StarRow rating={review.rating} />
            </div>
          </div>
        </div>

        <p className="whitespace-pre-wrap text-sm">{review.content}</p>

        {showActions && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="default"
              disabled={loading !== null}
              onClick={() => act("approve")}
            >
              {loading === "approve" ? (
                <Loader2 className="mr-1 size-4 animate-spin" />
              ) : (
                <Check className="mr-1 size-4" />
              )}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loading !== null}
              onClick={() => act("reject")}
            >
              {loading === "reject" ? (
                <Loader2 className="mr-1 size-4 animate-spin" />
              ) : (
                <X className="mr-1 size-4" />
              )}
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ReviewsAdminClient({ pending, approved, rejected }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Отзывы</h1>
        <div className="text-sm text-muted-foreground">
          На модерации: {pending.length} • Одобрено: {approved.length} • Отклонено:{" "}
          {rejected.length}
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Модерация {pending.length > 0 && `(${pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="approved">Одобренные</TabsTrigger>
          <TabsTrigger value="rejected">Отклонённые</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Отзывов на модерации нет.
            </p>
          ) : (
            pending.map((r) => (
              <ReviewRow key={r.id} review={r} showActions />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Одобренных отзывов пока нет.
            </p>
          ) : (
            approved.map((r) => (
              <ReviewRow key={r.id} review={r} showActions={false} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejected.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Отклонённых отзывов нет.
            </p>
          ) : (
            rejected.map((r) => (
              <ReviewRow key={r.id} review={r} showActions={false} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
