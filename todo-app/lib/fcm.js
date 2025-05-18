"use client";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { app } from "./firebase";
import { toast } from "react-hot-toast";

let messaging = null;

const initMessaging = async () => {
  const supported = await isSupported();
  if (supported && typeof window !== "undefined") {
    messaging = getMessaging(app);
  }
  return messaging;
};

const generateToken = async (messaging) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
    }
  } catch (error) {}
};

const listenForMessages = (messaging) => {
  onMessage(messaging, (payload) => {
    toast.success(payload.notification.body);
  });
};

export { initMessaging, generateToken, listenForMessages };
