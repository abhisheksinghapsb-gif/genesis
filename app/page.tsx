"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sounds } from "./components/sound";
import RegistrationModal from "./components/RegistrationModal";
import BrochureModal from "./components/BrochureModal";
import PrizeModal from "./components/PrizeModal";
import SponsorsModal from "./components/SponsorsModal";
import MenuDrawer from "./components/MenuDrawer";

// Deterministic twinkling stars with individual drift offsets
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: ((i * 7919 + 29) % 10000) / 100,
  y: ((i * 6547 + 53) % 10000) / 100,
  size: (i % 3) === 0 ? 3 : (i % 2) === 0 ? 2 : 1.5,
  opacity: 0.2 + (i % 6) * 0.13,
  animDuration: 2.2 + (i % 5) * 0.8,
  animDelay: (i * 0.25) % 4,
  driftDuration: 8 + (i % 7) * 2,
}));

// Squeak character quotes
const SQUEAK_QUOTES = [
  "Fine, you have my full attention.",
  "Ready for the 3v3 Brawl Ball Showdown?!",
  "Don't drop the 10 gems in the mine!",
  "Only true legends lift the Genesis Trophy!",
  "Register your trio before slots vanish!",
  "GDAI Tournament of the Year is HERE!",
];

export default function Home() {
  // Modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isPrizeOpen, setIsPrizeOpen] = useState(false);
  const [isSponsorsOpen, setIsSponsorsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sound mute state
  const [isMuted, setIsMuted] = useState(false);

  // Interactive Easter eggs & character reactions
  const [squeakIndex, setSqueakIndex] = useState(0);
  const [squeakBounce, setSqueakBounce] = useState(false);
  const [coltQuote, setColtQuote] = useState<string | null>(null);
  const [leonQuote, setLeonQuote] = useState<string | null>(null);
  const [telescopeGlint, setTelescopeGlint] = useState(false);

  // 3D Interactive Tilt & Container Refs (Zero React Re-render on Mouse Move!)
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const normX = ((e.clientX / window.innerWidth) - 0.5) * 2;
        const normY = ((e.clientY / window.innerHeight) - 0.5) * 2;
        // Update CSS variables directly for 60/120fps hardware-composited parallax without React re-renders!
        containerRef.current.style.setProperty("--mx", normX.toFixed(3));
        containerRef.current.style.setProperty("--my", normY.toFixed(3));
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Butter-smooth 3D Logo Tilt via direct DOM style (0 React re-renders!)
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x - rect.width / 2) / (rect.width / 2);
    const normY = (y - rect.height / 2) / (rect.height / 2);

    requestAnimationFrame(() => {
      if (!logoRef.current) return;
      const rotX = -normY * 18;
      const rotY = normX * 18;
      logoRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.08, 1.08, 1.08)`;
    });
  };

  const handleLogoMouseEnter = () => {
    setIsLogoHovered(true);
    sounds.playHover();
  };

  const handleLogoMouseLeave = () => {
    setIsLogoHovered(false);
    if (logoRef.current) {
      logoRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  const handleLogoClick = () => {
    sounds.playRegister();
    setIsLogoClicked(true);
    setTimeout(() => setIsLogoClicked(false), 500);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  const handleSqueakClick = () => {
    sounds.playPop();
    setSqueakBounce(true);
    setSqueakIndex((prev) => (prev + 1) % SQUEAK_QUOTES.length);
    setTimeout(() => setSqueakBounce(false), 500);
  };

  const handleColtClick = () => {
    sounds.playLaser();
    const quotes = ["Watch out, here I come!", "Too pretty for pain!", "Brawn and beauty!"];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setColtQuote(randomQuote);
    setTimeout(() => setColtQuote(null), 3000);
  };

  const handleLeonClick = () => {
    sounds.playShuriken();
    const quotes = ["Sneaky time!", "Don't look at me!", "Leon in the lead!"];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setLeonQuote(randomQuote);
    setTimeout(() => setLeonQuote(null), 3000);
  };

  const handleTelescopeClick = () => {
    sounds.playHover();
    setTelescopeGlint(true);
    setTimeout(() => setTelescopeGlint(false), 2000);
  };

  return (
    <main 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#030015] flex items-center justify-center select-none"
      style={{
        ["--mx" as string]: 0,
        ["--my" as string]: 0,
      }}
    >
      {/* ── Scaled Widescreen Canvas Container ──────────────── */}
      <div 
        className="relative w-full h-full max-w-[1700px] max-h-[1100px] overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 32%, #180946 0%, #0d0426 42%, #030014 100%)",
        }}
      >
        {/* ── Ambient Cosmic Nebula Glow ─────────────────────── */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-45 gpu-accel"
          style={{
            transform: "translate3d(calc(var(--mx) * 12px), calc(var(--my) * 12px), 0)",
            backgroundImage: `
              radial-gradient(circle at 18% 28%, rgba(56, 189, 248, 0.18) 0%, transparent 45%),
              radial-gradient(circle at 82% 20%, rgba(168, 85, 247, 0.22) 0%, transparent 50%),
              radial-gradient(circle at 50% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 55%)
            `,
          }}
        />

        {/* ── Naturally Drifting & Twinkling Stars Layer ─────── */}
        <div 
          className="absolute inset-0 pointer-events-none gpu-accel"
          style={{ transform: "translate3d(calc(var(--mx) * 6px), calc(var(--my) * 6px), 0)" }}
        >
          {STARS.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white gpu-accel"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `
                  twinkle ${star.animDuration}s ${star.animDelay}s infinite ease-in-out,
                  star-slow-drift ${star.driftDuration}s infinite ease-in-out
                `,
                boxShadow: star.size > 2 ? "0 0 6px 1px rgba(255,255,255,0.85)" : undefined,
              }}
            />
          ))}
        </div>

        {/* ── NATURALLY FALLING METEORS & COMETS (GPU ACCELERATED) ── */}
        {/* Meteor 1: Hero Large Meteor blazing across upper-left */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "6%",
            left: "14%",
            width: "320px",
            height: "160px",
            animation: "meteor-fluent-1 2.8s 0s infinite linear",
          }}
        >
          <Image
            src="/assets/neon-comet-shooting-star-1.webp"
            alt="Falling Meteor"
            width={320}
            height={160}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Meteor 2: Upper Mid-Right shooting comet */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "8%",
            right: "24%",
            width: "200px",
            height: "100px",
            animation: "meteor-fluent-2 3.2s 1.2s infinite linear",
          }}
        >
          <Image
            src="/assets/neon-comet-shooting-star-3.webp"
            alt="Shooting Star"
            width={200}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Meteor 3: Mid-Left diagonal falling star */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "20%",
            left: "22%",
            width: "180px",
            height: "90px",
            animation: "meteor-fluent-3 2.9s 2.4s infinite linear",
          }}
        >
          <Image
            src="/assets/neon-comet-shooting-star-4.webp"
            alt="Shooting Star"
            width={180}
            height={90}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Meteor 4: Deep Right falling comet */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "28%",
            right: "10%",
            width: "170px",
            height: "85px",
            animation: "meteor-fluent-4 2.6s 3.6s infinite linear",
          }}
        >
          <Image
            src="/assets/neon-comet-shooting-star-2.webp"
            alt="Shooting Star"
            width={170}
            height={85}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Meteor 5: Center-Right high altitude meteor */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "14%",
            left: "48%",
            width: "160px",
            height: "80px",
            animation: "meteor-fluent-2 3.4s 4.8s infinite linear",
          }}
        >
          <Image
            src="/assets/neon-comet-shooting-star-5.webp"
            alt="Shooting Star"
            width={160}
            height={80}
            className="w-full h-full object-contain"
          />
        </div>

        {/* ── Celestial Planets & Asteroids ──────────────────── */}
        {/* Large Blue Cratered Planet (Top Left) */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "25%",
            left: "5%",
            width: "145px",
            height: "140px",
            transform: "translate3d(calc(var(--mx) * -14px), calc(var(--my) * -14px), 0)",
            animation: "planet-float 7s ease-in-out infinite",
          }}
        >
          <Image
            src="/assets/glossy-blue-planet-icon-1.webp"
            alt="Blue Planet"
            width={145}
            height={140}
            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]"
          />
        </div>

        {/* Small Blue Planet (Upper Mid-Left) */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "22%",
            left: "18%",
            width: "42px",
            height: "42px",
            animation: "planet-float 9s 1.5s ease-in-out infinite",
          }}
        >
          <Image
            src="/assets/glossy-blue-planet-icon-3.webp"
            alt="Small Blue Planet"
            width={42}
            height={42}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Saturn-like Purple Ringed Planet (Top Right) */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "14%",
            right: "4%",
            width: "330px",
            height: "170px",
            transform: "translate3d(calc(var(--mx) * -18px), calc(var(--my) * -18px), 0)",
            animation: "planet-float 8.5s 1s ease-in-out infinite",
          }}
        >
          <Image
            src="/assets/neon-purple-ringed-planet-1.webp"
            alt="Purple Ringed Planet"
            width={330}
            height={170}
            className="w-full h-full object-contain drop-shadow-[0_0_28px_rgba(168,85,247,0.4)]"
          />
        </div>

        {/* Medium Blue Planet (Mid Right) */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "45%",
            right: "13%",
            width: "85px",
            height: "82px",
            animation: "planet-float 6.5s 2s ease-in-out infinite",
          }}
        >
          <Image
            src="/assets/glossy-blue-planet-icon-2.webp"
            alt="Medium Blue Planet"
            width={85}
            height={82}
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          />
        </div>

        {/* Floating Violet Asteroid Rocks */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel"
          style={{
            top: "45%",
            right: "1.5%",
            width: "60px",
            height: "55px",
            animation: "planet-float 10s 3s ease-in-out infinite",
          }}
        >
          <Image
            src="/assets/glossy-violet-asteroid-rock-1-1.webp"
            alt="Asteroid Rock"
            width={60}
            height={55}
            className="w-full h-full object-contain opacity-85"
          />
        </div>

        {/* ── TOP NAVIGATION BAR ─────────────────────────────── */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-6 pt-2 pointer-events-none">
          {/* Top-Left: GDAI Club Banner */}
          <div 
            className="pointer-events-auto cursor-pointer group transition-transform duration-300"
            style={{ animation: "banner-sway 4s ease-in-out infinite" }}
            onClick={() => {
              sounds.playHover();
              setIsMenuOpen(true);
            }}
          >
            <div className="relative">
              <Image
                src="/assets/group-1000012449.webp"
                alt="GDAI Club Emblem"
                width={70}
                height={123}
                className="drop-shadow-[0_4px_10px_rgba(220,38,38,0.45)] group-hover:scale-105 transition-transform"
                priority
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity border border-amber-500/40">
                GDAI CLUB
              </span>
            </div>
          </div>

          {/* Top-Center: Interactive Navigation Buttons */}
          <nav className="pointer-events-auto flex items-center justify-center gap-6 mt-3">
            {/* BROCHURE Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsBrochureOpen(true);
              }}
              onMouseEnter={() => sounds.playHover()}
              className="relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none"
              aria-label="View Event Brochure"
            >
              <Image
                src="/assets/nav-brochure.webp"
                alt="BROCHURE"
                width={195}
                height={42}
                className="h-9 md:h-11 w-auto object-contain drop-shadow-[0_4px_8px_rgba(6,182,212,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(6,182,212,0.85)]"
                priority
              />
            </button>

            {/* PRIZE Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsPrizeOpen(true);
              }}
              onMouseEnter={() => sounds.playHover()}
              className="relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none"
              aria-label="View Tournament Prizes"
            >
              <Image
                src="/assets/nav-prize.webp"
                alt="PRIZE"
                width={175}
                height={42}
                className="h-9 md:h-11 w-auto object-contain drop-shadow-[0_4px_8px_rgba(250,204,21,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(250,204,21,0.85)]"
                priority
              />
            </button>

            {/* SPONSORS Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsSponsorsOpen(true);
              }}
              onMouseEnter={() => sounds.playHover()}
              className="relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none"
              aria-label="View Sponsors"
            >
              <Image
                src="/assets/nav-sponsors.webp"
                alt="SPONSORS"
                width={200}
                height={42}
                className="h-9 md:h-11 w-auto object-contain drop-shadow-[0_4px_8px_rgba(52,211,153,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(52,211,153,0.85)]"
                priority
              />
            </button>
          </nav>

          {/* Top-Right: Settings / Menu Button & Sound Mute Toggle */}
          <div className="pointer-events-auto flex items-center gap-3 mt-3">
            {/* Quick Audio Toggle */}
            <button
              onClick={toggleMute}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all hover:scale-110 active:scale-90 ${
                !isMuted 
                  ? "bg-purple-900/60 border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]" 
                  : "bg-red-950/70 border-red-500/60 text-red-300"
              }`}
              title={!isMuted ? "Mute Arcade SFX" : "Unmute Arcade SFX"}
            >
              {!isMuted ? "🔊" : "🔇"}
            </button>

            {/* Menu Hamburger Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsMenuOpen(true);
              }}
              onMouseEnter={() => sounds.playHover()}
              className="relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Image
                src="/assets/btn-settings.webp"
                alt="Settings Menu"
                width={65}
                height={35}
                className="h-9 md:h-10 w-auto object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                priority
              />
            </button>
          </div>
        </header>

        {/* ── CENTER HERO: BRAWL STARS / GENESIS LOGO (SMOOTH 3D TILT) ── */}
        <div 
          className="absolute top-[10%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none gpu-accel"
          style={{
            animation: !isLogoHovered ? "float-hero 4s ease-in-out infinite" : undefined,
          }}
        >
          <div 
            ref={logoRef}
            onMouseMove={handleLogoMouseMove}
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
            onClick={handleLogoClick}
            className="relative pointer-events-auto cursor-pointer group select-none gpu-accel"
            style={{
              perspective: "800px",
              transformStyle: "preserve-3d",
              transition: isLogoHovered 
                ? "filter 0.3s ease" 
                : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease",
              filter: isLogoHovered
                ? "drop-shadow(0 0 28px rgba(251,191,36,0.85)) brightness(1.1)"
                : "drop-shadow(0 8px 18px rgba(0,0,0,0.75))",
            }}
            title="Genesis Emblem • Click for Victory Powerup!"
          >
            {/* The Main Genesis Title & Winged Brawl Star Skull Asset */}
            <Image
              src="/assets/group-1000012441.webp"
              alt="GENESIS Tournament Brawl Stars Logo"
              width={460}
              height={290}
              className={`w-[340px] md:w-[440px] lg:w-[490px] h-auto object-contain transition-transform ${
                isLogoClicked ? "scale-110" : ""
              }`}
              priority
            />

            {/* Dynamic Light Sweep Glint on Hover */}
            {isLogoHovered && (
              <div 
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  animation: "shimmer-sweep 1.8s infinite ease-in-out",
                }}
              />
            )}

            {/* Wing Energy Particles */}
            <div 
              className={`absolute top-[28%] left-[49%] w-3.5 h-3.5 bg-white rounded-full pointer-events-none transition-all ${
                isLogoHovered ? "scale-150" : ""
              }`}
              style={{
                boxShadow: isLogoHovered 
                  ? "0 0 14px 5px #fde047, 0 0 28px 10px #f59e0b"
                  : "0 0 8px 3px #fbbf24, 0 0 16px 6px #f59e0b",
                animation: "glint 2.5s infinite ease-in-out",
              }}
            />

            {/* Left Wing Sparkle */}
            {isLogoHovered && (
              <div 
                className="absolute top-[65%] left-[18%] w-2.5 h-2.5 bg-yellow-200 rounded-full pointer-events-none"
                style={{
                  boxShadow: "0 0 10px 3px #facc15",
                  animation: "glint 1.8s 0.2s infinite ease-in-out",
                }}
              />
            )}

            {/* Right Wing Sparkle */}
            {isLogoHovered && (
              <div 
                className="absolute top-[65%] right-[18%] w-2.5 h-2.5 bg-yellow-200 rounded-full pointer-events-none"
                style={{
                  boxShadow: "0 0 10px 3px #facc15",
                  animation: "glint 1.8s 0.6s infinite ease-in-out",
                }}
              />
            )}
          </div>
        </div>

        {/* ── CENTER STAGE: GLOWING MOON DOME ────────────────── */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none gpu-accel"
          style={{ bottom: "16%" }}
        >
          {/* Luminous Atmospheric Halo */}
          <div 
            className="absolute rounded-full"
            style={{
              bottom: "10px",
              width: "680px",
              height: "460px",
              background: "radial-gradient(circle at 50% 60%, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.22) 50%, transparent 75%)",
              filter: "blur(40px)",
            }}
          />

          {/* Spherical Moon Dome Surface with Crater Markings */}
          <div 
            className="relative overflow-hidden gpu-accel"
            style={{
              width: "clamp(460px, 48vw, 680px)",
              height: "clamp(230px, 24vw, 340px)",
              borderRadius: "50% 50% 0 0",
              background: `
                radial-gradient(circle at 45% 25%, #dff4fd 0%, #7dd3fc 22%, #0284c7 52%, #034f8a 82%, #021f45 100%)
              `,
              boxShadow: `
                inset -25px 20px 60px rgba(2, 31, 69, 0.8),
                inset 15px -10px 40px rgba(224, 242, 254, 0.6),
                0 0 60px rgba(56, 189, 248, 0.7),
                0 0 120px rgba(14, 165, 233, 0.35)
              `,
              animation: "glow-pulse 4s ease-in-out infinite",
            }}
          >
            {/* Crater 1 */}
            <div 
              className="absolute rounded-full"
              style={{
                top: "34%",
                left: "22%",
                width: "60px",
                height: "55px",
                background: "radial-gradient(circle at 35% 35%, #0274b3 0%, #034f8a 70%, #023864 100%)",
                boxShadow: "inset 2px 3px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.2)",
                opacity: 0.85,
              }}
            />
            {/* Crater 2 */}
            <div 
              className="absolute rounded-full"
              style={{
                top: "48%",
                left: "64%",
                width: "90px",
                height: "82px",
                background: "radial-gradient(circle at 35% 35%, #0274b3 0%, #034f8a 70%, #023864 100%)",
                boxShadow: "inset 3px 4px 8px rgba(0,0,0,0.45), 0 2px 4px rgba(255,255,255,0.2)",
                opacity: 0.8,
              }}
            />
            {/* Crater 3 */}
            <div 
              className="absolute rounded-full"
              style={{
                top: "18%",
                left: "58%",
                width: "42px",
                height: "38px",
                background: "radial-gradient(circle at 35% 35%, #0274b3 0%, #034f8a 70%, #023864 100%)",
                boxShadow: "inset 1px 2px 4px rgba(0,0,0,0.4)",
                opacity: 0.75,
              }}
            />
            {/* Moon Top Crescent Highlight */}
            <div 
              className="absolute top-3 left-1/4 right-1/4 h-12 rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 80%)",
                filter: "blur(6px)",
              }}
            />
          </div>
        </div>

        {/* ── OBSERVATORY BALCONY DECK & ARENA RAILING ────────── */}
        <div 
          className="absolute left-0 right-0 z-20 pointer-events-none flex flex-col items-center"
          style={{ bottom: "0px", height: "23%" }}
        >
          {/* Curved Railing Top Edge with Electric Neon Glow Trim */}
          <div 
            className="w-full relative gpu-accel"
            style={{
              height: "44px",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
              background: "linear-gradient(180deg, #6322b6 0%, #3e127e 60%, #200845 100%)",
              boxShadow: `
                0 -4px 18px rgba(168, 85, 247, 0.6),
                0 -8px 40px rgba(56, 189, 248, 0.45),
                inset 0 2px 0 rgba(230, 200, 255, 0.6)
              `,
              borderTop: "3px solid #38bdf8",
            }}
          >
            {/* Parapet segments highlight */}
            <div className="absolute inset-0 flex justify-around opacity-25">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-[1.5px] h-full bg-cyan-200" />
              ))}
            </div>
          </div>

          {/* Arena Floor / Deck Surface in Perspective */}
          <div 
            className="w-full flex-1 relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #1d0741 0%, #100329 55%, #050112 100%)",
              boxShadow: "inset 0 10px 30px rgba(0,0,0,0.8)",
            }}
          >
            {/* Floor Light Reflections */}
            <div 
              className="absolute top-0 left-1/4 right-1/4 h-12"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.28) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
            />
          </div>
        </div>

        {/* ── CHARACTERS & PROPS ROW (STAGE) ─────────────────── */}

        {/* 1. Left Telescope Turret */}
        <div 
          onClick={handleTelescopeClick}
          className="absolute z-25 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group gpu-accel"
          style={{
            bottom: "16%",
            left: "0.5%",
            width: "clamp(220px, 20vw, 300px)",
            height: "auto",
          }}
          title="Click to peek through the Genesis Observatory Telescope!"
        >
          <div className="relative">
            <Image
              src="/assets/glossy-blue-star-emblem-cannon-turret-1.webp"
              alt="Observatory Telescope Cannon"
              width={300}
              height={365}
              className={`w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] ${
                telescopeGlint ? "brightness-125 filter" : ""
              }`}
              priority
            />
            {telescopeGlint && (
              <div className="absolute -top-12 left-16 px-3 py-1.5 rounded-lg bg-sky-950/90 border border-cyan-400 text-cyan-200 text-xs font-bold whitespace-nowrap shadow-lg animate-bounce">
                🔭 Scanning Sector 7 Brawl Arena... Target Acquired!
              </div>
            )}
          </div>
        </div>

        {/* 2. Left Character: COLT (Dual Gunslinger) */}
        <div 
          onClick={handleColtClick}
          className="absolute z-26 cursor-pointer transition-transform duration-300 hover:scale-105 group gpu-accel"
          style={{
            bottom: "21%",
            left: "14%",
            width: "clamp(240px, 24vw, 370px)",
            height: "auto",
            animation: "float-gentle 4.5s ease-in-out infinite",
          }}
          title="Click Colt to fire lasers & talk!"
        >
          <div className="relative">
            <Image
              src="/assets/dual-wielding-neon-gunslinger-1.webp"
              alt="Colt Gunslinger"
              width={370}
              height={290}
              className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.75)] filter group-hover:brightness-110 transition-all"
              priority
            />
            {/* Colt Dialogue Bubble */}
            {coltQuote && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white text-slate-900 font-extrabold text-sm whitespace-nowrap shadow-2xl border-2 border-slate-900 animate-fadeIn">
                {coltQuote}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
              </div>
            )}
          </div>
        </div>

        {/* 3. Center: Golden 3D "REGISTER" Button */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gpu-accel"
          style={{ bottom: "27%" }}
        >
          <button
            onClick={() => {
              sounds.playRegister();
              setIsRegisterOpen(true);
            }}
            onMouseEnter={() => sounds.playHover()}
            className="cursor-pointer relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none"
            style={{
              animation: "register-pulse 3s ease-in-out infinite",
            }}
            aria-label="Register for Genesis Tournament"
          >
            <Image
              src="/assets/group-1074.webp"
              alt="REGISTER"
              width={260}
              height={125}
              className="w-[210px] md:w-[250px] lg:w-[275px] h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]"
              priority
            />
            {/* Particle sparkles on hover */}
            <div className="absolute -inset-3 bg-amber-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        </div>

        {/* 4. Right Character: LEON (Chameleon Ninja Brawler) */}
        <div 
          onClick={handleLeonClick}
          className="absolute z-26 cursor-pointer transition-transform duration-300 hover:scale-105 group gpu-accel"
          style={{
            bottom: "20%",
            right: "12%",
            width: "clamp(230px, 23vw, 360px)",
            height: "auto",
            animation: "float-gentle 4s 1s ease-in-out infinite",
          }}
          title="Click Leon for sneaky brawler moves!"
        >
          <div className="relative">
            <Image
              src="/assets/chameleon-hood-ninja-brawler-1.webp"
              alt="Leon Brawler"
              width={360}
              height={330}
              className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.75)] filter group-hover:brightness-110 transition-all"
              priority
            />
            {/* Leon Dialogue Bubble */}
            {leonQuote && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white text-slate-900 font-extrabold text-sm whitespace-nowrap shadow-2xl border-2 border-slate-900 animate-fadeIn">
                {leonQuote}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
              </div>
            )}
          </div>
        </div>

        {/* 5. Bottom Right: Squeak Balloon Character & Speech Bubble */}
        <div 
          onClick={handleSqueakClick}
          className={`absolute z-35 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group gpu-accel ${
            squeakBounce ? "animate-bounce" : ""
          }`}
          style={{
            bottom: "1.5%",
            right: "1.5%",
            width: "clamp(260px, 25vw, 370px)",
            height: "auto",
            animation: !squeakBounce ? "balloon-bob 4s ease-in-out infinite" : undefined,
          }}
          title="Click Squeak for more brawler thoughts!"
        >
          {squeakIndex === 0 ? (
            /* Original Figma Asset with exact artwork & speech bubble */
            <div className="relative">
              <Image
                src="/assets/group-1000012450.webp"
                alt="Fine, you have my full attention."
                width={370}
                height={245}
                className="w-full h-auto object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)]"
                priority
              />
              <span className="absolute -bottom-1 right-8 text-[9px] text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-2 py-0.5 rounded">
                Click me! 💬
              </span>
            </div>
          ) : (
            /* Interactive Dynamic Dialogue State */
            <div className="relative flex items-end justify-end gap-2">
              <div className="relative max-w-[210px] p-3 rounded-2xl bg-white text-slate-950 font-black text-xs leading-snug shadow-2xl border-2 border-slate-900">
                {SQUEAK_QUOTES[squeakIndex]}
                {/* Pointer arrow to the right balloon */}
                <div 
                  className="absolute bottom-4 -right-2 w-0 h-0"
                  style={{
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "8px solid white",
                  }}
                />
              </div>

              {/* Just the Balloon Brawler Avatar */}
              <div className="w-20 md:w-24 h-auto flex-shrink-0">
                <Image
                  src="/assets/group-1000012450.webp"
                  alt="Squeak Balloon"
                  width={150}
                  height={150}
                  style={{ width: "auto", height: "auto" }}
                  className="w-full h-auto object-cover object-right"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── MODALS & DRAWERS ───────────────────────────────── */}
      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      <BrochureModal 
        isOpen={isBrochureOpen} 
        onClose={() => setIsBrochureOpen(false)} 
      />

      <PrizeModal 
        isOpen={isPrizeOpen} 
        onClose={() => setIsPrizeOpen(false)} 
      />

      <SponsorsModal 
        isOpen={isSponsorsOpen} 
        onClose={() => setIsSponsorsOpen(false)} 
      />

      <MenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenPrize={() => setIsPrizeOpen(true)}
        onOpenSponsors={() => setIsSponsorsOpen(true)}
      />
    </main>
  );
}
