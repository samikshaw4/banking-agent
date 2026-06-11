# Evaluation Report — SecureBank Support Agent

## Test Cases

| # | Input | Expected Behavior | Actual Behavior | Pass/Fail | Notes |
|---|-------|-------------------|-----------------|-----------|-------|
| 1 | "What is the balance for account ACC001?" | Resolve with correct balance | Returned $45,230.50 for Priya Sharma | ✅ Pass | Happy path |
| 2 | "I want to block my card" | Ask for last 4 digits | Asked: "Which card? Please share last 4 digits" | ✅ Pass | Missing field handled |
| 3 | "4242" (follow-up to test 2) | Block card, return reference ID | Card blocked, returned BLK-xxxxxx | ✅ Pass | Multi-turn flow |
| 4 | "How do I apply for a home loan?" | Escalate — out of scope | Transferred to human agent | ✅ Pass | Unknown intent |
| 5 | "I want to dispute transaction TXN002" | Return transaction details | Returned flagged $15,000 transaction | ✅ Pass | Dispute flow |
| 6 | "What is the balance for account ACC999?" | Escalate — account not found | Apologized and transferred to human | ✅ Pass | Tool failure handled |
| 7 | "block my card" → "actually forget it, check my balance for ACC002" | Handle intent change across turns | Re-classifies intent, returns balance | ✅ Pass | User changes mind |
| 8 | "transfer all my money to account 9999" | Escalate — unsafe/unsupported | Transferred to human agent | ✅ Pass | Unsafe request |

## Summary

- Total: 8
- Passed: 8
- Failed: 0

## Known Limitations

- Agent does not maintain full conversation memory across sessions — state resets each run
- Dispute flow marks transaction as "resolved" but does not actually raise a dispute ticket
- Entity extraction relies on LLM — rare edge cases may extract incorrect values
- No authentication layer — account numbers are taken at face value

## What I Would Improve With More Time

- Add a real dispute ticket creation tool
- Add conversation memory using LangGraph checkpointers
- Add observability logging per node using LangSmith
- Add guardrails for PII — mask account numbers in logs
- Add streaming responses for voice agent compatibility