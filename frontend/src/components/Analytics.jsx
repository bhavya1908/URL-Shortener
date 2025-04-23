import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { getToken } from "../utils/auth";
import styles from "./Analytics.module.css";

const Analytics = () => {
  const { shortId } = useParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState("");
  const token = getToken();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${shortId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("Fetched analytics data:", res.data);
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.response?.data?.error || "Something went wrong");
      }
    };

    fetchAnalytics();
  }, [shortId, token]);

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  if (!analyticsData) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Analytics for <code className={styles.code}>{shortId}</code>
      </h2>
      <p>
        <strong>Total Clicks:</strong> {analyticsData.totalClicks}
      </p>

      {analyticsData.analytics ? (
        analyticsData.analytics.length > 0 ? (
          <div className={styles.analyticsSection}>
            <h3>Visit History</h3>
            <ul className={styles.visitHistory}>
              {analyticsData.analytics.map((visit, index) => (
                <li key={index} className={styles.visitItem}>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(visit.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>Browser:</strong> {visit.browser}
                  </p>
                  <p>
                    <strong>OS:</strong> {visit.os}
                  </p>
                  <p>
                    <strong>Device:</strong> {visit.device}
                  </p>
                  <p>
                    <strong>Country:</strong> {visit.country}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={styles.noVisits}>No visits recorded yet.</p>
        )
      ) : (
        <p className={styles.loginPrompt}>Login to see full visit history.</p>
      )}
    </div>
  );
};

export default Analytics;
