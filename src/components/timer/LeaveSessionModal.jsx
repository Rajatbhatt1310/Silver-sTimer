import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";

export default function LeaveSessionModal({
  open,
  onStay,
  onLeave,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-[60]
              w-[480px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-3xl
              border
              border-white/5
              bg-[var(--color-card)]
              p-8
            "
          >
            <div className="flex flex-col items-center">

              <div className="mb-5 rounded-full bg-amber-500/10 p-5">
                <TriangleAlert
                  size={34}
                  className="text-amber-400"
                />
              </div>

              <h2 className="text-2xl font-semibold">
                Focus Session Active
              </h2>

              <p className="mt-3 text-center text-zinc-400">
                Leaving this page will stop your current
                focus session.
              </p>

              <div className="mt-8 flex w-full gap-4">

                <button
                  onClick={onStay}
                  className="
                    flex-1
                    rounded-2xl
                    bg-emerald-500
                    py-3
                    font-semibold
                    text-black
                  "
                >
                  Stay Focused
                </button>

                <button
                  onClick={onLeave}
                  className="
                    flex-1
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.03]
                    py-3
                  "
                >
                  Leave Anyway
                </button>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}