"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MockComment } from "./mock-data";
import { formatDateTime } from "./mock-data";

interface OrderCommentsProps {
  comments: MockComment[];
  onInsertTemplate?: (text: string) => void;
}

export function OrderComments({ comments: initialComments }: OrderCommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  function handleSend() {
    if (!newComment.trim()) return;
    const comment: MockComment = {
      id: `cm-new-${Date.now()}`,
      orderId: comments[0]?.orderId ?? "",
      authorId: "admin1",
      authorName: "Администратор",
      authorInitials: "АД",
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment("");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Комментариев пока нет
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-xs">
                {comment.authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-foreground/80 mt-0.5 whitespace-pre-wrap">
                {comment.text.split(/(@\S+)/g).map((part, i) =>
                  part.startsWith("@") ? (
                    <span key={i} className="font-medium text-primary">
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* New comment */}
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий..."
          className="min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSend();
            }
          }}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!newComment.trim()}
          className="shrink-0 self-end"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
