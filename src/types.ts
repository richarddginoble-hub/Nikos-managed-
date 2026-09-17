export type FanTier = 'Standard Fan' | 'Silver Privé' | 'Diamond VIP';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  tier: FanTier;
  memberSince: string;
  isVerifiedFan: boolean;
  avatarUrl: string;
  ticketsCount: number;
  fanPoints: number;
}

export interface SongTrack {
  id: string;
  title: string;
  greekTitle: string;
  album: string;
  year: number;
  duration: string;
  durationSec: number;
  views: string;
  bpm: number;
  isExclusive?: boolean;
  audioSampleType: 'bouzouki_laiko' | 'romantic_ballad' | 'uptempo_anthem';
  coverUrl: string;
  lyricsSnippet: string;
  lyricsFullGreek: string;
  lyricsEnglishTranslation: string;
}

export interface ExclusiveContentItem {
  id: string;
  title: string;
  type: 'video_4k' | 'audio_unreleased' | 'masterclass' | 'photo_vault' | 'documentary';
  category: 'Backstage YTON' | 'Acoustic Solos' | 'Full Concerts' | 'Studio Vault';
  duration?: string;
  itemsCount?: number;
  thumbnailUrl: string;
  description: string;
  releaseDate: string;
  requiredTier: 'Free' | 'Silver' | 'Diamond VIP';
  views: number;
  likes: number;
  downloadable?: boolean;
  videoEmbedId?: string;
}

export interface EventVenue {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  dates: string[];
  doorsOpen: string;
  showStarts: string;
  imageUrl: string;
  isResidency?: boolean;
  status: 'Selling Fast' | 'Limited VIP Tables' | 'Almost Sold Out';
}

export interface TableCategory {
  id: string;
  name: string;
  greekName: string;
  description: string;
  capacity: string;
  pricePerPerson: number;
  minSpend: number;
  color: string;
  perks: string[];
  availableTables: number;
}

export interface BookingAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'flower_trays' | 'champagne' | 'experience';
  icon: string;
  quantity: number;
}

export interface BookingOrder {
  bookingCode: string;
  transactionId: string;
  venueId: string;
  venueName: string;
  city: string;
  date: string;
  time: string;
  tableCategory: TableCategory;
  guestsCount: number;
  addons: { addon: BookingAddon; count: number }[];
  totalAmount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  paymentMethod: string;
  bookedAt: string;
  qrPayload: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  badge?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: 'YTON Live' | 'Lyrics & Music' | 'Tour & Meetups' | 'Bouzouki & Band' | 'Fan Stories';
  author: string;
  avatar: string;
  badge: string;
  isVerifiedArtist?: boolean;
  isPinned?: boolean;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
  tags: string[];
}

export interface PersonalizedDedicationRequest {
  id: string;
  recipientName: string;
  senderName: string;
  occasion: 'Birthday' | 'Wedding' | 'Name Day (Γιορτή)' | 'Anniversary' | 'Graduation' | 'Personal Encouragement';
  language: 'English' | 'Greek' | 'Dutch';
  dedicationSong: string;
  personalNotes: string;
  deliveryDate: string;
  status: 'Draft' | 'Generating Script' | 'Ready to Order' | 'Delivered';
  generatedScript?: string;
  videoPreviewUrl?: string;
  price: number;
}

export interface LiveSetlistSong {
  id: string;
  order: number;
  title: string;
  greekTitle: string;
  album: string;
  duration: string;
  durationSec: number;
  act: string;
  status: 'completed' | 'performing' | 'upcoming' | 'encore';
  estimatedTime: string;
  flowerTrays: number;
  bouzoukiSolo: boolean;
  lyricsGreek: string;
  lyricsEnglish: string;
}

export interface LiveSetlistState {
  isActive: boolean;
  eventName: string;
  venueName: string;
  doorsTime: string;
  showStartTime: string;
  currentSongIndex: number;
  elapsedSec: number;
  flowerBasketsTotal: number;
  attendeesCount: number;
  atmosphereRating: number;
  setlist: LiveSetlistSong[];
  encorePoll: {
    id: string;
    title: string;
    greekTitle: string;
    votes: number;
  }[];
}

export interface SeatMapTable {
  id: string;
  number: number;
  zoneId: string;
  zoneName: string;
  x: number;
  y: number;
  radius: number;
  seats: number;
  distanceFromStageMeters: number;
  sightlinePercent: number;
  sightlineDescription: string;
  pricePerPerson: number;
  minSpend: number;
  status: 'available' | 'reserved' | 'selected';
}
