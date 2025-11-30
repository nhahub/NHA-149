import { useEffect, useReducer } from "react";
import {
  safeGetItem,
  safeGetJSON,
  safeSetItem,
  safeSetJSON,
} from "../utils/localStorage.js";
import { AuthContext } from "./AuthContext.js";

const getInitialState = () => {
  const token = safeGetItem("token");
  const user = safeGetJSON("user");
  const isAuthenticated = !!(token && user);

  console.log("AuthContext - Initial state:", {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated,
    tokenLength: token?.length || 0,
    userId: user?._id || null,
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading: true, // Start with loading to prevent premature redirects
    language: safeGetItem("language") || "en",
  };
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS": {
      console.log("AuthReducer - LOGIN_SUCCESS payload:", {
        hasUser: !!action.payload?.user,
        hasToken: !!action.payload?.token,
        userId: action.payload?.user?._id,
        userName: action.payload?.user?.name,
        tokenLength: action.payload?.token?.length,
        fullPayload: action.payload,
      });

      const newState = {
        ...state,
        user: action.payload?.user || null,
        token: action.payload?.token || null,
        isAuthenticated: !!(action.payload?.user && action.payload?.token),
        isLoading: false,
      };

      console.log("AuthReducer - New state:", {
        hasUser: !!newState.user,
        hasToken: !!newState.token,
        isAuthenticated: newState.isAuthenticated,
      });

      return newState;
    }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  // Restore authentication state on app load
  useEffect(() => {
    console.log("AuthProvider - useEffect starting...");

    // Check direct localStorage first
    const directToken = localStorage.getItem("token");
    const directUser = localStorage.getItem("user");
    console.log("AuthProvider - Direct localStorage:", {
      directToken: !!directToken,
      directUser: !!directUser,
      directTokenLength: directToken?.length,
    });

    // Check using safe functions
    const token = safeGetItem("token");
    const user = safeGetJSON("user");

    console.log("AuthProvider - Checking stored auth:", {
      hasToken: !!token,
      hasUser: !!user,
      tokenStart: token?.substring(0, 20) + "...",
      userName: user?.name,
      userId: user?._id,
      tokenLength: token?.length,
    });

    if (token && user) {
      console.log("AuthProvider - Restoring authentication");
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });
    } else {
      console.log("AuthProvider - No valid auth found, logging out");
      dispatch({ type: "LOGOUT" });
    }

    // Always set loading to false after initial check
    setTimeout(() => {
      console.log("AuthProvider - Setting loading to false");
      dispatch({ type: "SET_LOADING", payload: false });
    }, 100);
  }, []);

  // Listen for storage changes (e.g., from other tabs or API interceptor)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        const token = safeGetItem("token");
        const user = safeGetJSON("user");

        if (token && user) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    // Listen for both storage events and custom events
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events that might be triggered by API interceptor
    const handleCustomStorageChange = () => {
      const token = safeGetItem("token");
      const user = safeGetJSON("user");

      if (token && user) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };

    window.addEventListener("auth-storage-change", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "auth-storage-change",
        handleCustomStorageChange
      );
    };
  }, []);

  const login = (userData, token) => {
    return new Promise((resolve) => {
      console.log("AuthContext - Login called with:", {
        hasUser: !!userData,
        hasToken: !!token,
        userId: userData?._id,
        userName: userData?.name,
        tokenStart: token?.substring(0, 20) + "...",
      });

      // Store in localStorage
      safeSetItem("token", token);
      safeSetJSON("user", userData);

      // Check what was actually stored
      const directToken = localStorage.getItem("token");
      const directUser = localStorage.getItem("user");
      console.log("AuthContext - Direct localStorage check:", {
        directToken: !!directToken,
        directUser: !!directUser,
        directTokenLength: directToken?.length,
        directUserParsed: directUser ? JSON.parse(directUser) : null,
      });

      // Update state
      console.log(
        "AuthContext - About to dispatch LOGIN_SUCCESS with payload:",
        {
          user: userData,
          token: token,
        }
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: { user: userData, token } });

      // Verify the data was stored using safe functions
      const storedToken = safeGetItem("token");
      const storedUser = safeGetJSON("user");
      console.log("AuthContext - Safe function check:", {
        tokenStored: !!storedToken,
        userStored: !!storedUser,
        storedUserId: storedUser?._id,
      });

      // Resolve after state update
      setTimeout(resolve, 50);
    });
  };

  const logout = () => {
    safeSetItem("token", null);
    safeSetItem("user", null);
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userData) => {
    safeSetJSON("user", userData);
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  const setLanguage = (language) => {
    safeSetItem("language", language);
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    setLanguage,
  };

  console.log("AuthContext - Provider value:", {
    isAuthenticated: value.isAuthenticated,
    hasUser: !!value.user,
    hasToken: !!value.token,
    isLoading: value.isLoading,
    userId: value.user?._id,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
