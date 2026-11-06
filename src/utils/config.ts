import { SiteConfig, PlanPricingConfig } from '../types';
import counsellorPortrait from '../assets/images/counsellor_portrait_1793978423116.jpg';
import counsellingSpaceHero from '../assets/images/counselling_space_hero_1793978423999.jpg';

export { counsellorPortrait, counsellingSpaceHero };

export const DEFAULT_PLAN_PRICES: PlanPricingConfig = {
  chat: {
    '2hours': 'PKR 1,000',
    '1day': 'PKR 2,200',
    '1week': 'PKR 6,000',
    '1month': 'PKR 16,000',
  },
  notes: {
    '2hours': 'PKR 1,500',
    '1day': 'PKR 3,200',
    '1week': 'PKR 8,500',
    '1month': 'PKR 22,000',
  },
  calls: {
    '2hours': 'PKR 2,200',
    '1day': 'PKR 4,500',
    '1week': 'PKR 12,000',
    '1month': 'PKR 32,000',
  },
};

export const DEFAULT_CONFIG: SiteConfig = {
  brandName: 'Friendly Counsel',
  creatorName: 'Dua Kashmiri',
  whatsappNumber: '+92 300 1234567', // Standard Pakistani format placeholder
  instagramUsername: 'friendlycounsel_pk',
  telegramUsername: 'friendlycounsel',
  email: 'contact@friendlycounsel.com',
  sevenDayPrice: 'PKR 4,500',
  thirtyDayPrice: 'PKR 14,000',
  sessionDuration: '45–60 Mins (Daily Voice Call + Texting)',
  qualifications: 'Your Friendly Counsellor · Daily Chats & Voice Calls',
  heroHeadline: 'All You Need Is a Friend, Not a Therapist.',
  heroSubheadline: 'Connect with me for personal emotional support and guidance.',
  bioHeadline: 'Let me be your friend who listens, cares, and guides you daily.',
  bioStory: 'I offer friendly emotional support because no one should feel alone with their everyday problems. Think of me as your personal friend who you can text anytime or talk to over daily voice calls. We discuss whatever is on your mind—family issues, heartbreak, lonely nights, or stress—and take small, calming steps forward together.',
  portraitImage: counsellorPortrait,
  heroImage: counsellingSpaceHero,
  availabilityText: 'Online Daily · 10:00 AM – 1:00 AM PKT',
  planPrices: DEFAULT_PLAN_PRICES,
  // Default JazzCash payment configuration
  jazzCashAccountTitle: 'Friendly Counsel / Dua Kashmiri',
  jazzCashAccountNumber: '0300 1234567',
  jazzCashTillId: '00294819', // JazzCash Business TID
  jazzCashQrCodeImage: '',
  easyPaisaAccountTitle: 'Friendly Counsel',
  easyPaisaAccountNumber: '0300 1234567',
  paymentInstructions: 'Transfer via JazzCash App or dial *786#. You can pay directly to our Mobile Account or scan our QR Code / Till ID (TID). After sending, enter your TID / Trx ID below.',
  // WhatsApp Lock & Channels
  whatsappLockEnabled: true,
  whatsappUnlockFee: 'PKR 100',
  whatsappFastReplyText: '⚡ Typically replies in 1 minute (Fastest)',
  instagramReplyText: 'Standard reply (Usually within a few hours)',
  whatsappLockReason: 'To prevent spam and provide dedicated 1-on-1 personal attention, direct WhatsApp is reserved for clients with an active plan or a PKR 100 security access fee.',
  adminUnlockCodes: ['FRIEND100', 'ACTIVE', 'DUA2026', 'VIP100'],
};

/**
 * Normalizes phone numbers for WhatsApp wa.me links.
 * Pakistani numbers often look like 0300 1234567 or +92 300 1234567.
 */
export function getCleanWhatsAppNumber(rawNumber: string): string {
  // Strip non-digit characters
  const digits = rawNumber.replace(/\D/g, '');
  if (!digits) return '923001234567'; // Fallback sample number

  // If local Pakistani 03XX... number, convert to international 923XX...
  if (digits.startsWith('03') && digits.length === 11) {
    return '92' + digits.slice(1);
  }
  return digits;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = getCleanWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function buildInstagramUrl(username: string): string {
  const cleanHandle = username.replace(/^@/, '').trim();
  if (!cleanHandle || cleanHandle === '[Your Instagram Username]') {
    return 'https://instagram.com';
  }
  return `https://instagram.com/${cleanHandle}`;
}

export function buildTelegramUrl(telegramUsername?: string): string {
  if (!telegramUsername) return 'https://t.me';
  const clean = telegramUsername.trim();
  if (clean.startsWith('http')) return clean;
  const usernameOnly = clean.replace(/^@/, '');
  return `https://t.me/${usernameOnly}`;
}

export function buildMailtoUrl(email: string, subject: string, body?: string): string {
  const cleanEmail = email.trim();
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${cleanEmail}${query}`;
}

// Payment Storage Helpers (Persisted in localStorage with simulated order management)
const STORAGE_KEY_PAYMENTS = 'wellness_site_payments';

export function getStoredPayments(): import('../types').PaymentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveStoredPayments(payments: import('../types').PaymentSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  } catch {
    // ignore
  }
}

export function addPaymentSubmission(
  submission: Omit<import('../types').PaymentSubmission, 'id' | 'createdAt' | 'status'>
): import('../types').PaymentSubmission {
  const payments = getStoredPayments();
  const newRecord: import('../types').PaymentSubmission = {
    ...submission,
    id: 'pay_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...payments];
  saveStoredPayments(updated);
  return newRecord;
}

export function updatePaymentStatus(
  id: string,
  status: import('../types').PaymentSubmission['status']
): void {
  const payments = getStoredPayments();
  const updated = payments.map((p) => (p.id === id ? { ...p, status } : p));
  saveStoredPayments(updated);
}

export function deletePaymentSubmission(id: string): void {
  const payments = getStoredPayments();
  const updated = payments.filter((p) => p.id !== id);
  saveStoredPayments(updated);
}

// WhatsApp Unlock Storage & Verification Helpers
export const STORAGE_KEY_WHATSAPP_UNLOCKED = 'wellness_whatsapp_unlocked';

export interface WhatsAppUnlockInfo {
  unlocked: boolean;
  unlockedAt?: string;
  planName?: string;
  amount?: string;
  transactionId?: string;
  clientPhone?: string;
  reason?: string;
}

export function getWhatsAppUnlockInfo(): WhatsAppUnlockInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WHATSAPP_UNLOCKED);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.unlocked) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return { unlocked: false };
}

export function setWhatsAppUnlocked(info?: Partial<WhatsAppUnlockInfo>): void {
  try {
    const data: WhatsAppUnlockInfo = {
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      ...info,
    };
    localStorage.setItem(STORAGE_KEY_WHATSAPP_UNLOCKED, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function lockWhatsApp(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_WHATSAPP_UNLOCKED);
  } catch {
    // ignore
  }
}

export function verifyUnlockCode(code: string, validCodes?: string[]): boolean {
  const clean = code.trim().toUpperCase();
  if (!clean) return false;
  const list = validCodes && validCodes.length > 0 ? validCodes : ['FRIEND100', 'ACTIVE', 'DUA2026', 'VIP100'];
  if (list.map((c) => c.trim().toUpperCase()).includes(clean)) {
    return true;
  }
  // Check if matches any existing payment transaction ID
  const payments = getStoredPayments();
  return payments.some((p) => p.transactionId.trim().toUpperCase() === clean);
}


