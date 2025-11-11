/**
 * Station Amenities & Chat Component (TypeScript)
 */

import React, { useState } from 'react';
import { MapPin, ArrowLeft, Wifi, Coffee, ShoppingBag, Bath, SendHorizontal, LucideIcon } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface AmenityProps {
  icon: LucideIcon;
  label: string;
}

function Amenity({ icon: Icon, label }: AmenityProps): React.ReactElement {
  return (
    <div className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-[12px] flex items-center gap-2">
      <Icon className="h-4 w-4 text-slate-700" />
      <span>{label}</span>
    </div>
  );
}

interface BubbleProps {
  me?: boolean;
  text: string;
}

function Bubble({ me = false, text }: BubbleProps): React.ReactElement {
  return (
    <div className={me ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={me ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'}
        style={{ maxWidth: '78%', borderRadius: 16, padding: '8px 12px' }}
      >
        <span className="text-[13px] leading-5">{text}</span>
      </div>
    </div>
  );
}

interface Message {
  me: boolean;
  text: string;
}

interface AmenitiesListProps {
  amenities?: string[];
  initialMessages?: Message[];
  onBack?: () => void;
  onSendMessage?: (text: string) => void;
}

export function AmenitiesList({
  amenities = ['Cafe', 'Wi‑Fi', 'Shops', 'Restrooms'],
  initialMessages = [
    { me: false, text: 'Hello, is the CCS2 60kW connector free right now?' },
    { me: true, text: "I'm on the way, will arrive in 10 mins." },
  ],
  onBack,
  onSendMessage,
}: AmenitiesListProps): React.ReactElement {
  const [msg, setMsg] = useState('');
  const [items, setItems] = useState<Message[]>(initialMessages);

  const amenityIcons: Record<string, LucideIcon> = {
    Cafe: Coffee,
    'Wi‑Fi': Wifi,
    Wifi: Wifi,
    Shops: ShoppingBag,
    Restrooms: Bath,
    Bath: Bath,
  };

  function send(): void {
    if (!msg.trim()) return;
    const newMessage = { me: true, text: msg.trim() };
    setItems((p) => [...p, newMessage]);
    onSendMessage?.(msg.trim());
    setMsg('');
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center gap-2 text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Amenities & Chat</span>
        </div>
      </div>

      {/* Segmented header */}
      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1 text-[12px]">
          <button className="h-9 rounded-lg text-slate-600">Overview</button>
          <button className="h-9 rounded-lg text-slate-600">Chargers</button>
          <button className="h-9 rounded-lg bg-white shadow font-semibold">Amenities/Chat</button>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-4 pb-28">
        {/* Amenities */}
        <div>
          <div className="text-[12px] text-slate-500 mb-2">Nearby amenities</div>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, i) => {
              const Icon = amenityIcons[amenity] || Coffee;
              return <Amenity key={i} icon={Icon} label={amenity} />;
            })}
          </div>
        </div>

        {/* Chat */}
        <div className="mt-5">
          <div className="text-[12px] text-slate-500 mb-2">Chat with station support / community</div>
          <div className="space-y-2">
            {items.map((m, i) => (
              <Bubble key={i} me={m.me} text={m.text} />
            ))}
          </div>
        </div>
      </main>

      {/* Input dock */}
      <div className="fixed inset-x-0" style={{ bottom: 0 }}>
        <div className="max-w-md mx-auto px-4 pb-3">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message"
              className="flex-1 h-10 px-3 text-[13px] rounded-lg outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  send();
                }
              }}
            />
            <button
              onClick={send}
              className="h-10 px-3 rounded-lg text-white text-[12px] font-medium"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

