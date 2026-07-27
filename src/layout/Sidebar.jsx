import {
  LogOut,
  Timer,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
} from "../utils/navigation";

import UserCard from "../components/common/UserCard.jsx";
import ConfirmModal from "../components/common/ConfirmModal";

import {
  useTimerContext,
} from "../context/TimerContext";

import {
  useAuth,
} from "../context/AuthContext";

import {
  logout,
} from "../services/authService";


function NavItem({
  item,
  onNavigate,
  currentPath,
}) {
  const Icon = item.icon;

  const isActive =
    currentPath === `/${item.id}` ||
    (
      item.id === "dashboard" &&
      currentPath === "/"
    );

  return (
    <button
      type="button"
      onClick={() =>
        onNavigate(item.id)
      }
      className={[
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "relative transition-colors duration-150",

        isActive
          ? "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]"
          : "text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]",

      ].join(" ")}
    >
      <Icon
        size={18}
        strokeWidth={2}
        className={
          isActive
            ? "text-[var(--color-primary-light)]"
            : ""
        }
      />

      <span className="truncate">
        {item.label}
      </span>

      {item.hasNotification &&
        !isActive && (

          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />

        )}

    </button>
  );
}


export default function Sidebar({
  className = "",
}) {
  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const timer =
    useTimerContext();


  // ==================================================
  // LEAVE TIMER MODAL
  // ==================================================

  const [
    showLeaveModal,
    setShowLeaveModal,
  ] = useState(false);

  const [
    pendingPage,
    setPendingPage,
  ] = useState(null);


  // ==================================================
  // LOGOUT
  // ==================================================

  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [
    logoutError,
    setLogoutError,
  ] = useState("");


  // ==================================================
  // NAVIGATION
  // ==================================================

  function handleNavigate(page) {
    if (
      location.pathname ===
      `/${page}`
    ) {
      return;
    }

    if (
      timer.isRunning ||
      timer.isPaused
    ) {
      setPendingPage(page);
      setShowLeaveModal(true);

      return;
    }

    navigate(
      `/${page}`
    );
  }


  // ==================================================
  // LOGOUT
  // ==================================================

  function handleLogoutClick() {
    setLogoutError("");

    setShowLogoutModal(true);
  }


  async function handleLogoutConfirm() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setLogoutError("");

      // Stop active timer locally before
      // destroying the authenticated session.
      if (
        timer.isRunning ||
        timer.isPaused
      ) {
        timer.stop();
      }

      await logout();

      setShowLogoutModal(false);

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      setLogoutError(
        error?.response?.data?.error ||
        "Unable to log out. Please try again."
      );

    } finally {
      setLoggingOut(false);
    }
  }


  return (
    <>

      <aside
        className={[
          "flex h-full w-[248px] shrink-0 flex-col justify-between",
          "border-r border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-5",
          className,
        ].join(" ")}
      >

        {/* ==================================================
            TOP
        ================================================== */}

        <div className="flex flex-col gap-6">


          {/* Logo */}

          <button
            type="button"
            onClick={() =>
              handleNavigate(
                "dashboard"
              )
            }
            aria-label="Go to dashboard"
            className="
              group
              flex
              w-fit
              items-center
              gap-2
              rounded-lg
              px-2
              py-1
              text-left
              transition
              hover:bg-white/[0.03]
            "
          >

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-[var(--color-primary-dim)]
                transition-transform
                duration-200
                group-hover:scale-105
              "
            >
              <Timer
                size={16}
                strokeWidth={2.5}
                className="text-[var(--color-primary-light)]"
              />
            </span>


            <span className="text-[15px] font-bold tracking-tight text-[var(--color-text-primary)]">

              Silver's{" "}

              <span className="text-[var(--color-primary-light)]">
                Timer
              </span>

            </span>

          </button>


          {/* Main Navigation */}

          <nav className="flex flex-col gap-1">

            {NAV_ITEMS.map(
              (item) => (

                <NavItem
                  key={item.id}
                  item={item}
                  currentPath={
                    location.pathname
                  }
                  onNavigate={
                    handleNavigate
                  }
                />

              )
            )}

          </nav>

        </div>


        {/* ==================================================
            BOTTOM
        ================================================== */}

        <div className="flex flex-col gap-3">


          {/* Secondary Navigation */}

          {SECONDARY_NAV_ITEMS.length >
            0 && (

              <nav className="flex flex-col gap-1 border-t border-[var(--color-border)] pt-3">

                {SECONDARY_NAV_ITEMS.map(
                  (item) => (

                    <NavItem
                      key={item.id}
                      item={item}
                      currentPath={
                        location.pathname
                      }
                      onNavigate={
                        handleNavigate
                      }
                    />

                  )
                )}

              </nav>

            )}


          {/* User */}

          {user && (

            <div className="flex items-center gap-2">

              <div className="min-w-0 flex-1">

                <UserCard
                  name={
                    user.full_name ||
                    user.username
                  }
                  onClick={() =>
                    handleNavigate(
                      "profile"
                    )
                  }
                />

              </div>


              {/* Logout */}

              <button
                type="button"
                onClick={
                  handleLogoutClick
                }
                disabled={
                  loggingOut
                }
                title="Log out"
                aria-label="Log out"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--color-border)]
                  text-[var(--color-text-muted)]
                  transition-all
                  duration-150
                  hover:border-red-500/30
                  hover:bg-red-500/10
                  hover:text-red-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <LogOut
                  size={17}
                  strokeWidth={2}
                />

              </button>

            </div>

          )}


          {/* Logout Error */}

          {logoutError && (

            <p className="px-1 text-xs leading-5 text-red-400">
              {logoutError}
            </p>

          )}

        </div>

      </aside>


      {/* ==================================================
          ACTIVE TIMER CONFIRMATION
      ================================================== */}

      <ConfirmModal
        open={
          showLeaveModal
        }

        title="Leave Focus Session?"

        message={
          "Your focus session is still running."
        }

        confirmText="Leave"

        cancelText="Stay"

        onCancel={() => {
          setShowLeaveModal(false);
          setPendingPage(null);
        }}

        onConfirm={() => {
          timer.stop();

          if (pendingPage) {
            navigate(
              `/${pendingPage}`
            );
          }

          setPendingPage(null);
          setShowLeaveModal(false);
        }}
      />


      {/* ==================================================
          LOGOUT CONFIRMATION
      ================================================== */}

      <ConfirmModal
        open={
          showLogoutModal
        }

        title="Log out?"

        message={
          "Are you sure you want to log out of Silver's Timer?"
        }

        confirmText={
          loggingOut
            ? "Logging out..."
            : "Log out"
        }

        cancelText="Cancel"

        onCancel={() => {
          if (!loggingOut) {
            setShowLogoutModal(false);
          }
        }}

        onConfirm={
          handleLogoutConfirm
        }
      />

    </>
  );
}