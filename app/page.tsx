"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sounds } from "./components/sound";
import AboutSection from "./components/AboutSection";
import TimelineSection from "./components/TimelineSection";

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

export default function Home() {
  // Sound mute state (Controls arcade SFX without opening any overlay)
  const [isMuted, setIsMuted] = useState(false);

  // 3D Interactive Tilt & Container Refs (Zero React Re-render on Mouse Move!)
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "about" | "timeline">("hero");
  const lastSectionRef = useRef<"hero" | "about" | "timeline">("hero");

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

  // Smooth Scroll & Viewport Tracker
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const height = window.innerHeight;
      const aboutEl = document.getElementById("about");
      const timelineEl = document.getElementById("timeline");

      const aboutTop = aboutEl?.offsetTop || height;
      const timelineTop = timelineEl?.offsetTop || height * 2;

      let current: "hero" | "about" | "timeline" = "hero";
      if (scrollY >= timelineTop - height * 0.35) {
        current = "timeline";
      } else if (scrollY >= aboutTop - height * 0.35) {
        current = "about";
      } else {
        current = "hero";
      }

      if (current !== lastSectionRef.current) {
        lastSectionRef.current = current;
        setActiveSection(current);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (lastSectionRef.current === "hero") {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        } else if (lastSectionRef.current === "about") {
          document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (lastSectionRef.current === "timeline") {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        } else if (lastSectionRef.current === "about") {
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
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

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };



  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth select-none bg-[#030015]"
      style={{
        ["--mx" as string]: 0,
        ["--my" as string]: 0,
      }}
    >
      {/* ── SECTION 1: HERO VIEWPORT (FULL SCREEN 100VH) ───── */}
      <section 
        id="hero"
        className="relative w-screen h-screen min-h-screen snap-start snap-always flex items-center justify-center overflow-hidden flex-shrink-0"
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

        {/* ── NATURALLY FALLING METEORS & COMETS (GPU ACCELERATED & IMMEDIATE MOTION) ── */}
        {/* Meteor 1: Hero Large Meteor blazing across upper-left */}
        <div 
          className="absolute pointer-events-none z-10 gpu-accel opacity-0"
          style={{
            top: "6%",
            left: "14%",
            width: "320px",
            height: "160px",
            transform: "translate3d(-260px, -130px, 0)",
            animation: "meteor-fluent-1 2.8s -1.4s infinite linear both",
            willChange: "transform, opacity",
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
          className="absolute pointer-events-none z-10 gpu-accel opacity-0"
          style={{
            top: "8%",
            right: "24%",
            width: "200px",
            height: "100px",
            transform: "translate3d(-220px, -110px, 0)",
            animation: "meteor-fluent-2 3.2s -0.8s infinite linear both",
            willChange: "transform, opacity",
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
          className="absolute pointer-events-none z-10 gpu-accel opacity-0"
          style={{
            top: "20%",
            left: "22%",
            width: "180px",
            height: "90px",
            transform: "translate3d(-180px, -90px, 0)",
            animation: "meteor-fluent-3 2.9s -2.1s infinite linear both",
            willChange: "transform, opacity",
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
          className="absolute pointer-events-none z-10 gpu-accel opacity-0"
          style={{
            top: "28%",
            right: "10%",
            width: "170px",
            height: "85px",
            transform: "translate3d(-200px, -100px, 0)",
            animation: "meteor-fluent-4 2.6s -1.0s infinite linear both",
            willChange: "transform, opacity",
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
          className="absolute pointer-events-none z-10 gpu-accel opacity-0"
          style={{
            top: "14%",
            left: "48%",
            width: "160px",
            height: "80px",
            transform: "translate3d(-220px, -110px, 0)",
            animation: "meteor-fluent-2 3.4s -2.5s infinite linear both",
            willChange: "transform, opacity",
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
          <div className="w-full h-full gpu-accel" style={{ animation: "planet-spin 28s linear infinite" }}>
            <Image
              src="/assets/glossy-blue-planet-icon-1.webp"
              alt="Blue Planet"
              width={145}
              height={140}
              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]"
            />
          </div>
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
          <div className="w-full h-full gpu-accel" style={{ animation: "planet-spin 18s linear infinite" }}>
            <Image
              src="/assets/glossy-blue-planet-icon-3.webp"
              alt="Small Blue Planet"
              width={42}
              height={42}
              className="w-full h-full object-contain"
            />
          </div>
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
          <div className="w-full h-full gpu-accel" style={{ animation: "planet-ring-natural 9s ease-in-out infinite" }}>
            <Image
              src="/assets/neon-purple-ringed-planet-1.webp"
              alt="Purple Ringed Planet"
              width={330}
              height={170}
              className="w-full h-full object-contain drop-shadow-[0_0_28px_rgba(168,85,247,0.4)]"
            />
          </div>
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
          <div className="w-full h-full gpu-accel" style={{ animation: "planet-spin-reverse 24s linear infinite" }}>
            <Image
              src="/assets/glossy-blue-planet-icon-2.webp"
              alt="Medium Blue Planet"
              width={85}
              height={82}
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            />
          </div>
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
          <div className="w-full h-full gpu-accel" style={{ animation: "asteroid-tumble 18s linear infinite" }}>
            <Image
              src="/assets/glossy-violet-asteroid-rock-1-1.webp"
              alt="Asteroid Rock"
              width={60}
              height={55}
              className="w-full h-full object-contain opacity-85"
            />
          </div>
        </div>

        {/* ── TOP NAVIGATION BAR ─────────────────────────────── */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-6 pt-2 pointer-events-none">
          {/* Top-Left: GDAI Club Banner (External link to IndieConnect in new tab) */}
          <a
            href="https://www.indieconnect.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto group transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg block cursor-pointer"
            style={{
              animation: "banner-sway 4s ease-in-out infinite",
              marginLeft: "var(--gdai-left-offset, 20px)",
            }}
            aria-label="Visit IndieConnect (GDAI Club) - Opens in new tab"
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
          </a>

          {/* Top-Center: Navigation Buttons (BROCHURE — PRIZE — SPONSORS) */}
          <nav className="pointer-events-auto flex items-center justify-center gap-2.5 sm:gap-4 md:gap-6 mt-3">
            {/* 1. BROCHURE Button (Opens the Genesis Brochure PDF in a new tab) */}
            <a
              href="/brochure"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none cursor-pointer block"
              aria-label="Open Genesis Tournament Brochure (PDF) - Opens in new tab"
            >
              <Image
                src="/assets/nav-brochure.webp"
                alt="BROCHURE"
                width={195}
                height={42}
                className="h-8 sm:h-9 md:h-11 w-auto object-contain drop-shadow-[0_4px_8px_rgba(6,182,212,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(6,182,212,0.85)]"
                priority
              />
            </a>

            {/* 2. PRIZE Button (Visually restored per original Figma reference, nonfunctional) */}
            <div
              className="relative transition-transform duration-200 hover:scale-105 select-none cursor-default block"
              aria-label="Prize Pool"
            >
              <Image
                src="/assets/nav-prize.webp"
                alt="PRIZE"
                width={195}
                height={46}
                className="h-8 sm:h-9 md:h-11 w-auto object-contain drop-shadow-[0_4px_8px_rgba(234,179,8,0.35)]"
                priority
              />
            </div>

            {/* 3. SPONSORS Button (Visually restored per original Figma reference, nonfunctional) */}
            <div
              className="relative transition-transform duration-200 hover:scale-105 select-none cursor-default block"
              aria-label="Sponsors"
            >
              <Image
                src="/assets/nav-sponsors.webp"
                alt="SPONSORS"
                width={195}
                height={44}
                className="h-8 sm:h-9 md:h-11 w-auto object-contain drop-shadow-[0_4px_8px_rgba(34,197,94,0.35)]"
                priority
              />
            </div>
          </nav>

          {/* Top-Right: Settings / Menu Button & Sound Mute Toggle */}
          <div className="pointer-events-auto flex items-center gap-3 mt-3">
            {/* Quick Audio Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all hover:scale-110 active:scale-90 cursor-pointer ${
                !isMuted 
                  ? "bg-purple-900/60 border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]" 
                  : "bg-red-950/70 border-red-500/60 text-red-300"
              }`}
              title={!isMuted ? "Mute Arcade SFX" : "Unmute Arcade SFX"}
              aria-label={!isMuted ? "Mute Arcade SFX" : "Unmute Arcade SFX"}
            >
              {!isMuted ? "🔊" : "🔇"}
            </button>

            {/* Menu Hamburger Button (Preserved Visuals & Placement, No Drawer Overlay) */}
            <button
              type="button"
              className="relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none cursor-default"
              aria-label="Navigation Menu"
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

        {/* ── CENTER HERO: BRAWL STARS / GENESIS LOGO (SMOOTH 3D TILT & GLINT) ── */}
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
            className="relative pointer-events-auto select-none gpu-accel cursor-default"
            style={{
              perspective: "800px",
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.75))",
            }}
            title="Genesis Emblem"
          >
            {/* The Main Genesis Title & Winged Brawl Star Skull Asset */}
            <Image
              src="/assets/group-1000012441.webp"
              alt="GENESIS Tournament Brawl Stars Logo"
              width={460}
              height={290}
              className="w-[340px] md:w-[440px] lg:w-[490px] h-auto object-contain"
              priority
            />

            {/* Subtle Center Star Glint */}
            <div 
              className="absolute top-[28%] left-[49%] w-3 h-3 bg-white rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 8px 3px #fbbf24, 0 0 16px 6px #f59e0b",
                animation: "glint 2.5s infinite ease-in-out",
              }}
            />
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

        {/* 1. Left Telescope Turret (Clean Display, No Toast) */}
        <div 
          className="absolute z-25 transition-transform duration-300 hover:scale-105 group gpu-accel cursor-default"
          style={{
            bottom: "16%",
            left: "0.5%",
            width: "clamp(220px, 20vw, 300px)",
            height: "auto",
          }}
          title="Genesis Observatory Telescope"
        >
          <div className="relative">
            <Image
              src="/assets/glossy-blue-star-emblem-cannon-turret-1.webp"
              alt="Observatory Telescope Cannon"
              width={300}
              height={365}
              className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              priority
            />
          </div>
        </div>

        {/* 2. Left Character: COLT (Dual Gunslinger - Subtle Idle Float, No Speech Bubble) */}
        <div 
          className="absolute z-26 transition-transform duration-300 hover:scale-105 group gpu-accel cursor-default"
          style={{
            bottom: "21%",
            left: "14%",
            width: "clamp(240px, 24vw, 370px)",
            height: "auto",
            animation: "float-gentle 4.5s ease-in-out infinite",
          }}
          title="Colt Gunslinger"
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
          </div>
        </div>

        {/* 3. Center: Golden 3D "REGISTER" Button (Static normally, responsive on hover, no modal popup) */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gpu-accel"
          style={{ bottom: "27%" }}
        >
          <button
            type="button"
            className="cursor-pointer relative transition-all duration-200 hover:scale-108 active:scale-95 group focus:outline-none"
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

        {/* 4. Right Character: LEON (Chameleon Ninja Brawler - Subtle Idle Float, No Speech Bubble) */}
        <div 
          className="absolute z-26 transition-transform duration-300 hover:scale-105 group gpu-accel cursor-default"
          style={{
            bottom: "20%",
            right: "12%",
            width: "clamp(230px, 23vw, 360px)",
            height: "auto",
            animation: "float-gentle 4s 1s ease-in-out infinite",
          }}
          title="Leon Brawler"
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
          </div>
        </div>

        {/* 5. Bottom Right: Squeak Balloon Character (Idle Float, Original Mascot Artwork, No Speech Popups) */}
        <div 
          className="absolute z-35 transition-transform duration-300 hover:scale-105 group gpu-accel cursor-default"
          style={{
            bottom: "1.5%",
            right: "1.5%",
            width: "clamp(260px, 25vw, 370px)",
            height: "auto",
            animation: "balloon-bob 4s ease-in-out infinite",
          }}
          title="Squeak Balloon Mascot"
        >
          <div className="relative">
            <Image
              src="/assets/group-1000012450.webp"
              alt="Fine, you have my full attention."
              width={370}
              height={245}
              className="w-full h-auto object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)]"
              priority
            />
          </div>
        </div>

        {/* Floating Scroll Cue to About Genesis */}
        <div 
          onClick={() => {
            sounds.playHover();
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-35 flex flex-col items-center cursor-pointer group pointer-events-auto"
          title="Scroll down to About Genesis"
        >
          <div className="px-3.5 sm:px-5 py-1.5 rounded-full bg-blue-950/80 border-2 border-red-500 text-red-100 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-1.5 transition-all group-hover:scale-105 group-hover:bg-blue-900 group-hover:border-red-400">
            <span className="animate-bounce">▼</span>
            <span>ABOUT GENESIS</span>
            <span className="animate-bounce">▼</span>
          </div>
        </div>

      </div>
    </section>

    {/* ── SECTION 2: ABOUT GENESIS (STATIC SECTION) ──────── */}
    <AboutSection />

    {/* ── SECTION 3: TIMELINE (INTERACTIVE ROADMAP) ──────── */}
    <TimelineSection />

      {/* ── FULL-SCREEN VIEWPORT SIDE DOCK INDICATORS (3 SECTIONS) ──────── */}
      <aside aria-label="Page Sections" className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border-2 cursor-pointer ${
            activeSection === "hero"
              ? "bg-amber-400 border-white scale-125 shadow-[0_0_12px_#fbbf24]"
              : "bg-blue-950/80 border-blue-400/50 hover:bg-blue-700 hover:scale-110"
          }`}
          title="Genesis Main Stage"
          aria-label="Genesis Main Stage"
        />
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border-2 cursor-pointer ${
            activeSection === "about"
              ? "bg-red-500 border-white scale-125 shadow-[0_0_12px_#ef4444]"
              : "bg-blue-950/80 border-blue-400/50 hover:bg-blue-700 hover:scale-110"
          }`}
          title="About Genesis"
          aria-label="About Genesis"
        />
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border-2 cursor-pointer ${
            activeSection === "timeline"
              ? "bg-cyan-400 border-white scale-125 shadow-[0_0_12px_#22d3ee]"
              : "bg-blue-950/80 border-blue-400/50 hover:bg-blue-700 hover:scale-110"
          }`}
          title="Genesis Event Timeline"
          aria-label="Genesis Event Timeline"
        />
      </aside>
    </div>
  );
}
