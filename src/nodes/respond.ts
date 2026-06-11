import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AIMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { responsePrompt } from "../prompts/response";
import { systemPrompt } from "../prompts/system";

const llm = new ChatGroq({ model: "llama-3.1-8b-instant", temperature: 0 });

export async function generateResponse(state: AgentState): Promise<Partial<AgentState>> {
  const prompt = responsePrompt
    .replace("{intent}", state.intent)
    .replace("{tool_result}", JSON.stringify(state.tool_results));

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  return {
    messages: [...state.messages, new AIMessage(response.content as string)],
    final_outcome: "resolved",
  };
}