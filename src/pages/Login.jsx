import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleLogin(credentials) {
    try {
      setLoading(true);
      setError("");

      const response =
        await login(credentials);

      // Update AuthContext immediately
      setUser(response.user);

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Login failed:",
        err
      );

      setError(
        err.response?.data?.error ||
        "Unable to sign in. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your focus journey"
    >
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}