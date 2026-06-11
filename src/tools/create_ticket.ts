export interface TicketResult {
  ticket_id: string;
  status: string;
  message: string;
}

export function createEscalationTicket(
  account_number: string,
  reason: string
): TicketResult {
  return {
    ticket_id: `TKT-${Date.now()}`,
    status: "open",
    message: `Escalation ticket raised for account ${account_number}. Reason: ${reason}`,
  };
}