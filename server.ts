import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // AI Assistant Route (optional helper for fare inquiries)
  app.post("/api/ai-assistant", async (req: express.Request, res: express.Response) => {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(400).json({ error: "No API key configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are the AI Trip Planner & Fare Expert for Get Taxi Kovai (Coimbatore, Tamil Nadu). Answer concisely and helpful regarding Coimbatore cab fares (Base Rs 80 + Rs 28/km local, Rs 26/km one-way, Rs 15/km roundtrip, Rs 100 base + Rs 30/km airport), routes to Ooty, Kodaikanal, Isha Yoga Center, Valparai, Munnar, Mysore, CJB airport drops, and hill station driving tips. Prompt: ${prompt}`,
      });

      return res.json({ reply: response.text });
    } catch {
      return res.status(500).json({ error: "Failed to generate AI advice" });
    }
  });

  // Multi-page static server or Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      const requestedPath = req.path;
      if (requestedPath.endsWith(".html")) {
        res.sendFile(path.join(distPath, requestedPath));
      } else {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Get Taxi Kovai Multi-Page Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
