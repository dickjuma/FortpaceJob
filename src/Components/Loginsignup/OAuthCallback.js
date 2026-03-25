import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../../Services/api";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing Google sign in...");

  useEffect(() => {
    const run = async () => {
      const error = searchParams.get("error");
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (error) {
        setMessage("Google sign in failed. Please try again.");
        return;
      }

      if (!accessToken || !refreshToken) {
        setMessage("Google sign in response was invalid.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        await authAPI.getMe();
      } catch (_) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setMessage("Could not load your account after Google sign in.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "freelancer") {
        navigate("/my-profile/overview");
      } else if (user?.role === "client") {
        navigate("/client-services/overview");
      } else {
        navigate("/");
      }
    };

    run();
  }, [navigate, searchParams]);

  return <div style={{ padding: "2rem", textAlign: "center" }}>{message}</div>;
};

export default OAuthCallback;
