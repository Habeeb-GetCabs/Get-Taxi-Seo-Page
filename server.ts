import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  DISCOVERY_CATEGORIES,
  COIMBATORE_NEIGHBOURHOODS,
  VERIFIED_PLACES,
  STATEWIDE_DESTINATIONS,
  SCENIC_ROUTES,
  READY_TRIP_SUGGESTIONS,
} from "./src/data/discovery.ts";

import {
  PHONE_NUMBER,
  CALL_PHONE_DISPLAY,
  CALL_PHONE_E164,
  WHATSAPP_BASE_URL,
} from "./src/data/contact.ts";

import {
  logClickEvent,
  updateClickEvent,
  getFraudRadarSummary,
  clearFraudLogs,
} from "./src/data/fraudRadar.ts";

function extractClientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const first = forwarded.split(",")[0].trim();
    if (first) return first.replace(/^::ffff:/, "");
  }
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp) {
    return cfIp.trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp) {
    return realIp.trim();
  }
  const remote = req.socket?.remoteAddress || req.ip || "127.0.0.1";
  return remote.replace(/^::ffff:/, "");
}

function sanitizeField(val: unknown, maxLen = 240): string {
  if (typeof val !== "string") return "";
  return val.replace(/[\r\n<>]/g, " ").trim().slice(0, maxLen);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "64kb" }));
  app.use(express.text({ type: ["text/plain", "application/x-www-form-urlencoded"] }));
  const PORT = 3000;

  // Directory Health & Metadata Status Endpoint
  app.get("/api/directory/status", (_req: express.Request, res: express.Response) => {
    return res.json({
      status: "ok",
      service: "Get Taxi Kovai — Tamil Nadu & Coimbatore Local Discovery Directory",
      counts: {
        categories: DISCOVERY_CATEGORIES.length,
        coimbatoreNeighbourhoods: COIMBATORE_NEIGHBOURHOODS.length,
        verifiedPlaces: VERIFIED_PLACES.length,
        statewideDestinations: STATEWIDE_DESTINATIONS.length,
        scenicRoutes: SCENIC_ROUTES.length,
        readyItineraries: READY_TRIP_SUGGESTIONS.length,
      },
      contact: {
        phone: CALL_PHONE_E164,
        phoneDisplay: CALL_PHONE_DISPLAY,
        whatsapp: WHATSAPP_BASE_URL,
      },
    });
  });

  // Server-Side Validated Trip & Directory Enquiry Endpoint
  app.post("/api/directory/enquiry", (req: express.Request, res: express.Response) => {
    try {
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
          ok: false,
          error: "Invalid request payload. Please provide trip enquiry details.",
        });
      }

      const pickup = sanitizeField(req.body.pickup, 200);
      const destination = sanitizeField(req.body.destination || req.body.drop, 200);
      const tripType = sanitizeField(req.body.tripType || "Round-Trip Sightseeing", 100);
      const duration = sanitizeField(req.body.duration || "1 Day", 100);
      const vehicle = sanitizeField(req.body.vehicle || "Executive Sedan", 120);
      const travelDate = sanitizeField(req.body.travelDate || "Flexible", 40);
      const returnDate = sanitizeField(req.body.returnDate || "", 40);
      const pickupTime = sanitizeField(req.body.pickupTime || "Flexible", 40);
      const luggage = sanitizeField(req.body.luggage || "Standard Luggage", 120);
      const phone = sanitizeField(req.body.phone || "", 30);
      const notes = sanitizeField(req.body.notes || "", 400);

      const rawPassengers = Number(req.body.passengers ?? 2);
      const passengers = Number.isFinite(rawPassengers)
        ? Math.min(50, Math.max(1, Math.round(rawPassengers)))
        : 2;

      const rawStops = Array.isArray(req.body.stops) ? req.body.stops : [];
      const stops = rawStops
        .map((s: unknown) => sanitizeField(s, 140))
        .filter(Boolean)
        .slice(0, 15);

      if (!pickup || !destination) {
        return res.status(400).json({
          ok: false,
          error: "Both Pickup location and Destination are required to prepare a trip enquiry.",
        });
      }

      if (travelDate && returnDate && /^\d{4}-\d{2}-\d{2}$/.test(travelDate) && /^\d{4}-\d{2}-\d{2}$/.test(returnDate)) {
        if (returnDate < travelDate) {
          return res.status(400).json({
            ok: false,
            error: "Return date cannot be earlier than the travel start date.",
          });
        }
      }

      const enquiryId = `GTK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const stopsSummary = stops.length > 0 ? stops.join(" -> ") : "Direct (No extra stops)";
      const messageLines = [
        `Hello Get Taxi Kovai, I would like a custom trip quotation (Ref: ${enquiryId}):`,
        `• Origin / Pickup: ${pickup}`,
        `• Primary Destination: ${destination}`,
        `• Ordered Stops: ${stopsSummary}`,
        `• Trip Type: ${tripType}`,
        `• Duration: ${duration}`,
        `• Travel Date: ${travelDate}${returnDate ? ` to ${returnDate}` : ""} (${pickupTime})`,
        `• Passengers: ${passengers} Pax`,
        `• Luggage: ${luggage}`,
        `• Preferred Vehicle: ${vehicle}`,
        ...(phone ? [`• Customer Phone: ${phone}`] : []),
        ...(notes ? [`• Special Instructions: ${notes}`] : []),
      ];

      const whatsappUrl = `https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent(messageLines.join("\n"))}`;
      const disclaimer =
        `IMPORTANT: Your enquiry is NOT saved on our server or dispatched automatically. Please click the WhatsApp button below and press Send in WhatsApp to transmit your trip details to our 24/7 dispatch desk (${CALL_PHONE_DISPLAY}), or call us directly.`;

      return res.status(200).json({
        ok: true,
        status: "prepared_for_dispatch",
        enquiryId,
        disclaimer,
        disclosure: disclaimer,
        enquirySummary: {
          enquiryId,
          pickup,
          destination,
          stops,
          tripType,
          duration,
          travelDate,
          returnDate,
          pickupTime,
          passengers,
          luggage,
          vehicle,
          phone,
          notes,
        },
        whatsappUrl,
        callHref: `tel:+91${PHONE_NUMBER}`,
      });
    } catch {
      return res.status(500).json({
        ok: false,
        error: `Unable to process enquiry right now. Please call ${CALL_PHONE_DISPLAY} or WhatsApp directly.`,
      });
    }
  });

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
        contents: `You are the AI Trip Planner & Fare Expert for Get Taxi Kovai (Coimbatore, Tamil Nadu). Answer concisely and helpful regarding Coimbatore cab fares (Base Rs 80 + Rs 28/km local sedan, Base Rs 100 + Rs 40/km local SUV, One-Way Drop: Sedan Rs 16/km, SUV Rs 20/km, Premium SUV/Creta Rs 25/km + Rs 500 driver batta with 130 km minimum billable distance and tolls/permits extra, Homepage Outstation: Base Rs 300 + Rs 30/km + Rs 300 driver batta, Hourly Rental Sedan: 1 hr Rs 375, 2 hrs Rs 750, +Rs 350/hr after 2 hrs), routes to Ooty, Kodaikanal, Isha Yoga Center (Option 1 Rs 3000 10h/100km, Option 2 Rs 3500 12h/120km, Direct Pickup from Gandhipuram Rs 1100, Airport Rs 1400), Valparai, Munnar, Mysore, CJB airport drops, and hill station driving tips. Prompt: ${prompt}`,
      });

      return res.json({ reply: response.text });
    } catch {
      return res.status(500).json({ error: "Failed to generate AI advice" });
    }
  });

  // Google Ads Click Fraud & IP Security Telemetry Endpoints
  app.post("/api/security/log-click", (req: express.Request, res: express.Response) => {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      body = body || {};

      const clientIp = extractClientIp(req);
      const entry = logClickEvent({
        ip: clientIp,
        isGoogleAd: Boolean(body.isGoogleAd),
        gclid: typeof body.gclid === "string" ? sanitizeField(body.gclid, 150) : undefined,
        source: sanitizeField(body.source || "Direct", 80),
        landingPage: sanitizeField(body.landingPage || "/", 200),
        userAgent: sanitizeField(body.userAgent || req.headers["user-agent"] || "unknown", 300),
        deviceType: body.deviceType === "mobile" || body.deviceType === "tablet" ? body.deviceType : "desktop",
        sessionVisitsToday: Number(body.sessionVisitsToday) || 1,
        dwellSeconds: Number(body.dwellSeconds) || 0,
        area: typeof body.area === "string" ? sanitizeField(body.area, 100) : "",
        coordinates: body.coordinates && typeof body.coordinates.lat === "number" && typeof body.coordinates.lng === "number"
          ? { lat: body.coordinates.lat, lng: body.coordinates.lng }
          : undefined,
        interacted: Boolean(body.interacted),
      });

      return res.json({ ok: true, entry });
    } catch (err) {
      console.error("Security log-click error:", err);
      return res.status(500).json({ ok: false, error: "Failed to record telemetry" });
    }
  });

  app.post("/api/security/update-dwell", (req: express.Request, res: express.Response) => {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      body = body || {};

      const id = typeof body.id === "string" ? body.id : "";
      const dwellSeconds = Number(body.dwellSeconds) || 0;
      const interacted = Boolean(body.interacted);
      const coordinates = body.coordinates && typeof body.coordinates.lat === "number" && typeof body.coordinates.lng === "number"
        ? { lat: body.coordinates.lat, lng: body.coordinates.lng }
        : undefined;

      updateClickEvent(id, { dwellSeconds, coordinates, interacted });
      return res.json({ ok: true });
    } catch {
      return res.json({ ok: false });
    }
  });

  app.get("/api/security/fraud-logs", (_req: express.Request, res: express.Response) => {
    try {
      const summary = getFraudRadarSummary();
      return res.json(summary);
    } catch (err) {
      console.error("Failed to retrieve fraud radar logs:", err);
      return res.status(500).json({ error: "Failed to fetch security logs" });
    }
  });

  app.post("/api/security/clear-logs", (_req: express.Request, res: express.Response) => {
    try {
      clearFraudLogs();
      return res.json({ ok: true, message: "Fraud logs cleared successfully" });
    } catch {
      return res.status(500).json({ error: "Failed to clear logs" });
    }
  });

  const rootDir = process.cwd();
  const distPath = path.join(rootDir, "dist");

  // Clean URL rewrite & 404 check middleware
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/api/") &&
      !req.path.startsWith("/@") &&
      !req.path.startsWith("/src/") &&
      !req.path.startsWith("/node_modules/")
    ) {
      const baseDir = process.env.NODE_ENV === "production" ? distPath : rootDir;
      if (!req.path.includes(".") && req.path !== "/") {
        const cleanName = `${req.path.replace(/^\/+|\/+$/g, "")}.html`;
        if (fs.existsSync(path.join(baseDir, cleanName))) {
          const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
          req.url = `/${cleanName}${query}`;
        } else {
          const fallbackIndex = path.join(baseDir, "index.html");
          if (fs.existsSync(fallbackIndex)) {
            return res.status(404).sendFile(fallbackIndex);
          }
          return res.status(404).send("404 Not Found");
        }
      } else if (req.path.endsWith(".html")) {
        const requestedHtml = req.path.replace(/^\/+/, "");
        if (!fs.existsSync(path.join(baseDir, requestedHtml))) {
          const fallbackIndex = path.join(baseDir, "index.html");
          if (fs.existsSync(fallbackIndex)) {
            return res.status(404).sendFile(fallbackIndex);
          }
          return res.status(404).send("404 Not Found");
        }
      }
    }
    next();
  });

  // Multi-page static server or Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      const requestedPath = req.path.replace(/^\/+/, "");
      // Never serve HTML for missing static assets (.js, .css, images, fonts, json)
      if (/\.(js|mjs|css|png|jpg|jpeg|webp|svg|gif|ico|json|woff|woff2|ttf|map|xml|txt)$/i.test(requestedPath)) {
        return res.status(404).end();
      }
      if (requestedPath === "" || requestedPath === "index.html") {
        return res.sendFile(path.join(distPath, "index.html"));
      }
      if (requestedPath.endsWith(".html")) {
        const fullHtmlPath = path.join(distPath, requestedPath);
        if (fs.existsSync(fullHtmlPath)) {
          return res.sendFile(fullHtmlPath);
        }
      }
      return res.status(404).sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Get Taxi Kovai Multi-Page Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
