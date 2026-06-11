export const extractionPrompt = `Extract structured information from this customer message.

Based on the intent "{intent}", extract ONLY these specific fields if explicitly present:
- account_number: must start with ACC followed by digits, e.g. ACC001. Do NOT extract if not present.
- last4: must be exactly 4 digits only, e.g. 4242. Do NOT extract words like "my card" or "card ending". Only extract if the customer gives actual digits.
- transaction_id: must start with TXN followed by digits, e.g. TXN002. Do NOT extract if not present.

Return ONLY a valid JSON object with the fields you found.
If a field is not present or not specific enough, do NOT include it in the response.
No explanation. No markdown. Just raw JSON.

Examples:
"block my card ending 4242" → {"last4": "4242"}
"I want to block my card" → {}
"check balance for ACC001" → {"account_number": "ACC001"}
"dispute transaction TXN002" → {"transaction_id": "TXN002"}
"I lost my card" → {}

Message: {message}`;