import AuthForm from "../components/AuthForm.jsx";
import styles from "../components/AuthForm.module.css";
const Signup = () => (
  <div className={styles.pageContainer}>
    <AuthForm type="signup" />
  </div>
);
export default Signup;
