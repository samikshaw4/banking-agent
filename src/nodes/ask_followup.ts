import { AgentState } from "../state";
import { AIMessage } from "@langchain/core/messages";

const fieldQuestions: Record<string, string> = {
  account_number: "Could you please share your account number? It starts with ACC, for example ACC001.",
  last4: "Which card would you like to block? Please share the last 4 digits.",
  transaction_id: "Could you share the transaction ID you'd like to dispute? It starts with TXN, for example TXN002.",
};

export function askFollowup(state: AgentState): Partial<AgentState> {
  const nextMissingField = state.missing_fields[0];
  const question = fieldQuestions[nextMissingField] || "Could you provide more details?";

  return {
    messages: [
      ...state.messages,
      new AIMessage(question),
    ],
  };
}