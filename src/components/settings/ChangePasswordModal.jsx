import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  changePassword,
} from "../../services/authService";


function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  const [
    visible,
    setVisible,
  ] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={false}
          className="
            w-full
            rounded-xl
            border
            border-[var(--color-border)]
            bg-[var(--color-bg)]
            px-4
            py-3
            pr-11
            text-sm
            text-[var(--color-text-primary)]
            outline-none
            transition
            placeholder:text-[var(--color-text-subtle)]
            focus:border-[var(--color-primary)]
          "
        />

        <button
          type="button"
          onClick={() =>
            setVisible(
              (current) =>
                !current
            )
          }
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[var(--color-text-subtle)]
            transition
            hover:text-[var(--color-text-primary)]
          "
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}


export default function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
}) {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  if (!open) {
    return null;
  }


  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  }


  function handleClose() {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");


    // ------------------------------------------
    // Frontend validation
    // ------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );

      return;
    }


    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );

      return;
    }


    if (
      currentPassword ===
      newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );

      return;
    }


    try {
      setLoading(true);

      const result =
        await changePassword({
          current_password:
            currentPassword,

          new_password:
            newPassword,

          confirm_password:
            confirmPassword,
        });


      resetForm();

      onClose();


      if (onSuccess) {
        onSuccess(
          result?.message ||
            "Password changed successfully."
        );
      }

    } catch (error) {
      console.error(
        "Change password failed:",
        error
      );

      setError(
        error?.response?.data?.error ||
          "Unable to change password. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-card)]
          p-6
          shadow-2xl
        "
      >

        {/* Header */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[var(--color-primary-dim)]
                text-[var(--color-primary-light)]
              "
            >
              <KeyRound
                size={19}
              />
            </div>


            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Change Password
              </h2>

              <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">
                Update your account password
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading
            }
            aria-label="Close"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[var(--color-text-muted)]
              transition
              hover:bg-white/[0.05]
              hover:text-[var(--color-text-primary)]
              disabled:opacity-50
            "
          >
            <X size={17} />
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6"
        >

          <div className="flex flex-col gap-4">

            <PasswordField
              label="Current Password"
              value={
                currentPassword
              }
              onChange={
                setCurrentPassword
              }
              placeholder="Enter current password"
              autoComplete="current-password"
            />


            <PasswordField
              label="New Password"
              value={
                newPassword
              }
              onChange={
                setNewPassword
              }
              placeholder="Enter new password"
              autoComplete="new-password"
            />


            <PasswordField
              label="Confirm New Password"
              value={
                confirmPassword
              }
              onChange={
                setConfirmPassword
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
            />

          </div>


          {/* Error */}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Actions */}

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="
                rounded-xl
                border
                border-[var(--color-border)]
                px-4
                py-2.5
                text-sm
                text-[var(--color-text-muted)]
                transition
                hover:bg-white/[0.04]
                hover:text-[var(--color-text-primary)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[var(--color-primary)]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {loading
                ? "Changing..."
                : "Change Password"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
}