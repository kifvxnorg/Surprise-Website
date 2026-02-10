import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const messageData = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.get(api.quotes.daily.path, async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      let quote = await storage.getDailyQuote(today);

      if (!quote) {
        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            {
              role: "system",
              content: "You are a romantic poet. Generate a short, beautiful, and romantic quote or compliment for a birthday surprise website. Keep it under 20 words. Do not use hashtags or emojis.",
            },
            {
              role: "user",
              content: "Generate a romantic quote for today.",
            },
          ],
        });

        const content = response.choices[0].message.content || "You are the light of my life.";
        quote = await storage.createDailyQuote({ content, quoteDate: today });
      }

      res.json({ content: quote.content });
    } catch (error) {
      console.error("Error generating quote:", error);
      res.status(500).json({ message: "Failed to generate daily dose of love." });
    }
  });

  return httpServer;
}
