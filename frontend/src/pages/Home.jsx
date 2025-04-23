import ShortenerForm from "../components/ShortenerForm";
import styles from "../components/AuthForm.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <h1>Welcome to MINILINKS!</h1>

      <ShortenerForm />
    </div>
  );
};

export default Home;
