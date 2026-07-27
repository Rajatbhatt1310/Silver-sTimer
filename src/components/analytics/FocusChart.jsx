import { BarChart3 } from "lucide-react";


export default function FocusChart({
  data = [],
}) {
  const hasData = data.some(
    (item) => item.minutes > 0
  );

  const maxMinutes = Math.max(
    ...data.map(
      (item) => item.minutes || 0
    ),
    1
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
          Focus Time
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Your daily focus activity
        </p>
      </div>


      {!hasData ? (
        <div className="flex h-64 flex-col items-center justify-center text-zinc-600">

          <BarChart3 size={25} />

          <p className="mt-3 text-sm">
            No focus data yet
          </p>

        </div>
      ) : (

        <div className="mt-6">

          <div className="flex h-52 items-end gap-3">

            {data.map((item) => {
              const height =
                Math.max(
                  (
                    item.minutes /
                    maxMinutes
                  ) * 100,
                  item.minutes > 0
                    ? 6
                    : 0
                );

              return (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >

                  <span className="mb-2 text-[11px] font-medium text-zinc-500">
                    {item.minutes > 0
                      ? `${item.minutes}m`
                      : ""}
                  </span>


                  <div className="flex h-[170px] w-full items-end">

                    <div
                      className="
                        w-full
                        rounded-t-md
                        bg-emerald-500/70
                        transition-all
                        duration-300
                        hover:bg-emerald-400
                      "
                      style={{
                        height:
                          `${height}%`,
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