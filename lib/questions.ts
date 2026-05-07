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
  | 'email-gate';

/** Card layout variants for OptionCard. See components/quiz/OptionCard.tsx. */
export type CardVariant = 'portrait' | 'square' | 'wide';

export interface OptionSpec {
  id: string;
  label: string;
  /** Optional secondary descriptor used by the wide variant. */
  sub?: string;
  value: string; // persisted into answers map
  imageUrl?: string;
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
  bodyBg?: string;
  ctaBg?: string;
  fields?: Array<{ name: string; type: 'email' | 'tel'; label: string; placeholder?: string; required: boolean }>;
  /** If true, only render when gender matches. */
  showOnlyForGender?: Gender;
}

const img = (step: string, opt: string) => `/images/quiz/${step}/${opt}.svg`;

export const STEPS: StepSpec[] = [
  {
    step: 1,
    id: 'gender',
    type: 'single-select',
    headline: 'Започваме с теб',
    subheadline: 'Кой/коя си?',
    cardVariant: 'portrait',
    options: [
      { id: 'male', label: 'Мъж', value: 'male', imageUrl: img('gender', 'male') },
      { id: 'female', label: 'Жена', value: 'female', imageUrl: img('gender', 'female') },
    ],
  },
  {
    step: 2,
    id: 'goal',
    type: 'single-select',
    headline: 'Каква е твоята цел?',
    cardVariant: 'wide',
    optionsByGender: {
      male: [
        { id: 'lose-major', label: 'Искам да сваля сериозно тегло (15+ кг)', value: 'lose-major', imageUrl: img('goal', 'm-lose-major') },
        { id: 'tone-recomp', label: 'Искам да сваля малко и да изградя мускули', value: 'tone-recomp', imageUrl: img('goal', 'm-tone-recomp') },
        { id: 'gain-mass', label: 'Искам да кача чиста мускулна маса', value: 'gain-mass', imageUrl: img('goal', 'm-gain-mass') },
      ],
      female: [
        { id: 'lose-major', label: 'Искам да сваля сериозно тегло (15+ кг)', value: 'lose-major', imageUrl: img('goal', 'f-lose-major') },
        { id: 'tone-recomp', label: 'Искам да сваля малко и да се стегна', value: 'tone-recomp', imageUrl: img('goal', 'f-tone-recomp') },
        { id: 'tone-only', label: 'Искам само да се стегна и да дефинирам формите', value: 'tone-only', imageUrl: img('goal', 'f-tone-only') },
      ],
    },
  },
  {
    step: 3,
    id: 'bodyType',
    type: 'single-select',
    headline: 'Кое тяло описва теб днес?',
    cardVariant: 'portrait',
    optionsByGender: {
      male: [
        { id: 'overweight', label: 'С наднормено тегло', value: 'overweight', imageUrl: '/silhouettes/m-overweight.svg' },
        { id: 'skinny-fat', label: 'Слаб с малко мазнини', value: 'skinny-fat', imageUrl: '/silhouettes/m-skinny-fat.svg' },
        { id: 'skinny', label: 'Слаб', value: 'skinny', imageUrl: '/silhouettes/m-skinny.svg' },
      ],
      female: [
        { id: 'overweight', label: 'С наднормено тегло', value: 'overweight', imageUrl: '/silhouettes/f-overweight.svg' },
        { id: 'skinny-fat', label: 'Стройна, но не стегната', value: 'skinny-fat', imageUrl: '/silhouettes/f-skinny-fat.svg' },
      ],
    },
  },
  {
    step: 4,
    id: 'age',
    type: 'single-select',
    headline: 'На колко си?',
    cardVariant: 'square',
    options: [
      { id: '18-29', label: '18-29', value: '18-29', imageUrl: img('age', '18-29') },
      { id: '30-39', label: '30-39', value: '30-39', imageUrl: img('age', '30-39') },
      { id: '40-49', label: '40-49', value: '40-49', imageUrl: img('age', '40-49') },
      { id: '50-59', label: '50-59', value: '50-59', imageUrl: img('age', '50-59') },
      { id: '60+', label: '60+', value: '60+', imageUrl: img('age', '60-plus') },
    ],
  },
  {
    step: 5,
    id: 'problemAreas',
    type: 'multi-select',
    headline: 'Кои зони те притесняват най-много?',
    minSelect: 1,
    maxSelect: 6,
    cardVariant: 'square',
    optionsByGender: {
      male: [
        { id: 'belly', label: 'Корем', value: 'belly', imageUrl: img('problemAreas', 'm-belly') },
        { id: 'love-handles', label: 'Любовни дръжки', value: 'love-handles', imageUrl: img('problemAreas', 'm-love-handles') },
        { id: 'chest', label: 'Гърди', value: 'chest', imageUrl: img('problemAreas', 'm-chest') },
        { id: 'arms', label: 'Ръце', value: 'arms', imageUrl: img('problemAreas', 'm-arms') },
        { id: 'whole-body', label: 'Цялото тяло', value: 'whole-body', imageUrl: img('problemAreas', 'm-whole-body') },
      ],
      female: [
        { id: 'belly', label: 'Корем', value: 'belly', imageUrl: img('problemAreas', 'f-belly') },
        { id: 'waist', label: 'Талия', value: 'waist', imageUrl: img('problemAreas', 'f-waist') },
        { id: 'hips', label: 'Ханш', value: 'hips', imageUrl: img('problemAreas', 'f-hips') },
        { id: 'thighs', label: 'Бедра', value: 'thighs', imageUrl: img('problemAreas', 'f-thighs') },
        { id: 'arms', label: 'Ръце', value: 'arms', imageUrl: img('problemAreas', 'f-arms') },
        { id: 'whole-body', label: 'Цялото тяло', value: 'whole-body', imageUrl: img('problemAreas', 'f-whole-body') },
      ],
    },
  },
  {
    step: 6,
    id: 'activity',
    type: 'single-select',
    headline: 'Колко активен/-на си през седмицата?',
    cardVariant: 'wide',
    options: [
      { id: 'sedentary', label: 'Почти не се движа', value: 'sedentary', imageUrl: img('activity', 'sedentary') },
      { id: 'light', label: 'Лек активен/-на', sub: 'Рядко тренировки', value: 'light', imageUrl: img('activity', 'light') },
      { id: 'moderate', label: 'Умерено', sub: '2-3 тренировки седмично', value: 'moderate', imageUrl: img('activity', 'moderate') },
      { id: 'high', label: 'Много активен/-на', sub: '4+ тренировки седмично', value: 'high', imageUrl: img('activity', 'high') },
    ],
  },
  {
    step: 7,
    id: 'jobMovement',
    type: 'single-select',
    headline: 'Какво описва твоя ден?',
    cardVariant: 'wide',
    options: [
      { id: 'desk', label: 'Седяща работа, 8+ часа на стол', value: 'desk', imageUrl: img('jobMovement', 'desk') },
      { id: 'standing', label: 'Прав/-а през повечето време', value: 'standing', imageUrl: img('jobMovement', 'standing') },
      { id: 'physical', label: 'Физическа работа', value: 'physical', imageUrl: img('jobMovement', 'physical') },
    ],
  },
  {
    step: 8,
    id: 'sleep',
    type: 'single-select',
    headline: 'Как спиш?',
    cardVariant: 'square',
    options: [
      { id: 'lt5', label: 'Под 5 часа', value: 'lt5', imageUrl: img('sleep', 'lt5') },
      { id: '5-6', label: '5-6 часа', value: '5-6', imageUrl: img('sleep', '5-6') },
      { id: '6-7', label: '6-7 часа', value: '6-7', imageUrl: img('sleep', '6-7') },
      { id: '7-8', label: '7-8 часа', value: '7-8', imageUrl: img('sleep', '7-8') },
      { id: '8plus', label: 'Над 8 часа', value: '8plus', imageUrl: img('sleep', '8plus') },
    ],
  },
  {
    step: 9,
    id: 'stress',
    type: 'single-select',
    headline: 'Колко стрес имаш?',
    cardVariant: 'square',
    options: [
      { id: 'low', label: 'Нисък', value: 'low', imageUrl: img('stress', 'low') },
      { id: 'medium', label: 'Среден', sub: 'Има моменти', value: 'medium', imageUrl: img('stress', 'medium') },
      { id: 'high', label: 'Висок', sub: 'Често съм напрегнат/-а', value: 'high', imageUrl: img('stress', 'high') },
      { id: 'burnout', label: 'Изгарящ', sub: 'Не мога да се отпусна', value: 'burnout', imageUrl: img('stress', 'burnout') },
    ],
  },
  {
    step: 10,
    id: 'water',
    type: 'single-select',
    headline: 'Колко вода пиеш на ден?',
    cardVariant: 'square',
    options: [
      { id: 'lt1l', label: 'Под 1 литър', value: 'lt1l', imageUrl: img('water', 'lt1l') },
      { id: '1-2l', label: '1-2 литра', value: '1-2l', imageUrl: img('water', '1-2l') },
      { id: '2-3l', label: '2-3 литра', value: '2-3l', imageUrl: img('water', '2-3l') },
      { id: '3plus', label: 'Над 3 литра', value: '3plus', imageUrl: img('water', '3plus') },
    ],
  },
  {
    step: 11,
    id: 'dietStyle',
    type: 'single-select',
    headline: 'Как се храниш сега?',
    cardVariant: 'wide',
    options: [
      { id: 'free', label: 'Ям каквото ми се яде', value: 'free', imageUrl: img('dietStyle', 'free') },
      { id: 'mindful', label: 'Опитвам се да внимавам', value: 'mindful', imageUrl: img('dietStyle', 'mindful') },
      { id: 'planned', label: 'Следвам конкретен план', value: 'planned', imageUrl: img('dietStyle', 'planned') },
      { id: 'yoyo', label: 'Карам йо-йо диети', value: 'yoyo', imageUrl: img('dietStyle', 'yoyo') },
      { id: 'none', label: 'Нямам никаква система', value: 'none', imageUrl: img('dietStyle', 'none') },
    ],
  },
  {
    step: 12,
    id: 'pastAttempts',
    type: 'multi-select',
    headline: 'Какво си пробвал/-а досега?',
    minSelect: 1,
    cardVariant: 'square',
    options: [
      { id: 'gym', label: 'Фитнес зала', value: 'gym', imageUrl: img('pastAttempts', 'gym') },
      { id: 'diets', label: 'Диети', value: 'diets', imageUrl: img('pastAttempts', 'diets') },
      { id: 'youtube', label: 'YouTube програми', value: 'youtube', imageUrl: img('pastAttempts', 'youtube') },
      { id: 'supplements', label: 'Хранителни добавки', value: 'supplements', imageUrl: img('pastAttempts', 'supplements') },
      { id: 'pt', label: 'Личен треньор', value: 'pt', imageUrl: img('pastAttempts', 'pt') },
      { id: 'nothing', label: 'Нищо още', value: 'nothing', imageUrl: img('pastAttempts', 'nothing') },
    ],
  },
  {
    step: 13,
    id: 'interstitial-1',
    type: 'interstitial',
    headline: 'Над 10 000 души преминаха същия път с Dr.Fit',
    bodyBg: '98% казват, че проблемът не беше волята им. Беше планът.',
    ctaBg: 'Продължи',
  },
  {
    step: 14,
    id: 'mealTiming',
    type: 'single-select',
    headline: 'Кога ядеш повечето си храна?',
    cardVariant: 'square',
    options: [
      { id: 'morning', label: 'Сутрин', sub: 'Закуската е най-голяма', value: 'morning', imageUrl: img('mealTiming', 'morning') },
      { id: 'lunch', label: 'На обяд', value: 'lunch', imageUrl: img('mealTiming', 'lunch') },
      { id: 'evening', label: 'Вечер', sub: 'Често пропускам закуска', value: 'evening', imageUrl: img('mealTiming', 'evening') },
      { id: 'graze', label: 'Хапвам по малко цял ден', value: 'graze', imageUrl: img('mealTiming', 'graze') },
    ],
  },
  {
    step: 15,
    id: 'energy',
    type: 'single-select',
    headline: 'Как е енергията ти?',
    cardVariant: 'square',
    options: [
      { id: 'stable', label: 'Стабилна', sub: 'Издържам докрай', value: 'stable', imageUrl: img('energy', 'stable') },
      { id: 'afternoon-crash', label: 'Падам следобед', value: 'afternoon-crash', imageUrl: img('energy', 'afternoon-crash') },
      { id: 'always-tired', label: 'Уморен/-а съм почти винаги', value: 'always-tired', imageUrl: img('energy', 'always-tired') },
      { id: 'caffeine', label: 'Държа се с кафе', value: 'caffeine', imageUrl: img('energy', 'caffeine') },
    ],
  },
  {
    step: 16,
    id: 'cravings',
    type: 'single-select',
    headline: 'След ядене ти се иска още?',
    cardVariant: 'square',
    options: [
      { id: 'sweet', label: 'Сладко', value: 'sweet', imageUrl: img('cravings', 'sweet') },
      { id: 'salty', label: 'Солено', value: 'salty', imageUrl: img('cravings', 'salty') },
      { id: 'both', label: 'И двете', value: 'both', imageUrl: img('cravings', 'both') },
      { id: 'none', label: 'Не, наситен/-а съм', value: 'none', imageUrl: img('cravings', 'none') },
    ],
  },
  {
    step: 17,
    id: 'bloating',
    type: 'single-select',
    headline: 'Подуваш ли се след хранене?',
    cardVariant: 'square',
    options: [
      { id: 'often', label: 'Често', value: 'often', imageUrl: img('bloating', 'often') },
      { id: 'sometimes', label: 'Понякога', value: 'sometimes', imageUrl: img('bloating', 'sometimes') },
      { id: 'rarely', label: 'Рядко', value: 'rarely', imageUrl: img('bloating', 'rarely') },
      { id: 'never', label: 'Никога', value: 'never', imageUrl: img('bloating', 'never') },
    ],
  },
  {
    step: 18,
    id: 'bodyTemp',
    type: 'single-select',
    headline: 'Как си с температурата?',
    cardVariant: 'wide',
    options: [
      { id: 'cold', label: 'Често ми е студено', sub: 'Особено ръце и крака', value: 'cold', imageUrl: img('bodyTemp', 'cold') },
      { id: 'normal', label: 'Нормално', value: 'normal', imageUrl: img('bodyTemp', 'normal') },
      { id: 'hot', label: 'Често ми е топло', sub: 'Потя се лесно', value: 'hot', imageUrl: img('bodyTemp', 'hot') },
    ],
  },
  {
    step: 19,
    id: 'pastBest',
    type: 'single-select',
    headline: 'Колко тегло си свалял/-а в най-добрата си форма?',
    cardVariant: 'wide',
    options: [
      { id: 'lt5', label: 'Под 5 кг', value: 'lt5', imageUrl: img('pastBest', 'lt5') },
      { id: '5-10', label: '5-10 кг', value: '5-10', imageUrl: img('pastBest', '5-10') },
      { id: '10-20', label: '10-20 кг', value: '10-20', imageUrl: img('pastBest', '10-20') },
      { id: 'gt20', label: 'Над 20 кг', value: 'gt20', imageUrl: img('pastBest', 'gt20') },
      { id: 'never', label: 'Никога не съм опитвал/-а сериозно', value: 'never', imageUrl: img('pastBest', 'never') },
    ],
  },
  {
    step: 20,
    id: 'interstitial-2',
    type: 'interstitial',
    headline: '92% от хората с твоя профил виждат първи резултати в първите 30 дни',
    bodyBg: 'Това е силата на персонализацията. Ще ти покажем точно защо.',
    ctaBg: 'Продължи',
  },
  {
    step: 21,
    id: 'motivation',
    type: 'multi-select',
    headline: 'Защо искаш да се промениш точно сега?',
    minSelect: 1,
    cardVariant: 'square',
    options: [
      { id: 'health', label: 'За здраве', value: 'health', imageUrl: img('motivation', 'health') },
      { id: 'partner', label: 'За партньора/-ката', value: 'partner', imageUrl: img('motivation', 'partner') },
      { id: 'photos', label: 'За да се харесвам на снимки', value: 'photos', imageUrl: img('motivation', 'photos') },
      { id: 'kids', label: 'За децата', value: 'kids', imageUrl: img('motivation', 'kids') },
      { id: 'event', label: 'Имам конкретно събитие', value: 'event', imageUrl: img('motivation', 'event') },
      { id: 'fed-up', label: 'Стига вече', value: 'fed-up', imageUrl: img('motivation', 'fed-up') },
    ],
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
    cardVariant: 'wide',
    options: [
      { id: 'no-time', label: 'Нямам време', value: 'no-time', imageUrl: img('blockers', 'no-time') },
      { id: 'no-plan', label: 'Нямам план', value: 'no-plan', imageUrl: img('blockers', 'no-plan') },
      { id: 'no-support', label: 'Нямам подкрепа', value: 'no-support', imageUrl: img('blockers', 'no-support') },
      { id: 'expensive', label: 'Скъпо ми е', value: 'expensive', imageUrl: img('blockers', 'expensive') },
      { id: 'lost', label: 'Не знам откъде да започна', value: 'lost', imageUrl: img('blockers', 'lost') },
      { id: 'fear', label: 'Страх ме е, че няма да издържа', value: 'fear', imageUrl: img('blockers', 'fear') },
      { id: 'failed', label: 'Пробвал/-а съм и не върви', value: 'failed', imageUrl: img('blockers', 'failed') },
    ],
  },
  {
    step: 24,
    id: 'metrics',
    type: 'numeric-combo',
    headline: 'Последна стъпка: твоите числа',
    inputs: [
      { name: 'height', label: 'Височина', min: 140, max: 220, default: 170, suffix: 'см' },
      { name: 'weight', label: 'Тегло сега', min: 40, max: 200, default: 80, suffix: 'кг' },
      { name: 'targetWeight', label: 'Целево тегло', min: 40, max: 200, default: 70, suffix: 'кг' },
    ],
  },
  {
    step: 25,
    id: 'calculating',
    type: 'calculating',
    headline: 'Анализираме твоя метаболитен профил',
    durationMs: 9000,
    milestonesBg: [
      'Изчисляваме BMI и метаболитна възраст',
      'Сравняваме с 10 000+ подобни профила',
      'Подбираме оптималната тренировъчна програма',
      'Готово',
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
  return STEPS.find((s) => s.step === n);
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
