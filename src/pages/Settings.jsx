import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import SettingsHeader from "../components/settings/SettingsHeader";
import AccountSettings from "../components/settings/AccountSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import DangerZone from "../components/settings/DangerZone";
import DeleteAccountModal from "../components/settings/DeleteAccountModal";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";

import {
  deleteAccount,
} from "../services/authService";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../services/settingsService";


export default function Settings() {
  const navigate = useNavigate();


  // ==================================================
  // CHANGE PASSWORD
  // ==================================================

  const [
    showChangePasswordModal,
    setShowChangePasswordModal,
  ] = useState(false);

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");


  // ==================================================
  // NOTIFICATION PREFERENCES
  // ==================================================

  const [
    emailReminders,
    setEmailReminders,
  ] = useState(false);

  const [
    loadingPreferences,
    setLoadingPreferences,
  ] = useState(true);

  const [
    savingPreferences,
    setSavingPreferences,
  ] = useState(false);


  // ==================================================
  // DELETE ACCOUNT
  // ==================================================

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    deletingAccount,
    setDeletingAccount,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState("");


  // ==================================================
  // LOAD NOTIFICATION PREFERENCES
  // ==================================================

  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      try {
        const data =
          await getNotificationPreferences();

        if (cancelled) {
          return;
        }

        setEmailReminders(
          Boolean(
            data?.preferences
              ?.email_notifications
          )
        );

      } catch (error) {
        console.error(
          "Failed to load notification preferences:",
          error
        );

      } finally {
        if (!cancelled) {
          setLoadingPreferences(false);
        }
      }
    }

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);


  // ==================================================
  // CHANGE PASSWORD
  // ==================================================

  function handleChangePassword() {
    setPasswordSuccess("");
    setShowChangePasswordModal(true);
  }


  // ==================================================
  // EMAIL REMINDERS
  // ==================================================

  async function handleEmailRemindersChange(
    enabled
  ) {
    if (
      loadingPreferences ||
      savingPreferences
    ) {
      return;
    }

    const previousValue =
      emailReminders;

    // Optimistic UI update
    setEmailReminders(enabled);

    try {
      setSavingPreferences(true);

      const data =
        await updateNotificationPreferences({
          email_notifications:
            enabled,
      });

      setEmailReminders(
        Boolean(
          data?.preferences
            ?.email_notifications
        )
      );

    } catch (error) {
      console.error(
        "Failed to update email reminders:",
        error
      );

      // Restore previous value if request fails
      setEmailReminders(
        previousValue
      );

    } finally {
      setSavingPreferences(false);
    }
  }


  // ==================================================
  // DELETE ACCOUNT
  // ==================================================

  async function handleDeleteAccount() {
    if (deletingAccount) {
      return;
    }

    try {
      setDeletingAccount(true);
      setDeleteError("");

      await deleteAccount();

      setShowDeleteModal(false);

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Delete account failed:",
        error
      );

      setDeleteError(
        error?.response?.data?.error ||
          "Unable to delete your account. Please try again."
      );

    } finally {
      setDeletingAccount(false);
    }
  }


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">

      <SettingsHeader />


      {/* Delete Error */}

      {deleteError && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {deleteError}
        </div>
      )}


      {/* Password Success */}

      {passwordSuccess && (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {passwordSuccess}
        </div>
      )}


      <div className="mt-8 flex flex-col gap-6">

        {/* Account Security */}

        <AccountSettings
          onChangePassword={
            handleChangePassword
          }
        />


        {/* Notifications */}

        <NotificationSettings
          emailReminders={
            emailReminders
          }
          onEmailRemindersChange={
            handleEmailRemindersChange
          }
        />


        {/* Danger Zone */}

        <DangerZone
          onDeleteAccount={() => {
            setDeleteError("");
            setShowDeleteModal(true);
          }}
        />

      </div>


      {/* Change Password Modal */}

      <ChangePasswordModal
        open={
          showChangePasswordModal
        }

        onClose={() =>
          setShowChangePasswordModal(
            false
          )
        }

        onSuccess={(message) => {
          setPasswordSuccess(
            message
          );
        }}
      />


      {/* Delete Account Modal */}

      <DeleteAccountModal
        open={
          showDeleteModal
        }

        onClose={() => {
          if (!deletingAccount) {
            setShowDeleteModal(
              false
            );
          }
        }}

        onConfirm={
          handleDeleteAccount
        }

        loading={
          deletingAccount
        }
      />

    </div>
  );
}