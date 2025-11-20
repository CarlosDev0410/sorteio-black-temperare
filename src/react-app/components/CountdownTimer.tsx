import { useCountdown } from "@/react-app/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date;
  compact?: boolean;
}

export default function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const timeUnits = [
    { value: days, label: "Dias" },
    { value: hours, label: "Horas" },
    { value: minutes, label: "Minutos" },
    { value: seconds, label: "Segundos" },
  ];

  if (compact) {
    return (
      <>
        {timeUnits.map((unit, index) => (
          <span key={index} className="flex items-baseline gap-0.5">
            <span className="font-bold">{String(unit.value).padStart(2, "0")}</span>
            <span className="text-[10px] opacity-70">{unit.label.charAt(0)}</span>
            {index < timeUnits.length - 1 && <span className="mx-0.5">:</span>}
          </span>
        ))}
      </>
    );
  }

  return (
    <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
      {timeUnits.map((unit, index) => (
        <div
          key={index}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className={`relative bg-black/80 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 md:p-8 min-w-[110px] md:min-w-[140px] text-center ${unit.label === 'Segundos' ? 'animate-pulse-subtle' : ''}`}>
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent mb-2">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-sm md:text-base text-gray-400 uppercase tracking-wider">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
