import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export type Intent = "balance_inquiry" | "block_card" | "dispute_transaction" | "unknown";
export type Outcome = "resolved" | "escalated" | "pending" | null;

export const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  intent: Annotation<Intent>({
    reducer: (_x, y) => y,
    default: () => "unknown",
  }),
  entities: Annotation<{ account_number?: string; last4?: string; transaction_id?: string }>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  missing_fields: Annotation<string[]>({
    reducer: (_x, y) => y,
    default: () => [],
  }),
  tool_results: Annotation<Record<string, any>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  confidence: Annotation<"high" | "low">({
    reducer: (_x, y) => y,
    default: () => "low",
  }),
  escalation_reason: Annotation<string | undefined>({
    reducer: (_x, y) => y,
    default: () => undefined,
  }),
  final_outcome: Annotation<Outcome>({
    reducer: (_x, y) => y,
    default: () => null,
  }),
});

export type AgentState = typeof AgentStateAnnotation.State;