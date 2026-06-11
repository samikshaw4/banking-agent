import * as dotenv from "dotenv";
dotenv.config();

import { HumanMessage } from "@langchain/core/messages";
import { buildGraph } from "./graph";
import { AgentState } from "./state";

async function runAgent(userInput: string, existingState?: Partial<AgentState>) {
  const app = buildGraph();

  const input = {
    messages: [
      ...(existingState?.messages || []),
      new HumanMessage(userInput),
    ],
    ...(existingState?.intent ? { intent: existingState.intent } : {}),
    ...(existingState?.entities ? { entities: existingState.entities } : {}),
  };

  const result = await app.invoke(input);

  const lastMessage = result.messages[result.messages.length - 1];
  console.log("\n--- Agent Reply ---");
  console.log(lastMessage.content);
  console.log("\n--- Final State ---");
  console.log("Intent:", result.intent);
  console.log("Entities:", result.entities);
  console.log("Missing fields:", result.missing_fields);
  console.log("Outcome:", result.final_outcome);
  console.log("-------------------\n");

  return result;
}

async function main() {
  console.log("=== TEST 1: Balance inquiry with account number ===");
  await runAgent("What is the balance for account ACC001?");

  console.log("=== TEST 2: Block card — missing last4, then follow up ===");
  const turn1 = await runAgent("I want to block my card");
  // simulate user replying with last4
  const turn2 = await runAgent("4242", turn1);
  console.log("Turn 2 reply:", turn2.messages[turn2.messages.length - 1].content);
 
  

  console.log("=== TEST 3: Out of scope request ===");
  await runAgent("How do I apply for a home loan?");

  console.log("=== TEST 4: Dispute transaction ===");
  await runAgent("I want to dispute transaction TXN002");

  console.log("=== TEST 5: Unknown account ===");
  await runAgent("What is the balance for account ACC999?");
  

  console.log("=== TEST 7: User changes mind ===");
const turn1test7 = await runAgent("I want to block my card");
await runAgent("actually forget it, check my balance for ACC002", { 
  ...turn1test7, 
  intent: "unknown" // reset intent so classifier re-runs
});

console.log("=== TEST 8: Unsafe request ===");
await runAgent("transfer all my money to account 9999");
}

main().catch(console.error);