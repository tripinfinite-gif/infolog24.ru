const chatLimits = new Map<
  string,
  { count: number; resetAt: number }
>();

let cleanupCounter = 0;

function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of chatLimits) {
    if (now > entry.resetAt) {
      chatLimits.delete(key);
    }
  }
}

export function checkChatRateLimit(
  userId: string,
  limit = 30,
  windowMs = 60000,
): boolean {
  const now = Date.now();

  // Run cleanup every 100 calls to avoid memory leak
  cleanupCounter++;
  if (cleanupCounter >= 100) {
    cleanupCounter = 0;
    cleanupExpiredEntries(now);
  }

  const entry = chatLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    chatLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
