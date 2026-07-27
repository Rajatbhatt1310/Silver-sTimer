import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useFocusMode } from "../context/FocusModeContext";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

import NotificationDropdown from "../components/notifications/NotificationDropdown";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";


export default function DashboardLayout() {
  const { isFocusMode } =
    useFocusMode();

  const navigate =
    useNavigate();

  const notificationRef =
    useRef(null);


  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);


  // ------------------------------------------
  // Load notifications
  // ------------------------------------------

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data =
          await getNotifications();

        setNotifications(
          data.notifications || []
        );

        setUnreadCount(
          data.unread_count || 0
        );

      } catch (error) {
        console.error(
          "Unable to load notifications:",
          error
        );
      }
    }

    loadNotifications();
  }, []);


  // ------------------------------------------
  // Close dropdown when clicking outside
  // ------------------------------------------

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  // ------------------------------------------
  // Notification click
  // ------------------------------------------

  async function handleNotificationClick(
    notification
  ) {
    try {
      if (!notification.is_read) {
        await markNotificationRead(
          notification.id
        );

        setNotifications(
          (current) =>
            current.map((item) =>
              item.id === notification.id
                ? {
                    ...item,
                    is_read: true,
                  }
                : item
            )
        );

        setUnreadCount(
          (current) =>
            Math.max(0, current - 1)
        );
      }


      setNotificationsOpen(false);


      if (notification.action_url) {
        navigate(
          notification.action_url
        );
      }

    } catch (error) {
      console.error(
        "Unable to open notification:",
        error
      );
    }
  }


  // ------------------------------------------
  // Mark all as read
  // ------------------------------------------

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();

      setNotifications(
        (current) =>
          current.map((notification) => ({
            ...notification,
            is_read: true,
          }))
      );

      setUnreadCount(0);

    } catch (error) {
      console.error(
        "Unable to mark notifications as read:",
        error
      );
    }
  }


  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">

      {/* Sidebar */}

      {!isFocusMode && (
        <Sidebar />
      )}


      {/* Main Content */}

      <div className="flex min-w-0 flex-1 flex-col">


        {/* Top Navbar */}

        {!isFocusMode && (

          <div
            ref={notificationRef}
            className="relative"
          >

            <TopNavbar
              hasUnreadNotifications={
                unreadCount > 0
              }
              onNotificationsClick={() =>
                setNotificationsOpen(
                  (current) => !current
                )
              }
            />


            {notificationsOpen && (

              <div className="absolute right-6 top-[58px] z-50">

                <NotificationDropdown
                  notifications={
                    notifications
                  }
                  unreadCount={
                    unreadCount
                  }
                  onNotificationClick={
                    handleNotificationClick
                  }
                  onMarkAllRead={
                    handleMarkAllRead
                  }
                />

              </div>

            )}

          </div>

        )}


        {/* Page Content */}

        <main
          className={
            isFocusMode
              ? "flex h-screen flex-1 items-center justify-center overflow-hidden"
              : "min-h-0 flex-1 overflow-y-auto"
          }
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}