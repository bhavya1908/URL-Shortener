import axios from "axios";

export const protectRoute = async (req, res, next) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!process.env.IPQS_API_KEY) {
      return res.status(500).json({ error: "IPQS API key is missing" });
    }

    const response = await axios.get(
      `https://ipqualityscore.com/api/json/url/${
        process.env.IPQS_API_KEY
      }/${encodeURIComponent(longUrl)}`
    );
    const data = response.data;
    if (
      data.unsafe ||
      data.suspicious ||
      data.phishing ||
      data.malware ||
      data.spam
    ) {
      return res.status(403).json({
        error: "This URL has been flagged as unsafe or malicious.",
        reasons: {
          unsafe: data.unsafe,
          phishing: data.phishing,
          malware: data.malware,
          spam: data.spam,
        },
      });
    }

    next();
  } catch (err) {
    console.error("IPQS API error:", err.message);
    return res.status(500).json({ error: "Unable to verify URL safety" });
  }
};
