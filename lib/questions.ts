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
  options: Array<{ id: string; label: string; value: string }>;
}

/** Card layout variants for OptionCard. See components/quiz/OptionCard.tsx.
 *  'split-photo' renders a hero photo of the user's matched character above the
 *  stacked option list (BetterMe-style). When this variant is set, splitPhotoSlot
 *  must point at a character pose folder under public/images/photo/. */
export type CardVariant = 'portrait' | 'square' | 'wide' | 'icon-row' | 'split-photo';

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
    id: 'metrics',
    type: 'numeric-combo',
    headline: 'Височина и тегло',
    subheadline: 'За да изчислим индекса и калоричността ти.',
    inputs: [
      { name: 'height', label: 'Височина', min: 140, max: 220, default: 170, suffix: 'см' },
      { name: 'weight', label: 'Тегло сега', min: 40, max: 200, default: 80, suffix: 'кг' },
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
    cardVariant: 'icon-row',
    optionsByGender: {
      male: [
        { id: 'belly', label: 'Корем', value: 'belly', icon: 'target' },
        { id: 'love-handles', label: 'Любовни дръжки', value: 'love-handles', icon: 'arrow-right-left' },
        { id: 'chest', label: 'Гърди', value: 'chest', icon: 'shield-alert' },
        { id: 'back', label: 'Гръб', value: 'back', icon: 'rotate-ccw' },
        { id: 'arms', label: 'Ръце', value: 'arms', icon: 'dumbbell' },
        { id: 'whole-body', label: 'Цялото тяло', value: 'whole-body', icon: 'user' },
      ],
      female: [
        { id: 'belly', label: 'Корем', value: 'belly', icon: 'target' },
        { id: 'waist', label: 'Талия', value: 'waist', icon: 'circle-slash' },
        { id: 'hips', label: 'Ханш', value: 'hips', icon: 'compass' },
        { id: 'thighs', label: 'Бедра', value: 'thighs', icon: 'mountain' },
        { id: 'arms', label: 'Ръце', value: 'arms', icon: 'dumbbell' },
        { id: 'whole-body', label: 'Цялото тяло', value: 'whole-body', icon: 'user' },
      ],
    },
  },
  {
    step: 7,
    id: 'interstitial-early',
    type: 'interstitial',
    headline: '8 от 10 души идват при нас със същите зони',
    bodyBg: 'Не е твоята вина. Просто грешният подход. Ще го променим.',
    ctaBg: 'Продължи',
    imageUrl: '/images/photo/testimonials/{gender}-1.jpg',
  },
  {
    step: 8,
    id: 'activity',
    type: 'single-select',
    headline: 'Колко активен/-на си през седмицата?',
    cardVariant: 'icon-row',
    options: [
      { id: 'sedentary', label: 'Почти не се движа', sub: 'Седяща работа, без спорт', value: 'sedentary', icon: 'armchair' },
      { id: 'light', label: 'Лек активен/-на', sub: 'Рядко тренировки', value: 'light', icon: 'footprints' },
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
    headline: 'Въглехидратите не са враг',
    bodyBg: 'Carb-Cycling редува дни с високи и ниски въглехидрати, за да задържи метаболизма ти буден. Никаква диета, никакво сбогом с любимата храна.',
    ctaBg: 'Продължи',
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
    headline: 'Какво си пробвал/-а досега?',
    minSelect: 1,
    cardVariant: 'icon-row',
    options: [
      { id: 'gym', label: 'Фитнес зала', sub: 'Карта или абонамент', value: 'gym', icon: 'dumbbell' },
      { id: 'diets', label: 'Диети', sub: 'Кето, IF, нискокалорично', value: 'diets', icon: 'carrot' },
      { id: 'youtube', label: 'YouTube програми', sub: 'Безплатни тренировки', value: 'youtube', icon: 'play' },
      { id: 'supplements', label: 'Хранителни добавки', sub: 'Протеин, креатин, витамини', value: 'supplements', icon: 'pill' },
      { id: 'pt', label: 'Личен треньор', sub: 'Платена индивидуална работа', value: 'pt', icon: 'user' },
      { id: 'nothing', label: 'Нищо още', sub: 'Започвам отначало', value: 'nothing', icon: 'circle-slash' },
    ],
  },
  {
    step: 14,
    id: 'interstitial-1',
    type: 'interstitial',
    headline: 'Над 10 000 души преминаха същия път с Dr.Fit',
    bodyBg: '98% казват, че проблемът не беше волята им. Беше планът.',
    ctaBg: 'Продължи',
    imageUrl: '/images/photo/testimonials/{gender}-2.jpg',
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
    headline: '30 минути работят повече от 2 часа във фитнеса',
    bodyBg: 'Time-Under-Tension и AfterBurn ефектът — кратки, бавни тренировки, които горят калории часове след като си приключил/-а. Без зала, без апаратура.',
    ctaBg: 'Продължи',
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
    imageUrl: '/images/photo/testimonials/{gender}-3.jpg',
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
    headline: '„Не вярвах, че е възможно без личен треньор"',
    bodyBg: 'Иван свали 14 кг за 4 месеца, по 30 минути на ден у дома. Над 10 000 души вече следват Dr.Fit. 9 от 10 виждат резултат в първите 30 дни.',
    ctaBg: 'Продължи',
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
      { id: 'no-plan', label: 'Нямам план', sub: 'Без ясна структура', value: 'no-plan', icon: 'route' },
      { id: 'no-support', label: 'Нямам подкрепа', sub: 'Сам/сама съм в това', value: 'no-support', icon: 'users' },
      { id: 'expensive', label: 'Скъпо ми е', sub: 'Бюджетът е стегнат', value: 'expensive', icon: 'coins' },
      { id: 'lost', label: 'Не знам откъде да започна', sub: 'Прекалено много информация', value: 'lost', icon: 'compass' },
      { id: 'fear', label: 'Страх ме е, че няма да издържа', sub: 'Притеснява ме провал', value: 'fear', icon: 'shield-alert' },
      { id: 'failed', label: 'Пробвал/-а съм и не върви', sub: 'Не получавам резултат', value: 'failed', icon: 'trending-down' },
    ],
  },
  {
    step: 24,
    id: 'interstitial-commit',
    type: 'interstitial',
    headline: 'Виждаме точно къде си заседнал/-а. И как да продължиш',
    bodyBg: 'Остават малко въпроси. После сглобяваме плана, скроен само за теб.',
    ctaBg: 'Продължи',
    imageUrl: '/images/photo/testimonials/{gender}-4.jpg',
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
        ],
      },
      {
        id: 'equipment',
        atProgress: 0.65,
        headline: 'С какво оборудване разполагаш?',
        options: [
          { id: 'home', label: 'Само у дома', value: 'home' },
          { id: 'gym', label: 'Зала', value: 'gym' },
          { id: 'both', label: 'И двете', value: 'both' },
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
