import AuthForm from "../components/AuthForm";
import styles from "../components/AuthForm.module.css";

const Login = () => (
  <div className={styles.pageContainer}>
    <AuthForm type="login" />
  </div>
);
export default Login;
