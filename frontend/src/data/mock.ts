// Mock data for the frontend-only build. No backend.
// Images use remote CDN URLs (design guidelines + Pexels/Unsplash).

export type Sport =
  | "Soccer"
  | "Basketball"
  | "Pickleball"
  | "Tennis"
  | "Volleyball"
  | "Running";

export interface Member {
  id: string;
  name: string;
  role: "Owner" | "Admin" | "Member";
  avatar: string;
  jersey?: string;
}

export interface Group {
  id: string;
  name: string;
  sport: Sport;
  logo: string;
  role: "Owner" | "Admin" | "Member";
  memberCount: number;
  unread: number;
  color: string;
  premium?: boolean;
}

export type RSVP = "going" | "maybe" | "no" | null;

export interface EventItem {
  id: string;
  groupId: string;
  groupName: string;
  type: "Game" | "Practice" | "Social" | "Meet";
  title: string;
  opponent?: string;
  start: string; // ISO
  durationMin: number;
  venue: string;
  address: string;
  cover: string;
  rsvp: RSVP;
  goingCount: number;
  maybeCount: number;
  capacity: number;
  checkedIn: number;
  weather: { tempF: number; condition: string; icon: string; precip: number };
  volunteersNeeded?: { label: string; filled: number; total: number }[];
  mode?: "simple" | "reg_free" | "reg_paid";
  registration?: {
    capacity: number;
    deadline: string;
    waitlistEnabled: boolean;
    customFields: { id: string; label: string; type: "text" | "toggle" }[];
  };
  paid?: { price: number; methods: ("paypal" | "venmo")[] };
}

export interface LiveActivity {
  id: string;
  eventId: string;
  groupName: string;
  status: "live" | "upcoming" | "final";
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  clock: string;
  detail: string;
}

export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  mine?: boolean;
  reactions?: { emoji: string; count: number }[];
  system?: boolean;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  sport: Sport;
  seller: string;
  location: string;
  liked?: boolean;
  sold?: boolean;
}

export interface WalletItem {
  id: string;
  type: "coupon" | "reward" | "referral";
  brand: string;
  title: string;
  value: string;
  code: string;
  expires?: string;
  gradient: [string, string];
  redeemed?: boolean;
}

const AVA = (n: number) =>
  `https://i.pravatar.cc/150?img=${n}`;

export const currentUser = {
  name: "Jordan Dixon",
  first: "Jordan",
  handle: "JD",
  avatar: AVA(12),
  location: "Lakewood Ranch, FL",
  savings: 148,
  points: 2450,
  paymentLinks: { paypal: "paypal.me/jordandixon", venmo: "@Jordan-Dixon" },
};

export const weatherNow = {
  tempF: 82,
  feelsF: 86,
  condition: "Partly Cloudy",
  hi: 88,
  lo: 72,
  precip: 20,
  location: "Lakewood Ranch, FL",
  hourly: [
    { t: "Now", temp: 82, icon: "partly-sunny", precip: 20 },
    { t: "1PM", temp: 84, icon: "sunny", precip: 10 },
    { t: "2PM", temp: 85, icon: "sunny", precip: 5 },
    { t: "3PM", temp: 86, icon: "partly-sunny", precip: 15 },
    { t: "4PM", temp: 85, icon: "cloudy", precip: 30 },
    { t: "5PM", temp: 83, icon: "rainy", precip: 60 },
    { t: "6PM", temp: 80, icon: "rainy", precip: 55 },
  ],
  daily: [
    { d: "Mon", hi: 88, lo: 72, icon: "partly-sunny" },
    { d: "Tue", hi: 90, lo: 74, icon: "sunny" },
    { d: "Wed", hi: 87, lo: 73, icon: "rainy" },
    { d: "Thu", hi: 85, lo: 71, icon: "cloudy" },
    { d: "Fri", hi: 89, lo: 72, icon: "sunny" },
  ],
  playability: "good" as "good" | "caution" | "poor",
};

export const groups: Group[] = [
  {
    id: "g1",
    name: "Riverside FC",
    sport: "Soccer",
    logo: "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=300",
    role: "Owner",
    memberCount: 22,
    unread: 3,
    color: "#059669",
    premium: true,
  },
  {
    id: "g2",
    name: "Downtown Hoops",
    sport: "Basketball",
    logo: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300",
    role: "Admin",
    memberCount: 14,
    unread: 0,
    color: "#D97706",
  },
  {
    id: "g3",
    name: "SRQ Dink District",
    sport: "Pickleball",
    logo: "https://images.pexels.com/photos/6224459/pexels-photo-6224459.jpeg?auto=compress&cs=tinysrgb&w=300",
    role: "Member",
    memberCount: 38,
    unread: 7,
    color: "#0EA5A0",
  },
  {
    id: "g4",
    name: "Baseline Tennis Club",
    sport: "Tennis",
    logo: "https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=300",
    role: "Member",
    memberCount: 19,
    unread: 1,
    color: "#16A34A",
  },
  {
    id: "g5",
    name: "Sunset Spikers",
    sport: "Volleyball",
    logo: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=300",
    role: "Member",
    memberCount: 16,
    unread: 0,
    color: "#EA580C",
  },
  {
    id: "g6",
    name: "Dawn Patrol Runners",
    sport: "Running",
    logo: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=300",
    role: "Admin",
    memberCount: 45,
    unread: 2,
    color: "#059669",
  },
];

export const members: Member[] = [
  { id: "m1", name: "Jordan Dixon", role: "Owner", avatar: AVA(12), jersey: "10" },
  { id: "m2", name: "Maya Chen", role: "Admin", avatar: AVA(45), jersey: "7" },
  { id: "m3", name: "Andre Silva", role: "Member", avatar: AVA(33), jersey: "9" },
  { id: "m4", name: "Priya Nair", role: "Member", avatar: AVA(48), jersey: "4" },
  { id: "m5", name: "Tom Becker", role: "Member", avatar: AVA(15), jersey: "1" },
  { id: "m6", name: "Sofia Rossi", role: "Member", avatar: AVA(20), jersey: "11" },
  { id: "m7", name: "Leo Martins", role: "Member", avatar: AVA(52), jersey: "6" },
  { id: "m8", name: "Grace Kim", role: "Member", avatar: AVA(41), jersey: "3" },
];

export const events: EventItem[] = [
  {
    id: "e1",
    groupId: "g1",
    groupName: "Riverside FC",
    type: "Game",
    title: "League Match vs Northgate United",
    opponent: "Northgate United",
    start: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    durationMin: 90,
    venue: "Premier Sports Complex — Field 4",
    address: "5350 17th St, Sarasota, FL",
    cover:
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=900",
    rsvp: "going",
    goingCount: 14,
    maybeCount: 3,
    capacity: 18,
    checkedIn: 11,
    weather: { tempF: 82, condition: "Partly Cloudy", icon: "partly-sunny", precip: 20 },
    volunteersNeeded: [
      { label: "Snacks", filled: 1, total: 2 },
      { label: "Scorekeeper", filled: 0, total: 1 },
      { label: "Carpool", filled: 2, total: 3 },
    ],
  },
  {
    id: "e2",
    groupId: "g3",
    groupName: "SRQ Dink District",
    type: "Social",
    title: "Open Play & Pizza Night",
    start: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    durationMin: 120,
    venue: "Bayfront Courts",
    address: "5th Ave, Sarasota, FL",
    cover:
      "https://images.pexels.com/photos/6224459/pexels-photo-6224459.jpeg?auto=compress&cs=tinysrgb&w=900",
    rsvp: "maybe",
    goingCount: 22,
    maybeCount: 6,
    capacity: 40,
    checkedIn: 0,
    weather: { tempF: 79, condition: "Clear", icon: "sunny", precip: 5 },
    mode: "reg_free",
    registration: {
      capacity: 40,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
      waitlistEnabled: true,
      customFields: [
        { id: "guest", label: "Bringing a guest?", type: "toggle" },
        { id: "notes", label: "Dietary notes (pizza)", type: "text" },
      ],
    },
  },
  {
    id: "e3",
    groupId: "g2",
    groupName: "Downtown Hoops",
    type: "Practice",
    title: "Shootaround & Scrimmage",
    start: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    durationMin: 75,
    venue: "Community Rec Center — Court B",
    address: "1200 Main St, Bradenton, FL",
    cover:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=900",
    rsvp: null,
    goingCount: 8,
    maybeCount: 2,
    capacity: 14,
    checkedIn: 0,
    weather: { tempF: 84, condition: "Sunny", icon: "sunny", precip: 0 },
  },
  {
    id: "e4",
    groupId: "g6",
    groupName: "Dawn Patrol Runners",
    type: "Meet",
    title: "Saturday Long Run — 10 miles",
    start: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    durationMin: 90,
    venue: "Legacy Trail — North Trailhead",
    address: "Palmer Ranch, Sarasota, FL",
    cover:
      "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=900",
    rsvp: "going",
    goingCount: 19,
    maybeCount: 4,
    capacity: 60,
    checkedIn: 0,
    weather: { tempF: 74, condition: "Cloudy", icon: "cloudy", precip: 30 },
  },
  {
    id: "e5",
    groupId: "g3",
    groupName: "SRQ Dink District",
    type: "Meet",
    title: "Weekend Skills Clinic with Coach Maya",
    start: new Date(Date.now() + 1000 * 60 * 60 * 60).toISOString(),
    durationMin: 120,
    venue: "Bayfront Courts — Court 2",
    address: "5th Ave, Sarasota, FL",
    cover:
      "https://images.pexels.com/photos/6224459/pexels-photo-6224459.jpeg?auto=compress&cs=tinysrgb&w=900",
    rsvp: null,
    goingCount: 14,
    maybeCount: 0,
    capacity: 20,
    checkedIn: 0,
    weather: { tempF: 81, condition: "Sunny", icon: "sunny", precip: 5 },
    mode: "reg_paid",
    paid: { price: 25, methods: ["paypal", "venmo"] },
    registration: {
      capacity: 20,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      waitlistEnabled: true,
      customFields: [{ id: "skill", label: "Skill level (2.5–4.0)", type: "text" }],
    },
  },
  {
    id: "e6",
    groupId: "g2",
    groupName: "Downtown Hoops",
    type: "Game",
    title: "Summer 3v3 Tournament",
    start: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    durationMin: 240,
    venue: "Community Rec Center — Main Court",
    address: "1200 Main St, Bradenton, FL",
    cover:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=900",
    rsvp: null,
    goingCount: 21,
    maybeCount: 0,
    capacity: 24,
    checkedIn: 0,
    weather: { tempF: 86, condition: "Sunny", icon: "sunny", precip: 0 },
    mode: "reg_paid",
    paid: { price: 40, methods: ["paypal", "venmo"] },
    registration: {
      capacity: 24,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      waitlistEnabled: true,
      customFields: [{ id: "team", label: "Team name", type: "text" }],
    },
  },
];

export const liveActivities: LiveActivity[] = [
  {
    id: "l1",
    eventId: "e1",
    groupName: "Riverside FC",
    status: "live",
    homeName: "RIV",
    awayName: "NOR",
    homeScore: 2,
    awayScore: 1,
    clock: "67'",
    detail: "Field changed → Field 4",
  },
  {
    id: "l2",
    eventId: "e9",
    groupName: "Downtown Hoops",
    status: "upcoming",
    homeName: "DTH",
    awayName: "EAG",
    homeScore: 0,
    awayScore: 0,
    clock: "T-1:30",
    detail: "Tip-off at 7:00 PM",
  },
  {
    id: "l3",
    eventId: "e8",
    groupName: "Baseline Tennis",
    status: "final",
    homeName: "BAS",
    awayName: "OAK",
    homeScore: 6,
    awayScore: 4,
    clock: "FT",
    detail: "Match won • Set 2",
  },
];

export const messagesByGroup: Record<string, Message[]> = {
  g1: [
    { id: "s1", author: "system", avatar: "", text: "Event updated: Match moved to Field 4", time: "9:02 AM", system: true },
    { id: "c1", author: "Maya Chen", avatar: AVA(45), text: "Who's carpooling from the north side today?", time: "9:14 AM", reactions: [{ emoji: "🙌", count: 2 }] },
    { id: "c2", author: "Andre Silva", avatar: AVA(33), text: "I've got 3 seats, leaving at 4:30.", time: "9:16 AM" },
    { id: "c3", author: "Jordan Dixon", avatar: AVA(12), text: "Perfect — I'll bring the extra cones and pinnies.", time: "9:18 AM", mine: true, reactions: [{ emoji: "⚽", count: 3 }] },
    { id: "c4", author: "Priya Nair", avatar: AVA(48), text: "Weather looks good, slight chance of rain after 5. See everyone there!", time: "9:25 AM" },
  ],
  g3: [
    { id: "p1", author: "Sofia Rossi", avatar: AVA(20), text: "Pizza night was a blast 🍕 same time next week?", time: "Yesterday" },
    { id: "p2", author: "Jordan Dixon", avatar: AVA(12), text: "Absolutely. I'll post a poll for the date.", time: "Yesterday", mine: true },
  ],
};

export const listings: Listing[] = [
  {
    id: "mk1",
    title: "Nike Mercurial Cleats — Size 10",
    price: 65,
    image:
      "https://images.pexels.com/photos/19834317/pexels-photo-19834317.jpeg?auto=compress&cs=tinysrgb&w=600",
    condition: "Barely Used",
    sport: "Soccer",
    seller: "Andre S.",
    location: "Sarasota, FL",
  },
  {
    id: "mk2",
    title: "Wilson Evolution Basketball",
    price: 40,
    image:
      "https://images.pexels.com/photos/13330747/pexels-photo-13330747.jpeg?auto=compress&cs=tinysrgb&w=600",
    condition: "Good",
    sport: "Basketball",
    seller: "Maya C.",
    location: "Bradenton, FL",
  },
  {
    id: "mk3",
    title: "Selkirk Pickleball Paddle Set",
    price: 90,
    image:
      "https://images.pexels.com/photos/6224459/pexels-photo-6224459.jpeg?auto=compress&cs=tinysrgb&w=600",
    condition: "Like New",
    sport: "Pickleball",
    seller: "Tom B.",
    location: "Venice, FL",
  },
  {
    id: "mk4",
    title: "Babolat Tennis Racket + Cover",
    price: 55,
    image:
      "https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=600",
    condition: "Good",
    sport: "Tennis",
    seller: "Grace K.",
    location: "Sarasota, FL",
  },
  {
    id: "mk5",
    title: "Mizuno Volleyball Knee Pads",
    price: 18,
    image:
      "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=600",
    condition: "New",
    sport: "Volleyball",
    seller: "Leo M.",
    location: "Palmetto, FL",
  },
  {
    id: "mk6",
    title: "Garmin Forerunner 255 Watch",
    price: 180,
    image:
      "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=600",
    condition: "Barely Used",
    sport: "Running",
    seller: "Priya N.",
    location: "Sarasota, FL",
  },
];

export const walletItems: WalletItem[] = [
  {
    id: "w1",
    type: "coupon",
    brand: "SoccerPro",
    title: "20% off cleats & apparel",
    value: "20% OFF",
    code: "SIDELINE20",
    expires: "Jun 30, 2026",
    gradient: ["#059669", "#0EA5A0"],
  },
  {
    id: "w2",
    type: "reward",
    brand: "Sideline Rewards",
    title: "Free tournament entry",
    value: "2,450 pts",
    code: "REWARD-TOURN",
    gradient: ["#0F766E", "#059669"],
  },
  {
    id: "w3",
    type: "coupon",
    brand: "Courtside Nutrition",
    title: "$10 off orders over $50",
    value: "$10 OFF",
    code: "COURT10",
    expires: "Jul 15, 2026",
    gradient: ["#D97706", "#F59E0B"],
  },
  {
    id: "w4",
    type: "referral",
    brand: "Invite friends",
    title: "Give $5, get $5 in rewards",
    value: "SHARE",
    code: "JD-REF-5",
    gradient: ["#065F46", "#10B981"],
  },
];

export const polls = [
  {
    id: "poll1",
    question: "Best day for next open play?",
    options: [
      { label: "Friday 6PM", votes: 8 },
      { label: "Saturday 10AM", votes: 14 },
      { label: "Sunday 4PM", votes: 5 },
    ],
    total: 27,
    voted: 1,
    deadline: "Closes in 2 days",
  },
];

export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today · ${time}`;
  const tmrw = new Date(now);
  tmrw.setDate(now.getDate() + 1);
  if (d.toDateString() === tmrw.toDateString()) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
}

export function countdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "LIVE";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
