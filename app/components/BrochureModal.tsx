"use client";

import React, { useState } from "react";
import { sounds } from "./sound";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "rules" | "maps">("overview");

  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-cyan-400 bg-gradient-to-b from-[#091536] via-[#040b20] to-[#020512] shadow-[0_0_50px_rgba(6,182,212,0.45)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-500 border-b-4 border-cyan-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h2 className="text-2xl font-black tracking-wider text-[#02182b] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              EVENT BROCHURE — GENESIS
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-900 text-cyan-200 hover:bg-red-600 hover:text-white font-black transition-all hover:scale-110 active:scale-90"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-900/60 bg-[#061028] px-4 pt-3 gap-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "schedule", label: "Schedule" },
            { id: "rules", label: "Rules" },
            { id: "maps", label: "Map Pool" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playHover();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-4 py-2 font-black rounded-t-lg text-sm tracking-wide transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-slate-950 shadow-[0_-2px_8px_rgba(6,182,212,0.4)]"
                  : "text-cyan-300 hover:bg-cyan-950/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 font-sans space-y-4 max-h-[65vh] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-300">Welcome to Genesis Tournament 2026</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Organized by the Game Development & Artificial Intelligence (GDAI) Club, GENESIS is the pinnacle competitive Brawl Stars inter-college tournament. With fierce team showdowns, pro casting, and exhilarating prizes, players clash on the cosmic stage!
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                  <div className="text-xs text-cyan-400 font-bold uppercase">Format</div>
                  <div className="text-sm font-semibold text-white">3v3 Double Elimination</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                  <div className="text-xs text-cyan-400 font-bold uppercase">Teams</div>
                  <div className="text-sm font-semibold text-white">32 Registered Trios</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                  <div className="text-xs text-cyan-400 font-bold uppercase">Platform</div>
                  <div className="text-sm font-semibold text-white">Mobile (Brawl Stars Official)</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                  <div className="text-xs text-cyan-400 font-bold uppercase">Streaming</div>
                  <div className="text-sm font-semibold text-white">Live on GDAI YouTube & Twitch</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-cyan-300">Tournament Timeline</h3>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-[#0c1c42] border-l-4 border-cyan-400">
                  <div className="text-xs text-cyan-300 font-bold">PHASE 1 • QUALIFIERS (DAY 1 - 10:00 AM)</div>
                  <div className="text-sm text-slate-200">Group Stage Bo3 Matches (Gem Grab & Brawl Ball). Top 2 from each group advance.</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0c1c42] border-l-4 border-sky-400">
                  <div className="text-xs text-sky-300 font-bold">PHASE 2 • QUARTER & SEMI FINALS (DAY 2 - 2:00 PM)</div>
                  <div className="text-sm text-slate-200">Upper & Lower Brackets Bo5 with Brawler Ban/Pick phase.</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0c1c42] border-l-4 border-amber-400">
                  <div className="text-xs text-amber-300 font-bold">PHASE 3 • GRAND FINALS (DAY 2 - 6:30 PM)</div>
                  <div className="text-sm text-slate-200">Bo7 Ultimate Showdown live on stage with live casting and trophy presentation!</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-cyan-300">Official Tournament Rules</h3>
              <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                <li>Power 11 with all Hypercharges, Star Powers, and Gears unlocked in Friendly Battles.</li>
                <li>Each match follows blind pick or draft mode specified by the lobby referee.</li>
                <li>No emulators permitted — all matches must be played on standard iOS/Android devices.</li>
                <li>Teams must report to their Discord lobby 15 minutes prior to match time.</li>
                <li>Unsportsmanlike behavior, toxicity, or intentional disconnects result in immediate disqualification.</li>
              </ul>
            </div>
          )}

          {activeTab === "maps" && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-cyan-300">Competitive Map Pool</h3>
              <div className="grid grid-cols-2 gap-2.5 text-sm">
                <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-600/30">
                  <div className="font-bold text-cyan-200">⚽ Brawl Ball</div>
                  <div className="text-xs text-slate-300">Pinball Dreams, Backyard Bowl, Sneaky Fields</div>
                </div>
                <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-600/30">
                  <div className="font-bold text-cyan-200">💎 Gem Grab</div>
                  <div className="text-xs text-slate-300">Hard Rock Mine, Double Swoosh, Undermine</div>
                </div>
                <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-600/30">
                  <div className="font-bold text-cyan-200">🥊 Knockout</div>
                  <div className="text-xs text-slate-300">Goldarm Gulch, Outflank, Belle&apos;s Rock</div>
                </div>
                <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-600/30">
                  <div className="font-bold text-cyan-200">💰 Heist</div>
                  <div className="text-xs text-slate-300">Safe Zone, Kaboom Canyon, Pit Stop</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#050e24] border-t border-cyan-900/60">
          <span className="text-xs text-cyan-400 font-sans">GDAI Club • Genesis Edition</span>
          <button
            onClick={() => {
              sounds.playClick();
              alert("Downloading Genesis Tournament Rulebook & Guide PDF...");
            }}
            className="px-5 py-2 rounded-lg bg-cyan-400 text-slate-950 font-black text-sm tracking-wide hover:bg-cyan-300 transition-all hover:scale-105 active:scale-95"
          >
            📥 DOWNLOAD PDF
          </button>
        </div>
      </div>
    </div>
  );
}
