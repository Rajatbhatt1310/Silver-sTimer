import AuthLayout from "../components/auth/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function ResetPassword() {
  function handleResetPassword(data) {
    console.log(
      "Reset password through Django:",
      data
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account"
    >
      <ResetPasswordForm
        onSubmit={handleResetPassword}
      />
    </AuthLayout>
  );
}