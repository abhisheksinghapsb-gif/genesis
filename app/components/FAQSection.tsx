"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { FAQCategory, FAQ_DATA } from "../data/faqData";
import FAQAccordionItem from "./FAQAccordionItem";
import { sounds } from "./sound";

const CATEGORIES: FAQCategory[] = ["general", "technical", "prizes", "logistics"];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("general");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive dynamic scaling so the entire FAQ unit fits 100vh on any desktop/laptop without being too small
  useEffect(() => {
    const updateScaling = () => {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 768) {
        setScale(1);
        return;
      }

      // Natural target height of the complete assembly: ~715px (Banner + Panel + Bottom Nav + gaps)
      const targetH = 715;
      const targetW = 980;
      const scaleH = (vh * 0.94) / targetH;
      const scaleW = (vw * 0.95) / targetW;
      // Clamp between 0.80 ("not too small") and 1.05 (Figma max scale)
      const calculatedScale = Math.min(1.05, Math.max(0.80, Math.min(scaleH, scaleW)));
      setScale(Number(calculatedScale.toFixed(4)));
    };

    updateScaling();
    window.addEventListener("resize", updateScaling, { passive: true });
    return () => window.removeEventListener("resize", updateScaling);
  }, []);

  // Switch category with sleek 160ms opacity transition & accordion reset
  const handleCategoryChange = useCallback(
    (category: FAQCategory) => {
      if (category === activeCategory) return;
      sounds.playClick();
      setExpandedQuestionId(null);
      setIsTransitioning(true);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setActiveCategory(category);
        setIsTransitioning(false);
      }, 160);
    },
    [activeCategory]
  );

  // Single-open accordion toggle
  const handleToggleQuestion = useCallback((id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  }, []);

  const currentCategoryData = FAQ_DATA[activeCategory];

  return (
    <section
      id="faq"
      className="relative w-full h-screen min-h-screen flex flex-col items-center justify-center select-none bg-[#030015] text-white px-3 sm:px-6 z-10 shrink-0 overflow-hidden"
      aria-label="Frequently Asked Questions"
    >
      {/* ── 1. COSMIC BRAWL STARS PATTERN BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <picture>
          <img
            src="/faq/bg_cosmic_faq.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
          />
        </picture>
        {/* Subtle radial vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(3,0,21,0.6)_100%)]"
          aria-hidden="true"
        />
        {/* Subtle Edge Transitions: Visual continuity with Sponsors above */}
        <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#030015] to-transparent pointer-events-none" />
      </div>

      {/* ── SCALED FAQ ARCADE ASSEMBLY (Banner + Blue Panel + Bottom Nav) ── */}
      <div
        className="relative z-10 w-full max-w-[980px] flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4.5 transition-transform duration-150"
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        {/* ── 2. TOP: ORANGE FAQ HEADING BANNER ── */}
        <div className="relative w-full flex flex-col items-center shrink-0">
          <h2 className="sr-only">Frequently Asked Questions</h2>
          <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[430px] h-[48px] sm:h-[58px] md:h-[68px] lg:h-[76px] pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)]">
            <img
              src="/faq/faq_banner.svg"
              alt="FAQs"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>

        {/* ── 3. CENTER: MAIN BLUE ARCADE INFORMATION PANEL ── */}
        <div className="relative w-full max-w-[961px] flex flex-col items-center shrink-0">
          <div
            className="w-full rounded-2xl sm:rounded-3xl border-4 border-[#000c28] shadow-[0_16px_40px_rgba(0,8,28,0.9),0_0_50px_rgba(16,93,229,0.35)] overflow-hidden flex flex-col transition-all duration-300"
            style={{
              backgroundColor: "#105DE5",
              boxShadow:
                "inset 0 -2px 0 rgba(0,0,0,0.25), inset 0 2px 0 #063A97, 0 8px 0 #248EF6, 0 20px 45px rgba(0,0,0,0.85)",
            }}
          >
            {/* Panel Header Bar (Lighter Blue #248EF6 with inner arcade shadow) */}
            <div
              className="relative w-full h-[50px] sm:h-[60px] md:h-[68px] lg:h-[74px] flex items-center justify-center px-4 sm:px-6 border-b-4 border-[#000c28] shrink-0"
              style={{
                backgroundColor: "#248EF6",
                boxShadow: "inset 0 -3.4px 0 #055CB3",
              }}
            >
              {/* Centered Category Title Artwork */}
              <div
                className={`h-[22px] sm:h-[26px] md:h-[32px] lg:h-[36px] flex items-center justify-center transition-all duration-200 ${
                  isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <img
                  src={currentCategoryData.headerSvg}
                  alt={currentCategoryData.label}
                  className="h-full w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[270px] object-contain pointer-events-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>

            {/* Panel Body: Question Rows Container (Figma 45px left/right inset: 871px row in 961px panel) */}
            <div
              className={`faq-panel-body min-h-[340px] sm:min-h-[385px] md:min-h-[425px] lg:min-h-[455px] h-auto flex flex-col ${
                currentCategoryData.questions.length <= 2
                  ? "justify-center gap-5 sm:gap-7 md:gap-8"
                  : currentCategoryData.questions.length === 3
                  ? "justify-start gap-3 sm:gap-4 md:gap-4.5"
                  : "justify-start gap-2.5 sm:gap-3 md:gap-3.5"
              } transition-opacity duration-180 overflow-y-auto scrollbar-none ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {currentCategoryData.questions.map((q, idx) => (
                <FAQAccordionItem
                  key={q.id}
                  item={q}
                  isOpen={expandedQuestionId === q.id}
                  onToggle={() => handleToggleQuestion(q.id)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. BOTTOM: FOUR CATEGORY NAVIGATION OPTIONS ── */}
        <div className="relative w-full max-w-[1200px] flex justify-center shrink-0">
          <nav
            aria-label="FAQ Categories"
            role="tablist"
            className="w-full max-w-3xl px-2 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-[#051E53]/95 backdrop-blur-md border-2 border-blue-400/40 shadow-[0_8px_25px_rgba(0,10,36,0.9)] flex items-center justify-between gap-1 sm:gap-3 overflow-x-auto scrollbar-none"
          >
          {CATEGORIES.map((catKey) => {
            const cat = FAQ_DATA[catKey];
            const isActive = activeCategory === catKey;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={`faq-tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls="faq"
                onClick={() => handleCategoryChange(cat.id)}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                    sounds.playHover();
                  }
                }}
                className={`relative flex-1 min-w-[65px] sm:min-w-[110px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer select-none group ${
                  isActive
                    ? "bg-blue-600/40 shadow-[0_0_16px_rgba(36,142,246,0.6)] scale-105"
                    : "hover:bg-blue-900/40 hover:scale-102 opacity-75 hover:opacity-100"
                }`}
              >
                {/* Visual SVG Navigation Tag from Figma reference */}
                <div className="h-[18px] sm:h-[24px] md:h-[28px] flex items-center justify-center">
                  <img
                    src={cat.navSvg}
                    alt={cat.label}
                    className={`h-full w-auto object-contain pointer-events-none transition-all duration-200 ${
                      isActive
                        ? "brightness-125 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
                        : "brightness-90 group-hover:brightness-110"
                    }`}
                  />
                </div>

                {/* Active Indicator Underline / Glow Bar */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-2 right-2 sm:left-3 sm:right-3 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 shadow-[0_0_8px_#38bdf8]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      </div>
    </section>
  );
}
