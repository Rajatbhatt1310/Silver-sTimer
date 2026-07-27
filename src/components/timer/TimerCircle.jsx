import { motion } from "framer-motion";

const SIZE = 340;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TimerCircle({
  minutes = "45",
  seconds = "00",
  progress = 0.35,
  remainingSeconds = 2700,
  modeLabel = "Deep Work",
}) {
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative flex items-center justify-center">

      {/* Outer Glow */}
      <motion.div
        animate={
          remainingSeconds <= 60
            ? {
              scale: [1, 1.03, 1],
              opacity: [0.2, 0.4, 0.2],
            }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 2.4,
          ease: "easeInOut",
        }}
        className="
          absolute
          h-[370px]
          w-[370px]
          rounded-full
          bg-emerald-500/10
          blur-[70px]
        "
      />

      {/* Glass Center */}
      <div
        className="
          absolute
          h-[250px]
          w-[250px]
          rounded-full
          border
          border-white/5
          bg-white/[0.02]
          backdrop-blur-xl
        "
      />

      <svg
        width={SIZE}
        height={SIZE}
        className="-rotate-90"
      >
        <defs>
          <linearGradient
            id="timerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#4ADE80"
            />

            <stop
              offset="100%"
              stopColor="#10B981"
            />
          </linearGradient>

          <filter id="timerGlow">
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,.05)"
          strokeWidth={STROKE}
        />

        {/* Progress */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#timerGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 0.25,
            ease: "linear",
          }}
          filter="url(#timerGlow)"
        />
      </svg>

      {/* Timer Content */}
      <div className="absolute flex flex-col items-center">

        <motion.span
          key={`${minutes}:${seconds}`}
          initial={{ opacity: 0.75, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="
                      text-[76px]
                      font-bold
                      leading-none
                      tracking-tight
                      text-white
                    "
        >

          {minutes}:{seconds}
        </motion.span>

        <p
          className="
                mt-6
                text-sm
                font-medium
                uppercase
                tracking-[0.35em]
                text-zinc-500
          "
        >
          {modeLabel}
        </p>

      </div>

    </div>
  );
}