"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "BROCHURE", href: "#brochure" },
  { label: "PRIZE", href: "#prize" },
  { label: "SPONSORS", href: "#sponsors" },
];

/* ── Icon components ───────────────────────── */

function BrochureIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="bg-brochure" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="url(#bg-brochure)" />
      <circle cx="14" cy="14" r="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Globe lines */}
      <ellipse cx="14" cy="14" rx="5" ry="13" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      <line x1="1.5" y1="14" x2="26.5" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      <line x1="3" y1="8" x2="25" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="3" y1="20" x2="25" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    </svg>
  );
}

function PrizeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="bg-prize" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="url(#bg-prize)" />
      {/* Skull */}
      <ellipse cx="14" cy="13" rx="6" ry="6.5" fill="white" />
      <ellipse cx="11" cy="11.5" rx="2" ry="2.3" fill="#92400e" />
      <ellipse cx="17" cy="11.5" rx="2" ry="2.3" fill="#92400e" />
      <rect x="11.2" y="17.5" width="2.2" height="3" rx="0.8" fill="white" />
      <rect x="14.6" y="17.5" width="2.2" height="3" rx="0.8" fill="white" />
    </svg>
  );
}

function SponsorsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="bg-sponsors" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#065f46" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="url(#bg-sponsors)" />
      {/* Star */}
      <polygon
        points="14,6 16.5,11.5 22.5,12 18,16 19.5,22 14,18.5 8.5,22 10,16 5.5,12 11.5,11.5"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  BROCHURE: <BrochureIcon />,
  PRIZE: <PrizeIcon />,
  SPONSORS: <SponsorsIcon />,
};

/* ── Navbar ────────────────────────────────── */

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-5 py-3">
      {/* GDAI Shield Logo */}
      <div
        style={{
          width: "52px",
          height: "64px",
          background: "linear-gradient(175deg, #ef4444 0%, #991b1b 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: "13px",
            letterSpacing: "0.05em",
            marginTop: "-12px",
          }}
        >
          GDAI
        </span>
      </div>

      {/* Center Nav Links (desktop) */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            id={`nav-${item.label.toLowerCase()}`}
            className="flex items-center gap-2 transition-all hover:scale-105 group"
            style={{ textDecoration: "none" }}
          >
            <span className="transition-transform group-hover:scale-110">
              {ICONS[item.label]}
            </span>
            <span
              style={{
                fontFamily: "var(--font-bangers)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
                color: "white",
                textShadow: "0 0 12px rgba(255,255,255,0.25)",
                transition: "color 0.2s",
              }}
              className="group-hover:text-yellow-300"
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Hamburger button */}
      <button
        id="nav-menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        className="flex flex-col items-center justify-center gap-[5px] w-12 h-12 rounded-lg cursor-pointer transition-opacity hover:opacity-80"
        style={{
          background: "rgba(30, 28, 60, 0.85)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          flexShrink: 0,
        }}
      >
        <span className="block w-6 h-[2px] bg-white rounded-full" />
        <span className="block w-6 h-[2px] bg-white rounded-full" />
        <span className="block w-6 h-[2px] bg-white rounded-full" />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div
          id="nav-mobile-menu"
          className="absolute top-full right-4 mt-1 rounded-2xl p-5 flex flex-col gap-5 md:hidden"
          style={{
            background: "rgba(4, 3, 28, 0.96)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            zIndex: 100,
            minWidth: "180px",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 group transition-all"
              onClick={() => setOpen(false)}
            >
              {ICONS[item.label]}
              <span
                style={{
                  fontFamily: "var(--font-bangers)",
                  fontSize: "1.2rem",
                  letterSpacing: "0.12em",
                  color: "white",
                }}
                className="group-hover:text-yellow-300 transition-colors"
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
