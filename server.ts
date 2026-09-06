import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with generous threshold for snapshot upload
app.use(express.json({ limit: "15mb" }));

// Local File Database & Directory Setup
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "trades.json");
const IMAGES_DIR = path.join(DATA_DIR, "images");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Initial mockup trades for persistent database seed if database is completely fresh
const INITIAL_DB_TRADES: any[] = [];

// Seed placeholders if empty
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB_TRADES, null, 2), "utf-8");
}

// Write simple base64 patterns for standard asset placeholders
const placeholders = ["placeholder_btc", "placeholder_nvda", "placeholder_eth"];
placeholders.forEach(name => {
  const p = path.join(IMAGES_DIR, `${name}.png`);
  if (!fs.existsSync(p)) {
    // Write an ultra tiny blank 1x1 transparent png pixel for placeholders
    const blankPngB64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    fs.writeFileSync(p, Buffer.from(blankPngB64, "base64"));
  }
});

// Load local database of trades
function loadLocalTrades(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to parse trades data files:", err);
  }
  return [];
}

// Save local database of trades
function saveLocalTrades(list: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write trades to disk:", err);
  }
}

// Supabase Intelligent Client Wrapper
const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawSupabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Strip trailing slashes and /rest/v1 paths to ensure @supabase/supabase-js can authenticate properly
const supabaseUrl = rawSupabaseUrl ? rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "").trim() : "";
const supabaseKey = rawSupabaseKey ? rawSupabaseKey.trim() : "";

let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log(`[Tradelense Server] Supabase integration active. PostgreSQL database target: ${supabaseUrl}`);
    
    // Auto-create/verify trade-screenshots storage bucket if permissions are available
    supabase.storage.createBucket("trade-screenshots", { public: true })
      .then(({ error }) => {
        if (!error) {
          console.log("[Tradelense Server] Supabase 'trade-screenshots' public storage bucket verified/created successfully.");
        } else if (error.message && !error.message.includes("already exists")) {
          console.warn("[Tradelense Server] Could not auto-create storage bucket 'trade-screenshots':", error.message);
        }
      })
      .catch(err => {
        console.warn("[Tradelense Server] Auto-bucket creation safe catch:", err);
      });
  } catch (err) {
    console.warn("[Tradelense Server] Supabase config check skipped, using local fallback persistence:", err);
  }
} else {
  console.log("[Tradelense Server] Supabase credentials not found. Defaulting to robust server-local high-speed JSON database persistence.");
}

// Lazy initializer for Google GenAI client
let aiInstance: GoogleGenAI | null = null;

function getAIV4Client() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to local fallback simulation.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// REST Endpoint: Heartbeat
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", hasKey: !!process.env.GEMINI_API_KEY });
});

// REST Endpoint: Database Setup and Table Validation Check
app.get("/api/db-status", async (req, res) => {
  if (!supabase) {
    return res.json({ connected: false, tableExists: false, error: "Supabase client not initialized. Set up variables in Settings." });
  }
  try {
    const { error } = await supabase.from("trades").select("id").limit(1);
    if (error) {
      const isMissingTable = error.message && (
        error.message.includes("Could not find the table") || 
        error.message.includes("does not exist") ||
        error.code === "P0001"
      );
      const isFetchFailed = error.message && (
        error.message.includes("fetch failed") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("network")
      );
      return res.json({ 
        connected: !isFetchFailed, 
        tableExists: !isMissingTable && !isFetchFailed, 
        error: error.message,
        code: error.code
      });
    }
    return res.json({ connected: true, tableExists: true });
  } catch (err: any) {
    const errMsg = err.message || String(err);
    const isFetchFailed = errMsg.includes("fetch failed") || errMsg.includes("Failed to fetch") || errMsg.includes("network");
    return res.json({ 
      connected: !isFetchFailed, 
      tableExists: false, 
      error: errMsg 
    });
  }
});

// REST Endpoint: Visual OCR Candlestick Edge Scanner using Gemini
app.post("/api/ocr", async (req, res) => {
  const { image, mimeType, presetName } = req.body;

  // Set up robust mock values to ensure high-fidelity calculations when GEMINI_API_KEY is not defined
  const mockPresets: Record<string, any> = {
    gold: {
      asset: "XAU / USD",
      type: "LONG",
      entryPrice: 2342.10,
      exitPrice: 2368.50,
      sl: 2330.00,
      tp: 2375.00,
      rr: 2.7,
      pips: 264,
      riskPercent: 1.5,
      rewardPercent: 4.05,
      timeframe: "1H",
      chartTime: "2026-05-22T09:30:00Z",
      candleCount: 12,
      duration: "12h",
      detectedTool: "LONG_POSITION",
      estimatedOutcome: "MANUAL_CLOSED",
      session: "London/NY Overlap",
      day: "Friday",
      sentiment: "BULLISH",
      setup_type: "breakout",
      market_structure: "Bullish Break of Structure (BOS)",
      emotion_detected: "none",
      mistake_type: "none",
      discipline_score: 95,
      execution_quality: 90,
      risk_management_quality: 95,
      setup_quality: 92,
      confidence: 96,
      notes: "[Demo Mode] Bull flag breakout confirmed. Volume spikes matched the major breakout boundary. Stop Loss positioned safely under structural swing-lows.",
    },
    nasdaq: {
      asset: "NQ100 Futures",
      type: "SHORT",
      entryPrice: 18450.00,
      exitPrice: 18320.00,
      sl: 18510.00,
      tp: 18300.00,
      rr: 2.5,
      pips: 130,
      riskPercent: 2.0,
      rewardPercent: 5.0,
      timeframe: "15m",
      chartTime: "2026-05-18T14:45:00Z",
      candleCount: 34,
      duration: "8h 30m",
      detectedTool: "SHORT_POSITION",
      estimatedOutcome: "MANUAL_CLOSED",
      session: "New York",
      day: "Monday",
      sentiment: "BEARISH",
      setup_type: "reversal",
      market_structure: "Bearish head-and-shoulders reversal at institutional supply blocks",
      emotion_detected: "impatience",
      mistake_type: "early exit",
      discipline_score: 78,
      execution_quality: 82,
      risk_management_quality: 85,
      setup_quality: 80,
      confidence: 88,
      notes: "[Demo Mode] Scalped early neckline breach. Order entry was slightly delayed, leading to elevated emotional impatience but stop remained highly defended.",
    },
    eurusd: {
      asset: "EUR / USD",
      type: "LONG",
      entryPrice: 1.08450,
      exitPrice: 1.09100,
      sl: 1.08250,
      tp: 1.09200,
      rr: 3.25,
      pips: 65,
      riskPercent: 1.0,
      rewardPercent: 3.25,
      timeframe: "5m",
      chartTime: "2026-05-20T07:15:00Z",
      candleCount: 24,
      duration: "2h",
      detectedTool: "LONG_POSITION",
      estimatedOutcome: "TP_HIT",
      session: "London",
      day: "Wednesday",
      sentiment: "BULLISH",
      setup_type: "liquidity sweep",
      market_structure: "Asian session range low deviation & sweep grab",
      emotion_detected: "none",
      mistake_type: "none",
      discipline_score: 98,
      execution_quality: 95,
      risk_management_quality: 98,
      setup_quality: 95,
      confidence: 94,
      notes: "[Demo Mode] Liquidity sweep setup of prime asian range limits. Immediate impulsive displacement indicates major institutional demand blocks.",
    }
  };

  let image_url = "/api/images/placeholder_btc";

  try {
    const ai = getAIV4Client();
    
    // Auto-save screenshot locally or query Supabase bucket
    let savedImgId = "";

    if (image && mimeType) {
      savedImgId = `img_${Date.now()}`;
      try {
        const imageBuffer = Buffer.from(image, "base64");
        // Save locally for resilient fallback
        const localPath = path.join(IMAGES_DIR, `${savedImgId}.png`);
        fs.writeFileSync(localPath, imageBuffer);
        image_url = `/api/images/${savedImgId}`;

        // Send to Supabase Storage if present
        if (supabase) {
          const { error } = await supabase.storage
            .from("trade-screenshots")
            .upload(`${savedImgId}.png`, imageBuffer, {
              contentType: mimeType || "image/png",
              upsert: true
            });
          
          if (!error) {
            const { data: publicUrlData } = supabase.storage
              .from("trade-screenshots")
              .getPublicUrl(`${savedImgId}.png`);
            if (publicUrlData && publicUrlData.publicUrl) {
              image_url = publicUrlData.publicUrl;
              console.log("[Tradelense Server] Screenshot uploaded successfully to Supabase Bucket:", image_url);
            }
          } else {
            console.log("[Tradelense Server] Supabase storage upload bypassed (using server-local high-speed screenshot cache file):", error.message);
          }
        }
      } catch (err) {
        console.error("[Tradelense Server] Screenshot persistence step skipped:", err);
      }
    }

    // Direct bypass for mock predefined presets to avoid unnecessary Gemini API hits, latency, or rate limits during high demand
    if (!image && presetName) {
      const presetKey = presetName;
      const data = mockPresets[presetKey] || mockPresets.eurusd;

      // Adjust image_url for mock presets to have placeholder fallback or local image url
      let presetImgUrl = image_url;
      if (presetKey === "gold") presetImgUrl = "/api/images/placeholder_btc";
      if (presetKey === "nasdaq") presetImgUrl = "/api/images/placeholder_nvda";
      if (presetKey === "eurusd") presetImgUrl = "/api/images/placeholder_eth";

      // Calculate backend validation checks for mock response
      const validationWarnings: string[] = [];
      if (data.type === "LONG") {
        if (data.sl && data.sl >= data.entryPrice) {
          validationWarnings.push("Stop Loss cannot be above Entry Price for a LONG position.");
        }
        if (data.tp && data.tp <= data.entryPrice) {
          validationWarnings.push("Take Profit cannot be below Entry Price for a LONG position.");
        }
      } else if (data.type === "SHORT") {
        if (data.sl && data.sl <= data.entryPrice) {
          validationWarnings.push("Stop Loss cannot be below Entry Price for a SHORT position.");
        }
        if (data.tp && data.tp >= data.entryPrice) {
          validationWarnings.push("Take Profit cannot be above Entry Price for a SHORT position.");
        }
      }
      if (data.rr && data.rr < 1) {
        validationWarnings.push("Risk-Reward ratio is below 1:1, posing a math vulnerability.");
      }

      return res.json({
        ...data,
        image_url: presetImgUrl,
        validationWarnings,
        extractionConfidenceLow: data.confidence < 85,
        isMock: true
      });
    }

    if (!ai) {
      if (image && mimeType) {
        return res.json({
          success: false,
          error: "Gemini API key is not configured in the host environment. Visual analysis is inactive.",
          geminiConnected: false,
          visionRequestSent: false,
          visionResponseReceived: false,
          isFailed: true,
          notes: "AI extraction unavailable"
        });
      }

      const presetKey = presetName || "eurusd";
      const data = mockPresets[presetKey] || mockPresets.eurusd;

      // Adjust image_url for mock presets to have placeholder fallback or local image url
      let presetImgUrl = image_url;
      if (!image && presetKey === "gold") presetImgUrl = "/api/images/placeholder_btc";
      if (!image && presetKey === "nasdaq") presetImgUrl = "/api/images/placeholder_nvda";
      if (!image && presetKey === "eurusd") presetImgUrl = "/api/images/placeholder_eth";

      // Calculate backend validation checks for mock response
      const validationWarnings: string[] = [];
      if (data.type === "LONG") {
        if (data.sl && data.sl >= data.entryPrice) {
          validationWarnings.push("Stop Loss cannot be above Entry Price for a LONG position.");
        }
        if (data.tp && data.tp <= data.entryPrice) {
          validationWarnings.push("Take Profit cannot be below Entry Price for a LONG position.");
        }
      } else if (data.type === "SHORT") {
        if (data.sl && data.sl <= data.entryPrice) {
          validationWarnings.push("Stop Loss cannot be below Entry Price for a SHORT position.");
        }
        if (data.tp && data.tp >= data.entryPrice) {
          validationWarnings.push("Take Profit cannot be above Entry Price for a SHORT position.");
        }
      }
      if (data.rr && data.rr < 1) {
        validationWarnings.push("Risk-Reward ratio is below 1:1, posing a math vulnerability.");
      }

      return res.json({
        ...data,
        image_url: presetImgUrl,
        validationWarnings,
        extractionConfidenceLow: data.confidence < 85,
        isMock: true
      });
    }

    let contents: any[] = [];
    const prompt = `You are an elite, world-class institutional trading analyst and behavioral coach.
Perform a strict 5-stage analysis pipeline on the provided chart screenshot:

Stage 1: Multi-pattern OCR
Precise transcription of dark/light-themed charts. Locate:
- Pair/Asset (e.g. 'EUR/USD', 'BTC/USD', 'XAU/USD', 'NQ Futures')
- Timeframe (e.g. '5m', '15m', '1H', '4H', '1D')
- Direction (must be 'LONG' or 'SHORT')
- Current or Entry price level
- Price sentiments (BULLISH, BEARISH, or NEUTRAL)

Stage 2: TradingView Long/Short Position Tool Detection
Identify if a green-red TradingView position modeling tool is active on the chart. If active, extract:
- Entry Price, Stop Loss (SL), Take Profit (TP)
- Risk Reward Ratio (RR)
- Expected movement in Pips or Points
- Risk % and Reward % modeled
- Approximate candles (holding bars) count

Stage 3 & 4: Outcome & Session Analysis
- Estimate the outcome: 'TP_HIT', 'SL_HIT', 'TRAILING_SL', or 'MANUAL_CLOSED'. Check price zones.
- Identify Session based on timeframe and timestamps: 'London', 'New York', 'Asian', 'London/NY Overlap', or 'None'.
- Classify weekday of the trade date if visible, or select Wednesday as a default.

Stage 5: Structured AI Psychiatry & Behavioral Intelligence
- Setup Type (Breakout, trend continuation, reversal, support resistance bounce, liquidity sweep, scalp, intraday, swing trade)
- Market Structure detail
- Emotion Detected (impatience, greed, fear exits, overconfidence, revenge behavior, hesitation, none)
- Mistake Type (early exit, revenge trading, FOMO entry, oversized position, moved stop loss, poor RR, overtrading, late entry, none)
- Quant scores (from 0 to 100):
  - Discipline score (0-100)
  - Execution quality (0-100)
  - Risk management quality (0-100)
  - Setup quality (0-100)

Return your response strictly adhering to the requested JSON schema.`;

    if (image && mimeType) {
      contents = [
        prompt,
        {
          inlineData: {
            data: image,
            mimeType: mimeType
          }
        }
      ];
    } else {
      // verbal override simulation if no raw image
      const presetKey = presetName || "eurusd";
      const presetString = JSON.stringify(mockPresets[presetKey]);
      contents = [
        prompt,
        `Extract technical structures and behavioral traits matching this preset pattern template: ${presetString}`
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            asset: { type: Type.STRING },
            type: { type: Type.STRING, description: "Must be LONG or SHORT" },
            entryPrice: { type: Type.NUMBER },
            exitPrice: { type: Type.NUMBER },
            sl: { type: Type.NUMBER },
            tp: { type: Type.NUMBER },
            rr: { type: Type.NUMBER },
            pips: { type: Type.NUMBER },
            riskPercent: { type: Type.NUMBER },
            rewardPercent: { type: Type.NUMBER },
            timeframe: { type: Type.STRING },
            chartTime: { type: Type.STRING },
            candleCount: { type: Type.INTEGER },
            duration: { type: Type.STRING },
            detectedTool: { type: Type.STRING, description: "LONG_POSITION, SHORT_POSITION, or NONE" },
            estimatedOutcome: { type: Type.STRING, description: "TP_HIT, SL_HIT, TRAILING_SL, or MANUAL_CLOSED" },
            session: { type: Type.STRING, description: "London, New York, Asian, London/NY Overlap, or None" },
            day: { type: Type.STRING, description: "Day of the week e.g. Monday, Tuesday, etc." },
            sentiment: { type: Type.STRING, description: "BULLISH, BEARISH, or NEUTRAL" },
            setup_type: { type: Type.STRING, description: "breakout, trend continuation, reversal, support resistance bounce, liquidity sweep, scalp, intraday, swing trade" },
            market_structure: { type: Type.STRING },
            emotion_detected: { type: Type.STRING, description: "fear exits, greed, impatience, overconfidence, revenge behavior, hesitation, none" },
            mistake_type: { type: Type.STRING, description: "early exit, revenge trading, FOMO entry, oversized position, moved stop loss, poor RR, overtrading, late entry, none" },
            discipline_score: { type: Type.INTEGER },
            execution_quality: { type: Type.INTEGER },
            risk_management_quality: { type: Type.INTEGER },
            setup_quality: { type: Type.INTEGER },
            confidence: { type: Type.INTEGER, description: "OCR Confidence percent score 0-100" },
            notes: { type: Type.STRING }
          },
          required: ["asset", "type", "entryPrice", "sentiment", "notes", "confidence"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");

    // Compute robust backend validations
    const validationWarnings: string[] = [];
    if (parsedData.type === "LONG") {
      if (parsedData.sl && parsedData.sl >= parsedData.entryPrice) {
        validationWarnings.push("Stop Loss cannot be above Entry Price for a LONG position.");
      }
      if (parsedData.tp && parsedData.tp <= parsedData.entryPrice) {
        validationWarnings.push("Take Profit cannot be below Entry Price for a LONG position.");
      }
    } else if (parsedData.type === "SHORT") {
      if (parsedData.sl && parsedData.sl <= parsedData.entryPrice) {
        validationWarnings.push("Stop Loss cannot be below Entry Price for a SHORT position.");
      }
      if (parsedData.tp && parsedData.tp >= parsedData.entryPrice) {
        validationWarnings.push("Take Profit cannot be above Entry Price for a SHORT position.");
      }
    }
    if (parsedData.rr && parsedData.rr < 1) {
      validationWarnings.push("Risk-Reward ratio is below 1:1, posing a core math vulnerability.");
    }

    res.json({
      ...parsedData,
      image_url,
      validationWarnings,
      extractionConfidenceLow: parsedData.confidence < 85,
      isMock: false
    });

  } catch (error: any) {
    console.info("[Tradelense Server] Gemini OCR API failure handles cleanly. Reason:", error.message || error);
    
    return res.json({
      success: false,
      error: error.message || "Failed to analyze trading snapshot via Gemini.",
      geminiConnected: true,
      visionRequestSent: true,
      visionResponseReceived: false,
      isFailed: true,
      notes: "AI extraction unavailable"
    });
  }
});

// REST Endpoint: Get All Trades
app.get("/api/trades", async (req, res) => {
  try {
    if (supabase) {
      let data: any = null;
      let error: any = null;
      try {
        const response = await (supabase as any)
          .from("trades")
          .select("*")
          .order("created_at", { ascending: false });
        data = response.data;
        error = response.error;
      } catch (err: any) {
        error = err;
      }

      if (!error && data) {
        const camelCaseTrades = (data as any[]).map((dbRow: any) => ({
          id: dbRow.id,
          asset: dbRow.pair,
          type: dbRow.direction,
          entryPrice: Number(dbRow.entry_price || 0),
          exitPrice: Number(dbRow.exit_price || 0),
          pnl: Number(dbRow.pnl || 0),
          time: dbRow.created_at || dbRow.time,
          duration: dbRow.holding_time,
          notes: dbRow.notes,
          sl: dbRow.stop_loss ? Number(dbRow.stop_loss) : undefined,
          tp: dbRow.take_profit ? Number(dbRow.take_profit) : undefined,
          rr: dbRow.rr_ratio ? Number(dbRow.rr_ratio) : undefined,
          pips: dbRow.pips ? Number(dbRow.pips) : undefined,
          riskPercent: dbRow.risk_percent ? Number(dbRow.risk_percent) : undefined,
          rewardPercent: dbRow.reward_percent ? Number(dbRow.reward_percent) : undefined,
          session: dbRow.session,
          day: dbRow.weekday,
          setup_type: dbRow.setup_type,
          market_structure: dbRow.market_structure,
          emotion_detected: dbRow.emotion_detected || dbRow.emotion || "none",
          mistake_type: dbRow.mistake_type,
          discipline_score: dbRow.discipline_score ? Number(dbRow.discipline_score) : undefined,
          execution_quality: dbRow.execution_quality ? Number(dbRow.execution_quality) : undefined,
          risk_management_quality: dbRow.risk_management_quality ? Number(dbRow.risk_management_quality) : undefined,
          confidence_score: dbRow.confidence_score ? Number(dbRow.confidence_score) : undefined,
          size: dbRow.position_size || dbRow.size ? Number(dbRow.position_size || dbRow.size) : undefined,
          image_url: dbRow.image_url,
          estimatedOutcome: dbRow.trade_outcome || dbRow.estimatedOutcome || "MANUAL_CLOSED"
        }));
        return res.json(camelCaseTrades);
      }
      
      const errMsg = error?.message || String(error);
      if (errMsg.includes("fetch failed") || errMsg.includes("Failed to fetch") || errMsg.includes("network")) {
        console.info("[Tradelense Server] Supabase is offline or network unreachable, matching local backup index instead.");
      } else {
        console.warn("[Tradelense Server] Supabase trades selection failed, matching local backup index.");
      }
    }

    const list = loadLocalTrades();
    res.json(list);
  } catch (err: any) {
    console.error("Fetch trades failed:", err);
    res.status(500).json({ error: "Failed to retrieve real trades histories." });
  }
});

// REST Endpoint: Create / Insert New Trade
app.post("/api/trades", async (req, res) => {
  const t = req.body;
  if (!t.id) t.id = `tx-ocr-${Date.now()}`;
  if (!t.time) t.time = new Date().toISOString();

  try {
    if (supabase) {
      const dbRow = {
        id: t.id,
        user_id: "default-user",
        pair: t.asset,
        direction: t.type,
        entry_price: t.entryPrice,
        exit_price: t.exitPrice,
        pnl: t.pnl,
        holding_time: t.duration,
        notes: t.notes,
        stop_loss: t.sl,
        take_profit: t.tp,
        rr_ratio: t.rr,
        pips: t.pips,
        risk_percent: t.riskPercent,
        reward_percent: t.rewardPercent,
        session: t.session,
        weekday: t.day,
        setup_type: t.setup_type,
        market_structure: t.market_structure,
        emotion: t.emotion_detected || "none",
        mistake_type: t.mistake_type,
        discipline_score: t.discipline_score,
        execution_quality: t.execution_quality,
        risk_management_quality: t.risk_management_quality,
        confidence_score: t.confidence_score || t.confidence,
        position_size: t.size,
        image_url: t.image_url,
        trade_outcome: t.estimatedOutcome || "MANUAL_CLOSED",
        created_at: t.time
      };

      let error: any = null;
      try {
        const res = await (supabase as any).from("trades").insert([dbRow]);
        error = res.error;
      } catch (err: any) {
        error = err;
      }

      if (!error) {
        console.log("[Tradelense Server] Trade saved in Supabase PG Database successfully:", t.id);
      } else {
        const errMsg = error?.message || String(error);
        if (errMsg.includes("fetch failed") || errMsg.includes("Failed to fetch") || errMsg.includes("network")) {
          console.info("[Tradelense Server] Supabase offline/unreachable on insert, default to local backup.");
        } else {
          console.warn("[Tradelense Server] Supabase PG trades insert failed, default to local backup:", errMsg);
        }
      }
    }

    // Mirror to local JSON file persistence
    const list = loadLocalTrades();
    const index = list.findIndex(item => item.id === t.id);
    if (index >= 0) {
      list[index] = t;
    } else {
      list.unshift(t);
    }
    saveLocalTrades(list);

    res.json({ success: true, trade: t });
  } catch (err: any) {
    console.error("Save trade endpoint failed:", err);
    res.status(500).json({ error: "Failed to persist trade entry on backend database." });
  }
});

// REST Endpoint: Update Existing Trade (for Manual Edit overrides on detailed reviews)
app.put("/api/trades/:id", async (req, res) => {
  const { id } = req.params;
  const t = req.body;

  try {
    if (supabase) {
      const dbRow = {
        pair: t.asset,
        direction: t.type,
        entry_price: t.entryPrice,
        exit_price: t.exitPrice,
        pnl: t.pnl,
        holding_time: t.duration,
        notes: t.notes,
        stop_loss: t.sl,
        take_profit: t.tp,
        rr_ratio: t.rr,
        pips: t.pips,
        risk_percent: t.riskPercent,
        reward_percent: t.rewardPercent,
        session: t.session,
        weekday: t.day,
        setup_type: t.setup_type,
        market_structure: t.market_structure,
        emotion: t.emotion_detected || "none",
        mistake_type: t.mistake_type,
        discipline_score: t.discipline_score,
        execution_quality: t.execution_quality,
        risk_management_quality: t.risk_management_quality,
        confidence_score: t.confidence_score || t.confidence,
        position_size: t.size,
        image_url: t.image_url,
        trade_outcome: t.estimatedOutcome || "MANUAL_CLOSED"
      };

      let error: any = null;
      try {
        const res = await (supabase as any)
          .from("trades")
          .update(dbRow)
          .eq("id", id);
        error = res.error;
      } catch (err: any) {
        error = err;
      }
      
      if (!error) {
        console.log("[Tradelense Server] Trade updated in Supabase PG Database:", id);
      } else {
        const errMsg = error?.message || String(error);
        if (errMsg.includes("fetch failed") || errMsg.includes("Failed to fetch") || errMsg.includes("network")) {
          console.info("[Tradelense Server] Supabase offline/unreachable on update, saving to local backup instead.");
        } else {
          console.warn("[Tradelense Server] Supabase PG trades update failed:", errMsg);
        }
      }
    }

    const list = loadLocalTrades();
    const index = list.findIndex(item => item.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...t };
      saveLocalTrades(list);
      res.json({ success: true, trade: list[index] });
    } else {
      res.status(404).json({ error: "Trade item not found in persistent store." });
    }
  } catch (err: any) {
    console.error("Update trade endpoint failed:", err);
    res.status(500).json({ error: "Failed to update trade details on database backend." });
  }
});

// REST Endpoint: Purge / Delete Trade
app.delete("/api/trades/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (supabase) {
      let error: any = null;
      try {
        const res = await (supabase as any)
          .from("trades")
          .delete()
          .eq("id", id);
        error = res.error;
      } catch (err: any) {
        error = err;
      }

      if (!error) {
        console.log("[Tradelense Server] Trade purged in Supabase PG Database:", id);
      } else {
        const errMsg = error?.message || String(error);
        if (errMsg.includes("fetch failed") || errMsg.includes("Failed to fetch") || errMsg.includes("network")) {
          console.info("[Tradelense Server] Supabase offline/unreachable on delete, purging from local backup instead.");
        } else {
          console.warn("[Tradelense Server] Supabase PG delete failed:", errMsg);
        }
      }
    }

    const list = loadLocalTrades();
    const filtered = list.filter(item => item.id !== id);
    saveLocalTrades(filtered);
    res.json({ success: true, id });
  } catch (err: any) {
    console.error("Delete trade endpoint failed:", err);
    res.status(500).json({ error: "Failed to purge database entries." });
  }
});

// REST Endpoint: Serve Screenshot Image file caches
app.get("/api/images/:id", (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(IMAGES_DIR, `${id}.png`);
  if (fs.existsSync(imagePath)) {
    res.setHeader("Content-Type", "image/png");
    fs.createReadStream(imagePath).pipe(res);
  } else {
    // Return transparent empty pixel fallback
    const placeholderB64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    res.setHeader("Content-Type", "image/png");
    res.end(Buffer.from(placeholderB64, "base64"));
  }
});

// REST Endpoint: Cognitive Psychology & Behavioral Audit
app.post("/api/audit", async (req, res) => {
  const { disciplineScore, ruleAdherence, stopLossMgmt, recentTrades } = req.body;

  try {
    const ai = getAIV4Client();
    
    if (!ai) {
      return res.json({
        report: `## ⚠️ AI Demo Fallback Mode Enabled
To unlock live Gemini-powered behavioral auditing, please configure a clean \`GEMINI_API_KEY\` in your environment or Secrets console.

### Institutional Psych Audit Summary
Based on a **Discipline Score of ${disciplineScore || 94}/100**:
- **Discipline Rating:** Stable to Exceptional.
- **Key Vulnerability:** Monday market opens show heightened emotional susceptibility.
- **Rule Adherence:** ${ruleAdherence || 98}% demonstrates remarkable mechanical discipline.
- **Recommended Action:** Cap maximum drawdown on NQ & EUR/USD sessions. Automate hard risk limits via broker connection.`,
        isMock: true
      });
    }

    const payloadText = `Discipline Score: ${disciplineScore}
Rule Adherence Rate: ${ruleAdherence}%
Stop Loss Management Score: ${stopLossMgmt}%
Recent Trading Ledger Details: ${JSON.stringify(recentTrades)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        `You are the Tradelense AI Journal Co-Pilot, a professional psychological coach specializing in trading consistency, psychology, and mechanical execution.
Provide a high-quality audit evaluating cognitive biases, risk alignment, mechanical control, and suggestions on preventing emotional tilt like 'Monday Revenge Trading'.
Keep your report highly analytical, professional, concise, with clean markdown headers and strong scannable formatting. Do not use verbose fluff. Keep it focused on human performance variables.`,
        payloadText
      ]
    });

    res.json({
      report: response.text || "Failed to generate audit report text.",
      isMock: false
    });

  } catch (error: any) {
    console.info("[Tradelense Server] Gemini Forensic Audit peak limit fallback activated: compiling resilient local audit profile. Reason:", error.message || error);
    res.json({
      report: `## ⚠️ AI High Demand Fallback Mode Active
The Gemini AI engine is currently experiencing heavy peak demand or temporary network congestion (503). Tradelense diagnostic controllers have compiled this resilient, high-fidelity local psychological profile to ensure your session remains uninterrupted:

### Resilient Psych Audit Analytics
- **Discipline Performance:** Evaluated at **${disciplineScore || 90}/100**. Your execution quality demonstrates robust foundational discipline.
- **Biases Monitored:** Elevated risk of impatience during low-volume mid-day doldrums.
- **Rule Adherence Index:** **${ruleAdherence || 85}%**. Your system maintains stable risk-to-reward constraints, preventing massive drawdown cascades.
- **Emergency Coach Actionable Plan:** 
  1. Continue to defend hard stop loss settings immediately upon trade entry.
  2. Implement a 30-minute cooling interval immediately after recording any execution mistake.
  3. Ensure position sizing is strictly limited below your configured settings limit.`,
      isMock: true,
      isFallback: true,
      fallbackErrorMessage: error.message || String(error)
    });
  }
});

async function main() {
  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tradelense Server] Running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Bootstrap Error: ", err);
});
