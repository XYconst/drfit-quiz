import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function base(props: IconProps) {
  return {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': props.title ? undefined : true,
    role: props.title ? 'img' : undefined,
    ...props,
  };
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function HelpCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      {props.title && <title>{props.title}</title>}
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function BedIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

export function WavesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}

export function ZapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function BatteryLowIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
      <line x1="22" x2="22" y1="11" y2="13" />
      <line x1="6" x2="6" y1="11" y2="13" />
    </svg>
  );
}

export function CoffeeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}

export function WindIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

export function CandyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z" />
      <path d="M14 6.5v10" />
      <path d="M10 7.5v10" />
      <path d="m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1" />
      <path d="m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1" />
    </svg>
  );
}

export function CookieIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
}

export function DrumstickIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M15.45 15.4c-2.13.65-4.3.32-5.7-1.1-2.29-2.27-1.76-6.5 1.17-9.42 2.93-2.93 7.15-3.46 9.43-1.18 1.41 1.41 1.74 3.57 1.1 5.71-1.4-.51-3.26-.02-4.64 1.36-1.38 1.38-1.87 3.23-1.36 4.63z" />
      <path d="m11.25 15.6-2.16 2.16a2.5 2.5 0 1 1-4.56 1.73 2.49 2.49 0 0 1-1.41-4.24 2.5 2.5 0 0 1 3.14-.32l2.16-2.16" />
    </svg>
  );
}

export function WheatOffIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m2 22 10-10" />
      <path d="m16 8-1.17 1.17" />
      <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97" />
      <path d="M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.49 3.49 0 0 1 .73 3.83" />
      <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
      <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
      <path d="m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98" />
      <path d="M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.49 3.49 0 0 0-3.83-.73" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export function CalculatorIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

export function WheatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M2 22 16 8" />
      <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
      <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
      <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
      <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    </svg>
  );
}

export function UtensilsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export function SunsetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M12 10V2" />
      <path d="m4.93 10.93 1.41 1.41" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="m19.07 10.93-1.41 1.41" />
      <path d="M22 22H2" />
      <path d="m16 6-4 4-4-4" />
      <path d="M16 18a4 4 0 0 0-8 0" />
    </svg>
  );
}

export function ThermometerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

export function ThermometerSnowflakeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M2 12h10" />
      <path d="M9 4v16" />
      <path d="m3 9 3 3-3 3" />
      <path d="M12 6 9 9 6 6" />
      <path d="m6 18 3-3 3 3" />
      <path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

export function ThermometerSunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M12 9a4 4 0 0 0-2 7.5" />
      <path d="M12 3v2" />
      <path d="m6.6 18.4-1.4 1.4" />
      <path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
      <path d="M4 13H2" />
      <path d="M6.34 7.34 4.93 5.93" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

export function BabyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function CircleSlashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <line x1="9" x2="15" y1="15" y2="9" />
    </svg>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function SmileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

export function MehIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <line x1="8" x2="16" y1="14" y2="14" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

export function FrownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

export function ArmchairIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
      <path d="M3 16a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
      <path d="M3 14v-2a2 2 0 0 1 4 0v2" />
      <path d="M17 14v-2a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function FootprintsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M4 16v-2.38c0-.36.05-.71.1-1.07.45-2.51 1.37-4.81 2.4-7.04 .8-1.7 2.2-2.5 3.5-2.5 1.3 0 2.7.8 3.5 2.5 1.03 2.23 1.95 4.53 2.4 7.04 .05.36.1.71.1 1.07V16" />
      <path d="M2 21v-2.5a2.5 2.5 0 0 1 5 0V21H2Z" />
      <path d="M17 21v-2.5a2.5 2.5 0 0 1 5 0V21h-5Z" />
    </svg>
  );
}

export function DumbbellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M5.343 2.515a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829L6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829z" />
    </svg>
  );
}

export function MountainIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

export function HardHatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
      <path d="M4 15v-3a6 6 0 0 1 6-6" />
      <path d="M14 6a6 6 0 0 1 6 6v3" />
    </svg>
  );
}

export function GlassWaterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z" />
      <path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" />
    </svg>
  );
}

export function CupSodaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" />
      <path d="M5 8h14" />
      <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
      <path d="m12 8 1-6h2" />
    </svg>
  );
}

export function MoonStarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

export function SunriseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M12 2v8" />
      <path d="m4.93 10.93 1.41 1.41" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="m19.07 10.93-1.41 1.41" />
      <path d="M22 22H2" />
      <path d="m8 6 4-4 4 4" />
      <path d="M16 18a4 4 0 0 0-8 0" />
    </svg>
  );
}

export function CloudLightningIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m9 18 3-3-3-3 6 0-3 3 3 3z" />
    </svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

export function BatteryMediumIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
      <line x1="22" x2="22" y1="11" y2="13" />
      <line x1="6" x2="6" y1="11" y2="13" />
      <line x1="10" x2="10" y1="11" y2="13" />
    </svg>
  );
}

export function CakeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3" />
      <path d="M12 8v3" />
      <path d="M17 8v3" />
      <path d="M7 4h.01" />
      <path d="M12 4h.01" />
      <path d="M17 4h.01" />
    </svg>
  );
}

export function PizzaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M15 11h.01" />
      <path d="M11 15h.01" />
      <path d="M16 16h.01" />
      <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
      <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M19 9c-1-1.5-2.5-2-4-2-1 0-2 .3-3 1-1-.7-2-1-3-1-1.5 0-3 .5-4 2-1.7 2.7-1 7 2 11 1 1 2 1.5 3 1.5s2-.5 3-1c1 .5 2 1 3 1s2-.5 3-1.5c3-4 3.7-8.3 2-11Z" />
      <path d="M12 7c0-1 .5-2 1-2.5.5-.5 1-1 2-1" />
    </svg>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M17.5 19a4.5 4.5 0 1 0-1.41-8.775 5.5 5.5 0 0 0-10.91 1.6A4 4 0 0 0 6 19h11.5z" />
    </svg>
  );
}

export function CircleCheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function UtensilsCrossedIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
      <path d="m2.1 21.8 6.4-6.3" />
      <path d="m19 5-7 7" />
    </svg>
  );
}

export function SaladIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M7 21h10" />
      <path d="M2 13h20" />
      <path d="M3 13a9 9 0 0 1 18 0" />
      <path d="M11 7c-2 0-3 1-3 3" />
      <path d="M13 7c2 0 3 1 3 3" />
      <path d="M12 4v3" />
    </svg>
  );
}

export function ClipboardListIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

export function RepeatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function CarrotIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.36C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46" />
      <path d="m22 9-3 0a4 4 0 0 0-3 1l-3 3" />
      <path d="m14 2 0 3a4 4 0 0 0 1 3l3 3" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="currentColor">
      {props.title && <title>{props.title}</title>}
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

export function PillIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function RouteIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}

export function CoinsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function ShieldAlertIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export function TrendingDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export function ArrowRightLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

export function RotateCcwIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <rect width="20" height="14" x="2" y="3" rx="2" ry="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export function PersonStandingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="5" r="1" />
      <path d="m9 20 3-6 3 6" />
      <path d="m6 8 6 2 6-2" />
      <path d="M12 10v4" />
    </svg>
  );
}

export function SandwichIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3" />
      <path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83" />
      <path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z" />
      <path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 2.04 1.8 5.44 1.8 7.04 0 8.24-5.5 12-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function CirclePauseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <circle cx="12" cy="12" r="10" />
      <line x1="10" x2="10" y1="15" y2="9" />
      <line x1="14" x2="14" y1="15" y2="9" />
    </svg>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      {props.title && <title>{props.title}</title>}
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

export const ICON_REGISTRY: Record<string, (p: IconProps) => ReactNode> = {
  flame: FlameIcon,
  moon: MoonIcon,
  'moon-star': MoonStarIcon,
  bed: BedIcon,
  waves: WavesIcon,
  zap: ZapIcon,
  'battery-low': BatteryLowIcon,
  'battery-medium': BatteryMediumIcon,
  coffee: CoffeeIcon,
  wind: WindIcon,
  droplet: DropletIcon,
  'glass-water': GlassWaterIcon,
  'cup-soda': CupSodaIcon,
  candy: CandyIcon,
  cookie: CookieIcon,
  cake: CakeIcon,
  pizza: PizzaIcon,
  apple: AppleIcon,
  wheat: WheatIcon,
  utensils: UtensilsIcon,
  'utensils-crossed': UtensilsCrossedIcon,
  salad: SaladIcon,
  'clipboard-list': ClipboardListIcon,
  repeat: RepeatIcon,
  'help-circle': HelpCircleIcon,
  carrot: CarrotIcon,
  play: PlayIcon,
  pill: PillIcon,
  user: UserIcon,
  sun: SunIcon,
  sunset: SunsetIcon,
  sunrise: SunriseIcon,
  cloud: CloudIcon,
  'cloud-lightning': CloudLightningIcon,
  thermometer: ThermometerIcon,
  'thermometer-snowflake': ThermometerSnowflakeIcon,
  'thermometer-sun': ThermometerSunIcon,
  heart: HeartIcon,
  users: UsersIcon,
  camera: CameraIcon,
  baby: BabyIcon,
  calendar: CalendarIcon,
  flag: FlagIcon,
  'alert-triangle': AlertTriangleIcon,
  'circle-slash': CircleSlashIcon,
  'circle-check': CircleCheckIcon,
  activity: ActivityIcon,
  smile: SmileIcon,
  meh: MehIcon,
  frown: FrownIcon,
  armchair: ArmchairIcon,
  briefcase: BriefcaseIcon,
  footprints: FootprintsIcon,
  dumbbell: DumbbellIcon,
  mountain: MountainIcon,
  store: StoreIcon,
  'hard-hat': HardHatIcon,
  gauge: GaugeIcon,
  clock: ClockIcon,
  route: RouteIcon,
  coins: CoinsIcon,
  compass: CompassIcon,
  'shield-alert': ShieldAlertIcon,
  'trending-down': TrendingDownIcon,
  'trending-up': TrendingUpIcon,
  'arrow-right-left': ArrowRightLeftIcon,
  sparkles: SparklesIcon,
  'rotate-ccw': RotateCcwIcon,
  monitor: MonitorIcon,
  'person-standing': PersonStandingIcon,
  sandwich: SandwichIcon,
  leaf: LeafIcon,
  target: TargetIcon,
  'circle-pause': CirclePauseIcon,
  shuffle: ShuffleIcon,
  drumstick: DrumstickIcon,
  'wheat-off': WheatOffIcon,
  calculator: CalculatorIcon,
};

export function resolveIcon(name?: string): ReactNode {
  if (!name) return <HelpCircleIcon width={22} height={22} />;
  const Icon = ICON_REGISTRY[name];
  return Icon ? <Icon width={22} height={22} /> : <HelpCircleIcon width={22} height={22} />;
}
