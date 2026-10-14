"use client";

import React from "react";
import { sounds } from "./sound";

interface SponsorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SponsorsModal({ isOpen, onClose }: SponsorsModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border-4 border-emerald-400 bg-gradient-to-b from-[#021f14] via-[#01120b] to-[#000a06] shadow-[0_0_55px_rgba(52,211,153,0.5)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 border-b-4 border-emerald-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💎</span>
            <h2 className="text-2xl font-black tracking-wider text-[#002414] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              GENESIS SPONSORS & PARTNERS
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-950 text-emerald-200 hover:bg-red-600 hover:text-white font-black transition-all hover:scale-110 active:scale-90"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 font-sans space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title Sponsor */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-green-950/40 border-2 border-emerald-400/80 text-center space-y-2">
            <div className="text-xs font-bold uppercase text-emerald-400 tracking-widest">PRESENTING TITLE SPONSOR</div>
            <div className="text-3xl font-black text-white tracking-wider">HYPERION GAMING</div>
            <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
              Empowering next-generation collegiate esports with ultra-low latency peripherals and competitive tournament gear.
            </p>
          </div>

          {/* Tier 2 Partners */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
              <div className="text-xs font-bold text-teal-400 uppercase">Beverage Partner</div>
              <div className="text-lg font-black text-white mt-1">VOLT ENERGY</div>
              <div className="text-xs text-slate-300 mt-1">Fueling champions through every overtime.</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
              <div className="text-xs font-bold text-teal-400 uppercase">Media & Stream</div>
              <div className="text-lg font-black text-white mt-1">NEXUS CAST</div>
              <div className="text-xs text-slate-300 mt-1">Official broadcast & highlight studio partner.</div>
            </div>
          </div>

          {/* Club Partnership Note */}
          <div className="p-4 rounded-xl bg-[#031c12] border border-emerald-600/30 space-y-2">
            <h4 className="text-sm font-bold text-emerald-300">Interested in Sponsoring Genesis?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reach over 2,000+ passionate collegiate gamers, developers, and esports fans through direct on-stream placements, social shoutouts, and on-stage banners.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                alert("Please email gdai.club@genesis.event or reach out on our Discord server to get the Sponsor Deck!");
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs tracking-wider hover:bg-emerald-300 transition-all hover:scale-105 active:scale-95"
            >
              ✉ GET SPONSORSHIP DECK
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#01140c] border-t border-emerald-900/60 text-center text-xs text-emerald-400 font-sans">
          Proudly supported by the GDAI Community & Industry Partners
        </div>
      </div>
    </div>
  );
}
