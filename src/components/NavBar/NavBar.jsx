import { useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import styles from "./NavBar.module.scss";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate("/");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  function handleLogout() {
    signOut(auth);
    setUser(null);
  }

  function handleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  }

  return (
    <div className={styles.navbar}>
      <span>Navbar</span>
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        null
      )}
    </div>
  );
};

export default NavBar;
