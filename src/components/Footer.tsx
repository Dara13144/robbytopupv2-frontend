import React from 'react';
import { ShieldCheck, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-900 pb-8 text-center md:text-left">
          {/* Feature 1 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 mb-3">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Instant Delivery</h3>
            <p className="text-slate-400 text-xs max-w-xs">
              Automated system triggers direct game top-ups or voucher delivery immediately after payment is verified.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-violet-500/10 p-3 rounded-xl text-violet-400 mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Secure Payments</h3>
            <p className="text-slate-400 text-xs max-w-xs">
              Direct checkout integration with ABA PayWay and Bakong KHQR. We do not store card or banking details.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Official Verification</h3>
            <p className="text-slate-400 text-xs max-w-xs">
              All transactions are auto-verified with bank gateways. Live status check screen with instant Telegram alerts.
            </p>
          </div>
        </div>

        {/* Footer Bottom bar matching reference UI */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900/80">
          {/* WE ACCEPT Pill Container */}
          <div className="flex items-center gap-3 bg-[#0a0f1d]/90 border border-slate-800/80 px-4 py-2 rounded-2xl shadow-lg">
            {/* Green glowing dot + WE ACCEPT */}
            <div className="flex items-center gap-2 select-none pr-1">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] animate-pulse shrink-0" />
              <span className="text-white font-black tracking-wider text-xs uppercase font-sans">
                WE ACCEPT
              </span>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2">
              {/* ABA MOBILE Pill */}
              <div className="h-8 px-3 rounded-xl bg-[#0e1726] border border-slate-700/60 flex items-center justify-center shadow-inner hover:border-cyan-500/50 transition-all">
                <img
                  src="/images/payments/aba-mobile.svg"
                  alt="ABA Mobile"
                  className="h-5 w-auto object-contain rounded-md"
                />
              </div>

              {/* KHQR Pill */}
              <div className="h-8 px-3 rounded-xl bg-[#0e1726] border border-slate-700/60 flex items-center justify-center shadow-inner hover:border-red-500/50 transition-all">
                <img
                  src="/images/payments/khqr.svg"
                  alt="KHQR"
                  className="h-5 w-auto object-contain rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Copyright notice */}
          <p className="text-slate-400 text-xs font-semibold tracking-wide select-none">
            © 2026 ROBBY-TOPUP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
