"use client";

import React from "react";
import { sounds } from "./sound";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
  onOpenPrize: () => void;
  onOpenSponsors: () => void;
}

export default function MenuDrawer({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  onOpenRegister,
  onOpenBrochure,
  onOpenPrize,
  onOpenSponsors,
}: MenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm h-full bg-gradient-to-b from-[#12052b] via-[#090119] to-[#04000d] border-l-4 border-purple-500 shadow-[-10px_0_40px_rgba(168,85,247,0.4)] flex flex-col justify-between p-6 text-white font-sans overflow-y-auto">
        {/* Top bar */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-purple-800/60">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙</span>
              <h2 className="text-xl font-black tracking-wider text-purple-300 font-display">
                GENESIS MENU
              </h2>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-purple-900/60 text-purple-300 hover:bg-red-600 hover:text-white font-black flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>

          {/* Quick Nav Links */}
          <div className="mt-6 space-y-3">
            <div className="text-xs font-bold uppercase text-purple-400 tracking-wider">
              Quick Navigation
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold flex items-center justify-between transition-all hover:translate-x-1"
            >
              <span>⚔ Register for Tournament</span>
              <span>→</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenBrochure();
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-cyan-400 text-cyan-300 font-bold flex items-center justify-between transition-all hover:translate-x-1"
            >
              <span>📖 Event Brochure & Rules</span>
              <span>→</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPrize();
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-yellow-400 text-yellow-300 font-bold flex items-center justify-between transition-all hover:translate-x-1"
            >
              <span>🏆 Prize Pool Breakdown</span>
              <span>→</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSponsors();
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-emerald-400 text-emerald-300 font-bold flex items-center justify-between transition-all hover:translate-x-1"
            >
              <span>💎 Official Sponsors</span>
              <span>→</span>
            </button>
          </div>

          {/* Audio & Settings */}
          <div className="mt-8 space-y-3">
            <div className="text-xs font-bold uppercase text-purple-400 tracking-wider">
              Sound & Effects
            </div>
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-700/40 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Arcade SFX</div>
                <div className="text-xs text-purple-300">Retro synthesized UI sounds</div>
              </div>
              <button
                onClick={() => {
                  onToggleMute();
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all ${
                  !isMuted
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : "bg-red-500/80 text-white hover:bg-red-500"
                }`}
              >
                {!isMuted ? "🔊 ON" : "🔇 MUTED"}
              </button>
            </div>
          </div>

          {/* About Club */}
          <div className="mt-8 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2">
            <div className="text-xs font-bold text-amber-300 uppercase">About GDAI Club</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Game Development & Artificial Intelligence Club fosters student game development, competitive esports, AI workshops, and community events.
            </p>
          </div>
        </div>

        {/* Footer Socials */}
        <div className="pt-6 border-t border-purple-900/60 text-center space-y-2">
          <div className="text-xs text-purple-400">Join the Discord Community</div>
          <div className="flex justify-center gap-3">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-xs font-bold text-white transition-all hover:scale-105"
            >
              Discord Server
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all hover:scale-105"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
