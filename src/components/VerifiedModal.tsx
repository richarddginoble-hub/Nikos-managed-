import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Building, 
  FileCheck, 
  X, 
  ExternalLink,
  Award,
  Globe
} from 'lucide-react';

interface VerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerifiedModal: React.FC<VerifiedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10131c] border border-[#d4af37] rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-black relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232733] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#e5c158]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-white text-base">
                  Official Verified Platform
                </h3>
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] fill-[#0284c7]" />
              </div>
              <p className="text-[11px] text-stone-400">
                Cert. ID: NV-YTON-AUTH-2026-CERT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202534] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials Breakdown */}
        <div className="space-y-3.5 text-xs text-stone-300">
          <div className="p-3 bg-[#0b0d13] rounded-xl border border-[#232733] flex items-start gap-3">
            <Building className="w-4 h-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white block">Official Production Representation</strong>
              <p className="text-stone-400 mt-0.5">
                Operated in direct partnership with <strong className="text-stone-300">YTON Productions Ltd.</strong> (Petrou Ralli 38, Tavros, Athens) and Nikos Vertis Management.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#0b0d13] rounded-xl border border-[#232733] flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white block">Secure Encrypted Payments & Fast-Pass QR</strong>
              <p className="text-stone-400 mt-0.5">
                256-Bit TLS encryption, PCI-DSS Level 1 compliance with 3D Secure 2.0 authorization for all live table reservations and artist video requests.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#0b0d13] rounded-xl border border-[#232733] flex items-start gap-3">
            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white block">Direct Artist Content Guarantee</strong>
              <p className="text-stone-400 mt-0.5">
                All video masterclasses, acoustic studio recordings, and personalized video shoutouts are authenticated and delivered directly from Nikos Vertis.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#0b0d13] rounded-xl border border-[#232733] flex items-start gap-3">
            <Globe className="w-4 h-4 text-[#38bdf8] mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white block">Official Verification Contacts</strong>
              <p className="text-stone-400 mt-0.5">
                Email: <span className="font-mono text-stone-300">management@nikosvertis.com</span> • Box Office: <span className="font-mono text-stone-300">+30 210 345 3101</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#232733] flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Validated by Google AI Studio Cloud Container
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs hover:bg-[#e5c158]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
