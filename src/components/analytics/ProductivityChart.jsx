import { TrendingUp } from "lucide-react";


export default function ProductivityChart({
  data = [],
}) {
  const hasData = data.some(
    (item) => item.score > 0
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
          Productivity Trend
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Your focus completion rate
        </p>
      </div>


      {!hasData ? (
        <div className="flex h-64 flex-col items-center justify-center text-zinc-600">

          <TrendingUp size={25} />

          <p className="mt-3 text-sm">
            No productivity data yet
          </p>

        </div>
      ) : (

        <div className="mt-6">

          <div className="flex h-52 items-end gap-3">

            {data.map((item) => {
              const score =
                Math.min(
                  Math.max(
                    item.score || 0,
                    0
                  ),
                  100
                );

              return (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >

                  <span className="mb-2 text-[11px] font-medium text-zinc-500">
                    {score > 0
                      ? `${score}%`
                      : ""}
                  </span>


                  <div className="relative flex h-[170px] w-full items-end">

                    <div
                      className="
                        w-full
                        rounded-t-md
                        bg-blue-500/60
                        transition-all
                        duration-300
                        hover:bg-blue-400
                      "
                      style={{
                        height:
                          `${score}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>


          <div className="mt-3 flex gap-3 border-t border-white/[0.06] pt-3">

            {data.map((item) => (
              <div
                key={item.date}
                className="flex-1 text-center text-xs text-zinc-500"
              >
                {item.label}
              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}