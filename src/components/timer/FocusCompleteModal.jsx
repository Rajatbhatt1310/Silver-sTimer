import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Trophy,
  ArrowRight,
  Coffee,
  Star,
  Flame,
  Target,
} from "lucide-react";


export default function FocusCompleteModal({
  open,
  onDashboard,
  onBreak,
  rewards,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-40
              bg-black/60
              backdrop-blur-sm
            "
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-50
              w-[520px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-3xl
              border
              border-white/5
              bg-[var(--color-card)]
              p-8
              shadow-2xl
            "
          >
            <div className="flex flex-col items-center">

              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="
                  mb-6
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-500/15
                "
              >
                <Trophy
                  size={34}
                  className="text-emerald-400"
                />
              </motion.div>

              <h2 className="text-3xl font-bold">
                Session Complete
              </h2>

              <p className="mt-2 text-center text-zinc-400">
                Great work. Another focus session completed.
              </p>


              {rewards ? (
                <div className="mt-8 grid w-full grid-cols-3 gap-4">

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/5
                      bg-white/[0.03]
                      p-4
                      text-center
                    "
                  >
                    <Star
                      size={22}
                      className="mx-auto mb-2 text-yellow-400"
                    />

                    <p className="text-2xl font-bold">
                      +{rewards.xp_earned}
                    </p>

                    <p className="text-sm text-zinc-500">
                      XP Earned
                    </p>
                  </div>


                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/5
                      bg-white/[0.03]
                      p-4
                      text-center
                    "
                  >
                    <Flame
                      size={22}
                      className="mx-auto mb-2 text-orange-400"
                    />

                    <p className="text-2xl font-bold">
                      {rewards.current_streak}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Day Streak
                    </p>
                  </div>


                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/5
                      bg-white/[0.03]
                      p-4
                      text-center
                    "
                  >
                    <Target
                      size={22}
                      className="mx-auto mb-2 text-emerald-400"
                    />

                    <p className="text-2xl font-bold">
                      {rewards.focus_score}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Focus Score
                    </p>
                  </div>

                </div>
              ) : (
                <div
                  className="
                    mt-8
                    w-full
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.03]
                    p-5
                    text-center
                  "
                >
                  <p className="font-medium text-white">
                    Your session has been saved.
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Keep building your focus habit.
                  </p>
                </div>
              )}


              {rewards && (
                <div
                  className="
                    mt-5
                    w-full
                    rounded-xl
                    bg-emerald-500/10
                    px-5
                    py-3
                    text-center
                    text-sm
                    text-emerald-400
                  "
                >
                  Level {rewards.level} · Total XP {rewards.xp}
                </div>
              )}


              <div className="mt-8 flex w-full gap-4">

                <button
                  onClick={onBreak}
                  className="
                    flex-1
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.03]
                    py-3
                    transition
                    hover:bg-white/[0.05]
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <Coffee size={18} />
                    Continue Break
                  </div>
                </button>

                <button
                  onClick={onDashboard}
                  className="
                    flex-1
                    rounded-2xl
                    bg-emerald-500
                    py-3
                    font-semibold
                    text-black
                    transition
                    hover:brightness-110
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    Dashboard
                    <ArrowRight size={18} />
                  </div>
                </button>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}