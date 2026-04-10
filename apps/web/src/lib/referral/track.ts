export function extractReferralCode(url: string): string | null {
  const params = new URL(url).searchParams;
  return params.get("ref") || null;
}

export function generateReferralLink(
  partnerCode: string,
  baseUrl: string
): string {
  return `${baseUrl}/?ref=${partnerCode}`;
}

export function generatePartnerCode(partnerId: string): string {
  return `P${partnerId.slice(0, 8).toUpperCase()}`;
}
