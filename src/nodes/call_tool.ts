import { AgentState } from "../state";
import { getAccountDetails } from "../tools/account_lookup";
import { getTransactionDetails } from "../tools/transaction_lookup";
import { blockCard } from "../tools/block_card";

export async function callTool(state: AgentState): Promise<Partial<AgentState>> {
  let result: any = {};

  if (state.intent === "balance_inquiry") {
    result = getAccountDetails(state.entities.account_number!);
  } else if (state.intent === "block_card") {
    result = blockCard(state.entities.last4!);
  } else if (state.intent === "dispute_transaction") {
    result = getTransactionDetails(state.entities.transaction_id!);
  }

  // if tool returned an error, flag for escalation
  if (result.error) {
    return {
      tool_results: result,
      escalation_reason: result.error,
    };
  }

  return { tool_results: result };
}