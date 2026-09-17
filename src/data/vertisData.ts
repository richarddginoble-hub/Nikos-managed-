import { SongTrack, ExclusiveContentItem, EventVenue, TableCategory, BookingAddon, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Alexandros Moraitis',
  email: 'alexandros@fanmail.gr',
  phone: '+30 697 428 9910',
  tier: 'Diamond VIP',
  memberSince: 'March 2021',
  isVerifiedFan: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  ticketsCount: 4,
  fanPoints: 1450
};

export const SONGS_DATA: SongTrack[] = [
  {
    id: 'song-thelo-na-me-nioseis',
    title: 'Thelo Na Me Nioseis',
    greekTitle: 'Θέλω Να Με Νιώσεις',
    album: 'Protaseis (Προτάσεις)',
    year: 2013,
    duration: '4:23',
    durationSec: 263,
    views: '215M+',
    bpm: 88,
    isExclusive: true,
    audioSampleType: 'uptempo_anthem',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    lyricsSnippet: 'Θέλω να με νιώσεις, να με δικαιώσεις, ν’ ακούσω μια φορά πως μ’ αγαπάς...',
    lyricsFullGreek: `Θέλω να με νιώσεις, να με δικαιώσεις
Ν’ ακούσω μια φορά πως μ’ αγαπάς
Μη με πληγώσεις, μη με προδώσεις
Και πες μου αν για μένα πολεμάς

Εγώ για σένα τα 'δωσα όλα
Και στη φωτιά έπεσα μόνος
Κι αν είναι η αγάπη σου μαχαίρι
Ας γίνει ο πιο γλυκός μου πόνος`,
    lyricsEnglishTranslation: `I want you to feel me, to vindicate me
To hear just once that you love me
Do not hurt me, do not betray me
And tell me if you fight for me

I gave everything for you
And into the fire I fell alone
And if your love is a blade
Let it become my sweetest pain`
  },
  {
    id: 'song-an-eisai-ena-asteri',
    title: 'An Eisai Ena Asteri',
    greekTitle: 'Αν Είσαι Ένα Αστέρι',
    album: 'Eimai Mazi Sou (Είμαι Μαζί Σου)',
    year: 2011,
    duration: '4:15',
    durationSec: 255,
    views: '180M+',
    bpm: 74,
    audioSampleType: 'romantic_ballad',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    lyricsSnippet: 'Αν είσαι ένα αστέρι που φως θα φέρει στην άδεια μου ζωή, ποτέ μη σβήσεις...',
    lyricsFullGreek: `Αν είσαι ένα αστέρι
Που φως θα φέρει
Στην άδεια μου ζωή
Ποτέ μη σβήσεις
Μη μ’ απαρνήσαι
Μα να είσαι η αρχή

Μαζί σου να ταξιδέψω
Να σε λατρέψω
Και στην αγκαλιά σου να χαθώ`,
    lyricsEnglishTranslation: `If you are a star
That will bring light
Into my empty life
Never fade away
Do not forsake me
Rather be the beginning

With you let me travel
To adore you
And get lost inside your embrace`
  },
  {
    id: 'song-pes-to-mou-xana',
    title: 'Pes To Mou Xana',
    greekTitle: 'Πες Το Μου Ξανά',
    album: 'Poli Apotoma Vradiazei',
    year: 2003,
    duration: '3:45',
    durationSec: 225,
    views: '95M+',
    bpm: 118,
    audioSampleType: 'bouzouki_laiko',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    lyricsSnippet: 'Πες το μου ξανά πως μ’ αγαπάς, πες το μου να τρελαθώ...',
    lyricsFullGreek: `Πες το μου ξανά πως μ’ αγαπάς
Πες το μου να τρελαθώ
Στα μάτια σου κοιτάζω και μεθώ
Στον κόσμο σου να ζω

Πες το μου ξανά, μην το σκεφτείς
Είσαι ό,τι έχω ονειρευτεί`,
    lyricsEnglishTranslation: `Tell me again that you love me
Tell me so I can lose my mind
I look into your eyes and get intoxicated
To live in your world

Tell me again, do not hesitate
You are everything I have ever dreamed of`
  },
  {
    id: 'song-mou-elipses-poli',
    title: 'Mou Elipses Poli',
    greekTitle: 'Μου Έλειψες Πολύ',
    album: 'Mou Elipses Poli (New Album)',
    year: 2025,
    duration: '3:50',
    durationSec: 230,
    views: '42M+',
    bpm: 96,
    isExclusive: true,
    audioSampleType: 'romantic_ballad',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    lyricsSnippet: 'Μου έλειψες πολύ τις νύχτες που δεν είχα αγκαλιά...',
    lyricsFullGreek: `Μου έλειψες πολύ
Τις νύχτες που δεν είχα αγκαλιά
Μου έλειψες εσύ
Κι η ανάσα σου στα σκοτεινά`,
    lyricsEnglishTranslation: `I missed you so much
On the nights when I had no embrace
I missed you
And your breath in the dark`
  },
  {
    id: 'song-erotevmenos',
    title: 'Erotevmenos',
    greekTitle: 'Ερωτευμένος',
    album: 'Erotevmenos',
    year: 2017,
    duration: '4:02',
    durationSec: 242,
    views: '88M+',
    bpm: 104,
    audioSampleType: 'uptempo_anthem',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
    lyricsSnippet: 'Ερωτευμένος με τα μάτια σου, ερωτευμένος με τα λάθη σου...',
    lyricsFullGreek: `Ερωτευμένος με τα μάτια σου
Ερωτευμένος με τα λάθη σου
Δεν έχει άλλη σαν εσένα η γη`,
    lyricsEnglishTranslation: `In love with your eyes
In love with your flaws
There is no one else like you on earth`
  }
];

export const EXCLUSIVE_VAULT_ITEMS: ExclusiveContentItem[] = [
  {
    id: 'vault-1',
    title: 'YTON The Music Show: 4K Master Soundboard & Revolving Stage Special',
    type: 'video_4k',
    category: 'Full Concerts',
    duration: '48:15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    description: 'Exclusive multi-camera soundboard direct stream from YTON Athens amphitheater with stage-lift waterfall effects and live bouzouki orchestration.',
    releaseDate: 'September 2026',
    requiredTier: 'Silver',
    views: 48920,
    likes: 3410,
    videoEmbedId: 'live_yton_uncut'
  },
  {
    id: 'vault-2',
    title: 'Masterclass: Bouzouki Dromoi & Solos with Nikos Vertis',
    type: 'masterclass',
    category: 'Acoustic Solos',
    duration: '32:40',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    description: 'Nikos sits down at his YTON backstage studio with his custom 4-string bouzouki, demonstrating the microtonal nuances behind "An Eisai Ena Asteri".',
    releaseDate: 'August 2026',
    requiredTier: 'Diamond VIP',
    views: 29140,
    likes: 2780
  },
  {
    id: 'vault-3',
    title: 'Unreleased Acoustic Take: "Tha \'Mai Edo" (Athens Dressing Room Tape)',
    type: 'audio_unreleased',
    category: 'Studio Vault',
    duration: '3:45',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    description: 'Raw, uncompressed acoustic vocal & guitar demo recorded at 3:30 AM right after the Sunday closing show at YTON.',
    releaseDate: 'July 2026',
    requiredTier: 'Free',
    views: 61200,
    likes: 5490,
    downloadable: true
  },
  {
    id: 'vault-4',
    title: 'Documentary: From Gorinchem to Megastardom (20-Year Odyssey)',
    type: 'documentary',
    category: 'Backstage YTON',
    duration: '52:10',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    description: 'Intimate retrospective featuring childhood memories in Netherlands, early Thessaloniki bouzoukia nights, and the conception of YTON amphitheater.',
    releaseDate: 'June 2026',
    requiredTier: 'Silver',
    views: 74300,
    likes: 8120
  },
  {
    id: 'vault-5',
    title: 'Tour Vault: High-Resolution Live Stage Photography Pack',
    type: 'photo_vault',
    category: 'Studio Vault',
    itemsCount: 48,
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
    description: 'Official photographer archive: 48 color-graded lossless RAW/JPEG photos from the 20-year world tour and YTON opening spectacles.',
    releaseDate: 'May 2026',
    requiredTier: 'Diamond VIP',
    views: 18450,
    likes: 1940,
    downloadable: true
  }
];

export const VENUES_DATA: EventVenue[] = [
  {
    id: 'venue-yton-athens',
    name: 'YTON The Music Show (Athens)',
    city: 'Athens',
    country: 'Greece',
    address: 'Petrou Ralli 38, Tavros 177 78, Athens',
    dates: ['Saturday, Oct 3, 2026', 'Sunday, Oct 4, 2026', 'Saturday, Oct 10, 2026', 'Sunday, Oct 11, 2026'],
    doorsOpen: '23:00',
    showStarts: '00:15',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    isResidency: true,
    status: 'Limited VIP Tables'
  },
  {
    id: 'venue-orama-thessaloniki',
    name: 'ORAMA Live (Thessaloniki)',
    city: 'Thessaloniki',
    country: 'Greece',
    address: 'Airport Area / 14th km Thessaloniki-Mihaniona',
    dates: ['Friday, Nov 13, 2026', 'Saturday, Nov 14, 2026'],
    doorsOpen: '23:30',
    showStarts: '00:30',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    isResidency: false,
    status: 'Selling Fast'
  },
  {
    id: 'venue-london-apollo',
    name: 'Eventim Apollo (London Special)',
    city: 'London',
    country: 'United Kingdom',
    address: '45 Queen Caroline St, London W6 9QH',
    dates: ['Friday, Dec 4, 2026'],
    doorsOpen: '19:30',
    showStarts: '20:45',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80',
    isResidency: false,
    status: 'Almost Sold Out'
  },
  {
    id: 'venue-sydney-state',
    name: 'State Theatre (Sydney Australian Tour)',
    city: 'Sydney',
    country: 'Australia',
    address: '49 Market St, Sydney NSW 2000',
    dates: ['Saturday, Jan 16, 2027'],
    doorsOpen: '19:00',
    showStarts: '20:15',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    isResidency: false,
    status: 'Selling Fast'
  }
];

export const TABLE_CATEGORIES: TableCategory[] = [
  {
    id: 'stage-front-diamond',
    name: 'Stage-Front Diamond VIP Table',
    greekName: 'Πρώτο Τραπέζι Πίστα VIP',
    description: 'Directly in front of the rotating stage. Maximum intimacy with Nikos Vertis, direct bouzouki view, private waiter service & priority flower delivery.',
    capacity: '4 - 8 Guests',
    pricePerPerson: 180,
    minSpend: 720,
    color: 'from-amber-500/30 to-amber-900/40 border-amber-400',
    perks: [
      '1st Ring front-row stage positioning',
      'Complimentary bottle of Moët & Chandon Brut Impérial',
      '3 Complimentary Garifalla flower baskets for stage throwing',
      'VIP Fast-Track Red Carpet Entrance & Valet Parking',
      'Dedicated private sommelier & security host'
    ],
    availableTables: 3
  },
  {
    id: 'gold-ring-lounge',
    name: 'Gold Ring Lounge Table',
    greekName: 'Χρυσή Ζώνη (2η - 3η Σειρά)',
    description: 'Elevated second and third tiers with panoramic acoustic vantage point and optimal direct sightlines.',
    capacity: '4 - 6 Guests',
    pricePerPerson: 120,
    minSpend: 480,
    color: 'from-yellow-600/20 to-stone-900/40 border-yellow-600/70',
    perks: [
      'Prime center amphitheater view',
      '1 Premium Spirit Bottle (Belvedere / Grey Goose / Chivas 18)',
      '1 Complimentary Garifalla flower basket',
      'Priority VIP bar and lounge access'
    ],
    availableTables: 7
  },
  {
    id: 'silver-mezzanine',
    name: 'Silver Mezzanine Sofa Booth',
    greekName: 'Silver Ζώνη Καναπέδες',
    description: 'Spacious leather sofa booths with excellent acoustics and high-energy crowd ambiance.',
    capacity: '4 - 6 Guests',
    pricePerPerson: 85,
    minSpend: 340,
    color: 'from-slate-500/20 to-stone-900/40 border-slate-400/50',
    perks: [
      'Comfortable plush booth seating',
      '1 Standard Premium Spirit bottle of your choice',
      'Fruit platter and nuts service'
    ],
    availableTables: 12
  },
  {
    id: 'bar-standing-pass',
    name: 'Bar Lounge & Standing Cocktail Ticket',
    greekName: 'Είσοδος με Ποτό στο Bar',
    description: 'Atmospheric amphitheater standing bar access with 2 complimentary drinks included.',
    capacity: '1 Guest',
    pricePerPerson: 35,
    minSpend: 35,
    color: 'from-zinc-700/20 to-stone-900/40 border-zinc-600/50',
    perks: [
      '2 Premium drinks included at main bar',
      'Access to full live concert show until sunrise',
      'Digital wristband entry'
    ],
    availableTables: 45
  }
];

export const BOOKING_ADDONS: BookingAddon[] = [
  {
    id: 'addon-garifalla-deluxe',
    name: 'Garifalla Flower Trays (5 Baskets)',
    description: 'Traditional Greek live music flower baskets (carnations) for throwing at the stage during favorite songs!',
    price: 60,
    category: 'flower_trays',
    icon: 'Flower2',
    quantity: 0
  },
  {
    id: 'addon-garifalla-tower',
    name: 'Grand Celebration Flower Tower (15 Trays)',
    description: 'The ultimate YTON VIP ritual. Delivered to your table when Nikos sings your requested track!',
    price: 160,
    category: 'flower_trays',
    icon: 'Sparkles',
    quantity: 0
  },
  {
    id: 'addon-dom-perignon',
    name: 'Dom Pérignon Vintage Champagne (750ml)',
    description: 'Served on ice with crystal flutes and celebratory cold indoor sparklers.',
    price: 340,
    category: 'champagne',
    icon: 'Wine',
    quantity: 0
  },
  {
    id: 'addon-backstage-photo',
    name: 'Post-Show VIP Backstage Photo & Greeting',
    description: 'Exclusive 5-minute meet-and-greet in Nikos Vertis\'s private dressing room after the show with signed tour poster.',
    price: 250,
    category: 'experience',
    icon: 'Camera',
    quantity: 0
  }
];
