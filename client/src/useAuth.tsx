import { useState, useEffect } from "react";
import axios from "axios";

interface Response {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const API_URL = "http://localhost:5000";

const useAuth = (code: string) => {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.post<Response>(`${API_URL}/login`, {
          code,
        });

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setExpiresIn(data.expiresIn);

        window.history.replaceState("", document.title, "/");
      } catch (error) {
        window.location.href = "/";
      }
    };

    fetchToken();
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const refreshAccessToken = async () => {
      try {
        const { data } = await axios.post<Response>(`${API_URL}/refresh`, {
          refreshToken,
        });

        setAccessToken(data.accessToken);
        setExpiresIn(data.expiresIn);
      } catch (error) {
        window.location.href = "/";
      }
    };

    const interval = setInterval(refreshAccessToken, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;
