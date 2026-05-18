// Public domain / free-to-use Christ & Christian imagery
// Using Unsplash for reliable CDN delivery

export const churchPhotos = [
  // Cross against dramatic golden sky
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=90",
  // Sunlight through church window cross shadow
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1600&q=90",
  // Person praying hands with Bible
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=90",
  // Cross silhouette at sunset
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1600&q=90",
  // Open Bible with light rays
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1600&q=90",
  // Worship hands raised toward light
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1600&q=90",
  // Cathedral interior golden light
  "https://images.unsplash.com/photo-1490758966275-7ca4b329fbb1?w=1600&q=90",
  // Cross on hilltop dramatic clouds
  "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=1600&q=90",
  // Person reading Bible at sunrise
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=90",
  // Stained glass Christ window
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=90",
  // Hands clasped in prayer
  "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&q=90",
  // Church congregation worship
  "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=90",
  // Cross with rays of light
  "https://images.unsplash.com/photo-1472905981516-5ac09f35b7f4?w=1600&q=90",
];

// Scripture texts shown as overlay on each photo
export const scriptureOverlays = [
  { verse: "John 3:16", text: "For God so loved the world that He gave His one and only Son." },
  { verse: "Psalm 46:1", text: "God is our refuge and strength, an ever-present help in trouble." },
  { verse: "Philippians 4:13", text: "I can do all things through Christ who strengthens me." },
  { verse: "Isaiah 40:31", text: "Those who hope in the Lord will renew their strength." },
  { verse: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." },
  { verse: "Romans 8:28", text: "All things work together for good to those who love God." },
  { verse: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord." },
  { verse: "Proverbs 3:5", text: "Trust in the Lord with all your heart and lean not on your own understanding." },
  { verse: "Joshua 1:9", text: "Be strong and courageous. Do not be afraid; do not be discouraged." },
  { verse: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
  { verse: "John 14:6", text: "I am the way, the truth, and the life." },
  { verse: "Revelation 21:4", text: "He will wipe every tear from their eyes. There will be no more death." },
  { verse: "Psalm 119:105", text: "Your word is a lamp for my feet, a light on my path." },
];

export function getDailyPhoto(offset = 0): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return churchPhotos[(dayOfYear + offset) % churchPhotos.length];
}

export function getDailyScripture(offset = 0): { verse: string; text: string } {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return scriptureOverlays[(dayOfYear + offset) % scriptureOverlays.length];
}
