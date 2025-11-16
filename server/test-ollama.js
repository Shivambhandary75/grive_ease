// Quick diagnostic script to test Ollama API key and endpoint
require("dotenv").config({ path: "./.env" });

const apiKey = process.env.OLLAMA_API_KEY;
const host = process.env.OLLAMA_HOST;
const model = process.env.OLLAMA_MODEL;

console.log("\n=== Ollama Configuration Diagnostic ===\n");
console.log(`API Key: ${apiKey ? apiKey.substring(0, 20) + "..." : "NOT SET"}`);
console.log(`Host: ${host}`);
console.log(`Model: ${model}`);

// Test different endpoint combinations
async function testEndpoint(url, endpoint) {
  console.log(`\n--- Testing: ${url}${endpoint} ---`);

  try {
    const response = await fetch(`${url}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Hello, test message" }],
        stream: false,
      }),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(
        "✅ SUCCESS! Response:",
        JSON.stringify(data, null, 2).substring(0, 200)
      );
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function runDiagnostics() {
  console.log("\n=== Testing Common Ollama Endpoints ===\n");

  const endpointsToTry = [
    // Ollama standard endpoints
    { url: "https://ollama.ai/api", endpoint: "/chat" },
    { url: "https://api.ollama.ai", endpoint: "/chat" },
    { url: "https://ollama.com/api", endpoint: "/chat" },

    // OpenRouter (compatible with Ollama models)
    { url: "https://openrouter.ai/api/v1", endpoint: "/chat/completions" },

    // Local Ollama
    { url: "http://localhost:11434/api", endpoint: "/chat" },
  ];

  for (const test of endpointsToTry) {
    const success = await testEndpoint(test.url, test.endpoint);
    if (success) {
      console.log(`\n✅✅✅ FOUND WORKING CONFIGURATION! ✅✅✅`);
      console.log(`\nUpdate your .env with:`);
      console.log(`OLLAMA_HOST=${test.url}`);
      break;
    }
  }

  console.log("\n=== Diagnostic Complete ===\n");
  console.log("If none worked, your API key might be for a different service.");
  console.log(
    "Check where you got the key from and verify the correct endpoint.\n"
  );
}

runDiagnostics();
