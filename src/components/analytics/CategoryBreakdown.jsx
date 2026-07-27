import { PieChart } from "lucide-react";


function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}


export default function CategoryBreakdown({
  data = [],
}) {
  const totalMinutes = data.reduce(
    (total, item) =>
      total + (item.minutes || 0),
    0
  );


  return (
    <div
      className="
        rounded-2xl
        border border-white/[0.07]
        bg-white/[0.025]
        p-6
      "
    >
      <div>
        <h2 className="font-semibold text-white">
          Focus by Category
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Where you spend your planned focus time
        </p>
      </div>


      {data.length === 0 ||
      totalMinutes === 0 ? (

        <div className="flex h-64 flex-col items-center justify-center text-zinc-600">

          <PieChart size={25} />

          <p className="mt-3 text-sm">
            No category data yet
          </p>

        </div>

      ) : (

        <div className="mt-7 flex flex-col gap-5">

          {data.map((item) => {
            const percentage =
              Math.round(
                (
                  item.minutes /
                  totalMinutes
                ) * 100
              );

            return (
              <div
                key={item.category}
              >

                <div className="mb-2 flex items-center justify-between gap-4">

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-white">
                      {item.category}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-500">
                      {formatDuration(
                        item.minutes
                      )}
                    </p>

                  </div>


                  <span className="shrink-0 text-sm font-semibold text-zinc-300">
                    {percentage}%
                  </span>

                </div>


                <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                  <div
                    className="
                      h-full
                      rounded-full
                      bg-emerald-500/70
                      transition-all
                      duration-500
                    "
                    style={{
                      width:
                        `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}