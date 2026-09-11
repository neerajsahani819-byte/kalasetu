import React from 'react';
import { Store, Plus, ShoppingBag, User, WifiOff, Wifi, ArrowLeftRight } from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export type ScreenTab =
  | 'onboarding'
  | 'my-shop'
  | 'add-product'
  | 'ai-preview'
  | 'marketplace'
  | 'artisan-profile';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  language?: string;
  userRole: UserRole;
  onToggleRole: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isOffline,
  onToggleOffline,
  userRole,
  onToggleRole,
}) => {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E3D5C5] px-2 py-1.5 shadow-lg"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Tab 1: My Shop */}
        <button
          id="nav-tab-my-shop"
          onClick={() => onSelectTab('my-shop')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'my-shop'
              ? 'text-[#9C3D25] font-bold'
              : 'text-[#5E534D] hover:text-[#201A18]'
          }`}
        >
          <Store className={`w-5 h-5 ${currentTab === 'my-shop' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">{t('screens.myShop.title')}</span>
        </button>

        {/* Tab 2: Marketplace */}
        <button
          id="nav-tab-marketplace"
          onClick={() => onSelectTab('marketplace')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'marketplace'
              ? 'text-[#9C3D25] font-bold'
              : 'text-[#5E534D] hover:text-[#201A18]'
          }`}
        >
          <ShoppingBag
            className={`w-5 h-5 ${currentTab === 'marketplace' ? 'stroke-[2.5]' : ''}`}
          />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">{t('screens.marketplace.title')}</span>
        </button>

        {/* Center Primary Action: Add Product (in Artisan mode) or Role Switch (in Buyer mode) */}
        <div className="flex-1 flex justify-center -mt-5">
          {userRole === 'artisan' ? (
            <button
              id="nav-tab-add-product-center"
              onClick={() => onSelectTab('add-product')}
              className={`w-13 h-13 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                currentTab === 'add-product' || currentTab === 'ai-preview'
                  ? 'bg-[#9C3D25] ring-4 ring-[#E5A93C]'
                  : 'bg-[#2D5A43] hover:bg-[#1E3F2F]'
              }`}
              title={t('screens.addProduct.title')}
              aria-label={t('screens.addProduct.title')}
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          ) : (
            <button
              id="nav-tab-switch-center"
              onClick={onToggleRole}
              className="w-13 h-13 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform active:scale-95 bg-[#9C3D25] hover:bg-[#802913]"
              title={t('common.switch')}
              aria-label={t('common.switch')}
            >
              <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Tab 4: Profile */}
        <button
          id="nav-tab-artisan-profile"
          onClick={() => onSelectTab('artisan-profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'artisan-profile'
              ? 'text-[#9C3D25] font-bold'
              : 'text-[#5E534D] hover:text-[#201A18]'
          }`}
        >
          <User
            className={`w-5 h-5 ${currentTab === 'artisan-profile' ? 'stroke-[2.5]' : ''}`}
          />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">{t('screens.profile.title')}</span>
        </button>

        {/* Tab 5: Role / Offline Switch */}
        <button
          id="nav-tab-offline-toggle"
          onClick={onToggleOffline}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isOffline ? 'text-[#ba1a1a] font-bold' : 'text-[#5E534D]'
          }`}
          title={isOffline ? t('common.online') : t('common.offline')}
          aria-label={isOffline ? t('common.online') : t('common.offline')}
        >
          {isOffline ? (
            <WifiOff className="w-5 h-5 text-[#ba1a1a] animate-pulse" />
          ) : (
            <Wifi className="w-5 h-5 text-[#2D5A43]" />
          )}
          <span className="text-[10px] mt-0.5 whitespace-nowrap">
            {isOffline ? t('common.offline') : t('common.online')}
          </span>
        </button>
      </div>
    </nav>
  );
};
