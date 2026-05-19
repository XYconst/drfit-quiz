// Dr.Fit quiz step definitions. All BG copy is original, written in dr-fit's
// brand voice (informal "Ти", direct, concrete numbers). Source of truth: quiz-spec.md.

import type { Gender } from './avatars';

export type StepType =
  | 'single-select'
  | 'multi-select'
  | 'numeric-combo'
  | 'date'
  | 'body-area'
  | 'interstitial'
  | 'calculating'
  | 'projection'
  | 'email-gate';

/** Mid-loading micro-question shown as an overlay during the calculating step. */
export interface MidQuestionSpec {
  id: string;
  /** 0..1, the loading-progress threshold at which to pause and show this question. */
  atProgress: number;
  headline: string;
  options: Array<{
    id: string;
    label: string;
    value: string;
    /** If set, picking this option shows the note (and a "continue anyway"
     *  button) instead of advancing immediately. Use to softly tell the user
     *  the product isn't a fit but let them through. */
    disqualifyNote?: string;
  }>;
}

/** Card layout variants for OptionCard. See components/quiz/OptionCard.tsx.
 *  'split-photo' renders a hero photo of the user's matched character above the
 *  stacked option list (BetterMe-style). When this variant is set, splitPhotoSlot
 *  must point at a character pose folder under public/images/photo/. */
export type CardVariant = 'portrait' | 'square' | 'wide' | 'icon-row' | 'text-row' | 'split-photo';

export interface OptionSpec {
  id: string;
  label: string;
  /** Optional secondary descriptor used by the wide and icon-row variants. */
  sub?: string;
  value: string; // persisted into answers map
  imageUrl?: string;
  /** Lucide icon name from ICON_REGISTRY. Required when the parent step uses cardVariant: 'icon-row'. */
  icon?: string;
  /** Color-coded icon-badge tone for icon-row variant. Use to differentiate emotionally-loaded choices. */
  tone?: 'default' | 'red' | 'amber' | 'dark';
}

export interface NumericInputSpec {
  name: string;
  label: string;
  min: number;
  max: number;
  default?: number;
  suffix?: string;
}

export interface StepSpec {
  step: number;
  id: string; // stable key used in answers map
  type: StepType;
  headline?: string;
  subheadline?: string;
  options?: OptionSpec[];
  optionsByGender?: { male: OptionSpec[]; female: OptionSpec[] };
  /** Layout variant for OptionCard. Defaults are inferred by option count. */
  cardVariant?: CardVariant;
  minSelect?: number;
  maxSelect?: number;
  inputs?: NumericInputSpec[];
  durationMs?: number;
  milestonesBg?: string[];
  midQuestions?: MidQuestionSpec[];
  bodyBg?: string;
  /** Italic reassurance line shown above the CTA on transitional / projection screens. */
  reassureBg?: string;
  ctaBg?: string;
  fields?: Array<{ name: string; type: 'email' | 'tel'; label: string; placeholder?: string; required: boolean }>;
  /** If true, only render when gender matches. */
  showOnlyForGender?: Gender;
  /** When cardVariant is 'split-photo', this slot name is resolved to
   *  /images/photo/{splitPhotoSlot}/{characterCode}.png at render time. */
  splitPhotoSlot?: string;
  /** Direct image URL for an interstitial. Takes precedence over splitPhotoSlot.
   *  Use for static assets like real before/after testimonial photos that should
   *  not vary by character. */
  imageUrl?: string;
  /** Per-gender attribution caption, rendered on top of the interstitial photo
   *  (e.g. "Иван, 34 · март 2024"). Not shown when absent. */
  testimonialByGender?: { male: string; female: string };
  /** Per-gender testimonial id from TESTIMONIALS. When set, the interstitial
   *  renders the full before/after composite (not the single-photo imageUrl)
   *  and auto-builds the caption from the testimonial's name + age + city.
   *  Takes precedence over imageUrl and testimonialByGender. */
  testimonialIdByGender?: { male: string; female: string };
  /** When set, the interstitial dynamically picks a testimonial that matches
   *  the user's gender + goal direction + age, then takes the Nth best match.
   *  Different ranks across sibling interstitials give variety. Falls back to
   *  same-gender when no direction match exists. Takes precedence over
   *  testimonialIdByGender. */
  testimonialPick?: { rank: number };
  /** When true, renders the App Store + Google Play badges with a star rating
   *  underneath the body text. Use on social-proof interstitials. */
  showStoreBadges?: boolean;
}

const img = (step: string, opt: string) => `/images/quiz/${step}/${opt}.svg`;

export const STEPS: StepSpec[] = [
  {
    step: 1,
    id: 'gender',
    type: 'single-select',
    headline: 'Започваме с теб',
    subheadline: 'Мъж или жена?',
    cardVariant: 'portrait',
    options: [
      { id: 'male', label: 'Мъж', value: 'male', imageUrl: '/images/photo/gender/male.png' },
      { id: 'female', label: 'Жена', value: 'female', imageUrl: '/images/photo/gender/female.png' },
    ],
  },
  {
    step: 2,
    id: 'age',
    type: 'single-select',
    headline: 'На колко си?',
    cardVariant: 'square',
    optionsByGender: {
      male: [
        { id: '18-29', label: '18-29', value: '18-29', imageUrl: '/images/photo/ref/m1.png' },
        { id: '30-39', label: '30-39', value: '30-39', imageUrl: '/images/photo/ref/m2.png' },
        { id: '40-49', label: '40-49', value: '40-49', imageUrl: '/images/photo/ref/m3.png' },
        { id: '50+', label: '50+', value: '50+', imageUrl: '/images/photo/ref/m4.png' },
      ],
      female: [
        { id: '18-29', label: '18-29', value: '18-29', imageUrl: '/images/photo/ref/f1.png' },
        { id: '30-39', label: '30-39', value: '30-39', imageUrl: '/images/photo/ref/f2.png' },
        { id: '40-49', label: '40-49', value: '40-49', imageUrl: '/images/photo/ref/f3.png' },
        { id: '50+', label: '50+', value: '50+', imageUrl: '/images/photo/ref/f4.png' },
      ],
    },
  },
  {
    step: 3,
    id: 'height',
    type: 'numeric-combo',
    headline: 'Каква е височината ти?',
    subheadline: 'Използваме я, за да изчислим BMI и калоричността.',
    inputs: [
      { name: 'height', label: 'Височина', min: 140, max: 220, default: 170, suffix: 'см' },
    ],
  },
  {
    step: 3,
    id: 'weight',
    type: 'numeric-combo',
    headline: 'Колко тежиш сега?',
    subheadline: 'Без срам — числото е само за плана, не го споделяме.',
    inputs: [
      { name: 'weight', label: 'Тегло сега', min: 40, max: 200, default: 80, suffix: 'кг' },
    ],
  },
  {
    step: 3,
    id: 'targetWeight',
    type: 'numeric-combo',
    headline: 'Какво е целевото ти тегло?',
    subheadline: 'Това е числото, към което ще те водим.',
    inputs: [
      { name: 'targetWeight', label: 'Целево тегло', min: 40, max: 200, default: 70, suffix: 'кг' },
    ],
  },
  {
    step: 4,
    id: 'goal',
    type: 'single-select',
    headline: 'Каква е твоята цел?',
    cardVariant: 'icon-row',
    optionsByGender: {
      male: [
        { id: 'lose-major', label: 'Сваляне на тегло', sub: 'Свалям мазнини, виждам резултат', value: 'lose-major', icon: 'trending-down', tone: 'red' },
        { id: 'tone-recomp', label: 'Рекомпозиция', sub: 'Свалям мазнини и градя мускули', value: 'tone-recomp', icon: 'arrow-right-left', tone: 'amber' },
        { id: 'gain-mass', label: 'Качване на маса', sub: 'Чиста мускулна маса', value: 'gain-mass', icon: 'trending-up', tone: 'dark' },
      ],
      female: [
        { id: 'lose-major', label: 'Сваляне на тегло', sub: 'Свалям мазнини, виждам резултат', value: 'lose-major', icon: 'trending-down', tone: 'red' },
        { id: 'tone-recomp', label: 'Тонизиране', sub: 'Стягам тялото и сваля малко', value: 'tone-recomp', icon: 'arrow-right-left', tone: 'amber' },
        { id: 'tone-only', label: 'Дефиниране', sub: 'Стягам форми, без отслабване', value: 'tone-only', icon: 'sparkles', tone: 'dark' },
      ],
    },
  },
  {
    step: 5,
    id: 'bodyType',
    type: 'single-select',
    headline: 'Кое тяло описва теб днес?',
    subheadline: 'Не търсим точно копие — избери това, което се чувства най-близо до теб сега.',
    cardVariant: 'portrait',
    optionsByGender: {
      male: [
        // imageUrl is a placeholder template. Resolved per character in QuizContainer.
        { id: 'overweight', label: 'С наднормено тегло', value: 'overweight', imageUrl: '/images/photo/body-type/{char}-overweight.png' },
        { id: 'skinny-fat', label: 'Слаб с малко мазнини', value: 'skinny-fat', imageUrl: '/images/photo/body-type/{char}-skinny-fat.png' },
        { id: 'underweight', label: 'С ниско тегло', value: 'underweight', imageUrl: '/images/photo/body-type/{char}-underweight.png' },
        { id: 'perfect', label: 'В перфектна форма съм', value: 'perfect', imageUrl: '/images/photo/body-type/{char}-perfect.png' },
      ],
      female: [
        { id: 'overweight', label: 'С наднормено тегло', value: 'overweight', imageUrl: '/images/photo/body-type/{char}-overweight.png' },
        { id: 'skinny-fat', label: 'Стройна, но не стегната', value: 'skinny-fat', imageUrl: '/images/photo/body-type/{char}-skinny-fat.png' },
        { id: 'underweight', label: 'С ниско тегло', value: 'underweight', imageUrl: '/images/photo/body-type/{char}-underweight.png' },
        { id: 'perfect', label: 'В перфектна форма съм', value: 'perfect', imageUrl: '/images/photo/body-type/{char}-perfect.png' },
      ],
    },
  },
  {
    step: 6,
    id: 'problemAreas',
    type: 'multi-select',
    headline: 'Кои зони те притесняват най-много?',
    minSelect: 1,
    maxSelect: 6,
    cardVariant: 'text-row',
    optionsByGender: {
      male: [
        { id: 'belly', label: 'Корем', value: 'belly' },
        { id: 'love-handles', label: 'Любовни дръжки', value: 'love-handles' },
        { id: 'chest', label: 'Гърди', value: 'chest' },
        { id: 'back', label: 'Гръб', value: 'back' },
        { id: 'arms', label: 'Ръце', value: 'arms' },
        { id: 'whole-body', label: 'Цялото тяло', value: 'whole-body' },
      ],
      female: [
        { id: 'belly', label: 'Корем', value: 'belly' },
        { id: 'waist', label: 'Талия', value: 'waist' },
        { id: 'hips', label: 'Ханш', value: 'hips' },
        { id: 'thighs', label: 'Бедра', value: 'thighs' },
        { id: 'arms', label: 'Ръце', value: 'arms' },
        { id: 'whole-body', label: 'Цялото тяло', value: 'whole-body' },
      ],
    },
  },
  {
    step: 7,
    id: 'interstitial-early',
    type: 'interstitial',
    headline: 'Много хора идват при нас със същите зони като теб',
    bodyBg: 'Не е твоята вина. Просто грешният подход. Ще го променим.',
    ctaBg: 'Продължи',
    testimonialPick: { rank: 0 },
  },
  {
    step: 8,
    id: 'activity',
    type: 'single-select',
    headline: 'Колко активен/-на си през седмицата?',
    cardVariant: 'icon-row',
    options: [
      { id: 'sedentary', label: 'Почти не се движа', sub: 'Седяща работа, без спорт', value: 'sedentary', icon: 'armchair' },
      { id: 'light', label: 'Леко активен/-на', sub: 'Рядко тренировки', value: 'light', icon: 'footprints' },
      { id: 'moderate', label: 'Умерено', sub: '2-3 тренировки седмично', value: 'moderate', icon: 'dumbbell' },
      { id: 'high', label: 'Много активен/-на', sub: '4+ тренировки седмично', value: 'high', icon: 'mountain' },
    ],
  },
  {
    step: 8,
    id: 'jobMovement',
    type: 'single-select',
    headline: 'Какво описва твоя ден?',
    cardVariant: 'icon-row',
    options: [
      { id: 'desk', label: 'Седяща работа, 8+ часа на стол', sub: 'Малко движение през деня', value: 'desk', icon: 'monitor' },
      { id: 'standing', label: 'Прав/-а през повечето време', sub: 'Без редовни тренировки', value: 'standing', icon: 'person-standing' },
      { id: 'physical', label: 'Физическа работа', sub: 'Активен ден', value: 'physical', icon: 'hard-hat' },
    ],
  },
  {
    step: 9,
    id: 'sleep',
    type: 'single-select',
    headline: 'Как спиш?',
    cardVariant: 'icon-row',
    options: [
      { id: 'lt5', label: 'Под 5 часа', sub: 'Хронично недоспиване', value: 'lt5', icon: 'bed' },
      { id: '5-6', label: '5-6 часа', sub: 'Под минимума', value: '5-6', icon: 'cloud' },
      { id: '6-7', label: '6-7 часа', sub: 'На границата', value: '6-7', icon: 'moon' },
      { id: '7-8', label: '7-8 часа', sub: 'Здравословно', value: '7-8', icon: 'moon-star' },
      { id: '8plus', label: 'Над 8 часа', sub: 'Дълъг сън', value: '8plus', icon: 'sunrise' },
    ],
  },
  {
    step: 100,
    id: 'building-1',
    type: 'interstitial',
    headline: '„Спя по-малко, а имам повече енергия"',
    bodyBg: 'За 8 седмици с Dr.Fit метаболизмът, сънят и стресът се балансират. Затова те питаме точно за тях.',
    ctaBg: 'Продължи',
    testimonialPick: { rank: 1 },
  },
  {
    step: 10,
    id: 'stress',
    type: 'single-select',
    headline: 'Колко стрес имаш?',
    cardVariant: 'split-photo',
    splitPhotoSlot: 'split-stretch',
    options: [
      { id: 'low', label: 'Нисък', sub: 'Спокоен/-йна съм', value: 'low', icon: 'smile' },
      { id: 'medium', label: 'Среден', sub: 'Има моменти', value: 'medium', icon: 'meh' },
      { id: 'high', label: 'Висок', sub: 'Често съм напрегнат/-а', value: 'high', icon: 'frown' },
      { id: 'burnout', label: 'Изгарящ', sub: 'Не мога да се отпусна', value: 'burnout', icon: 'cloud-lightning' },
    ],
  },
  {
    step: 11,
    id: 'water',
    type: 'single-select',
    headline: 'Колко вода пиеш на ден?',
    cardVariant: 'split-photo',
    splitPhotoSlot: 'split-bottle',
    options: [
      { id: 'lt1l', label: 'Под 1 литър', sub: 'Често забравяш', value: 'lt1l', icon: 'glass-water' },
      { id: '1-2l', label: '1-2 литра', sub: 'Стандартно', value: '1-2l', icon: 'cup-soda' },
      { id: '2-3l', label: '2-3 литра', sub: 'Стабилен прием', value: '2-3l', icon: 'droplet' },
      { id: '3plus', label: 'Над 3 литра', sub: 'Активен/-на си', value: '3plus', icon: 'waves' },
    ],
  },
  {
    step: 12,
    id: 'dietStyle',
    type: 'single-select',
    headline: 'Как се храниш сега?',
    cardVariant: 'split-photo',
    splitPhotoSlot: 'split-bench',
    options: [
      { id: 'free', label: 'Ям каквото ми се яде', sub: 'Без правила', value: 'free', icon: 'sandwich' },
      { id: 'mindful', label: 'Опитвам се да внимавам', sub: 'Гледам по-чисто, без строг план', value: 'mindful', icon: 'leaf' },
      { id: 'planned', label: 'Следвам конкретен план', sub: 'Имам ясна структура', value: 'planned', icon: 'target' },
      { id: 'yoyo', label: 'Опитвам, но не издържам', sub: 'Тръгвам силно, после спирам', value: 'yoyo', icon: 'circle-pause' },
      { id: 'none', label: 'Нямам никаква система', sub: 'Храня се хаотично', value: 'none', icon: 'shuffle' },
    ],
  },
  {
    step: 13,
    id: 'pastAttempts',
    type: 'multi-select',
    headline: 'Какъв режим на хранене си пробвал/-а?',
    minSelect: 1,
    cardVariant: 'icon-row',
    options: [
      { id: 'keto', label: 'Кето', sub: 'Високи мазнини, минимум въглехидрати', value: 'keto', icon: 'flame' },
      { id: 'carnivore', label: 'Карнивор', sub: 'Само месо и животински продукти', value: 'carnivore', icon: 'drumstick' },
      { id: 'low-carb', label: 'Без въглехидрати', sub: 'Изрязах хляба, ориза, тестото', value: 'low-carb', icon: 'wheat-off' },
      { id: 'intuitive', label: 'Интуитивно хранене', sub: 'Без правила, ям когато съм гладен/-а', value: 'intuitive', icon: 'heart' },
      { id: 'macros', label: 'Броене на макроси', sub: 'IIFYM, премерям всичко', value: 'macros', icon: 'calculator' },
      { id: 'nothing', label: 'Нищо още', sub: 'Започвам отначало', value: 'nothing', icon: 'circle-slash' },
    ],
  },
  {
    step: 14,
    id: 'interstitial-1',
    type: 'interstitial',
    headline: 'Над 50 000 души свалиха Dr.Fit от 2024',
    bodyBg: '98% казват, че проблемът не беше волята им. Беше планът. Сега го имаш в джоба си.',
    ctaBg: 'Продължи',
    testimonialPick: { rank: 2 },
  },
  {
    step: 15,
    id: 'mealTiming',
    type: 'single-select',
    headline: 'Кога ядеш повечето си храна?',
    cardVariant: 'icon-row',
    options: [
      { id: 'morning', label: 'Сутрин', sub: 'Закуската е най-голяма', value: 'morning', icon: 'sun' },
      { id: 'lunch', label: 'На обяд', sub: 'Балансирано в средата', value: 'lunch', icon: 'utensils' },
      { id: 'evening', label: 'Вечер', sub: 'Често пропускам закуска', value: 'evening', icon: 'sunset' },
      { id: 'graze', label: 'Хапвам по малко цял ден', sub: 'Без ясна структура', value: 'graze', icon: 'wheat' },
    ],
  },
  {
    step: 16,
    id: 'energy',
    type: 'single-select',
    headline: 'Как е енергията ти?',
    cardVariant: 'split-photo',
    splitPhotoSlot: 'split-squat',
    options: [
      { id: 'stable', label: 'Стабилна', sub: 'Издържам докрай', value: 'stable', icon: 'gauge' },
      { id: 'afternoon-crash', label: 'Падам следобед', sub: 'Имам ясен спад', value: 'afternoon-crash', icon: 'battery-medium' },
      { id: 'always-tired', label: 'Уморен/-а съм почти винаги', sub: 'Хронична умора', value: 'always-tired', icon: 'battery-low' },
      { id: 'caffeine', label: 'Държа се с кафе', sub: 'Без него не мога', value: 'caffeine', icon: 'coffee' },
    ],
  },
  {
    step: 17,
    id: 'cravings',
    type: 'single-select',
    headline: 'След ядене ти се иска още?',
    cardVariant: 'icon-row',
    options: [
      { id: 'sweet', label: 'Сладко', sub: 'Десерт или плод', value: 'sweet', icon: 'cake' },
      { id: 'salty', label: 'Солено', sub: 'Нещо хрупкаво', value: 'salty', icon: 'pizza' },
      { id: 'both', label: 'И двете', sub: 'В различни моменти', value: 'both', icon: 'cookie' },
      { id: 'none', label: 'Не, наситен/-а съм', sub: 'Спирам без усилие', value: 'none', icon: 'apple' },
    ],
  },
  {
    step: 101,
    id: 'building-2',
    type: 'interstitial',
    headline: 'Въглехидратите не са враг',
    bodyBg: 'Въглехидратната ротация редува дни с високи и ниски въглехидрати, за да задържи метаболизма ти буден. Никаква диета, никакво сбогом с любимата храна.',
    ctaBg: 'Продължи',
    imageUrl: '/images/photo/interstitials/building-1.png',
  },
  {
    step: 18,
    id: 'bloating',
    type: 'single-select',
    headline: 'Подуваш ли се след хранене?',
    cardVariant: 'square',
    options: [
      { id: 'often', label: 'Често', sub: 'Почти всеки ден', value: 'often', imageUrl: '/images/photo/bloating/{char}-often.png' },
      { id: 'sometimes', label: 'Понякога', sub: 'След тежки храни', value: 'sometimes', imageUrl: '/images/photo/bloating/{char}-sometimes.png' },
      { id: 'rarely', label: 'Рядко', sub: 'Изключения са', value: 'rarely', imageUrl: '/images/photo/bloating/{char}-rarely.png' },
      { id: 'never', label: 'Никога', sub: 'Нямам проблем', value: 'never', imageUrl: '/images/photo/bloating/{char}-never.png' },
    ],
  },
  {
    step: 19,
    id: 'bodyTemp',
    type: 'single-select',
    headline: 'Как е температурата на тялото ти?',
    cardVariant: 'split-photo',
    splitPhotoSlot: 'split-towel',
    options: [
      { id: 'cold', label: 'Често ми е студено', sub: 'Особено ръце и крака', value: 'cold', icon: 'thermometer-snowflake' },
      { id: 'normal', label: 'Нормално', sub: 'Без отклонения', value: 'normal', icon: 'thermometer' },
      { id: 'hot', label: 'Често ми е топло', sub: 'Потя се лесно', value: 'hot', icon: 'thermometer-sun' },
    ],
  },
  {
    step: 20,
    id: 'interstitial-2',
    type: 'interstitial',
    headline: '92% от хората с твоя профил виждат първи резултати в първите 30 дни',
    bodyBg: 'Това е силата на персонализацията. Ще ти покажем точно защо.',
    ctaBg: 'Продължи',
    testimonialPick: { rank: 3 },
  },
  {
    step: 21,
    id: 'motivation',
    type: 'multi-select',
    headline: 'Защо искаш да се промениш точно сега?',
    minSelect: 1,
    cardVariant: 'icon-row',
    options: [
      { id: 'health', label: 'За здраве', sub: 'Дълъг и активен живот', value: 'health', icon: 'heart' },
      { id: 'partner', label: 'За половинката си', sub: 'Иска ми се да впечатля', value: 'partner', icon: 'users' },
      { id: 'photos', label: 'За да се харесвам на снимки', sub: 'Да съм уверен/-а', value: 'photos', icon: 'camera' },
      { id: 'kids', label: 'За децата', sub: 'Да съм пример', value: 'kids', icon: 'baby' },
      { id: 'event', label: 'Имам конкретно събитие', sub: 'Сватба, ваканция, рожден ден', value: 'event', icon: 'calendar' },
      { id: 'fed-up', label: 'Стига вече', sub: 'Готов/-а съм за промяна', value: 'fed-up', icon: 'flag' },
    ],
  },
  {
    step: 102,
    id: 'building-3',
    type: 'interstitial',
    headline: 'Личният ти треньор е с теб 24/7',
    bodyBg: 'Истински треньор от екипа на Dr.Fit, в джоба ти всеки ден. Тренировки за 30 минути у дома, седмични менюта и реален човек, който ти пише, когато имаш въпрос.',
    ctaBg: 'Продължи',
    imageUrl: '/images/photo/interstitials/building-3.png',
  },
  {
    step: 22,
    id: 'targetDate',
    type: 'date',
    headline: 'До кога искаш да достигнеш целта?',
  },
  {
    step: 23,
    id: 'blockers',
    type: 'multi-select',
    headline: 'Какво те спира досега?',
    minSelect: 1,
    cardVariant: 'icon-row',
    options: [
      { id: 'no-time', label: 'Нямам време', sub: 'Дните минават бързо', value: 'no-time', icon: 'clock' },
      { id: 'no-plan', label: 'Нямам ясен план', sub: 'Не знам откъде да започна', value: 'no-plan', icon: 'route' },
      { id: 'no-support', label: 'Нямам подкрепа', sub: 'Сам/-а съм в това', value: 'no-support', icon: 'users' },
      { id: 'expensive', label: 'Скъпо ми е', sub: 'Бюджетът е стегнат', value: 'expensive', icon: 'coins' },
      { id: 'failed', label: 'Опитвал/-а съм и не върви', sub: 'Страх ме е, че пак няма да издържа', value: 'failed', icon: 'trending-down' },
    ],
  },
  {
    step: 24,
    id: 'interstitial-commit',
    type: 'interstitial',
    headline: 'Виждаме точно къде си заседнал/-а. И как да продължиш',
    bodyBg: 'Остават малко въпроси. После сглобяваме плана, скроен само за теб.',
    ctaBg: 'Продължи',
    testimonialPick: { rank: 4 },
    showStoreBadges: true,
  },
  {
    step: 24,
    id: 'projection-preview',
    type: 'projection',
    headline: 'Така изглежда твоят път',
    subheadline: 'Готови сме с плана. Един последен поглед, преди да се захванем.',
    reassureBg: 'Планът ти е готов след минута.',
    ctaBg: 'Виж моя план',
  },
  {
    step: 25,
    id: 'calculating',
    type: 'calculating',
    headline: 'Анализираме твоя метаболитен профил',
    durationMs: 14000,
    milestonesBg: [
      'Анализираме отговорите ти',
      'Изчисляваме BMI и метаболитна възраст',
      'Изчисляваме хранителния ти режим',
      'Сравняваме с 10 000+ подобни профила',
      'Подбираме тренировъчната програма',
      'Компилираме резултатите...',
    ],
    midQuestions: [
      {
        id: 'workoutTime',
        atProgress: 0.3,
        headline: 'Кога предпочиташ да тренираш?',
        options: [
          { id: 'morning', label: 'Сутрин', value: 'morning' },
          { id: 'midday', label: 'Обед', value: 'midday' },
          { id: 'evening', label: 'Вечер', value: 'evening' },
          { id: 'anytime', label: 'Няма значение', value: 'anytime' },
        ],
      },
      {
        id: 'workoutDuration',
        atProgress: 0.65,
        headline: 'Колко време можеш да отделиш на ден за тренировка?',
        options: [
          { id: '15', label: 'До 15 минути', value: '15' },
          { id: '30', label: '15-30 минути', value: '30' },
          { id: '45', label: '30-45 минути', value: '45' },
          { id: '60+', label: 'Над 45 минути', value: '60+' },
          {
            id: 'none',
            label: 'Не мога да отделя време',
            value: 'none',
            disqualifyNote:
              'За съжаление без поне няколко минути на ден не можем да гарантираме резултат. Програмата работи на честота, не на дължина. Все пак можеш да продължиш и да видиш плана.',
          },
        ],
      },
    ],
  },
  {
    step: 26,
    id: 'email',
    type: 'email-gate',
    headline: 'Твоят 90-дневен план е готов',
    subheadline: 'Въведи email-а си и ти изпращаме плана плюс достъп до приложението',
    fields: [
      { name: 'email', type: 'email', label: 'Email', placeholder: 'твоят@email.bg', required: true },
      { name: 'phone', type: 'tel', label: 'Телефон (по желание)', placeholder: '+359...', required: false },
    ],
    ctaBg: 'Виж моя план',
  },
];

export const TOTAL_STEPS = STEPS.length;

export function getStep(n: number): StepSpec | undefined {
  // n is 1-indexed and reflects array position so we can insert/reorder freely
  // without renumbering every step.step field.
  return STEPS[n - 1];
}

export function resolveOptions(step: StepSpec, gender?: Gender): OptionSpec[] {
  if (step.optionsByGender && gender) return step.optionsByGender[gender];
  return step.options ?? [];
}

/** Resolve the card variant for a step. Falls back to a count-based default. */
export function resolveCardVariant(step: StepSpec, optionCount: number): CardVariant {
  if (step.cardVariant) return step.cardVariant;
  if (optionCount <= 3) return 'wide';
  if (optionCount === 4) return 'square';
  return 'square';
}
