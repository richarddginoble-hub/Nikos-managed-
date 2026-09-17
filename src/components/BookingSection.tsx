import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Check, 
  CreditCard,
  Wine,
  Camera,
  Info,
  ChevronRight,
  Flame
} from 'lucide-react';
import { VENUES_DATA, TABLE_CATEGORIES, BOOKING_ADDONS } from '../data/vertisData';
import { EventVenue, TableCategory, BookingAddon, SeatMapTable } from '../types';
import { InteractiveSeatMap } from './InteractiveSeatMap';

interface BookingSectionProps {
  onStartCheckout: (orderData: {
    itemType: 'table_booking';
    venue: EventVenue;
    date: string;
    table: TableCategory;
    guests: number;
    addons: { addon: BookingAddon; count: number }[];
    total: number;
    specificTable?: {
      id: string;
      distanceMeters: number;
      sightline: string;
    };
  }) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onStartCheckout }) => {
  const [selectedVenue, setSelectedVenue] = useState<EventVenue>(VENUES_DATA[0]);
  const [selectedDate, setSelectedDate] = useState<string>(VENUES_DATA[0].dates[0]);
  const [selectedTable, setSelectedTable] = useState<TableCategory>(TABLE_CATEGORIES[0]);
  const [selectedTableId, setSelectedTableId] = useState<string>('VIP-03');
  const [selectedTableDetails, setSelectedTableDetails] = useState<SeatMapTable | null>(null);
  const [guestCount, setGuestCount] = useState<number>(4);
  const [addonCounts, setAddonCounts] = useState<Record<string, number>>({
    'addon-garifalla-deluxe': 1, // Traditional Greek flower tray preset
    'addon-garifalla-tower': 0,
    'addon-dom-perignon': 0,
    'addon-backstage-photo': 0
  });

  const handleVenueChange = (venue: EventVenue) => {
    setSelectedVenue(venue);
    setSelectedDate(venue.dates[0]);
  };

  const handleSelectSeatTable = (tableId: string, table: SeatMapTable) => {
    setSelectedTableId(tableId);
    setSelectedTableDetails(table);

    // Map table zone to category
    const matchingCat = TABLE_CATEGORIES.find(c => c.id === table.zoneId) || TABLE_CATEGORIES[0];
    setSelectedTable(matchingCat);
  };

  const updateAddon = (id: string, delta: number) => {
    setAddonCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculate total
  const baseTablePrice = Math.max(selectedTable.minSpend, selectedTable.pricePerPerson * guestCount);
  const addonsTotal = BOOKING_ADDONS.reduce((sum, addon) => {
    const count = addonCounts[addon.id] || 0;
    return sum + count * addon.price;
  }, 0);
  const grandTotal = baseTablePrice + addonsTotal;

  const handleBookNow = () => {
    const selectedAddonsList = BOOKING_ADDONS.filter(
      (a) => (addonCounts[a.id] || 0) > 0
    ).map((a) => ({
      addon: a,
      count: addonCounts[a.id]
    }));

    onStartCheckout({
      itemType: 'table_booking',
      venue: selectedVenue,
      date: selectedDate,
      table: selectedTable,
      guests: guestCount,
      addons: selectedAddonsList,
      total: grandTotal,
      specificTable: selectedTableDetails ? {
        id: selectedTableDetails.id,
        distanceMeters: selectedTableDetails.distanceFromStageMeters,
        sightline: selectedTableDetails.sightlineDescription
      } : {
        id: selectedTableId,
        distanceMeters: 2.6,
        sightline: 'Center VIP Front Stage View'
      }
    });
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#232733] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#e5c158] text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            Official Residency & Tour Box Office
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Event Bookings & VIP Tables
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Book certified front-stage tables at <strong className="text-stone-200">YTON The Music Show (Athens)</strong> and global tour concerts. Includes authentic flower throwing trays (Garifalla), premium bottle service, and guaranteed instant digital QR passes.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#131722] border border-[#2e3447] px-4 py-2 rounded-xl text-xs text-stone-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official YTON Ticket & Table Guarantee</span>
        </div>
      </div>

      {/* 1. Venue Selection Tabs */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">
          1. Select Venue / City
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VENUES_DATA.map((venue) => {
            const isSelected = selectedVenue.id === venue.id;
            return (
              <div
                key={venue.id}
                onClick={() => handleVenueChange(venue)}
                className={`cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#1a1e2b] border-[#d4af37] shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                    : 'bg-[#11141d] border-[#232733] hover:border-stone-600 hover:bg-[#141824]'
                }`}
              >
                {venue.isResidency && (
                  <span className="absolute top-3 right-3 bg-[#d4af37] text-black font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                    Official Residency
                  </span>
                )}
                <div className="flex items-center gap-2 text-stone-300 text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{venue.city}, {venue.country}</span>
                </div>
                <h3 className="font-display font-bold text-white text-base">
                  {venue.name}
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    Doors: {venue.doorsOpen}
                  </span>
                  <span className="text-[#38bdf8] font-medium text-[11px]">
                    {venue.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Date Selection for Selected Venue */}
      <div className="mb-10">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">
          2. Select Concert Performance Date ({selectedVenue.city})
        </label>
        <div className="flex flex-wrap gap-2.5">
          {selectedVenue.dates.map((dateStr) => {
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-black font-bold border-[#d4af37] shadow-md shadow-[#d4af37]/20'
                    : 'bg-[#131722] text-stone-300 border-[#232733] hover:border-stone-500 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateStr}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive SVG Amphitheater Seat Map Component */}
      <div className="mb-10">
        <InteractiveSeatMap
          venueName={selectedVenue.name}
          selectedTableCategory={selectedTable}
          onSelectCategory={(cat) => setSelectedTable(cat)}
          selectedTableId={selectedTableId}
          onSelectTableId={handleSelectSeatTable}
        />
      </div>

      {/* 4. Table Tiers Grid */}
      <div className="mb-10">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">
          4. Table Tier Packages & Included Hospitality
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TABLE_CATEGORIES.map((category) => {
            const isSelected = selectedTable.id === category.id;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedTable(category)}
                className={`cursor-pointer rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1b202e] to-[#12151f] border-[#d4af37] shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                    : 'bg-[#10131c] border-[#232733] hover:border-stone-600 hover:bg-[#131722]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#d4af37] text-black p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <span className="text-[11px] text-[#e5c158] font-serif font-bold uppercase tracking-wider block">
                    {category.greekName}
                  </span>
                  <h4 className="font-display font-bold text-white text-lg mt-0.5 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Pricing tag */}
                  <div className="bg-[#0b0c10] border border-[#232733] rounded-xl p-3 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-stone-400">Price per person</span>
                      <span className="text-xl font-bold font-mono text-[#e5c158]">
                        €{category.pricePerPerson}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1 border-t border-[#1a1f2c] pt-1">
                      <span>Minimum Spend:</span>
                      <span className="font-mono text-stone-300">€{category.minSpend}</span>
                    </div>
                  </div>

                  {/* Perks list */}
                  <ul className="space-y-1.5 mb-4">
                    {category.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#232733] flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    {category.capacity}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {category.availableTables} available
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Guests & Party Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Guest counter */}
        <div className="bg-[#11141d] border border-[#232733] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
              4. Guests in Your Party
            </span>
            <h4 className="font-display font-bold text-white text-lg mt-1 mb-2">
              Number of Attendees
            </h4>
            <p className="text-xs text-stone-400 mb-4">
              Select party size to reserve adequate table seating and custom bottle pairings.
            </p>
          </div>

          <div className="flex items-center justify-between bg-[#0b0c10] border border-[#232733] rounded-xl p-3">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#d4af37]" />
              Party Size:
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-8 h-8 rounded-lg bg-[#1f2433] hover:bg-[#2d3448] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-lg text-[#e5c158]">
                {guestCount}
              </span>
              <button
                onClick={() => setGuestCount(Math.min(12, guestCount + 1))}
                className="w-8 h-8 rounded-lg bg-[#1f2433] hover:bg-[#2d3448] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Traditional Greek Add-ons (Garifalla Flower Baskets & Champagne) */}
        <div className="lg:col-span-2 bg-[#11141d] border border-[#232733] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                5. Greek Nightlife Traditions & Upgrades
              </span>
              <h4 className="font-display font-bold text-white text-lg mt-1">
                Bouzouki Flower Trays & VIP Experiences
              </h4>
            </div>
            <span className="text-[11px] text-stone-400 bg-[#191d2a] px-2.5 py-1 rounded-full border border-[#2e3447]">
              Iconic YTON Experience
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOOKING_ADDONS.map((addon) => {
              const count = addonCounts[addon.id] || 0;
              return (
                <div
                  key={addon.id}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between ${
                    count > 0 ? 'bg-[#1b202e] border-[#d4af37]/60' : 'bg-[#0d0f15] border-[#232733]'
                  }`}
                >
                  <div className="pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        {addon.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {addon.description}
                    </p>
                    <span className="text-xs font-mono font-bold text-[#e5c158] mt-1 block">
                      €{addon.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateAddon(addon.id, -1)}
                      className="w-7 h-7 rounded bg-[#1e2333] hover:bg-[#2d3448] text-white flex items-center justify-center text-xs cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-mono text-xs font-bold text-white">
                      {count}
                    </span>
                    <button
                      onClick={() => updateAddon(addon.id, 1)}
                      className="w-7 h-7 rounded bg-[#1e2333] hover:bg-[#2d3448] text-white flex items-center justify-center text-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Summary Bar & Checkout Launcher */}
      <div className="bg-gradient-to-r from-[#171b26] via-[#1f1a10] to-[#171b26] border-2 border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl shadow-black/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
            <span className="bg-[#d4af37]/20 text-[#e5c158] px-2.5 py-0.5 rounded-full font-bold">
              {selectedVenue.name}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-white font-medium">{selectedDate}</span>
            <span className="text-stone-400">•</span>
            <span className="text-[#fef08a] font-bold bg-[#1d2333] px-2.5 py-0.5 rounded-md border border-[#3b4766]">
              Table #{selectedTableId} ({selectedTableDetails ? `${selectedTableDetails.distanceFromStageMeters}m from stage` : 'Stage-Facing'})
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-300">{selectedTable.name} ({guestCount} Guests)</span>
          </div>

          <div className="flex items-baseline justify-center md:justify-start gap-3 mt-1">
            <span className="text-xs text-stone-400">Total Table & Hospitality Price:</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#e5c158]">
              €{grandTotal}
            </span>
            <span className="text-xs text-stone-400">incl. VAT & Service</span>
          </div>
        </div>

        <button
          onClick={handleBookNow}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b38f24] text-black font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 hover:brightness-110 shadow-xl shadow-[#d4af37]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <CreditCard className="w-5 h-5 stroke-[2.2]" />
          <span>Proceed to Secure Payment</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
};
