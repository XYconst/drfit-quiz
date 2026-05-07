// Dr.Fit quiz step definitions. All BG copy is original, written in dr-fit's
// brand voice ("Ти", direct, concrete numbers). Source of truth: quiz-spec.md.

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

export interface OptionSpec {
  id: string;
  label: string;
  emoji?: string;
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

export const STEPS: StepSpec[] = [
  {
    step: 1,
    id: 'gender',
    type: 'single-select',
    headline: 'Започваме с теб',
    subheadline: 'Кой/коя си?',
    options: [
      { id: 'male', label: 'Мъж', value: 'male', emoji: '👤' },
      { id: 'female', label: 'Жена', value: 'female', emoji: '👤' },
    ],
  },
  {
    step: 2,
    id: 'goal',
    type: 'single-select',
    headline: 'Каква е твоята цел?',
    optionsByGender: {
      male: [
        { id: 'lose-major', label: 'Искам да сваля сериозно тегло (15+ кг)', value: 'lose-major', emoji: '🔥' },
        { id: 'tone-recomp', label: 'Искам да сваля малко и да изградя мускули', value: 'tone-recomp', emoji: '⚖️' },
        { id: 'gain-mass', label: 'Искам да кача чиста мускулна маса', value: 'gain-mass', emoji: '💪' },
      ],
      female: [
        { id: 'lose-major', label: 'Искам да сваля сериозно тегло (15+ кг)', value: 'lose-major', emoji: '🔥' },
        { id: 'tone-recomp', label: 'Искам да сваля малко и да се стегна', value: 'tone-recomp', emoji: '✨' },
        { id: 'tone-only', label: 'Искам само да се стегна и да дефинирам формите', value: 'tone-only', emoji: '💃' },
      ],
    },
  },
  {
    step: 3,
    id: 'bodyType',
    type: 'single-select',
    headline: 'Кое тяло описва теб днес?',
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
    options: [
      { id: '18-29', label: '18-29', value: '18-29' },
      { id: '30-39', label: '30-39', value: '30-39' },
      { id: '40-49', label: '40-49', value: '40-49' },
      { id: '50-59', label: '50-59', value: '50-59' },
      { id: '60+', label: '60+', value: '60+' },
    ],
  },
  {
    step: 5,
    id: 'problemAreas',
    type: 'multi-select',
    headline: 'Кои зони те притесняват най-много?',
    minSelect: 1,
    maxSelect: 6,
    optionsByGender: {
      male: [
        { id: 'belly', label: 'Корем', value: 'belly' },
        { id: 'love-handles', label: 'Любовни дръжки', value: 'love-handles' },
        { id: 'chest', label: 'Гърди', value: 'chest' },
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
    step: 6,
    id: 'activity',
    type: 'single-select',
    headline: 'Колко активен/-на си през седмицата?',
    options: [
      { id: 'sedentary', label: 'Почти не се движа', value: 'sedentary', emoji: '🛋️' },
      { id: 'light', label: 'Лек активен/-на (рядко тренировки)', value: 'light', emoji: '🚶' },
      { id: 'moderate', label: 'Умерено (2-3 тренировки седмично)', value: 'moderate', emoji: '🏃' },
      { id: 'high', label: 'Много (4+ тренировки седмично)', value: 'high', emoji: '💪' },
    ],
  },
  {
    step: 7,
    id: 'jobMovement',
    type: 'single-select',
    headline: 'Какво описва твоя ден?',
    options: [
      { id: 'desk', label: 'Седяща работа, 8+ часа на стол', value: 'desk', emoji: '💻' },
      { id: 'standing', label: 'Прав/-а през повечето време', value: 'standing', emoji: '🚶' },
      { id: 'physical', label: 'Физическа работа', value: 'physical', emoji: '🔨' },
    ],
  },
  {
    step: 8,
    id: 'sleep',
    type: 'single-select',
    headline: 'Как спиш?',
    options: [
      { id: 'lt5', label: 'По-малко от 5 часа', value: 'lt5', emoji: '😴' },
      { id: '5-6', label: '5-6 часа', value: '5-6', emoji: '😐' },
      { id: '6-7', label: '6-7 часа', value: '6-7', emoji: '🙂' },
      { id: '7-8', label: '7-8 часа', value: '7-8', emoji: '😌' },
      { id: '8plus', label: 'Над 8 часа', value: '8plus', emoji: '✨' },
    ],
  },
  {
    step: 9,
    id: 'stress',
    type: 'single-select',
    headline: 'Колко стрес имаш?',
    options: [
      { id: 'low', label: 'Нисък', value: 'low', emoji: '🧘' },
      { id: 'medium', label: 'Среден (има моменти)', value: 'medium', emoji: '😅' },
      { id: 'high', label: 'Висок (често съм напрегнат/-а)', value: 'high', emoji: '😰' },
      { id: 'burnout', label: 'Изгарящ (не мога да се отпусна)', value: 'burnout', emoji: '🔥' },
    ],
  },
  {
    step: 10,
    id: 'water',
    type: 'single-select',
    headline: 'Колко вода пиеш на ден?',
    options: [
      { id: 'lt1l', label: 'Под 1 литър', value: 'lt1l' },
      { id: '1-2l', label: '1-2 литра', value: '1-2l' },
      { id: '2-3l', label: '2-3 литра', value: '2-3l' },
      { id: '3plus', label: 'Над 3 литра', value: '3plus' },
    ],
  },
  {
    step: 11,
    id: 'dietStyle',
    type: 'single-select',
    headline: 'Как се храниш сега?',
    options: [
      { id: 'free', label: 'Ям каквото ми се яде', value: 'free', emoji: '🍕' },
      { id: 'mindful', label: 'Опитвам се да внимавам', value: 'mindful', emoji: '🥗' },
      { id: 'planned', label: 'Следвам конкретен план', value: 'planned', emoji: '📋' },
      { id: 'yoyo', label: 'Карам йо-йо диети', value: 'yoyo', emoji: '🔄' },
      { id: 'none', label: 'Нямам никаква система', value: 'none', emoji: '🤷' },
    ],
  },
  {
    step: 12,
    id: 'pastAttempts',
    type: 'multi-select',
    headline: 'Какво си пробвал/-а досега?',
    minSelect: 1,
    options: [
      { id: 'gym', label: 'Фитнес зала', value: 'gym' },
      { id: 'diets', label: 'Диети', value: 'diets' },
      { id: 'youtube', label: 'YouTube програми', value: 'youtube' },
      { id: 'supplements', label: 'Хранителни добавки', value: 'supplements' },
      { id: 'pt', label: 'Личен треньор', value: 'pt' },
      { id: 'nothing', label: 'Нищо още', value: 'nothing' },
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
    options: [
      { id: 'morning', label: 'Сутрин (закуската е най-голяма)', value: 'morning', emoji: '🌅' },
      { id: 'lunch', label: 'На обяд', value: 'lunch', emoji: '☀️' },
      { id: 'evening', label: 'Вечер (често пропускам закуска)', value: 'evening', emoji: '🌙' },
      { id: 'graze', label: 'Хапвам по малко цял ден', value: 'graze', emoji: '🍴' },
    ],
  },
  {
    step: 15,
    id: 'energy',
    type: 'single-select',
    headline: 'Как е енергията ти?',
    options: [
      { id: 'stable', label: 'Стабилна (издържам докрай)', value: 'stable', emoji: '⚡' },
      { id: 'afternoon-crash', label: 'Падам следобед', value: 'afternoon-crash', emoji: '🔋' },
      { id: 'always-tired', label: 'Уморен/-а съм почти винаги', value: 'always-tired', emoji: '😴' },
      { id: 'caffeine', label: 'Държа се с кафе', value: 'caffeine', emoji: '☕' },
    ],
  },
  {
    step: 16,
    id: 'cravings',
    type: 'single-select',
    headline: 'След ядене ти се иска още?',
    options: [
      { id: 'sweet', label: 'Сладко', value: 'sweet', emoji: '🍫' },
      { id: 'salty', label: 'Солено', value: 'salty', emoji: '🥨' },
      { id: 'both', label: 'И двете', value: 'both', emoji: '🍰' },
      { id: 'none', label: 'Не, наситен/-а съм', value: 'none', emoji: '✋' },
    ],
  },
  {
    step: 17,
    id: 'bloating',
    type: 'single-select',
    headline: 'Подуваш ли се след хранене?',
    options: [
      { id: 'often', label: 'Често', value: 'often' },
      { id: 'sometimes', label: 'Понякога', value: 'sometimes' },
      { id: 'rarely', label: 'Рядко', value: 'rarely' },
      { id: 'never', label: 'Никога', value: 'never' },
    ],
  },
  {
    step: 18,
    id: 'bodyTemp',
    type: 'single-select',
    headline: 'Как си с температурата?',
    options: [
      { id: 'cold', label: 'Често ми е студено (особено ръце/крака)', value: 'cold', emoji: '🥶' },
      { id: 'normal', label: 'Нормално', value: 'normal', emoji: '🌡️' },
      { id: 'hot', label: 'Често ми е топло, потя се лесно', value: 'hot', emoji: '🥵' },
    ],
  },
  {
    step: 19,
    id: 'pastBest',
    type: 'single-select',
    headline: 'Колко тегло си свалял/-а в най-добрата си форма?',
    options: [
      { id: 'lt5', label: 'Под 5 кг', value: 'lt5' },
      { id: '5-10', label: '5-10 кг', value: '5-10' },
      { id: '10-20', label: '10-20 кг', value: '10-20' },
      { id: 'gt20', label: 'Над 20 кг', value: 'gt20' },
      { id: 'never', label: 'Никога не съм опитвал/-а сериозно', value: 'never' },
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
    options: [
      { id: 'health', label: 'За здраве', value: 'health' },
      { id: 'partner', label: 'За партньора/-ката', value: 'partner' },
      { id: 'photos', label: 'За да се харесвам на снимки', value: 'photos' },
      { id: 'kids', label: 'За децата', value: 'kids' },
      { id: 'event', label: 'Имам конкретно събитие', value: 'event' },
      { id: 'fed-up', label: 'Стига вече', value: 'fed-up' },
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
    options: [
      { id: 'no-time', label: 'Нямам време', value: 'no-time' },
      { id: 'no-plan', label: 'Нямам план', value: 'no-plan' },
      { id: 'no-support', label: 'Нямам подкрепа', value: 'no-support' },
      { id: 'expensive', label: 'Скъпо ми е', value: 'expensive' },
      { id: 'lost', label: 'Не знам откъде да започна', value: 'lost' },
      { id: 'fear', label: 'Страх ме е, че няма да издържа', value: 'fear' },
      { id: 'failed', label: 'Пробвал/-а съм и не върви', value: 'failed' },
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
    headline: 'Анализираме твоя метаболитен профил...',
    durationMs: 9000,
    milestonesBg: [
      'Изчисляваме BMI и метаболитна възраст...',
      'Сравняваме с 10 000+ подобни профила...',
      'Подбираме оптималната тренировъчна програма...',
      'Готово ✓',
    ],
  },
  {
    step: 26,
    id: 'email',
    type: 'email-gate',
    headline: 'Твоят 90-дневен план е готов',
    subheadline: 'Въведи email-а си и ти изпращаме плана + достъп до приложението',
    fields: [
      { name: 'email', type: 'email', label: 'Email', placeholder: 'твоят@email.bg', required: true },
      { name: 'phone', type: 'tel', label: 'Телефон (по желание)', placeholder: '+359...', required: false },
    ],
    ctaBg: 'Виж моя план →',
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
