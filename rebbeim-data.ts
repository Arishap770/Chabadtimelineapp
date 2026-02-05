import { TimelineEvent, timelineEvents } from './timeline-data';

export interface Sefer {
  title: string;
  titleHebrew?: string;
}

export interface Niggun {
  title: string;
  audioFile: string;
  description?: string;
}

export interface Family {
  lastName: string;
  father?: string;
  mother?: string;
  wife?: string;
  children?: string[];
  siblings?: string[];
}

export interface RebbeData {
  slug: string;
  name: string;
  fullName?: string;
  description: string;
  timeline: TimelineEvent[];
  family?: Family;
  sefarim?: Sefer[];
  niggunim?: Niggun[];
}

const getSlugFromName = (name: string): string => {
    return name.toLowerCase().replace(/\s/g, '-').replace(/'/g, '').replace(/rebbe-maharash/g, 'maharash').replace(/rebbe-rashab/g, 'rashab').replace(/frierdiker-rebbe/g, 'frierdiker-rebbe').replace(/lubavitcher-rebbe/g, 'rebbe');
};

const getPersonalTimeline = (name: string): TimelineEvent[] => {
    return timelineEvents.filter(event => event.tags.includes(name));
};

export const REBBEIM_DATA: RebbeData[] = [
  {
    slug: 'alter-rebbe',
    name: 'Alter Rebbe',
    fullName: 'Rabbi Schneur Zalman of Liadi',
    description: 'Rabbi Schneur Zalman of Liadi, founder of Chabad Chassidus, was known for his intellectual approach to Jewish mysticism and authored the seminal work, Tanya.',
    timeline: getPersonalTimeline("Alter Rebbe"),
    family: {
      lastName: 'Boruchovitch',
      father: 'Rabbi Baruch',
      mother: 'Rivka',
      wife: 'Rebbetzin Sterna',
      children: ['Rabbi DovBer (Mitteler Rebbe)', 'Rabbi Chaim Avraham', 'Rabbi Moshe', 'Freida', 'Rochel', 'Devorah Leah (Mother of the Tzemach Tzedek)']
    },
    sefarim: [
      { title: 'Tanya', titleHebrew: 'תניא' },
      { title: 'Shulchan Aruch HaRav', titleHebrew: 'שולחן ערוך הרב' },
      { title: 'Torah Or', titleHebrew: 'תורה אור' },
      { title: 'Likkutei Torah', titleHebrew: 'לקוטי תורה' }
    ],
    niggunim: [
      { title: 'Niggun Dalad Bavos', audioFile: '/dalad-bavos.mp3' },
      { title: 'Keili Atah', audioFile: '/keili-atah.mp3' }
    ]
  },
  {
    slug: 'mitteler-rebbe',
    name: 'Mitteler Rebbe',
    fullName: 'Rabbi DovBer Schneuri',
    description: "Rabbi DovBer Schneuri, the second Rebbe of Chabad, expanded on his father's teachings with deep, detailed analytical discourses, emphasizing intellectual contemplation of G-dliness.",
    timeline: getPersonalTimeline("Mitteler Rebbe"),
    family: {
      lastName: 'Schneuri',
      father: 'Rabbi Schneur Zalman (Alter Rebbe)',
      mother: 'Rebbetzin Sterna',
      wife: 'Rebbetzin Sheina',
      children: ['Menachem Nochum', 'Sarah (passed away at a very young age)', 'Boruch', 'Baila', 'Chaya Mushka (wife of the Tzemach Tzedek)', 'Devorah Leah', 'Menucha Rochel', 'Bracha', 'Sarah', 'Esther Miriam']
    },
    sefarim: [
      { title: 'Shaarei Orah', titleHebrew: 'שערי אורה' },
      { title: 'Imrei Binah', titleHebrew: 'אמרי בינה' },
      { title: 'Ateres Rosh', titleHebrew: 'עטרת ראש' },
      { title: 'Pokeach Ivrim', titleHebrew: 'פוקח עורים' },
      { title: 'Derech Chaim', titleHebrew: 'דרך חיים' },
      { title: 'Shaarei Teshuva', titleHebrew: 'שערי תשובה' },
      { title: 'Ner Mitzvah', titleHebrew: 'נר מצוה' }
    ],
    niggunim: [
      { title: "Mitteler Rebbe's Kapelye", audioFile: '/mitteler-niggun.mp3' },
      { title: 'Nye Zhuritze Chloptzi', audioFile: '/Nye.mp3' }
    ]
  },
  {
    slug: 'tzemach-tzedek',
    name: 'Tzemach Tzedek',
    fullName: 'Rabbi Menachem Mendel Schneersohn',
    description: 'Rabbi Menachem Mendel Schneersohn, the third Rebbe, was a prolific scholar, known for his vast Halachic responsa and his efforts to strengthen Jewish communal life under challenging conditions.',
    timeline: getPersonalTimeline("Tzemach Tzedek"),
    family: {
      lastName: 'Schneersohn',
      father: 'Rabbi Shmuel Shachna',
      mother: 'Rebbetzin Devorah Leah',
      wife: 'Rebbetzin Chaya Mushka',
      children: ['Boruch Sholom', 'Yehuda Leib', 'Chaim Schneur Zalman', 'Yisroel Noach', 'Yosef Yitzchak', 'Yaakov', 'Shmuel (The Rebbe Maharash)', 'Rodeh Freida', 'Devorah Leah']
    },
    sefarim: [
      { title: 'Tzemach Tzedek (Responsa)', titleHebrew: 'צמח צדק' },
      { title: 'Derech Mitzvosecha', titleHebrew: 'דרך מצותיך' },
      { title: 'Sefer HaChakira', titleHebrew: 'סידור עם דיני יסודי העבודה' },
      { title: 'Or Hatorah', titleHebrew: 'אור התורה' },
      { title: 'Biurei Hazohar', titleHebrew: 'ביאורי הזהר' }
    ],
    niggunim: [
      { title: 'Yemin Hashem', audioFile: '/yemin-hashem.mp3' },
      { title: 'Kaayol Taarog', audioFile: '/kaayol-taarog.mp3' }
    ]
  },
  {
    slug: 'maharash',
    name: 'Rebbe Maharash',
    fullName: 'Rabbi Shmuel Schneersohn',
    description: "Rabbi Shmuel Schneersohn, the fourth Rebbe, encouraged his followers to be assertive in their religious service with his famous saying, 'L'chatchila ariber'—to face obstacles head-on.",
    timeline: getPersonalTimeline("Rebbe Maharash"),
    family: {
      lastName: 'Schneersohn',
      father: 'Rabbi Menachem Mendel (Tzemach Tzedek)',
      mother: 'Rebbetzin Chaya Mushka',
      wife: 'Rebbetzin Rivka',
      children: ['Schneur Zalman Aharon', 'Shalom Dovber', 'Avraham Sender', 'Menachem Mendel', 'Devorah Leah', 'Chaya Mushka']
    },
    sefarim: [
      { title: 'Igros Kodesh', titleHebrew: 'איגרות קודש' },
      { title: 'Sefer Hatoldos', titleHebrew: 'ספר התולדות' },
      { title: 'Toras Shmuel', titleHebrew: 'תורת שמואל' }

    ],
    niggunim: [
      { title: 'Lechatchilla Ariber', audioFile: '/lechatchilla-ariber.mp3' }
    ]
  },
  {
    slug: 'rashab',
    name: 'Rebbe Rashab',
    fullName: 'Rabbi Sholom DovBer Schneersohn',
    description: 'Rabbi Sholom DovBer Schneersohn, the fifth Rebbe, founded the Tomchei Temimim Yeshiva system, revolutionizing Jewish education by combining Torah scholarship with Chassidic philosophy.',
    timeline: getPersonalTimeline("Rebbe Rashab"),
    family: {
      lastName: 'Schneersohn',
      father: 'Rabbi Shmuel (Rebbe Maharash)',
      mother: 'Rebbetzin Rivka',
      wife: 'Rebbetzin Shterna Sarah',
      children: ['Rabbi Yosef Yitzchak (The Frierdiker Rebbe)']
    },
    sefarim: [
      { title: 'Kuntres Umaayon', titleHebrew: 'קונטרס ומעינ' },
      { title: 'Kuntres Hatefila', titleHebrew: 'קונטרס התפלה' },
      { title: 'Kuntres Eitz HaChayim', titleHebrew: 'קונטרס עץ החיים' },
      { title: 'Sefer HaMaamarim', titleHebrew: 'ספר המאמרים' }
    ],
    niggunim: [
      { title: "Rashab's Niggun", audioFile: '/rashab-niggun.mp3' },
      { title: 'Niggun Hachana', audioFile: '/hachana.mp3' }
    ]
  },
  {
    slug: 'frierdiker-rebbe',
    name: 'Frierdiker Rebbe',
    fullName: 'Rabbi Yosef Yitzchak Schneersohn',
    description: 'Rabbi Yosef Yitzchak Schneersohn, the sixth Rebbe, guided the movement through Soviet oppression and successfully transplanted the heart of Chabad to the United States, initiating global outreach.',
    timeline: getPersonalTimeline("Frierdiker Rebbe"),
    family: {
      lastName: 'Schneersohn',
      father: 'Rabbi Sholom DovBer (Rebbe Rashab)',
      mother: 'Rebbetzin Shterna Sarah',
      wife: 'Rebbetzin Nechama Dina',
      children: ['Rebbetzin Chaya Mushka (wife of the Lubavitcher Rebbe)', 'Sheina', 'Chana']
    },
    sefarim: [
      { title: 'Likkutei Dibburim', titleHebrew: 'לקוטי דיבורים' },
      { title: 'Sefer HaSichos', titleHebrew: 'ספר השיחות' },
      { title: 'Igros Kodesh', titleHebrew: 'אגרות קודש' },
      { title: 'Sefer HaMaamarim', titleHebrew: 'ספר המאמרים' },
      { title: 'Sefer Hazichronos', titleHebrew: 'ספר הזכרונות' }

    ],
    niggunim: [
      { title: 'Beinoni Niggun', audioFile: '/fried-niggun.mp3' }
    ]
  },
  {
    slug: 'rebbe',
    name: 'Lubavitcher Rebbe',
    fullName: 'Rabbi Menachem Mendel Schneerson',
    description: 'Rabbi Menachem Mendel Schneerson, the seventh Rebbe, transformed Chabad into a worldwide movement through the Mivtzoim campaigns, outreach, and the establishment of thousands of Chabad Houses.',
    timeline: getPersonalTimeline("Lubavitcher Rebbe"),
    family: {
      lastName: 'Schneerson',
      father: 'Rabbi Levi Yitzchak',
      mother: 'Rebbetzin Chana',
      wife: 'Rebbetzin Chaya Mushka',
      siblings: ['Dovber', 'Yisroel Aryeh Leib'],
      children: []
    },
    sefarim: [
      { title: 'Likkutei Sichos', titleHebrew: 'לקוטי שיחות' },
      { title: 'Igros Kodesh', titleHebrew: 'אגרות קודש' },
      { title: 'Hayom Yom', titleHebrew: 'היום יום' },
      { title: 'Sefer HaMaamarim', titleHebrew: 'ספר המאמרים' }
    ],
    niggunim: [
      { title: 'Tzama Lecha Nafshi', audioFile: '/tzama.mp3' },
      { title: 'Hu Elokeinu', audioFile: '/Hu-Elokeinu.mp3' },
      { title: 'Atah Bechartanu', audioFile: '/atah-bechartanu.mp3' }
    ]
  },
  {
    slug: 'rebbetzin-chaya-mushka',
    name: 'Rebbetzin Chaya Mushka',
    description: 'Wife of the Lubavitcher Rebbe. She was renowned for her deep humility, piety, and profound devotion to supporting her husband’s global work. Her life serves as an inspiration of inner strength and dedication.',
    timeline: getPersonalTimeline("Rebbetzin Chaya Mushka"),
  },
  {
    slug: 'rebbetzin-chana',
    name: 'Rebbetzin Chana',
    description: 'Mother of the Lubavitcher Rebbe. She was a woman of extraordinary courage and faith who, even while exiled in Russia, painstakingly saved her husband’s Torah commentaries.',
    timeline: getPersonalTimeline("Rebbetzin Chana"),
  },
];

export const REBBEIM_MAP = REBBEIM_DATA.reduce((acc, rebbe) => {
    acc[rebbe.slug] = rebbe;
    return acc;
}, {} as { [key: string]: RebbeData });
