import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  function handleForgotPassword(data) {
    console.log(
      "Request password reset through Django:",
      data
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email to reset your password"
    >
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
      />
    </AuthLayout>
  );
}