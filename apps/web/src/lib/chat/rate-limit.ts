const chatLimits = new Map<
  string,
  { count: number; resetAt: number }
>();

export function checkChatRateLimit(
  userId: string,
  limit = 30,
  windowMs = 60000,
): boolean {
  const now = Date.now();
  const entry = chatLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    chatLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
