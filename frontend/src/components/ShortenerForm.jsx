import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getToken, removeToken } from "../utils/auth";
import { toast } from "react-toastify";
import styles from "./ShortenerForm.module.css";

const ShortenerForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");

  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setShortUrl("");
      setQrCode("");
    }
  }, [token]);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError("");
    setQrCode("");

    try {
      const res = await api.post(
        "/",
        { longUrl },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.shortUrl) {
        setShortUrl(res.data.shortUrl);
        if (token) {
          const shortId = res.data.shortUrl.split("/").pop();
          fetchQRCode(shortId);
        }
      } else {
        throw new Error("Short URL not returned from server.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setShortUrl("");
      setQrCode("");
    }
  };

  const fetchQRCode = async (shortId) => {
    try {
      const res = await api.get(`/qr/${shortId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQrCode(res.data.qrCode);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setQrCode("");
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        toast.info("Short URL copied to clipboard!");
      });
    }
  };

  const handleLogout = () => {
    removeToken();
    setShortUrl("");
    setQrCode("");
    toast.success("Logged out successfully 👋");
    navigate("/");
  };

  const handleLoginRedirect = () => navigate("/login");
  const handleSignupRedirect = () => navigate("/signup");

  return (
    <form onSubmit={handleShorten} className={styles.formContainer}>
      <h2>Shorten a URL</h2>

      <input
        type="url"
        placeholder="Enter a long URL"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        required
        className={styles.inputField}
      />

      <button type="submit" className={styles.button}>
        Shorten
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {shortUrl && (
        <div>
          <p>
            Short URL:{" "}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}>
              {shortUrl}
            </a>
          </p>
          <button type="button" onClick={handleCopy} className={styles.button}>
            Copy URL
          </button>
          {token && (
            <div>
              <a
                href={`/analytics/${shortUrl.split("/").pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}>
                View Analytics
              </a>
            </div>
          )}
        </div>
      )}

      {qrCode && token && (
        <div className={styles.qrSection}>
          <h3>QR Code</h3>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}

      {!token && (
        <div>
          <button
            type="button"
            onClick={handleLoginRedirect}
            className={styles.button}>
            Login
          </button>
          <button
            type="button"
            onClick={handleSignupRedirect}
            className={styles.button}>
            Signup
          </button>
          <p
            style={{
              color: "black",
              fontStyle: "italic",
              backgroundColor: "white",
            }}>
            🔒 Login to generate QR code and view analytics for this short URL
          </p>
        </div>
      )}

      {token && (
        <button type="button" onClick={handleLogout} className={styles.button}>
          Logout
        </button>
      )}
    </form>
  );
};

export default ShortenerForm;
