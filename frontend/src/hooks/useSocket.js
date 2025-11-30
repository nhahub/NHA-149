import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";

/**
 * Custom hook for Socket.io connection
 * @returns {import('socket.io-client').Socket | null} Socket instance or null
 */
export function useSocket() {
  const socketRef = useRef(null);
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      // Disconnect if no token
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Extract base URL from API base URL (remove /api/v1)
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
    const baseUrl = apiBaseUrl.replace(/\/api\/v1.*$/, "");

    console.log("useSocket - Connecting to:", baseUrl);

    // Create socket connection
    const socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Cleanup on unmount
    return () => {
      console.log("useSocket - Cleaning up socket connection");
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token, isAuthenticated]);

  return socketRef.current;
}

/**
 * Hook to get socket connection status
 * @returns {boolean} Connection status
 */
export function useSocketStatus() {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      return;
    }

    const updateStatus = () => setIsConnected(socket.connected);
    updateStatus();

    socket.on("connect", updateStatus);
    socket.on("disconnect", updateStatus);

    return () => {
      socket.off("connect", updateStatus);
      socket.off("disconnect", updateStatus);
    };
  }, [socket]);

  return isConnected;
}


