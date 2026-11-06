import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Instagram,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Key,
  CreditCard,
  Mail,
  Send,
  Clock,
  Heart
} from 'lucide-react';
import { SiteConfig } from '../types';
import {
  buildWhatsAppUrl,
  buildInstagramUrl,
  buildTelegramUrl,
  buildMailtoUrl,
  verifyUnlockCode,
  setWhatsAppUnlocked,
  counsellorPortrait
} from '../utils/config';

interface ConnectChannelModalProps {
  config: SiteConfig;
  isOpen: boolean;
  onClose: () => void;
  prefilledText?: string;
  contextTitle?: string;
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
  onOpenPaymentForUnlock: (unlockPlan: {
    id: string;
    name: string;
    duration: string;
    durationLabel: string;
    amount: string;
  }) => void;
  onOpenPlans: () => void;
}

export const ConnectChannelModal: React.FC<ConnectChannelModalProps> = ({
  config,
  isOpen,
  onClose,
  prefilledText,
  contextTitle,
  isUnlocked,
  onUnlockSuccess,
  onOpenPaymentForUnlock,
  onOpenPlans,
}) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);

  if (!isOpen) return null;

  const defaultMessage =
    prefilledText ||
    `Hi ${config.creatorName}! (Let me be your friend). I am reaching out from your website and would love to start our chat.`;

  const whatsappUrl = buildWhatsAppUrl(config.whatsappNumber, defaultMessage);
  const instagramUrl = buildInstagramUrl(config.instagramUsername);
  const telegramUrl = config.telegramUsername ? buildTelegramUrl(config.telegramUsername) : null;
  const emailUrl = config.email ? buildMailtoUrl(config.email, 'Friendly Emotional Support Request', defaultMessage) : null;

  const unlockFee = config.whatsappUnlockFee || 'PKR 100';
  const lockActive = config.whatsappLockEnabled !== false && !isUnlocked;

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setCodeError('Please enter your code or Transaction ID.');
      return;
    }

    const isValid = verifyUnlockCode(accessCode, config.adminUnlockCodes);
    if (isValid) {
      setWhatsAppUnlocked({
        reason: 'Unlocked via access code: ' + accessCode.trim().toUpperCase(),
        transactionId: accessCode.trim().toUpperCase(),
      });
      setCodeSuccess(true);
      setCodeError('');
      onUnlockSuccess();
      setTimeout(() => {
        setShowCodeInput(false);
        setCodeSuccess(false);
      }, 1500);
    } else {
      setCodeError('Invalid code. Please check your spelling or payment TID.');
    }
  };

  const handlePayUnlockClick = () => {
    onClose();
    onOpenPaymentForUnlock({
      id: 'plan-whatsapp-unlock',
      name: 'WhatsApp Quick Access & Security Pass',
      duration: 'instant',
      durationLabel: 'Instant WhatsApp Unlock',
      amount: unlockFee,
    });
  };

  const handleViewPlansClick = () => {
    onClose();
    onOpenPlans();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#DFE8E1] overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#223526] via-[#2D4532] to-[#223526] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-[#527B58] shadow-md bg-white">
                <img
                  src={config.portraitImage || counsellorPortrait}
                  alt={config.creatorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#4EDB6A] border-2 border-[#223526]"></span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#A6F4C5] text-[11px] font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Personal Emotional Guide</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Connect with {config.creatorName}
              </h3>
              <p className="text-xs text-[#C2D8C6] font-medium">
                Choose how you would like to start your friendly conversation
              </p>
            </div>
          </div>

          {contextTitle && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl text-xs text-[#E1EFE3] font-medium border border-white/10">
              <span className="text-[#9FE2AB] font-bold">Selected Topic:</span>
              <span className="truncate max-w-[280px] sm:max-w-[340px]">{contextTitle}</span>
            </div>
          )}
        </div>

        {/* Channels Section */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* CHANNEL 1: WHATSAPP (Fastest / Priority) */}
          <div
            className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${
              !lockActive
                ? 'bg-gradient-to-br from-[#F0F8F2] to-[#E3EFE5] border-[#25D366] shadow-sm'
                : 'bg-white border-[#E0ECE2] hover:border-[#38533D]'
            }`}
          >
            {/* Top Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-2xs">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#19321D] flex items-center gap-1.5">
                    <span>WhatsApp Chat & Calls</span>
                  </h4>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5">
                {!lockActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366]/15 text-[#145C27] text-xs font-bold rounded-full border border-[#25D366]/30">
                    <Unlock className="w-3 h-3 text-[#145C27]" />
                    <span>Unlocked & Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF4E5] text-[#9E5D00] text-xs font-bold rounded-full border border-[#FFD8A8]">
                    <Lock className="w-3 h-3 text-[#9E5D00]" />
                    <span>Locked Channel</span>
                  </span>
                )}
              </div>
            </div>

            {/* Speed Highlight Pill (Requested by User) */}
            <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#E2F4E6] text-[#195627] text-xs font-semibold rounded-lg border border-[#BCE4C6]">
              <Zap className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
              <span>{config.whatsappFastReplyText || '⚡ Fastest Reply — Typically in 1 minute'}</span>
            </div>

            {/* Unlocked State */}
            {!lockActive ? (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-[#39563E] leading-relaxed">
                  Your WhatsApp priority channel is active! You can send your private message right now for instant 1-minute replies.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-[#073618] text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-[#073618]" />
                  <span>Open WhatsApp Chat Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              /* Locked State */
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#DFE8E1] text-xs text-[#4A6150] leading-relaxed">
                  <p className="font-semibold text-[#223827] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3F6345]" />
                    <span>Why is WhatsApp locked?</span>
                  </p>
                  <span>
                    {config.whatsappLockReason ||
                      `To maintain dedicated 1-on-1 personal time, protect privacy, and avoid spam, WhatsApp is reserved for clients with an active plan or a one-time ${unlockFee} security access fee.`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* Button 1: Pay Rs 100 Unlock */}
                  <button
                    type="button"
                    onClick={handlePayUnlockClick}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#2D4532] hover:bg-[#1E3023] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-[#A6F4C5]" />
                    <span>Unlock WhatsApp ({unlockFee})</span>
                  </button>

                  {/* Button 2: Choose Plan */}
                  <button
                    type="button"
                    onClick={handleViewPlansClick}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-[#EAF2EC] hover:bg-[#DFEBE1] text-[#243B29] border border-[#CCDCD0] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <span>View Support Plans</span>
                    <ArrowRight className="w-3 h-3 text-[#39563E]" />
                  </button>
                </div>

                {/* Code verification dropdown */}
                <div className="pt-2 border-t border-[#E8EFE9]">
                  {!showCodeInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCodeInput(true)}
                      className="text-[11px] text-[#4F6C54] hover:text-[#1F2F23] font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                      <span>Already have an active plan or unlock code? Enter here</span>
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={accessCode}
                          onChange={(e) => {
                            setAccessCode(e.target.value);
                            setCodeError('');
                          }}
                          placeholder="Enter Code (e.g. FRIEND100) or Trx ID"
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#CCDCD0] bg-white text-[#2D3A30] focus:outline-none focus:ring-1 focus:ring-[#3F6345]"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-[#2D4532] text-white text-xs font-bold rounded-lg hover:bg-[#1E3023] transition-colors cursor-pointer"
                        >
                          Unlock
                        </button>
                      </div>

                      {codeError && (
                        <p className="text-[11px] text-[#A63636] font-medium">{codeError}</p>
                      )}
                      {codeSuccess && (
                        <p className="text-[11px] text-[#20833B] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Code verified! WhatsApp access unlocked!</span>
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* OR SEPARATOR */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-[#DFE8E1] w-full"></div>
            <span className="bg-[#FAF8F5] px-3 text-[11px] font-bold uppercase tracking-wider text-[#7A9380] absolute">
              Or Message For Free On Alternative
            </span>
          </div>

          {/* CHANNEL 2: INSTAGRAM DM (100% FREE Alternative) */}
          <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#DFE8E1] hover:border-[#D54381] shadow-2xs transition-all group">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#243527]">
                    Instagram Direct Message
                  </h4>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF0F4] text-[#B02A65] text-xs font-bold rounded-full border border-[#F5D5E3]">
                <Heart className="w-3 h-3 fill-[#B02A65]" />
                <span>100% Free · No Plan Needed</span>
              </span>
            </div>

            <p className="text-xs text-[#526956] leading-relaxed mb-3">
              Don’t want to pay the security fee or buy a plan? No worries at all! You can message me for free directly on Instagram.
            </p>

            <div className="flex items-center gap-2 mb-3 text-[11px] text-[#697F6E]">
              <Clock className="w-3.5 h-3.5 text-[#8E5E72]" />
              <span>{config.instagramReplyText || 'Standard reply (Usually within a few hours)'}</span>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FD1D1D] hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Message on Instagram Direct (@{config.instagramUsername.replace(/^@/, '')})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CHANNEL 3: OTHER FREE ALTERNATIVES (Telegram / Email) */}
          {(telegramUrl || emailUrl) && (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {telegramUrl && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-[#F2F8FC] border border-[#D5E5F2] text-[#215E8C] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 -rotate-12" />
                  <span>Free on Telegram</span>
                </a>
              )}
              {emailUrl && (
                <a
                  href={emailUrl}
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-[#F5F8F6] border border-[#CCDCD0] text-[#37523C] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Free via Email</span>
                </a>
              )}
            </div>
          )}

          {/* Safe Space Footer */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#617B66]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3F6345]" />
            <span>100% Confidential · Empathetic & Non-judgmental · Safe Space</span>
          </div>

        </div>
      </div>
    </div>
  );
};
