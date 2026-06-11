import { AgentState } from "../state";

export function validateState(state: AgentState): Partial<AgentState> {
  // if intent is unknown, mark for escalation
  if (state.intent === "unknown" || state.confidence === "low") {
    return {
      escalation_reason: "Customer request is outside supported scope or intent is unclear",
    };
  }
  return {};
}