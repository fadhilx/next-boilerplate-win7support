import { useState, useEffect, useCallback } from "react";
import { ErrorMessage, apiUrl, useApi } from "./useApi";
import { SafeUser } from "@/models/auth";

const useAuth = (
  verifyOnInit?: boolean,
  verifyCallback?: (verified: false | SafeUser) => void
) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<SafeUser>();
  const authApi = useApi<any, SafeUser | undefined>(apiUrl("auth/profile/me"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setToken(token);
    if (token) authApi.registerAuthorizationToken(token);
  }, []);
  useEffect(() => {
    if (verifyOnInit && !verified) verify();
  }, [authApi.tokenRegistered, verified]);
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    setVerified(false);
    setToken(null);
    setUser(undefined);
    verifyCallback?.(false);
    authApi.registerAuthorizationToken(undefined);
  };
  const verify = useCallback(async () => {
    if (!authApi.tokenRegistered) return;
    try {
      const user = await authApi.get();
      setVerified(!!user);
      setUser(user);
      if (user) verifyCallback?.(user);
    } catch (e) {
      const error: ErrorMessage = e as any;
      if (error.status === 401) {
        logout();
      }
    }
  }, [authApi.tokenRegistered]);
  return { isLoggedIn, token, verify, verified, user, logout };
};

export default useAuth;
