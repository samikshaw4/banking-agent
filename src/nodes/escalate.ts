import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AIMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { escalationPrompt } from "../prompts/escalation";
import { systemPrompt } from "../prompts/system";
import { createEscalationTicket } from "../tools/create_ticket";

const llm = new ChatGroq({ model: "llama-3.1-8b-instant", temperature: 0.3 });

export async function escalateToHuman(state: AgentState): Promise<Partial<AgentState>> {
  // create a ticket in the backend before responding to customer
  const ticket = createEscalationTicket(
    state.entities.account_number || "unknown",
    state.escalation_reason || "Unresolved request"
  );

  const prompt = escalationPrompt.replace(
    "{reason}",
    state.escalation_reason || "Unable to resolve request"
  );

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  return {
    messages: [...state.messages, new AIMessage(response.content as string)],
    tool_results: { ...state.tool_results, escalation_ticket: ticket },
    final_outcome: "escalated",
  };
}