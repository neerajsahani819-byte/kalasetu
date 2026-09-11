import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Mic,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  IndianRupee,
} from 'lucide-react';
import { CraftProduct, AuthUser, MarketplaceOrder } from '../types';
import { createOrderInFirestore } from '../services/firestoreService';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CraftProduct | null;
  mode?: 'buy' | 'support';
  currentUser?: AuthUser | null;
  language?: string;
  onViewOrders?: () => void;
  onBackToMarketplace?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  mode = 'buy',
  currentUser = null,
  onViewOrders,
  onBackToMarketplace,
}) => {
  const { language, t } = useLanguage();
  const speechLang = getSpeechLangCode(language);

  // Flow states: 'idle' | 'processing' | 'success'
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [confirmedOrder, setConfirmedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Support donation amount states
  const [selectedPreset, setSelectedPreset] = useState<number>(500);
  const [customAmountStr, setCustomAmountStr] = useState<string>('500');
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentState('idle');
      setConfirmedOrder(null);
      setCopiedOrderId(false);
      if (mode === 'support') {
        setSelectedPreset(500);
        setCustomAmountStr('500');
      }
    }
  }, [isOpen, mode]);

  if (!isOpen || !product) return null;

  const currentAmount =
    mode === 'support'
      ? Math.max(10, parseInt(customAmountStr, 10) || 100)
      : product.suggestedPrice || 850;

  const handleKeypadPress = (key: string) => {
    if (key === 'clear') {
      setCustomAmountStr('');
      setSelectedPreset(0);
      return;
    }
    if (key === 'backspace') {
      setCustomAmountStr((prev) => prev.slice(0, -1));
      setSelectedPreset(0);
      return;
    }
    setCustomAmountStr((prev) => {
      if (prev === '0' || prev === '500' && selectedPreset === 500) {
        return key;
      }
      if (prev.length >= 6) return prev;
      return prev + key;
    });
    setSelectedPreset(0);
  };

  const handleSelectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmountStr(amount.toString());
    speakAloud(`₹${amount}`, { lang: speechLang });
  };

  const handleVoiceAmountInput = () => {
    setIsVoiceInputActive(true);
    speakAloud('Please state contribution amount like 500 or 1000', {
      lang: speechLang,
      onEnd: () => {
        // Mock voice recognition for demo
        setTimeout(() => {
          setIsVoiceInputActive(false);
          setCustomAmountStr('1000');
          setSelectedPreset(1000);
          speakAloud('₹1,000 entered', { lang: speechLang });
        }, 1500);
      },
    });
  };

  const handlePay = async () => {
    setPaymentState('processing');

    // Generate unique order ID
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const orderPayload = {
      orderId,
      buyerId: currentUser?.id || 'guest-buyer',
      buyerName: currentUser?.name || 'Art Patron',
      artisanId: product.artisanId || 'user-parvati',
      artisanName: product.artisanName || 'Parvati Devi',
      productId: product.id,
      productTitle:
        mode === 'support'
          ? `Support Fund: ${product.title}`
          : product.title,
      productImageUrl: product.images?.[0] || '',
      amount: currentAmount,
      status: 'paid' as const,
      createdAt: new Date().toISOString(),
      paymentMethod: 'demo' as const,
      orderType: (mode === 'support' ? 'support' : 'purchase') as 'purchase' | 'support',
      deliveryEstimate: mode === 'buy' ? '3-5 business days • Free Delivery' : 'Instant Direct Transfer',
    };

    setTimeout(async () => {
      try {
        const created = await createOrderInFirestore(orderPayload);
        setConfirmedOrder(created);
        setPaymentState('success');

        const announceMsg =
          mode === 'support'
            ? `${t('screens.checkout.successTitle')} Order ID ${orderId}`
            : `${t('screens.checkout.successTitle')} Order ID ${orderId}`;
        speakAloud(announceMsg, { lang: speechLang });
      } catch (err) {
        console.error('[Payment] Error writing order to Firestore:', err);
        setConfirmedOrder(orderPayload as MarketplaceOrder);
        setPaymentState('success');
      }
    }, 2000);
  };

  const handleCopyOrderId = () => {
    if (confirmedOrder) {
      navigator.clipboard.writeText(confirmedOrder.orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && paymentState !== 'processing') {
          onClose();
        }
      }}
    >
      <div
        id="checkout-modal-dialog"
        className="bg-[#FAF6F0] w-full max-w-md rounded-3xl border border-[#E3D5C5] shadow-2xl overflow-hidden my-auto animate-scale-in flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white border-b border-[#E3D5C5] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                mode === 'support' ? 'bg-[#bceecf] text-[#2D5A43]' : 'bg-[#F5DDD6] text-[#9C3D25]'
              }`}
            >
              {mode === 'support' ? (
                <Heart className="w-4 h-4 fill-current" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#201A18]">
                {mode === 'support'
                  ? t('screens.checkout.supportTitle')
                  : t('screens.checkout.title')}
              </h2>
              <div className="text-[10px] text-[#5E534D]">
                {t('common.directFairTrade')}
              </div>
            </div>
          </div>

          {paymentState !== 'processing' && (
            <button
              id="btn-close-checkout"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF6F0] hover:bg-[#ebdccf] text-[#5E534D] flex items-center justify-center transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* STATE 1: IDLE / FORM */}
          {paymentState === 'idle' && (
            <>
              {/* Product Summary Card */}
              <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3 flex items-start gap-3 shadow-2xs">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F4EBE1] flex-shrink-0 border border-[#E3D5C5]">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-sm text-[#201A18] line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="text-xs text-[#5E534D] line-clamp-1">
                    {product.titleEnglish || product.category}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#201A18] font-medium">
                    <span className="text-[#5E534D]">{t('screens.orders.artisanLabel')}</span>
                    <span className="font-bold text-[#9C3D25]">{product.artisanName || 'Parvati Devi'}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#2D5A43] flex-shrink-0" />
                  </div>

                  {mode === 'buy' && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#F4EBE1] mt-1.5">
                      <span className="text-xs text-[#5E534D]">{t('screens.checkout.price')}:</span>
                      <span className="font-display font-bold text-base text-[#9C3D25]">
                        ₹{product.suggestedPrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Estimate */}
              {mode === 'buy' && (
                <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A43]">
                    <Truck className="w-4 h-4" />
                    <span>{t('screens.orders.deliveryEstimate')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#201A18]">
                    <span className="font-medium text-[#5E534D]">{t('screens.checkout.shipping')}:</span>
                    <span className="font-bold bg-[#E2ECE6] text-[#2D5A43] px-2 py-0.5 rounded-md">
                      {t('common.freeShipping')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5E534D] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
                    <span>{t('common.directFairTrade')}</span>
                  </div>
                </div>
              )}

              {/* Donation Support Flow */}
              {mode === 'support' && (
                <div className="space-y-3">
                  <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#201A18]">
                        {t('screens.checkout.supportTitle')}
                      </label>
                      <button
                        id="btn-voice-amount-input"
                        type="button"
                        onClick={handleVoiceAmountInput}
                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border transition-all ${
                          isVoiceInputActive
                            ? 'bg-[#9C3D25] text-white border-[#9C3D25] animate-pulse'
                            : 'bg-[#FAF6F0] text-[#9C3D25] border-[#E3D5C5] hover:bg-[#F5DDD6]'
                        }`}
                        title={t('common.listen')}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{t('common.listen')}</span>
                      </button>
                    </div>

                    {/* Preset Buttons (₹100, ₹500, ₹1000) */}
                    <div className="grid grid-cols-3 gap-2">
                      {[100, 500, 1000].map((amt) => {
                        const isSelected = selectedPreset === amt && customAmountStr === amt.toString();
                        return (
                          <button
                            key={amt}
                            id={`btn-preset-${amt}`}
                            type="button"
                            onClick={() => handleSelectPreset(amt)}
                            className={`h-11 rounded-xl font-display font-bold text-sm transition-all border ${
                              isSelected
                                ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                                : 'bg-[#FAF6F0] text-[#201A18] border-[#E3D5C5] hover:border-[#2D5A43]'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Large Amount Display */}
                    <div className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-xl p-2.5 text-center">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#5E534D]">
                        {t('screens.checkout.total')} (INR)
                      </div>
                      <div className="font-display font-extrabold text-2xl text-[#2D5A43] flex items-center justify-center gap-0.5 mt-0.5">
                        <IndianRupee className="w-5 h-5 stroke-[2.5]" />
                        <span>{customAmountStr || '0'}</span>
                      </div>
                    </div>

                    {/* Large Number Pad */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace'].map((key) => {
                        if (key === 'clear') {
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleKeypadPress('clear')}
                              className="h-10 bg-[#FAF6F0] hover:bg-[#ebdccf] text-xs font-bold text-[#ba1a1a] rounded-xl border border-[#E3D5C5]"
                            >
                              Clear
                            </button>
                          );
                        }
                        if (key === 'backspace') {
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleKeypadPress('backspace')}
                              className="h-10 bg-[#FAF6F0] hover:bg-[#ebdccf] text-xs font-bold text-[#5E534D] rounded-xl border border-[#E3D5C5]"
                            >
                              ⌫
                            </button>
                          );
                        }
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleKeypadPress(key)}
                            className="h-10 bg-white hover:bg-[#FAF6F0] font-display font-bold text-sm text-[#201A18] rounded-xl border border-[#E3D5C5] shadow-2xs active:scale-95 transition-transform"
                          >
                            {key}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5E534D]">
                  <span>{t('screens.checkout.price')}:</span>
                  <span className="font-semibold text-[#201A18]">₹{currentAmount}</span>
                </div>
                <div className="flex items-center justify-between text-[#5E534D]">
                  <span>{t('screens.checkout.shipping')}:</span>
                  <span className="font-semibold text-[#2D5A43]">{t('common.freeShipping')}</span>
                </div>
                <div className="flex items-center justify-between text-[#5E534D]">
                  <span>{t('screens.checkout.platformFee')}:</span>
                  <span className="font-semibold text-[#2D5A43]">₹0 (0%)</span>
                </div>
                <div className="border-t border-[#E3D5C5] pt-2 flex items-center justify-between font-bold text-sm text-[#201A18]">
                  <span>{t('screens.checkout.total')}:</span>
                  <span className="font-display text-base text-[#9C3D25]">₹{currentAmount}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                id="btn-confirm-checkout-pay"
                onClick={handlePay}
                disabled={currentAmount <= 0}
                className="w-full h-12 bg-[#9C3D25] hover:bg-[#802913] active:scale-98 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm">{t('screens.checkout.demoPaymentBtn', { amount: currentAmount })}</span>
              </button>
            </>
          )}

          {/* STATE 2: PROCESSING */}
          {paymentState === 'processing' && (
            <div className="py-12 px-4 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#F5DDD6] text-[#9C3D25] flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#201A18]">
                  {t('common.loading')}
                </h3>
                <p className="text-xs text-[#5E534D] mt-1">
                  Processing ₹{currentAmount}...
                </p>
                <p className="text-[11px] text-[#2D5A43] font-semibold mt-1">
                  {t('common.directFairTrade')}
                </p>
              </div>
            </div>
          )}

          {/* STATE 3: SUCCESS */}
          {paymentState === 'success' && confirmedOrder && (
            <div className="py-4 space-y-4 animate-scale-in text-center">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-[#bceecf] text-[#2D5A43] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-[#2D5A43]">
                  {t('screens.checkout.successTitle')} ✓
                </h3>
                <p className="text-xs text-[#5E534D] mt-1">
                  {t('screens.checkout.successMsg', { amount: confirmedOrder.amount, artisan: product.artisanName || 'Artisan' })}
                </p>
              </div>

              {/* Order ID Box */}
              <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3 space-y-2 text-left shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5E534D]">Order ID:</span>
                  <button
                    id="btn-copy-order-id"
                    onClick={handleCopyOrderId}
                    className="flex items-center gap-1 text-[11px] text-[#9C3D25] font-bold hover:underline"
                  >
                    {copiedOrderId ? (
                      <>
                        <Check className="w-3 h-3 text-[#2D5A43]" />
                        <span className="text-[#2D5A43]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono font-bold text-sm text-[#201A18] bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#E3D5C5]">
                  {confirmedOrder.orderId}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F4EBE1] text-xs">
                  <div>
                    <span className="text-[#5E534D]">{t('screens.checkout.price')}:</span>{' '}
                    <span className="font-bold text-[#9C3D25]">₹{confirmedOrder.amount}</span>
                  </div>
                  <div>
                    <span className="text-[#5E534D]">Status:</span>{' '}
                    <span className="font-bold text-[#2D5A43]">{t('screens.orders.statusPaid')} ✓</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#2D5A43] bg-[#E2ECE6] p-2 rounded-xl flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t('common.directFairTrade')} 🎉</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  id="btn-checkout-view-order"
                  onClick={() => {
                    onClose();
                    onViewOrders?.();
                  }}
                  className="h-11 bg-[#2D5A43] hover:bg-[#1E3F2F] active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{t('screens.checkout.viewOrders')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-checkout-back-marketplace"
                  onClick={() => {
                    onClose();
                    onBackToMarketplace?.();
                  }}
                  className="h-11 bg-white hover:bg-[#FAF6F0] active:scale-95 text-[#201A18] border border-[#E3D5C5] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{t('screens.checkout.continueShopping')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory Disclaimer */}
        <div className="bg-[#FAF6F0] border-t border-[#E3D5C5] px-4 py-2.5 text-center flex-shrink-0">
          <p className="text-[11px] font-semibold text-[#5E534D] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
            <span>Demo mode — 100% fair trade simulation</span>
          </p>
        </div>
      </div>
    </div>
  );
};
