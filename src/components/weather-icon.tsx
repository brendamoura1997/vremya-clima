import { useId } from "react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: string;
  label?: string;
  className?: string;
}

const PALETTE = [
  "[--wi-c1:#EBEEFD] dark:[--wi-c1:#E4C6F6]",
  "[--wi-c2:#A6B6F3] dark:[--wi-c2:#7F5FE3]",
  "[--wi-b1:#D3DBF8] dark:[--wi-b1:#B58BEA]",
  "[--wi-b2:#A5B5EE] dark:[--wi-b2:#5A3CC8]",
  "[--wi-d1:#9FB0EE] dark:[--wi-d1:#8E63DD]",
  "[--wi-d2:#5F78DA] dark:[--wi-d2:#3F26A8]",
  "[--wi-s1:#FFD84A] dark:[--wi-s1:#F9A73B]",
  "[--wi-s2:#FFA21F] dark:[--wi-s2:#F2601A]",
  "[--wi-ray:#F9A23F] dark:[--wi-ray:#F26A1B]",
  "[--wi-drop:#8DB9F8] dark:[--wi-drop:#3C6FE2]",
  "[--wi-bolt1:#FFC53D] dark:[--wi-bolt1:#F7A23A]",
  "[--wi-bolt2:#FF9A1F] dark:[--wi-bolt2:#F2611F]",
  "[--wi-snow:#8DB9F8] dark:[--wi-snow:#3D74E8]",
  "[--wi-mist:#B9C2EE] dark:[--wi-mist:#9C86DA]",
  "[--wi-m1:#FFE27A] dark:[--wi-m1:#FFC15A]",
  "[--wi-m2:#FFB02E] dark:[--wi-m2:#F28A2A]",
].join(" ");

const CLOUD =
  "M20 46H46A9 9 0 0 0 48 28.1A14 14 0 0 0 21.5 25.5A10.3 10.3 0 0 0 20 46Z";
const MOON = "M36 10a22 22 0 1 0 22 26a17 17 0 0 1 -22 -26z";
const DROP = "M0 -4C2 -1 3 0.8 3 2.2A3 3 0 0 1 -3 2.2C-3 0.8 -2 -1 0 -4Z";
const BOLT = "M36 35L25 51H32L28 62L42 45H35L39 35Z";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-cloud`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--wi-c1)" }} />
        <stop offset="1" style={{ stopColor: "var(--wi-c2)" }} />
      </linearGradient>
      <linearGradient id={`${id}-back`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--wi-b1)" }} />
        <stop offset="1" style={{ stopColor: "var(--wi-b2)" }} />
      </linearGradient>
      <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--wi-d1)" }} />
        <stop offset="1" style={{ stopColor: "var(--wi-d2)" }} />
      </linearGradient>
      <radialGradient id={`${id}-sun`} cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" style={{ stopColor: "var(--wi-s1)" }} />
        <stop offset="1" style={{ stopColor: "var(--wi-s2)" }} />
      </radialGradient>
      <linearGradient id={`${id}-moon`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--wi-m1)" }} />
        <stop offset="1" style={{ stopColor: "var(--wi-m2)" }} />
      </linearGradient>
      <linearGradient id={`${id}-bolt`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--wi-bolt1)" }} />
        <stop offset="1" style={{ stopColor: "var(--wi-bolt2)" }} />
      </linearGradient>
      <filter id={`${id}-blur`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
      <filter id={`${id}-soft`} x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="0.9" />
      </filter>
    </defs>
  );
}

function Cloud({
  id,
  t,
  back,
  deep,
}: {
  id: string;
  t?: string;
  back?: boolean;
  deep?: boolean;
}) {
  return (
    <path
      d={CLOUD}
      transform={t}
      fill={`url(#${id}-${deep ? "deep" : back ? "back" : "cloud"})`}
    />
  );
}

function Sun({
  id,
  cx,
  cy,
  r,
}: {
  id: string;
  cx: number;
  cy: number;
  r: number;
}) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(a) * r * 1.45;
    const y1 = cy + Math.sin(a) * r * 1.45;
    const x2 = cx + Math.cos(a) * r * 1.95;
    const y2 = cy + Math.sin(a) * r * 1.95;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={r * 0.3}
        strokeLinecap="round"
        style={{ stroke: "var(--wi-ray)" }}
      />
    );
  });

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r * 1.5}
        filter={`url(#${id}-blur)`}
        opacity={0.55}
        style={{ fill: "var(--wi-s2)" }}
      />
      {rays}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-sun)`} />
    </g>
  );
}

function Moon({ id, t }: { id: string; t: string }) {
  return (
    <g transform={t}>
      <g transform="translate(72.6 0) scale(-1 1)">
        <path
          d={MOON}
          filter={`url(#${id}-blur)`}
          opacity={0.55}
          style={{ fill: "var(--wi-m2)" }}
        />
        <path d={MOON} fill={`url(#${id}-moon)`} />
      </g>
    </g>
  );
}

function Celestial({
  id,
  night,
  cx,
  cy,
  r,
  moonT,
}: {
  id: string;
  night: boolean;
  cx: number;
  cy: number;
  r: number;
  moonT: string;
}) {
  return night ? (
    <Moon id={id} t={moonT} />
  ) : (
    <Sun id={id} cx={cx} cy={cy} r={r} />
  );
}

function Drops({ points }: { points: Array<[number, number]> }) {
  return (
    <g>
      {points.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={DROP}
          transform={`translate(${x} ${y}) rotate(18) scale(0.95)`}
          style={{ fill: "var(--wi-drop)" }}
        />
      ))}
    </g>
  );
}

function Snowflake() {
  return (
    <g
      transform="translate(32 52)"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: "var(--wi-snow)" }}
    >
      {[0, 60, 120].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d="M-7.5 0H7.5" />
          <path d="M5 -2.4L7.5 0L5 2.4" />
          <path d="M-5 -2.4L-7.5 0L-5 2.4" />
        </g>
      ))}
    </g>
  );
}

function Mist({ id }: { id: string }) {
  const lines: Array<[number, number, number]> = [
    [20, 22, 46],
    [14, 29, 52],
    [18, 36, 48],
    [12, 43, 54],
    [22, 50, 42],
  ];

  return (
    <g filter={`url(#${id})`}>
      {lines.map(([x1, y, x2]) => (
        <line
          key={y}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          strokeWidth={4}
          strokeLinecap="round"
          style={{ stroke: "var(--wi-mist)" }}
        />
      ))}
    </g>
  );
}

export function WeatherIcon({ code, label, className }: WeatherIconProps) {
  const id = useId().replace(/:/g, "");
  const kind = code.slice(0, 2);
  const night = code.endsWith("n");

  let body;

  switch (kind) {
    case "01":
      body = (
        <Celestial
          id={id}
          night={night}
          cx={32}
          cy={32}
          r={12}
          moonT="translate(-4 0)"
        />
      );
      break;
    case "02":
      body = (
        <>
          <Celestial
            id={id}
            night={night}
            cx={40}
            cy={22}
            r={7.5}
            moonT="translate(10 2) scale(0.65)"
          />
          <Cloud id={id} t="translate(0 8)" />
        </>
      );
      break;
    case "03":
      body = (
        <>
          <Cloud id={id} back t="translate(5 4) scale(0.8)" />
          <Cloud id={id} t="translate(-1 16) scale(0.7)" />
        </>
      );
      break;
    case "04":
      body = (
        <>
          <Cloud id={id} deep t="translate(5 4) scale(0.8)" />
          <Cloud id={id} t="translate(-1 16) scale(0.7)" />
        </>
      );
      break;
    case "09":
      body = (
        <>
          <Cloud id={id} t="translate(0 -6)" />
          <Drops
            points={[
              [21, 45],
              [32, 45],
              [43, 45],
              [26.5, 55],
              [37.5, 55],
            ]}
          />
        </>
      );
      break;
    case "10":
      body = (
        <>
          <Celestial
            id={id}
            night={night}
            cx={40}
            cy={22}
            r={7.5}
            moonT="translate(10 2) scale(0.65)"
          />
          <Cloud id={id} t="translate(4.8 8) scale(0.85)" />
          <Drops
            points={[
              [21, 53],
              [32, 53],
              [43, 53],
            ]}
          />
        </>
      );
      break;
    case "11":
      body = (
        <>
          <Cloud id={id} t="translate(0 -6)" />
          <path d={BOLT} fill={`url(#${id}-bolt)`} />
        </>
      );
      break;
    case "13":
      body = (
        <>
          <Cloud id={id} t="translate(0 -6)" />
          <Snowflake />
        </>
      );
      break;
    case "50":
      body = <Mist id={id} />;
      break;
    default:
      body = (
        <>
          <Cloud id={id} back t="translate(8 -4) scale(0.9)" />
          <Cloud id={id} t="translate(-2 8) scale(0.95)" />
        </>
      );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("overflow-visible", PALETTE, className)}
    >
      <Defs id={id} />
      {body}
    </svg>
  );
}
