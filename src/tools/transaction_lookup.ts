export interface TransactionDetails {
  transaction_id: string;
  account_number: string;
  merchant: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "flagged";
}

const mockTransactions: Record<string, TransactionDetails> = {
  "TXN001": { transaction_id: "TXN001", account_number: "ACC001", merchant: "Amazon", amount: 3499, date: "2025-06-01", status: "completed" },
  "TXN002": { transaction_id: "TXN002", account_number: "ACC001", merchant: "Unknown Merchant", amount: 15000, date: "2025-06-03", status: "flagged" },
  "TXN003": { transaction_id: "TXN003", account_number: "ACC002", merchant: "Swiggy", amount: 450, date: "2025-06-05", status: "pending" },
};

export function getTransactionDetails(transaction_id: string): TransactionDetails | { error: string } {
  const txn = mockTransactions[transaction_id.toUpperCase()];
  if (!txn) return { error: `No transaction found for ${transaction_id}` };
  return txn;
}