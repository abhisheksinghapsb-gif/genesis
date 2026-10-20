"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MilestoneBadge from "./MilestoneBadge";
import { sounds } from "./sound";

export interface TimelineSectionProps {
  onSectionActive?: (active: boolean) => void;
}

export const TIMELINE_STAGES = [
  {
    id: "stage-1",
    step: "01" as const,
    title: "Registration",
    sub: "Unstop & IndieConnect",
    asset: "/timeline/stage-registration.svg",
    position: "above" as const,
  },
  {
    id: "stage-2",
    step: "02" as const,
    title: "Round 1",
    sub: "Online Tournament",
    asset: "/timeline/stage-round1.svg",
    position: "below" as const,
  },
  {
    id: "stage-3",
    step: "03" as const,
    title: "Round 2",
    sub: "Offline Showdown",
    asset: "/timeline/stage-round2.svg",
    position: "above" as const,
  },
  {
    id: "stage-4",
    step: "04" as const,
    title: "Result",
    sub: "Grand Champions",
    asset: "/timeline/stage-result.svg",
    position: "below" as const,
  },
];

export default function TimelineSection({ onSectionActive }: TimelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Interaction states (only updated on discrete changes to eliminate render churn)
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);
  const [pulsingStageIndex, setPulsingStageIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dedicated refs for hardware-accelerated pointer light & track geometry
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const hoverLightRef = useRef<HTMLDivElement>(null);
  const pointerRafRef = useRef<number>(0);

  // Drag tracking refs (zero React re-renders during active pointer movement)
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const activeStageIndexRef = useRef(0);
  activeStageIndexRef.current = activeStageIndex;

  // Viewport resize detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Section entry detection (Restrained entrance sequence)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          if (onSectionActive) onSectionActive(true);
        } else {
          if (onSectionActive) onSectionActive(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onSectionActive]);

  // Synchronize horizontal scroll progress and active stage with 0 React render lag
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollLeft = viewport.scrollLeft;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollLeft / maxScroll)) : 0;

        // Direct hardware update of illuminated golden progress line (0 React re-renders!)
        if (progressLineRef.current) {
          const pct = Math.max(3, Math.min(100, progress * 100));
          progressLineRef.current.style.width = `${pct}%`;
        }

        // Accurately find stage closest to viewport center in real viewport coordinates
        const viewportRect = viewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;
        let closestIdx = 0;
        let minDiff = Infinity;

        stageRefs.current.forEach((stageEl, idx) => {
          if (!stageEl) return;
          const stageRect = stageEl.getBoundingClientRect();
          const stageCenter = stageRect.left + stageRect.width / 2;
          const diff = Math.abs(stageCenter - viewportCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });

        // Only commit React state update if the active stage index actually changed
        setActiveStageIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
      });
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Click on a stage card or milestone to smoothly focus it
  const handleStageSelect = useCallback((index: number) => {
    if (hasDraggedRef.current) return; // Prevent accidental click right after dragging

    sounds.playClick();
    setActiveStageIndex(index);
    setPulsingStageIndex(index);

    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => {
      setPulsingStageIndex(null);
    }, 380);

    const viewport = viewportRef.current;
    const targetEl = stageRefs.current[index];
    if (!viewport || !targetEl) return;

    const viewportRect = viewport.getBoundingClientRect();
    const stageRect = targetEl.getBoundingClientRect();
    const delta = stageRect.left + stageRect.width / 2 - (viewportRect.left + viewportRect.width / 2);
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const targetScrollLeft = Math.max(0, Math.min(maxScroll, viewport.scrollLeft + delta));

    viewport.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  }, []);

  // Desktop Mouse Drag Handlers (Pointer Events)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only primary button
    const viewport = viewportRef.current;
    if (!viewport) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = viewport.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // If mouse is pressed down, handle horizontal drag
    if (isPointerDownRef.current) {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const dx = e.clientX - startXRef.current;

      // Movement threshold to distinguish intent between drag and click
      if (!hasDraggedRef.current && Math.abs(dx) > 6) {
        hasDraggedRef.current = true;
        setIsDragging(true);
        if (hoverLightRef.current) {
          hoverLightRef.current.style.opacity = "0";
        }
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // Fallback for environments lacking pointer capture
        }
      }

      if (hasDraggedRef.current) {
        // Direct, responsive 1:1 mouse tracking with no artificial lag
        viewport.scrollLeft = startScrollLeftRef.current - dx;
      }
      return;
    }

    // Pointer Hover Preview (Smooth traveling golden light along the track)
    if (!isMobile && trackContainerRef.current && hoverLightRef.current) {
      const clientX = e.clientX;
      cancelAnimationFrame(pointerRafRef.current);
      pointerRafRef.current = requestAnimationFrame(() => {
        const trackEl = trackContainerRef.current;
        const hoverEl = hoverLightRef.current;
        if (!trackEl || !hoverEl) return;

        const trackRect = trackEl.getBoundingClientRect();
        if (trackRect.width <= 0) return;

        // Calculate pointer X relative to the track's current screen position
        const pointerXInTrack = clientX - trackRect.left;
        const clampedX = Math.max(0, Math.min(trackRect.width, pointerXInTrack));
        const pct = (clampedX / trackRect.width) * 100;

        hoverEl.style.left = `${pct}%`;
        hoverEl.style.opacity = "1";
      });
    }
  };

  const handlePointerLeave = () => {
    if (hoverLightRef.current) {
      hoverLightRef.current.style.opacity = "0";
    }
    setHoveredStageIndex(null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (hasDraggedRef.current) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }

      // Single Authority: Native CSS scroll snap (scrollSnapType: "x mandatory")
      // re-engages and smoothly centers the nearest stage.
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = Math.min(TIMELINE_STAGES.length - 1, activeStageIndexRef.current + 1);
      handleStageSelect(nextIdx);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = Math.max(0, activeStageIndexRef.current - 1);
      handleStageSelect(prevIdx);
    }
  };

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative w-screen h-screen min-h-screen flex flex-col justify-between overflow-hidden select-none bg-[#030015] text-white flex-shrink-0"
      aria-label="Genesis Event Timeline Roadmap"
    >
      {/* ── 1. BACKGROUND LAYER: COSMIC BLUE & PURPLE ARTWORK ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/timeline/cosmic-background.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030015]/30 to-[#030015]/85 pointer-events-none" />
        {/* Subtle Edge Transitions: Visual continuity between About above and Prize Pool below */}
        <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#030015] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-[#030015] to-transparent pointer-events-none" />
      </div>

      {/* ── 2. STABLE TOP HEADER: PARALLELOGRAM ORANGE BANNER + TIMELINE TITLE ── */}
      <header className="relative z-30 pt-2 sm:pt-3 md:pt-4 flex justify-center items-center pointer-events-none flex-shrink-0">
        <div
          className={`relative pointer-events-auto flex items-center justify-center transition-all duration-500 ${
            hasEntered ? "scale-100 opacity-100" : "scale-95 opacity-90"
          }`}
        >
          {/* Orange Angle Parallelogram Banner */}
          <img
            src="/timeline/heading-banner.svg"
            alt="Tournament Timeline"
            draggable={false}
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)]"
          />
          {/* Crisp TIMELINE Heading Text */}
          <img
            src="/timeline/heading-text.svg"
            alt="TIMELINE"
            draggable={false}
            className="absolute h-5 sm:h-6 md:h-7 lg:h-8 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
          />
        </div>
      </header>

      {/* ── 3. NATIVE HORIZONTAL SCROLL VIEWPORT (DRAGGABLE & SWIPABLE) ── */}
      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`timeline-viewport relative flex-1 w-full overflow-x-auto z-20 flex items-center focus:outline-none ${
          isDragging ? "cursor-grabbing is-dragging select-none" : "cursor-grab"
        }`}
        style={{
          scrollSnapType: isDragging ? "none" : "x mandatory",
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "auto",
        }}
      >
        {/* Horizontal Track Canvas */}
        <div
          className="h-full flex items-center relative min-w-max"
          style={{
            paddingLeft: isMobile ? "8vw" : "clamp(36px, 4.5vw, 80px)",
            paddingRight: isMobile ? "8vw" : "clamp(100px, 10vw, 200px)",
          }}
        >
          {/* A. Left Decorative Mascot Brawler (Visible on Desktop) */}
          {!isMobile && (
            <div
              className="relative z-15 pointer-events-none select-none flex-shrink-0 mr-6 lg:mr-12"
              style={{
                height: "clamp(240px, 40vh, 440px)",
                animation: "float-gentle 5s ease-in-out infinite",
              }}
            >
              <img
                src="/timeline/character-brawler.svg"
                alt="Genesis Tournament Brawler Mascot"
                draggable={false}
                className="h-full w-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)] filter brightness-105"
              />
            </div>
          )}

          {/* B. Stages Container with Connected Golden Line */}
          <div
            className="relative flex items-center"
            style={{
              gap: isMobile ? "6vw" : "clamp(100px, 11vw, 200px)",
            }}
          >
            {/* Horizontal Golden Track Line (Centerline passes through milestone badges) */}
            <div
              ref={trackContainerRef}
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{
                top: isMobile ? "28px" : "calc(50% - 12px)",
                height: isMobile ? "16px" : "24px",
              }}
            >
              {/* Base Track Rail */}
              <div
                className="w-full h-full rounded-sm overflow-hidden relative shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{
                  background:
                    "linear-gradient(180deg, #FDD944 0%, #FDD944 60%, #F07527 60%, #F07527 100%)",
                }}
              >
                <div className="absolute inset-x-0 top-0.5 h-[2px] bg-white/40" />
              </div>

              {/* Dynamic Illuminated Progress Line (Synchronized with scroll offset via rAF) */}
              <div
                ref={progressLineRef}
                className="absolute top-0 left-0 h-full rounded-sm pointer-events-none"
                style={{
                  width: "3%",
                  background:
                    "linear-gradient(90deg, #F59E0B 0%, #FDD944 40%, #FFFDE0 90%, #FFFFFF 100%)",
                  boxShadow:
                    "0 0 6px 1px rgba(253, 217, 68, 0.6), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              />

              {/* Cursor Hover Light Layer (Single independent traveling light following pointer X) */}
              <div
                ref={hoverLightRef}
                className="absolute top-0 h-full pointer-events-none transition-opacity duration-150"
                style={{
                  width: "50px",
                  left: "0%",
                  transform: "translateX(-50%)",
                  opacity: 0,
                  background:
                    "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(253, 217, 68, 0.75) 45%, rgba(245, 158, 11, 0) 80%)",
                  filter: "drop-shadow(0 0 10px #fbbf24) drop-shadow(0 0 20px rgba(253, 217, 68, 0.8))",
                }}
              >
                {/* Single traveling golden starburst/orb center */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
                  style={{
                    background: "radial-gradient(circle, #FFFFFF 40%, #FFF9A5 80%, #FDD944 100%)",
                    boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.95), 0 0 16px 4px rgba(251, 191, 36, 0.85)",
                  }}
                />
              </div>
            </div>

            {/* C. Four Event Stage Items */}
            {TIMELINE_STAGES.map((stage, index) => {
              const isActive = activeStageIndex === index;
              const isReached = index <= activeStageIndex;
              const isCardHovered = hoveredStageIndex === index;
              const isPulsing = pulsingStageIndex === index;

              return (
                <div
                  key={stage.id}
                  ref={(el) => {
                    stageRefs.current[index] = el;
                  }}
                  className={`relative flex flex-col items-center flex-shrink-0 snap-center ${
                    isMobile ? "w-[78vw] max-w-[290px] pt-2" : ""
                  }`}
                  style={{
                    width: isMobile ? "78vw" : "clamp(190px, 15vw, 250px)",
                  }}
                >
                  {/* ── DESKTOP ALTERNATING LAYOUT ── */}
                  {!isMobile ? (
                    <>
                      {/* Milestone Number Badge on Track (Centered at exact 50%) */}
                      <div
                        className="absolute z-30"
                        style={{
                          top: "calc(50% - 26px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <MilestoneBadge
                          step={stage.step}
                          isActive={isActive}
                          isReached={isReached}
                          isHovered={isCardHovered}
                          onClick={() => handleStageSelect(index)}
                        />
                      </div>

                      {/* STAGE CARD: ABOVE TRACK */}
                      {stage.position === "above" && (
                        <div
                          className="flex flex-col items-center justify-end"
                          style={{
                            position: "absolute",
                            bottom: "calc(50% + 28px)",
                            width: "100%",
                          }}
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => handleStageSelect(index)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleStageSelect(index);
                              }
                            }}
                            onPointerEnter={() => {
                              setHoveredStageIndex(index);
                              sounds.playHover();
                            }}
                            onPointerLeave={() => {
                              setHoveredStageIndex(null);
                            }}
                            className={`relative cursor-pointer transition-all duration-200 transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl ${
                              isCardHovered
                                ? "scale-[1.03] z-25 -translate-y-1 drop-shadow-[0_0_18px_rgba(251,191,36,0.85)] brightness-105"
                                : isActive
                                ? "scale-[1.01] z-20 opacity-100 drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)] brightness-102"
                                : "scale-100 z-10 opacity-85 hover:opacity-100 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
                            }`}
                            style={{
                              width: "auto",
                              maxHeight: "min(285px, 34vh)",
                              aspectRatio: "275 / 416",
                              overflow: "visible",
                            }}
                            aria-label={`Select Stage ${stage.step}: ${stage.title} (${stage.sub})`}
                          >
                            <img
                              src={stage.asset}
                              alt={`Stage ${stage.step} - ${stage.title}`}
                              draggable={false}
                              className="w-full h-full object-contain pointer-events-none select-none"
                            />
                            {/* Short click selection pulse that finishes cleanly */}
                            {isPulsing && (
                              <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-300 ring-offset-2 ring-offset-transparent pointer-events-none animate-stage-pulse" />
                            )}
                          </div>

                          {/* Golden Connector Peg to Milestone */}
                          <div
                            className={`w-[3px] transition-all duration-200 mt-1.5 ${
                              isActive || isReached || isCardHovered
                                ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                                : "bg-amber-500/60"
                            }`}
                            style={{ height: "14px" }}
                          />
                        </div>
                      )}

                      {/* STAGE CARD: BELOW TRACK */}
                      {stage.position === "below" && (
                        <div
                          className="flex flex-col items-center justify-start"
                          style={{
                            position: "absolute",
                            top: "calc(50% + 28px)",
                            width: "100%",
                          }}
                        >
                          {/* Golden Connector Peg from Milestone */}
                          <div
                            className={`w-[3px] transition-all duration-200 mb-1.5 ${
                              isActive || isReached || isCardHovered
                                ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                                : "bg-amber-500/60"
                            }`}
                            style={{ height: "14px" }}
                          />

                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => handleStageSelect(index)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleStageSelect(index);
                              }
                            }}
                            onPointerEnter={() => {
                              setHoveredStageIndex(index);
                              sounds.playHover();
                            }}
                            onPointerLeave={() => {
                              setHoveredStageIndex(null);
                            }}
                            className={`relative cursor-pointer transition-all duration-200 transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl ${
                              isCardHovered
                                ? "scale-[1.03] z-25 translate-y-1 drop-shadow-[0_0_18px_rgba(251,191,36,0.85)] brightness-105"
                                : isActive
                                ? "scale-[1.01] z-20 opacity-100 drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)] brightness-102"
                                : "scale-100 z-10 opacity-85 hover:opacity-100 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
                            }`}
                            style={{
                              width: "auto",
                              maxHeight: "min(285px, 34vh)",
                              aspectRatio: "275 / 416",
                              overflow: "visible",
                            }}
                            aria-label={`Select Stage ${stage.step}: ${stage.title} (${stage.sub})`}
                          >
                            <img
                              src={stage.asset}
                              alt={`Stage ${stage.step} - ${stage.title}`}
                              draggable={false}
                              className="w-full h-full object-contain pointer-events-none select-none"
                            />
                            {/* Short click selection pulse that finishes cleanly */}
                            {isPulsing && (
                              <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-300 ring-offset-2 ring-offset-transparent pointer-events-none animate-stage-pulse" />
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* ── MOBILE CARD LAYOUT (Top Milestone + Card) ── */
                    <div className="flex flex-col items-center w-full">
                      {/* Milestone Badge on Mobile */}
                      <div className="relative z-30 mb-2">
                        <MilestoneBadge
                          step={stage.step}
                          isActive={isActive}
                          isReached={isReached}
                          onClick={() => handleStageSelect(index)}
                        />
                      </div>

                      {/* Mobile Event Card */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleStageSelect(index)}
                        className={`relative w-full rounded-2xl transition-all duration-200 ${
                          isPulsing
                            ? "scale-102 ring-2 ring-amber-300 ring-offset-2 ring-offset-transparent"
                            : isActive
                            ? "scale-[1.01] brightness-102"
                            : "scale-98 opacity-85"
                        }`}
                        style={{
                          aspectRatio: "275 / 416",
                          maxHeight: "48vh",
                          overflow: "visible",
                        }}
                      >
                        <img
                          src={stage.asset}
                          alt={`Stage ${stage.step} - ${stage.title}`}
                          draggable={false}
                          className="w-full h-full object-contain select-none pointer-events-none"
                        />
                      </div>

                      {/* Mobile Stage Title Caption */}
                      <div className="mt-2 text-center">
                        <span className="text-[11px] uppercase font-black text-amber-400 tracking-wider">
                          Stage {stage.step}
                        </span>
                        <h3 className="text-sm font-bold text-white tracking-wide">
                          {stage.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM INTERACTION HINT & DECORATIVE DIVIDER ── */}
      <footer className="relative z-20 w-full flex flex-col items-center pointer-events-none pb-2 flex-shrink-0">
        <div className="text-[11px] font-bold text-amber-300/80 uppercase tracking-widest flex items-center gap-2 mb-1">
          <span>{isMobile ? "← SWIPE TO EXPLORE ROADMAP →" : "← DRAG OR SCROLL TO EXPLORE ROADMAP →"}</span>
        </div>
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      </footer>
    </section>
  );
}
