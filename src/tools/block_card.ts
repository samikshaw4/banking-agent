export interface BlockCardResult {
  success: boolean;
  last4: string;
  reference_id: string;
  message: string;
}

const validCards = ["1234", "5678", "4242", "9999"];

export function blockCard(last4: string): BlockCardResult | { error: string } {
  if (!validCards.includes(last4)) {
    return { error: `No card ending in ${last4} found on this account` };
  }
  return {
    success: true,
    last4,
    reference_id: `BLK-${Date.now()}`,
    message: `Card ending ${last4} has been successfully blocked`,
  };
}