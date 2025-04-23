import { useState } from "react";
import api from "../utils/api";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./AuthForm.module.css";

const AuthForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === "signup" ? "/auth/signup" : "/auth/login";
      const payload =
        type === "signup" ? { name, email, password } : { email, password };

      const res = await api.post(endpoint, payload);
      saveToken(res.data.token);
      setError("");

      toast.success(`${type === "signup" ? "Signup" : "Login"} successful!`);
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong";
      setError(errorMsg);

      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h2>{type === "signup" ? "Signup" : "Login"}</h2>

      {type === "signup" && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.authInput}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.authInput}
      />

      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`${styles.authInput} ${styles.passwordInput}`}
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className={styles.togglePassword}>
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <button type="submit" className={styles.authButton}>
        {type === "signup" ? "Signup" : "Login"}
      </button>

      {error && <p className={styles.authError}>{error}</p>}
    </form>
  );
};

export default AuthForm;
