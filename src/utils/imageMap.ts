// Image mapping for local assets
export const eventImages: { [key: string]: any } = {
  '/alter-rebbe.jpg': require('../../assets/event-images/alter-rebbe.jpg'),
  '/mittler-rebbe-9-kislev-pic.jpg': require('../../assets/event-images/mittler-rebbe-9-kislev-pic.jpg'),
  '/tzemach-born.jpg': require('../../assets/event-images/tzemach-born.jpg'),
  '/tanya-2.jpg': require('../../assets/event-images/tanya-2.jpg'),
  '/alter-rebbe-lib-final.jpeg': require('../../assets/event-images/alter-rebbe-lib-final.jpeg'),
  '/chuppah.jpg': require('../../assets/event-images/chuppah.jpg'),
  '/yudkislev.jpg': require('../../assets/event-images/yudkislev.jpg'),
  '/mitteler-pass.jpeg': require('../../assets/event-images/mitteler-pass.jpeg'),
  '/tzemach-2.jpg': require('../../assets/event-images/tzemach-2.jpg'),
  '/maharash-born.jpg': require('../../assets/event-images/maharash-born.jpg'),
  '/rashab.jpg': require('../../assets/event-images/rashab.jpg'),
  '/rashab-wedding.jpg': require('../../assets/event-images/rashab-wedding.jpg'),
  '/reb-chana.webp': require('../../assets/event-images/reb-chana.webp'),
  '/maharash-2.jpg': require('../../assets/event-images/maharash-2.jpg'),
  '/fried-rebbe.jpg': require('../../assets/event-images/fried-rebbe.jpg'),
  '/maharash-pass-3.jpg': require('../../assets/event-images/maharash-pass-3.jpg'),
  '/tomtem.jpg': require('../../assets/event-images/tomtem.jpg'),
  '/chayamushka.jpg': require('../../assets/event-images/chayamushka.jpg'),
  '/rebbe-birth.webp': require('../../assets/event-images/rebbe-birth.webp'),
  '/fried-rebbe-released.jpg': require('../../assets/event-images/fried-rebbe-released.jpg'),
  '/rebbe-wedding.png': require('../../assets/event-images/rebbe-wedding.png'),
  '/fried-rebbe-usa.jpg': require('../../assets/event-images/fried-rebbe-usa.jpg'),
  '/Rebbe-Usa.jpg': require('../../assets/event-images/Rebbe-Usa.jpg'),
  '/rebbe-father.jpg': require('../../assets/event-images/rebbe-father.jpg'),
  '/shterna.jpg': require('../../assets/event-images/shterna.jpg'),
  '/10shavt2.jpg': require('../../assets/event-images/10shavt2.jpg'),
  '/yis-ar-grave.jpg': require('../../assets/event-images/yis-ar-grave.jpg'),
  '/mivtza.jpg': require('../../assets/event-images/mivtza.jpg'),
  '/rbbe-heart-2.jpg': require('../../assets/event-images/rbbe-heart-2.jpg'),
  '/hei-teves.jpg': require('../../assets/event-images/hei-teves.jpg'),
  '/ohel.jpg': require('../../assets/event-images/ohel.jpg'),
  '/kinus2025.jpg': require('../../assets/event-images/kinus2025.jpg'),
};

export function getEventImage(imagePath: string) {
  return eventImages[imagePath] || null;
}
