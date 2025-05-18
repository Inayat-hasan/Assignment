"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase.js";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      setUser(response.user);
      // send to / page.
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
