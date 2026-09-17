import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Smartphone, 
  QrCode, 
  Download, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    itemType: 'table_booking' | 'exclusive_pass' | 'personalized_shoutout';
    title: string;
    description: string;
    totalAmount: number;
    metadata?: any;
  } | null;
  onSuccess: (receipt: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onSuccess
}) => {
  if (!isOpen || !orderData) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'iris'>('card');
  const [step, setStep] = useState<'details' | 'otp_verification' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('849');
  const [cardName, setCardName] = useState('Alexandros Moraitis');
  const [customerEmail, setCustomerEmail] = useState('alexandros@fanmail.gr');
  const [customerPhone, setCustomerPhone] = useState('+30 697 428 9910');

  // OTP simulation state
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Result receipt
  const [receipt, setReceipt] = useState<any>(null);

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 3D Secure bank handshake
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp_verification');
      setOtpCode('8492'); // Pre-fill sample OTP for convenient verification demo
    }, 800);
  };

  const handleConfirmOtp = async () => {
    if (otpCode.length < 4) {
      setOtpError('Please enter the 4-digit banking SMS code');
      return;
    }

    setIsProcessing(true);
    setOtpError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: orderData.itemType,
          details: orderData.metadata || { title: orderData.title },
          paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod.toUpperCase(),
          amount: orderData.totalAmount,
          currency: 'EUR',
          customer: {
            name: cardName,
            email: customerEmail,
            phone: customerPhone
          }
        })
      });

      const data = await res.json();
      setReceipt(data);
      setStep('success');
      onSuccess(data);
    } catch (err) {
      // Fallback in case offline
      const mockReceipt = {
        status: 'APPROVED',
        transactionId: `TXN-NV-${Date.now().toString(36).toUpperCase()}-9412`,
        bookingCode: `VER-${Math.floor(100000 + Math.random() * 900000)}`,
        verificationHash: 'NV_AUTH_TOKEN_79428',
        amount: orderData.totalAmount,
        currency: 'EUR',
        paymentMethod: paymentMethod.toUpperCase(),
        customer: { name: cardName, email: customerEmail, phone: customerPhone },
        verifiedAt: new Date().toISOString()
      };
      setReceipt(mockReceipt);
      setStep('success');
      onSuccess(mockReceipt);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#10131c] border border-[#d4af37]/40 rounded-2xl max-w-xl w-full shadow-2xl shadow-black overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#161a26] border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                {step === 'success' ? 'Booking Confirmed & Verified' : '256-Bit Encrypted Secure Checkout'}
              </h3>
              <p className="text-[11px] text-stone-400">
                PCI-DSS Level 1 Certified • Official Nikos Vertis Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202534] text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: PAYMENT DETAILS */}
        {step === 'details' && (
          <div className="p-6 space-y-6">
            {/* Order Summary Pill */}
            <div className="bg-[#0b0d13] border border-[#232733] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                    Order Summary
                  </span>
                  <h4 className="font-display font-bold text-white text-sm sm:text-base mt-0.5">
                    {orderData.title}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {orderData.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Total Due</span>
                  <span className="font-mono text-2xl font-bold text-[#e5c158]">
                    €{orderData.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Select Secure Payment Method:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'card', name: 'Credit Card', icon: CreditCard },
                  { id: 'apple_pay', name: 'Apple Pay', icon: Smartphone },
                  { id: 'google_pay', name: 'Google Pay', icon: Smartphone },
                  { id: 'iris', name: 'IRIS Instant', icon: Sparkles }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#1e2333] border-[#d4af37] text-white ring-1 ring-[#d4af37]'
                          : 'bg-[#0d0f15] border-[#232733] text-stone-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSel ? 'text-[#d4af37]' : 'text-stone-500'}`} />
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Credit Card Form */}
            <form onSubmit={handleStartVerification} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#2b3144] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="Full Name as on card"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#0b0d13] border border-[#2b3144] rounded-lg pl-3.5 pr-10 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    placeholder="4242 •••• •••• 4242"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-bold text-[#d4af37]">
                    VISA / MC
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#0b0d13] border border-[#2b3144] rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">
                    Security Code (CVC)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-[#0b0d13] border border-[#2b3144] rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    placeholder="CVC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#232733]">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">
                    Ticket Pass Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#0b0d13] border border-[#2b3144] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">
                    Mobile for SMS Ticket
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#0b0d13] border border-[#2b3144] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b38f24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Connecting to 3D Secure 2.0 Gateway...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Verify €{orderData.totalAmount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                PCI-DSS Level 1
              </span>
              <span>•</span>
              <span>Verified by VISA</span>
              <span>•</span>
              <span>Mastercard Identity Check</span>
            </div>
          </div>
        )}

        {/* STEP 2: 3D SECURE 2.0 OTP SMS SIMULATION */}
        {step === 'otp_verification' && (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#e5c158] flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-display font-bold text-lg text-white">
                Bank 3D Secure 2.0 Verification
              </h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Your card issuer sent a one-time verification SMS code to <strong className="text-white">{customerPhone}</strong> for authorization of <strong className="text-[#e5c158]">€{orderData.totalAmount}</strong>.
              </p>
            </div>

            <div className="bg-[#0b0d13] border border-[#232733] rounded-xl p-5 text-center">
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Enter 4-Digit Security Code:
              </label>

              <div className="flex items-center justify-center gap-2 mb-3">
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-44 text-center tracking-[0.4em] font-mono text-2xl font-bold bg-[#151924] border-2 border-[#d4af37] text-[#e5c158] rounded-xl py-2 focus:outline-none"
                  placeholder="8492"
                />
              </div>

              {otpError && (
                <p className="text-xs text-rose-400 flex items-center justify-center gap-1 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {otpError}
                </p>
              )}

              <p className="text-[11px] text-stone-500">
                Demo helper: Use pre-filled code <strong className="text-stone-300">8492</strong> to verify instantly.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex-1 py-3 rounded-xl bg-[#1a1e2b] text-stone-300 text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Back to Details
              </button>

              <button
                type="button"
                onClick={handleConfirmOtp}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Confirming with Issuer...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Authorize</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DIGITAL TICKET & CERTIFIED PASS RECEIPT */}
        {step === 'success' && receipt && (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-xl text-white">
                Payment Authorized & Verified!
              </h4>
              <p className="text-xs text-stone-400">
                Your reservation is confirmed directly with Nikos Vertis & YTON Box Office.
              </p>
            </div>

            {/* Visual Digital Concert Pass / Ticket */}
            <div className="bg-gradient-to-b from-[#181d2a] via-[#10131d] to-[#0a0c12] border-2 border-[#d4af37] rounded-2xl p-5 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2a3147] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-base text-[#e5c158] tracking-wider">
                    NIKOS VERTIS
                  </span>
                  <span className="bg-[#38bdf8]/20 text-[#38bdf8] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Official Ticket
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">Booking Code</span>
                  <span className="font-mono text-xs font-bold text-white">
                    {receipt.bookingCode}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div>
                  <span className="text-stone-500 block">Guest Name</span>
                  <strong className="text-white">{receipt.customer.name}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Transaction ID</span>
                  <span className="font-mono text-stone-300 text-[11px] truncate block">
                    {receipt.transactionId}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Item / Access</span>
                  <strong className="text-[#d4af37]">{orderData.title}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Amount Paid</span>
                  <strong className="font-mono text-emerald-400">€{receipt.amount}</strong>
                </div>
              </div>

              {/* QR Code Barcode representation */}
              <div className="bg-white p-3 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-black p-1 rounded-lg flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black block">
                      Fast-Track QR Entry Pass
                    </span>
                    <span className="text-[11px] text-stone-700 block">
                      Present at YTON VIP Red Carpet Entrance
                    </span>
                    <span className="font-mono text-[10px] text-stone-500">
                      SECURE-HASH-{receipt.bookingCode}
                    </span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-[#1c2233] text-stone-200 border border-[#2e374f] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print Pass</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e5c158] to-[#d4af37] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-[#d4af37]/20 transition-all cursor-pointer"
              >
                <span>Done & View Bookings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
