import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import { signup } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(data) {
    try {
      setLoading(true);
      setError("");

      await signup(data);

      // Django automatically logs the user in after signup
      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building better focus habits"
    >
      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}