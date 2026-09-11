import React, { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle2,
  Truck,
  Heart,
  ShoppingBag,
  Volume2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { MarketplaceOrder, UserRole, AuthUser } from '../types';
import { subscribeToOrders } from '../services/firestoreService';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface OrdersTabProps {
  currentRole: UserRole;
  currentUser?: AuthUser | null;
  artisanId?: string;
  language?: string;
  onBrowseMarketplace?: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  currentRole,
  currentUser = null,
  artisanId,
  onBrowseMarketplace,
}) => {
  const { language, t } = useLanguage();
  const speechLang = getSpeechLangCode(language);

  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'buyer' | 'artisan'>(
    currentRole === 'buyer' ? 'buyer' : 'artisan'
  );
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'purchase' | 'support'>('all');

  useEffect(() => {
    setActiveSubTab(currentRole === 'buyer' ? 'buyer' : 'artisan');
  }, [currentRole]);

  useEffect(() => {
    const unsub = subscribeToOrders(
      (loadedOrders) => {
        setOrders(loadedOrders);
        setIsLoading(false);
      },
      (loading) => {
        setIsLoading(loading);
      }
    );

    return () => unsub();
  }, []);

  // Filter orders based on active view and type filter
  const displayedOrders = orders.filter((ord) => {
    // Type filter
    if (selectedFilter === 'purchase' && ord.orderType === 'support') return false;
    if (selectedFilter === 'support' && ord.orderType !== 'support') return false;

    if (activeSubTab === 'buyer') {
      // For Buyer: Purchases made by this user or guest orders
      if (currentUser?.id) {
        return ord.buyerId === currentUser.id || ord.buyerId === 'guest-buyer' || ord.buyerId.startsWith('user-');
      }
      return true;
    } else {
      // For Artisan: Incoming orders addressed to this artisan or all artisan orders in demo
      if (artisanId) {
        return ord.artisanId === artisanId || ord.artisanId === 'user-parvati';
      }
      return true;
    }
  });

  const handleListenOrder = (ord: MarketplaceOrder) => {
    const text =
      ord.orderType === 'support'
        ? `${t('screens.orders.supportTab')}: ₹${ord.amount}. ${t('screens.orders.statusPaid')}. ${t('screens.orders.artisanLabel')} ${ord.artisanName}.`
        : `${t('screens.orders.title')}: ${ord.productTitle}. ₹${ord.amount}. ${t('screens.orders.statusPaid')}. ${t('screens.orders.deliveryEstimate')}.`;
    speakAloud(text, { lang: speechLang });
  };

  return (
    <div className="space-y-4">
      {/* Top View Selector Pill */}
      <div className="bg-[#FAF6F0] border border-[#E3D5C5] p-1 rounded-2xl flex items-center gap-1 shadow-2xs">
        <button
          id="tab-orders-buyer-view"
          type="button"
          onClick={() => setActiveSubTab('buyer')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'buyer'
              ? 'bg-white text-[#9C3D25] shadow-xs border border-[#E3D5C5]'
              : 'text-[#5E534D] hover:text-[#201A18]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('screens.orders.myPurchases')}</span>
        </button>

        <button
          id="tab-orders-artisan-view"
          type="button"
          onClick={() => setActiveSubTab('artisan')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'artisan'
              ? 'bg-white text-[#2D5A43] shadow-xs border border-[#E3D5C5]'
              : 'text-[#5E534D] hover:text-[#201A18]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{t('screens.orders.incomingOrders')}</span>
        </button>
      </div>

      {/* Subheader with Filter & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#201A18]">
            {activeSubTab === 'buyer' ? t('screens.orders.myPurchases') : t('screens.orders.incomingOrders')}
          </span>
          {isLoading && (
            <span className="flex items-center gap-1 text-[10px] text-[#9C3D25] bg-[#FDF1EC] px-2 py-0.5 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{t('common.loading')}</span>
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-2 py-0.5 rounded-lg font-medium text-[11px] transition-colors ${
              selectedFilter === 'all'
                ? 'bg-[#201A18] text-white'
                : 'bg-white text-[#5E534D] border border-[#E3D5C5]'
            }`}
          >
            {t('common.all')} ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('purchase')}
            className={`px-2 py-0.5 rounded-lg font-medium text-[11px] transition-colors ${
              selectedFilter === 'purchase'
                ? 'bg-[#9C3D25] text-white'
                : 'bg-white text-[#5E534D] border border-[#E3D5C5]'
            }`}
          >
            {t('screens.orders.purchasesTab')}
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('support')}
            className={`px-2 py-0.5 rounded-lg font-medium text-[11px] transition-colors ${
              selectedFilter === 'support'
                ? 'bg-[#2D5A43] text-white'
                : 'bg-white text-[#5E534D] border border-[#E3D5C5]'
            }`}
          >
            {t('screens.orders.supportTab')}
          </button>
        </div>
      </div>

      {/* Orders List Container */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white border border-[#E3D5C5] rounded-3xl p-6 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#8A726C] flex items-center justify-center mx-auto">
            {activeSubTab === 'buyer' ? (
              <ShoppingBag className="w-6 h-6" />
            ) : (
              <Package className="w-6 h-6" />
            )}
          </div>
          <h3 className="font-display font-bold text-sm text-[#201A18]">
            {activeSubTab === 'buyer'
              ? t('screens.orders.emptyPurchases')
              : t('screens.orders.emptyOrders')}
          </h3>
          <p className="text-xs text-[#5E534D] max-w-xs mx-auto">
            {activeSubTab === 'buyer'
              ? t('screens.orders.emptyPurchasesSub')
              : t('screens.orders.emptyOrdersSub')}
          </p>
          {onBrowseMarketplace && (
            <button
              type="button"
              onClick={onBrowseMarketplace}
              className="mt-2 inline-flex items-center gap-1.5 bg-[#9C3D25] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-[#802913] transition-colors"
            >
              <span>{t('screens.orders.browseBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedOrders.map((ord) => {
            const isSupport = ord.orderType === 'support';
            return (
              <div
                key={ord.orderId}
                id={`order-card-${ord.orderId}`}
                className="bg-white border border-[#E3D5C5] rounded-2xl p-3.5 space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Card Header: Order ID & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-[#F4EBE1] pb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#201A18] truncate">
                      #{ord.orderId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isSupport
                          ? 'bg-[#E2ECE6] text-[#2D5A43] border border-[#2D5A43]/20'
                          : 'bg-[#FDF1EC] text-[#9C3D25] border border-[#9C3D25]/20'
                      }`}
                    >
                      {isSupport ? (
                        <>
                          <Heart className="w-2.5 h-2.5 fill-current" />
                          <span>{t('screens.orders.supportTab')}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-2.5 h-2.5" />
                          <span>{t('screens.orders.purchasesTab')}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="bg-[#bceecf] text-[#002112] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#2D5A43]" />
                      <span>{t('screens.orders.statusPaid')} ✓</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleListenOrder(ord)}
                      className="w-6 h-6 rounded-full bg-[#FAF6F0] hover:bg-[#ebdccf] text-[#9C3D25] flex items-center justify-center transition-colors"
                      title={t('common.listen')}
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card Body: Product Info & Price */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF6F0] flex-shrink-0 border border-[#E3D5C5]">
                    <img
                      src={ord.productImageUrl || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80'}
                      alt={ord.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs text-[#201A18] line-clamp-1">
                      {ord.productTitle}
                    </h4>
                    <div className="text-[11px] text-[#5E534D] pt-0.5">
                      {activeSubTab === 'buyer' ? (
                        <span>{t('screens.orders.artisanLabel')} <strong className="text-[#9C3D25]">{ord.artisanName}</strong></span>
                      ) : (
                        <span>{t('screens.orders.buyerLabel')} <strong className="text-[#201A18]">{ord.buyerName || t('common.buyer')}</strong></span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#8A726C] pt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-extrabold text-base text-[#9C3D25]">
                      ₹{ord.amount}
                    </div>
                    <div className="text-[10px] text-[#2D5A43] font-semibold">
                      Direct Transfer
                    </div>
                  </div>
                </div>

                {/* Tracking & Fair Trade Note */}
                <div className="bg-[#FAF6F0] rounded-xl p-2 flex items-center justify-between text-[11px] text-[#5E534D]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#2D5A43]" />
                    <span>{ord.deliveryEstimate || t('screens.orders.deliveryEstimate')}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#2D5A43]">
                    {t('common.directFairTrade')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
