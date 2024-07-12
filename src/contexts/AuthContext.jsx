import { createContext, useState, useEffect, useContext } from "react";
import { auth, googleProvider } from "../services/firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  const signUpOrSignIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (signUpError) {
          if (signUpError.code === "auth/email-already-in-use") {
            throw new Error("Account exists, but password is incorrect");
          } else {
            throw signUpError;
          }
        }
      } else {
        throw error;
      }
    }
  };

  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpOrSignIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
