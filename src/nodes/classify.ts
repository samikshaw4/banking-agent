import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState, Intent } from "../state";
import { intentPrompt } from "../prompts/intent";
import { systemPrompt } from "../prompts/system";

const llm = new ChatGroq({ model: "llama-3.1-8b-instant", temperature: 0 });;

export async function classifyIntent(state: AgentState): Promise<Partial<AgentState>> {
    if (state.intent && state.intent !== "unknown") {
    return { intent: state.intent, confidence: "high" };
  }
    const userMessage = state.messages[state.messages.length - 1].content as string;

  const prompt = intentPrompt.replace("{message}", userMessage);

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  const intent = (response.content as string).trim().toLowerCase() as Intent;
  const validIntents: Intent[] = ["balance_inquiry", "block_card", "dispute_transaction", "unknown"];

  return {
    intent: validIntents.includes(intent) ? intent : "unknown",
    confidence: intent === "unknown" ? "low" : "high",
  };
}