export const intentPrompt = `You are classifying a customer support message for a bank.

Classify the message into exactly one of these intents:
- balance_inquiry: customer wants to check their account balance
- block_card: customer wants to block or freeze their debit/credit card
- dispute_transaction: customer wants to report or dispute a transaction
- unknown: anything else, unclear, or out of scope

Respond with ONLY the intent label. No explanation. No punctuation.

Examples:
"what is my balance" → balance_inquiry
"I lost my card please block it" → block_card
"there's a suspicious charge on my account" → dispute_transaction
"how do I apply for a loan" → unknown

Message: {message}`;