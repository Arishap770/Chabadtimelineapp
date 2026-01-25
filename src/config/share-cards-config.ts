// Maps event IDs to their share card image filenames in assets/share-pics/
// Images are stored locally in the assets folder

export const shareCardMap: Record<string, string> = {
  "birth-of-alter-rebbe": "Alter Rebbe Birth Share.png",
  "liberation-alter-rebbe": "Liberation alter share.png",
  "birth-of-mitteler-rebbe": "Mitteler Rebbe Birth Share.png",
  "passing-alter-rebbe": "Passing alter share.png",
  "rashab-wedding": "Rashab Wedding share.png",
  "tanya-published": "Tanya Share.png",
  "tzemach-tzedek-born": "Tzemach Tzedek Birth Share.png",
  "tzemach-tzedek-nesius": "Tzemach nesius share.png",
  "yom-hilula-yisroel-aryeh-leib": "aryeh-leib-share.png",
  "birth-rebbetzin-chana": "chana birth share.png",
  "passing-rebbetzin-chana": "chana-pass-share.png",
  "birth-rebbetzin-chaya-mushka": "chaya mushka birth share.png",
  "frierdiker-rebbe-born": "fried birth share.png",
  "frierdiker-rebbe-arrested": "fried-arrest-share.png",
  "frierdiker-rebbe-arrives-america": "fried-arrival-share.png",
  "frierdiker-rebbe-nesius": "fried-nesius-share.png",
  "passing-frierdiker-rebbe": "fried-pass-share.png",
  "hei-teves": "hei-teves-share.png",
  "liberation-mitteler-rebbe": "liberation mitteler share.png",
  "maharash-born": "maharash birth share.png",
  "maharash-nesius-begins": "maharash nesius share.png",
  "passing-maharash": "maharash pass share.png",
  "mitteler-rebbe-nesius": "nesius mitteler share.png",
  "passing-chaya-mushka": "pass-chaya-share.png",
  "passing-rebbe": "pass-rebbe-share.png",
  "passing-mitteler-rebbe": "passing mittler share.png",
  "passing-tzemach-tzedek": "passing tzemach share.png",
  "rashab-born": "rashab birth share.png",
  "passing-rashab": "rashab passing share.png",
  "birthday-of-rebbe": "rebbe birth share.png",
  "rebbe-rebbetzin-arrive-america": "rebbe-arrive-share.png",
  "yom-hilula-levi-yitzchok": "rebbe-father-pass-share.png",
  "rebbe-heart-attack-recovery": "rebbe-heart-share.png",
  "kabolas-hanisius-rebbe": "rebbe-nesius-share.png",
  "rebbe-rebbetzin-wedding-anniversary": "rebbe-wedding-share.png",
  "passing-rebbetzin-shterna-sara": "shterna-pass-share.png",
  "mivtza-tefillin": "teffilin-share.png",
  "founding-of-tomchei-temimim": "tomchei share.png",
  "tzemach-tzedek-wedding": "wedding tzemach share.png"
};

// Helper function to get the share card image path for an event
export function getShareCardPath(eventId?: string): string | null {
  if (!eventId || !shareCardMap[eventId]) {
    return null;
  }
  // Return the require path for local assets
  return shareCardMap[eventId];
}

// Helper function to get the full require statement for React Native
export function getShareCardImage(eventId?: string): any {
  if (!eventId || !shareCardMap[eventId]) {
    return null;
  }
  
  const filename = shareCardMap[eventId];
  // Map filenames to require statements (with actual filenames from assets folder)
  const imageMap: Record<string, any> = {
    "Alter Rebbe Birth Share.png": require("../../assets/share-pics/Alter Rebbe Birth Share.png"),
    "Liberation alter share.png": require("../../assets/share-pics/Liberation alter share.png"),
    "Mitteler Rebbe Birth Share.png": require("../../assets/share-pics/Mitteler Rebbe Birth Share.png"),
    "Passing alter share.png": require("../../assets/share-pics/Passing alter share.png"),
    "Rashab Wedding share.png": require("../../assets/share-pics/Rashab Wedding share.png"),
    "Tanya Share.png": require("../../assets/share-pics/Tanya Share.png"),
    "Tzemach Tzedek Birth Share.png": require("../../assets/share-pics/Tzemach Tzedek Birth Share.png"),
    "Tzemach nesius share.png": require("../../assets/share-pics/Tzemach nesius share.png"),
    "aryeh-leib-share.png": require("../../assets/share-pics/aryeh-leib-share.png"),
    "chana birth share.png": require("../../assets/share-pics/chana birth share.png"),
    "chana-pass-share.png": require("../../assets/share-pics/chana-pass-share.png"),
    "chaya mushka birth share.png": require("../../assets/share-pics/chaya mushka birth share.png"),
    "fried birth share.png": require("../../assets/share-pics/fried birth share.png"),
    "fried-arrest-share.png": require("../../assets/share-pics/fried-arrest-share.png"),
    "fried-arrival-share.png": require("../../assets/share-pics/fried-arrival-share.png"),
    "fried-nesius-share.png": require("../../assets/share-pics/fried-nesius-share.png"),
    "fried-pass-share.png": require("../../assets/share-pics/fried-pass-share.png"),
    "hei-teves-share.png": require("../../assets/share-pics/hei-teves-share.png"),
    "liberation mitteler share.png": require("../../assets/share-pics/liberation mitteler share.png"),
    "maharash birth share.png": require("../../assets/share-pics/maharash birth share.png"),
    "maharash nesius share.png": require("../../assets/share-pics/maharash nesius share.png"),
    "maharash pass share.png": require("../../assets/share-pics/maharash pass share.png"),
    "nesius mitteler share.png": require("../../assets/share-pics/nesius mitteler share.png"),
    "pass-chaya-share.png": require("../../assets/share-pics/pass-chaya-share.png"),
    "pass-rebbe-share.png": require("../../assets/share-pics/pass-rebbe-share.png"),
    "passing mittler share.png": require("../../assets/share-pics/passing mittler share.png"),
    "passing tzemach share.png": require("../../assets/share-pics/passing tzemach share.png"),
    "rashab birth share.png": require("../../assets/share-pics/rashab birth share.png"),
    "rashab passing share.png": require("../../assets/share-pics/rashab passing share.png"),
    "rebbe birth share.png": require("../../assets/share-pics/rebbe birth share.png"),
    "rebbe-arrive-share.png": require("../../assets/share-pics/rebbe-arrive-share.png"),
    "rebbe-father-pass-share.png": require("../../assets/share-pics/rebbe-father-pass-share.png"),
    "rebbe-heart-share.png": require("../../assets/share-pics/rebbe-heart-share.png"),
    "rebbe-nesius-share.png": require("../../assets/share-pics/rebbe-nesius-share.png"),
    "rebbe-wedding-share.png": require("../../assets/share-pics/rebbe-wedding-share.png"),
    "shterna-pass-share.png": require("../../assets/share-pics/shterna-pass-share.png"),
    "teffilin-share.png": require("../../assets/share-pics/teffilin-share.png"),
    "tomchei share.png": require("../../assets/share-pics/tomchei share.png"),
    "wedding tzemach share.png": require("../../assets/share-pics/wedding tzemach share.png"),
  };
  
  return imageMap[filename] || null;
}
