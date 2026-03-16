export async function askClaude(messages, systemPrompt) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt }),
    });
    const data = await response.json();
    return data.content;
  } catch (error) {
    return 'AI assistant unavailable. Please try again.';
  }
}

export async function analyzeSlipImage(imageBase64, notes) {
  try {
    const response = await fetch('/api/analyze-slip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, notes }),
    });
    const data = await response.json();
    return data.items;
  } catch (error) {
    return [];
  }
}