import { StateGraph, END } from "@langchain/langgraph";
import { AgentStateAnnotation, AgentState } from "./state";
import { classifyIntent } from "./nodes/classify";
import { extractEntities } from "./nodes/extract";
import { validateState } from "./nodes/validate";
import { callTool } from "./nodes/call_tool";
import { askFollowup } from "./nodes/ask_followup";
import { generateResponse } from "./nodes/respond";
import { escalateToHuman } from "./nodes/escalate";

function routeAfterValidation(state: AgentState): string {
  if (state.escalation_reason) return "escalate";
  if (state.missing_fields.length > 0) return "ask_followup";
  return "call_tool";
}

function routeAfterTool(state: AgentState): string {
  if (state.escalation_reason) return "escalate";
  return "respond";
}

export function buildGraph() {
  const graph = new StateGraph(AgentStateAnnotation);

  graph.addNode("classify", classifyIntent as any);
  graph.addNode("extract", extractEntities as any);
  graph.addNode("validate", validateState as any);
  graph.addNode("call_tool", callTool as any);
  graph.addNode("ask_followup", askFollowup as any);
  graph.addNode("respond", generateResponse as any);
  graph.addNode("escalate", escalateToHuman as any);

  (graph as any).addEdge("__start__", "classify");
  (graph as any).addEdge("classify", "extract");
  (graph as any).addEdge("extract", "validate");

  (graph as any).addConditionalEdges("validate", routeAfterValidation, {
    escalate: "escalate",
    ask_followup: "ask_followup",
    call_tool: "call_tool",
  });

  (graph as any).addConditionalEdges("call_tool", routeAfterTool, {
    escalate: "escalate",
    respond: "respond",
  });

  (graph as any).addEdge("respond", END);
  (graph as any).addEdge("escalate", END);
  (graph as any).addEdge("ask_followup", END);

  return graph.compile();
}