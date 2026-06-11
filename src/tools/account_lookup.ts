export interface AccountDetails {
  account_number: string;
  name: string;
  balance: number;
  status: "active" | "frozen" | "closed";
}

const mockAccounts: Record<string, AccountDetails> = {
  "ACC001": { account_number: "ACC001", name: "Priya Sharma", balance: 45230.5, status: "active" },
  "ACC002": { account_number: "ACC002", name: "Rohan Mehta", balance: 1200.0, status: "frozen" },
  "ACC003": { account_number: "ACC003", name: "Anita Desai", balance: 98000.0, status: "active" },
};

export function getAccountDetails(account_number: string): AccountDetails | { error: string } {
  const account = mockAccounts[account_number.toUpperCase()];
  if (!account) return { error: `No account found for ${account_number}` };
  return account;
}