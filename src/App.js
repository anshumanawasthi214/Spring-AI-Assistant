import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("Greet me");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanLine = (line) => {
  return line
    .replace(/<think>/gi, "")              // Remove <think>
    .replace(/<\/think>/gi, "")            // Remove </think>
    .replace(/\*\*(.*?)\*\*/g, "$1")       // Remove markdown bold
    .replace(/#+\s/g, "")                   // Remove markdown headers
    .replace(/\d+\.\s/g, "")                // Remove numbered list
    .replace(/[-*]\s/g, "")                 // Remove bullet points
    .replace(/\n{2,}/g, "\n")               // Collapse newlines
    .trim();
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/springAi/ai?query=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error("Failed to connect to backend");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          const line = cleanLine(lines[i]);
          if (line) {
            setResponse(prev => prev + line + "\n");
          }
        }

        buffer = lines[lines.length - 1]; // Keep the last incomplete line
      }

      if (buffer) {
        const line = cleanLine(buffer);
        if (line) {
          setResponse(prev => prev + line);
        }
      }
    } catch (error) {
      setResponse(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧠 Spring AI Assistant</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something like: Explain Java 8"
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
      <div style={styles.responseBox}>
        <h3>Response:</h3>
        <pre style={styles.responseText}>{response || "🤖 Waiting..."}</pre>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    background: "#f4f6f8",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer"
  },
  responseBox: {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "15px"
  },
  responseText: {
    whiteSpace: "pre-wrap",
    fontSize: "15px"
  }
};

export default App;
