import URL from "../models/model.url.js";
import shortid from "shortid";
import QRCode from "qrcode";
import { UAParser } from "ua-parser-js";

import geoip from "geoip-lite";

export const handleShorten = async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }
    const shortId = shortid.generate();

    const newUrl = await URL.create({
      shortId,
      longUrl,

      visitHistory: [],
    });

    const fullShortUrl = `${process.env.BASE_URL}/${shortId}`;
    res.status(201).json({ shortUrl: fullShortUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleRedirect = async (req, res) => {
  try {
    const { shortId } = req.params;

    const userAgentString = req.headers["user-agent"] || "";
    const referrer = req.get("Referrer") || "Direct";

    const parser = new UAParser(userAgentString);
    const ua = parser.getResult();

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    let geo = {};
    try {
      geo = geoip.lookup(ip) || { country: "Unknown" };
    } catch (geoError) {
      console.error("Geo lookup error:", geoError);
      geo = { country: "Unknown" };
    }

    const visitData = {
      timestamp: Date.now(),
      userAgent: userAgentString,
      referrer,
      browser: ua.browser.name || "Unknown",
      os: ua.os.name || "Unknown",
      device: ua.device.type || "Desktop",
      country: geo.country || "Unknown",
    };

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: visitData,
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(entry.longUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }

    const isAuthenticated = req.user ? true : false;

    if (isAuthenticated) {
      return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
      });
    } else {
      return res.json({ totalClicks: result.visitHistory.length });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGenerateQR = async (req, res) => {
  try {
    const { shortId } = req.params;
    const shortUrl = `${process.env.BASE_URL}/${shortId}`;

    const qrCodeImage = await QRCode.toDataURL(shortUrl);

    res.status(200).json({ shortUrl, qrCode: qrCodeImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
};
