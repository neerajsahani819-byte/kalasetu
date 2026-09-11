import React, { useState, useEffect } from 'react';
import { X, Send, Volume2, Mic, CheckCircle2, Phone, Loader2 } from 'lucide-react';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { subscribeToMessages, sendMessageToFirestore } from '../services/firestoreService';
import { FirestoreMessage, AuthUser } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisanName: string;
  productTitle: string;
  language?: string;
  currentUser?: AuthUser | null;
  artisanId?: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  artisanName,
  productTitle,
  currentUser,
  artisanId = 'user-parvati',
}) => {
  const { language, t } = useLanguage();
  const speechLang = getSpeechLangCode(language);

  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingMessages(true);
    const unsubscribe = subscribeToMessages(
      (loaded) => {
        // Filter messages for this product or general conversation
        const relevant = loaded.filter(
          (m) => !m.productTitle || m.productTitle === productTitle || m.senderName === artisanName
        );
        if (relevant.length > 0) {
          setMessages(relevant);
        } else {
          // Default initial welcoming message
          setMessages([
            {
              id: 'initial-welcome',
              senderId: artisanId,
              recipientId: currentUser?.id || 'buyer-guest',
              text: `Namaste! I am ${artisanName}. Do you have any questions about '${productTitle}'?`,
              timestamp: new Date().toISOString(),
              senderName: artisanName,
              senderRole: 'artisan',
              productTitle,
              time: '10:14 AM',
            },
          ]);
        }
        setIsLoadingMessages(false);
      },
      (loading) => {
        setIsLoadingMessages(loading);
      }
    );

    return () => unsubscribe();
  }, [isOpen, artisanName, productTitle, artisanId, currentUser?.id]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;
    const userMsg = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      await sendMessageToFirestore({
        senderId: currentUser?.id || 'buyer-guest',
        recipientId: artisanId,
        text: userMsg,
        senderName: currentUser?.name || 'Buyer',
        senderRole: 'buyer',
        productTitle,
      });

      // Artisan friendly instant reply saved to Firestore
      setTimeout(async () => {
        const replies = [
          'Yes, this is 100% authentic handcraft and will be packed carefully for dispatch.',
          'Thank you! We will securely pack and dispatch this within 2 days.',
          'Certainly! All materials used are completely authentic and traditional.',
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        await sendMessageToFirestore({
          senderId: artisanId,
          recipientId: currentUser?.id || 'buyer-guest',
          text: reply,
          senderName: artisanName,
          senderRole: 'artisan',
          productTitle,
        });
        speakAloud(`${artisanName}: ${reply}`, { lang: speechLang });
      }, 1200);
    } catch (err) {
      console.warn('Failed to send message to Firestore:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF6F0] rounded-t-3xl sm:rounded-3xl border border-[#E3D5C5] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E3D5C5] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#9C3D25] text-white flex items-center justify-center font-bold text-sm">
              {artisanName[0]}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#201A18] flex items-center gap-1">
                <span>{artisanName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
              </div>
              <div className="text-[11px] text-[#2D5A43] font-medium">
                {t('common.directFairTrade')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="tel:1800000123"
              className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#9C3D25] flex items-center justify-center"
              title={t('screens.profile.directCall')}
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#ebdccf] text-[#201A18] flex items-center justify-center"
              aria-label={t('common.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-[#bceecf] text-[#002112] text-[11px] font-medium p-2 rounded-xl text-center flex items-center justify-center gap-1.5">
            <span>🔒 {t('common.directFairTrade')}</span>
            <span className="text-[9px] bg-[#004d2c] text-white px-1.5 py-0.5 rounded-full font-bold">Direct</span>
          </div>

          {isLoadingMessages && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-xs text-[#8A726C] gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#9C3D25]" />
              <span>{t('common.loading')}</span>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isBuyer = msg.senderRole === 'buyer' || msg.senderId === (currentUser?.id || 'buyer-guest');
              const displayTime = msg.time || (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

              return (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      isBuyer
                        ? 'bg-[#2D5A43] text-white rounded-tr-none'
                        : 'bg-white text-[#201A18] border border-[#E3D5C5] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#8A726C] mt-1 px-1">
                    <span>{displayTime}</span>
                    {!isBuyer && (
                      <button
                        onClick={() => speakAloud(msg.text, { lang: speechLang })}
                        className="text-[#9C3D25] hover:underline"
                        title={t('common.listen')}
                      >
                        <Volume2 className="w-3 h-3 inline" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-[#E3D5C5] p-3 flex items-center gap-2">
          <button
            onClick={() => {
              speakAloud(t('screens.chat.placeholder'), { lang: speechLang });
              setInputText('Hello! Can this item be dispatched today?');
            }}
            className="w-10 h-10 rounded-full bg-[#FAF6F0] text-[#9C3D25] flex items-center justify-center flex-shrink-0"
            title={t('common.listen')}
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('screens.chat.placeholder')}
            className="flex-1 bg-[#FAF6F0] text-xs text-[#201A18] placeholder-[#8A726C] px-3 py-2.5 rounded-xl border border-[#E3D5C5] focus:outline-none focus:border-[#9C3D25]"
          />

          <button
            onClick={handleSendMessage}
            disabled={isSending}
            className="w-10 h-10 rounded-full bg-[#9C3D25] hover:bg-[#802913] disabled:opacity-50 text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
