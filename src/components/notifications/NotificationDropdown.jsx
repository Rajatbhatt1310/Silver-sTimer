import {
  CheckCheck,
  Timer,
} from "lucide-react";


export default function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  onNotificationClick,
  onMarkAllRead,
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-[380px]
        overflow-hidden
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-card)]
        shadow-2xl
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--color-border)]
          px-4
          py-3
        "
      >

        <div>
          <h3 className="text-sm font-semibold text-white">
            Notifications
          </h3>

          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </p>
        </div>


        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-emerald-400
              transition
              hover:text-emerald-300
            "
          >
            <CheckCheck size={14} />

            Mark all read
          </button>
        )}

      </div>


      {/* Notifications */}

      <div className="max-h-[420px] overflow-y-auto">

        {notifications.length === 0 ? (

          <div className="px-5 py-10 text-center">

            <p className="text-sm text-[var(--color-text-muted)]">
              No notifications yet.
            </p>

          </div>

        ) : (

          notifications.map(
            (notification) => (

              <button
                key={notification.id}
                type="button"
                onClick={() =>
                  onNotificationClick(
                    notification
                  )
                }
                className={`
                  flex
                  w-full
                  gap-3
                  border-b
                  border-[var(--color-border)]
                  px-4
                  py-4
                  text-left
                  transition
                  hover:bg-white/[0.04]

                  ${
                    notification.is_read
                      ? ""
                      : "bg-emerald-500/[0.035]"
                  }
                `}
              >

                <div
                  className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-500/10
                    text-emerald-400
                  "
                >
                  <Timer size={16} />
                </div>


                <div className="min-w-0 flex-1">

                  <div className="flex items-start gap-2">

                    <p className="flex-1 text-sm font-medium text-white">
                      {notification.title}
                    </p>


                    {!notification.is_read && (
                      <span
                        className="
                          mt-1.5
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          bg-emerald-400
                        "
                      />
                    )}

                  </div>


                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-[var(--color-text-muted)]
                    "
                  >
                    {notification.message}
                  </p>

                </div>

              </button>

            )
          )

        )}

      </div>

    </div>
  );
}
