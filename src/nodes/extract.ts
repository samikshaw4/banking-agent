import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { extractionPrompt } from "../prompts/extraction";

const llm = new ChatGroq({ model: "llama-3.1-8b-instant", temperature: 0 });

const requiredFields: Record<string, string[]> = {
  balance_inquiry: ["account_number"],
  block_card: ["last4"],
  dispute_transaction: ["transaction_id"],
  unknown: [],
};

export async function extractEntities(state: AgentState): Promise<Partial<AgentState>> {
  const userMessage = state.messages[state.messages.length - 1].content as string;

  const prompt = extractionPrompt
    .replace("{intent}", state.intent)
    .replace("{message}", userMessage);

  const response = await llm.invoke([new HumanMessage(prompt)]);

  let extracted: Record<string, string> = {};
  try {
    extracted = JSON.parse(response.content as string);
  } catch {
    extracted = {};
  }

  // merge with existing entities
  const entities = { ...state.entities, ...extracted };

  // figure out what's still missing
  const required = requiredFields[state.intent] || [];
  const missing_fields = required.filter((f) => !entities[f as keyof typeof entities]);

  return { entities, missing_fields };
}