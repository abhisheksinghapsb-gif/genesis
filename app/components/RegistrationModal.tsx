"use client";

import React, { useState } from "react";
import { sounds } from "./sound";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    teamName: "",
    captainIgn: "",
    captainTag: "",
    player2Ign: "",
    player3Ign: "",
    discord: "",
    mode: "3v3 Brawl Ball & Gem Grab",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playRegister();
    setSubmitted(true);
  };

  const handleClose = () => {
    sounds.playClick();
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border-4 border-[#ffbe0b] bg-gradient-to-b from-[#160738] via-[#0e0326] to-[#080119] shadow-[0_0_50px_rgba(255,190,11,0.45)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Header Bar */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] border-b-4 border-[#78350f]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <h2 className="text-2xl font-black tracking-wider text-[#1e0700] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
              GENESIS TOURNAMENT REGISTRATION
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#78350f] text-amber-200 hover:bg-red-600 hover:text-white font-black transition-all hover:scale-110 active:scale-90"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="text-6xl animate-bounce">🏆</div>
            <h3 className="text-3xl font-extrabold text-[#facc15] tracking-wide">
              YOU&apos;RE IN THE ARENA!
            </h3>
            <p className="text-lg text-slate-200 font-sans leading-relaxed">
              Team <span className="font-bold text-amber-300">«{formData.teamName || "Challengers"}»</span> has been registered for <span className="text-cyan-300 font-bold">{formData.mode}</span>!
            </p>
            <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-sm text-purple-200 font-sans">
              Check your Discord <span className="font-semibold text-white">({formData.discord || "provided tag"})</span> for scrim brackets and check-in lobby details.
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl bg-gradient-to-b from-[#facc15] to-[#ca8a04] text-[#1c1917] font-black text-xl tracking-wider shadow-[0_4px_0_#854d0e] hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              READY FOR BATTLE!
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans max-h-[80vh] overflow-y-auto">
            <p className="text-slate-300 text-sm font-sans mb-2">
              Assemble your trio! Compete in the Genesis Brawl Stars championship and earn your spot on the GDAI hall of fame.
            </p>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Team Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Star Shelly Syndicate"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a0c3b] border-2 border-purple-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Captain IGN *
                </label>
                <input
                  required
                  type="text"
                  placeholder="In-Game Name"
                  value={formData.captainIgn}
                  onChange={(e) => setFormData({ ...formData, captainIgn: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a0c3b] border-2 border-purple-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Captain Tag (#...) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="#8YG02P..."
                  value={formData.captainTag}
                  onChange={(e) => setFormData({ ...formData, captainTag: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a0c3b] border-2 border-purple-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Player 2 IGN
                </label>
                <input
                  type="text"
                  placeholder="Player 2 IGN"
                  value={formData.player2Ign}
                  onChange={(e) => setFormData({ ...formData, player2Ign: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a0c3b] border border-purple-500/40 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Player 3 IGN
                </label>
                <input
                  type="text"
                  placeholder="Player 3 IGN"
                  value={formData.player3Ign}
                  onChange={(e) => setFormData({ ...formData, player3Ign: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a0c3b] border border-purple-500/40 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Discord Username / Contact *
              </label>
              <input
                required
                type="text"
                placeholder="discord_handle#0000"
                value={formData.discord}
                onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#1a0c3b] border-2 border-purple-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Preferred Tournament Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a0c3b] border-2 border-purple-500/50 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="3v3 Brawl Ball & Gem Grab">3v3 Brawl Ball & Gem Grab (Primary)</option>
                <option value="Showdown Solo/Duo">Showdown Solo & Duo Championship</option>
                <option value="Knockout & Bounty">Knockout & Bounty Elimination</option>
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                onMouseEnter={() => sounds.playHover()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] text-[#291400] font-black text-xl tracking-widest shadow-[0_5px_0_#78350f,0_8px_20px_rgba(245,158,11,0.5)] hover:brightness-110 active:translate-y-1 active:shadow-[0_2px_0_#78350f] transition-all"
              >
                CONFIRM REGISTRATION
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
