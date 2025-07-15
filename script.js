// CONFIGURATION - CHANGE THESE IF NEEDED
const OLLAMA_URL = "http://localhost:11434"; 
const DEFAULT_MODEL = "mistral";

// DOM Elements
const generateBtn = document.getElementById("generateBtn");
const outputDiv = document.getElementById("guideOutput");

generateBtn.addEventListener("click", async () => {
  const prompt = document.getElementById("modelInput").value.trim();
  if (!prompt) return alert("Please describe your model");

  // Show loading state
  outputDiv.innerHTML = "<div class='loading'>Generating...<div class='spinner'></div></div>";

  try {
    // Test if Ollama is reachable first
    const isAlive = await testOllamaConnection();
    if (!isAlive) throw new Error("Ollama server not responding");

    // Make the generation request
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: `Create detailed Blender instructions for: "${prompt}". 
                Include specific shortcuts like (Shift+A) and markdown formatting.`,
        stream: false,
        options: { temperature: 0.7 }
      })
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const result = await response.json();
    outputDiv.innerHTML = marked.parse(result.response);
    
  } catch (error) {
    outputDiv.innerHTML = `
      <div class="error">
        <h3>Error</h3>
        <p>${error.message}</p>
        <div class="solution">
          <p>Try these fixes:</p>
          <ol>
            <li>Run in terminal: <code>ollama serve</code></li>
            <li>Download model: <code>ollama pull ${DEFAULT_MODEL}</code></li>
            <li>Verify URL: <code>${OLLAMA_URL}</code></li>
          </ol>
        </div>
      </div>
    `;
  }
});

// Test connection to Ollama
async function testOllamaConnection() {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "HEAD",
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  }
}