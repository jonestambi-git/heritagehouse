// Verified church photos from Unsplash (free to use)
// Source: https://unsplash.com/s/photos/church?orientation=landscape&license=free

export const churchPhotos = [
  "photo-1495582630316-0b481a069ce3", // white chapel low angle
  "photo-1490758966275-7ca4b329fbb1", // cathedral interior
  "photo-1519491050282-cf00c82424b4", // cathedral interior 2
  "photo-1473177104440-ffee2f376098", // empty cathedral
  "photo-1438032005730-c779502df39b", // stained glass interior
  "photo-1477672680933-0287a151330e", // gray concrete church
  "photo-1515162305285-0293e4767cc2", // brown church exterior
  "photo-1478147427282-58a87a120781", // people waving hands worship
  "photo-1548625149-fc4a29cf7092",    // blue white wooden church
  "photo-1472905981516-5ac09f35b7f4", // open bible
  "photo-1587293094245-15c3520d3894", // woman on church bench
  "photo-1438232992991-995b7058bbb3", // shallow focus hands worship
  "photo-1507692049790-de58290a4334", // religious concert band
];

export function getDailyPhoto(offset = 0): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const photo = churchPhotos[(dayOfYear + offset) % churchPhotos.length];
  return `https://images.unsplash.com/${photo}?w=1600&q=85`;
}
