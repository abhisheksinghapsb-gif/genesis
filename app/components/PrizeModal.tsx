"use client";

import React from "react";
import { sounds } from "./sound";

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrizeModal({ isOpen, onClose }: PrizeModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border-4 border-amber-400 bg-gradient-to-b from-[#211100] via-[#120700] to-[#0a0200] shadow-[0_0_55px_rgba(251,191,36,0.5)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 border-b-4 border-amber-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <h2 className="text-2xl font-black tracking-wider text-[#210900] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              GENESIS PRIZE POOL & AWARDS
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-950 text-amber-200 hover:bg-red-600 hover:text-white font-black transition-all hover:scale-110 active:scale-90"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 font-sans space-y-4 max-h-[75vh] overflow-y-auto">
          {/* 1st Place Champion */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-yellow-950/40 to-amber-900/60 border-2 border-amber-400/80 shadow-[0_4px_20px_rgba(251,191,36,0.3)] flex items-center gap-4">
            <div className="text-5xl animate-bounce">🏆</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-amber-300 tracking-wider">1ST PLACE — GRAND CHAMPIONS</h3>
                <span className="px-2.5 py-1 rounded bg-amber-400 text-black font-extrabold text-xs">GOLD</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">₹15,000 Cash Pool</div>
              <div className="text-xs text-amber-200 mt-1 flex flex-wrap gap-2">
                <span>✦ Official Genesis Trophy</span>
                <span>✦ 5,000 In-Game Brawl Gems</span>
                <span>✦ Exclusive GDAI Champ Hoodies</span>
              </div>
            </div>
          </div>

          {/* 2nd Place */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-400/60 flex items-center gap-4">
            <div className="text-4xl">🥈</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-200 tracking-wide">2ND PLACE — RUNNER UP</h3>
                <span className="px-2 py-0.5 rounded bg-slate-300 text-black font-bold text-xs">SILVER</span>
              </div>
              <div className="text-xl font-black text-white mt-1">₹8,000 Cash Pool</div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-2">
                <span>✦ Silver Medallions</span>
                <span>✦ 2,500 In-Game Gems</span>
                <span>✦ Gaming Gear Accessories</span>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#1c0c05] via-[#2a1309] to-[#1c0c05] border-2 border-amber-700/60 flex items-center gap-4">
            <div className="text-4xl">🥉</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-amber-500 tracking-wide">3RD PLACE — SEMI-FINALIST</h3>
                <span className="px-2 py-0.5 rounded bg-amber-700 text-amber-100 font-bold text-xs">BRONZE</span>
              </div>
              <div className="text-xl font-black text-white mt-1">₹4,000 Cash Pool</div>
              <div className="text-xs text-amber-200/80 mt-1 flex flex-wrap gap-2">
                <span>✦ Bronze Plaques</span>
                <span>✦ 1,000 In-Game Gems</span>
                <span>✦ Club Badges</span>
              </div>
            </div>
          </div>

          {/* Special Awards */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase">MVP & Highlights Award</div>
              <div className="text-sm text-slate-200">Tournament MVP, Clutch Play of Genesis, & Community Favorite</div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-amber-300">₹3,000 Bonus</span>
              <div className="text-xs text-purple-200">+ Starr Drop Pin</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#140600] border-t border-amber-900/60 text-center">
          <p className="text-xs text-amber-400 font-sans">
            Total Prize Pool: <span className="font-bold text-white text-sm">₹30,000+ & In-Game Rewards</span>
          </p>
        </div>
      </div>
    </div>
  );
}
