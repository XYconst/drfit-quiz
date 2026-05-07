// Per-avatar + per-answer copy for the result/paywall page.
// Spec section "01 — Защо стандартните програми не работят за теб" is generated
// from sleep / stress / dietStyle / pastAttempts (multi). All bullets are first-person
// "Ти" voice.

export type SleepAnswer = 'lt5' | '5-6' | '6-7' | '7-8' | '8plus';
export type StressAnswer = 'low' | 'medium' | 'high' | 'burnout';
export type DietAnswer = 'free' | 'mindful' | 'planned' | 'yoyo' | 'none';
export type PastAttempt = 'gym' | 'diets' | 'youtube' | 'supplements' | 'pt' | 'nothing';

const SLEEP_BULLETS: Record<SleepAnswer, string> = {
  'lt5': 'Под 5 часа сън: тялото ти живее в режим на тревога, кортизолът остава висок и метаболизмът забавя.',
  '5-6': '5-6 часа сън: недостатъчно за пълно възстановяване, гладът и захарта се вдигат на следващия ден.',
  '6-7': '6-7 часа сън: близо до нужното, но без оптимизация хормоните не се синхронизират.',
  '7-8': '7-8 часа сън: добра база, но без правилен ритъм качеството страда.',
  '8plus': 'Над 8 часа: количеството е там, но ако се събуждаш уморен/-а, ритъмът ти е разместен.',
};

const STRESS_BULLETS: Record<StressAnswer, string> = {
  low: 'Нисък стрес: добра стартова позиция, но повечето стандартни програми не отчитат и това.',
  medium: 'Среден стрес: кортизолът скача на парчета и това директно блокира свалянето на корема.',
  high: 'Висок стрес: кортизолът е завишен постоянно, тялото ти задържа мазнини в средата.',
  burnout: 'Изгарящ стрес: нервната система не превключва в режим на възстановяване, всяка диета без това е безсмислена.',
};

const DIET_BULLETS: Record<DietAnswer, string> = {
  free: 'Ядеш каквото ти се яде: инсулинът ти прави американски ролъркостър и тялото складира всичко.',
  mindful: 'Опитваш се да внимаваш, но без точни числа усилията не се превръщат в резултат.',
  planned: 'Имаш план, но ако не е калибриран за твоя метаболизъм, той работи само първите седмици.',
  yoyo: 'Йо-йо диети: всяка следваща сваля по-малко и качваш повече, защото тялото защитава мазнините.',
  none: 'Без система резултатите са случайни и невъзпроизводими, дори когато седмицата мине добре.',
};

const PAST_BULLETS: Record<PastAttempt, string> = {
  gym: 'Зала без план = калории без резултат',
  diets: 'Диети без хормонална корекция = връщане до 30 дни',
  youtube: 'YouTube програми, еднакви за всички, без отчитане на твоя профил',
  supplements: 'Добавки без основа: без хранене и сън нямат върху какво да работят',
  pt: 'Личен треньор без хранителен план е половин решение',
  nothing: 'Нямаш опит. Добре, ще започнем правилно от първи ден.',
};

export interface PersonalizeInput {
  sleep?: SleepAnswer;
  stress?: StressAnswer;
  diet?: DietAnswer;
  past?: PastAttempt[];
}

export function personalizedSection01Bullets(input: PersonalizeInput): string[] {
  const out: string[] = [];
  if (input.sleep && SLEEP_BULLETS[input.sleep]) out.push(SLEEP_BULLETS[input.sleep]);
  if (input.stress && STRESS_BULLETS[input.stress]) out.push(STRESS_BULLETS[input.stress]);
  if (input.diet && DIET_BULLETS[input.diet]) out.push(DIET_BULLETS[input.diet]);
  if (input.past && input.past.length > 0) {
    const top = input.past.find((p) => p !== 'nothing') ?? input.past[0];
    if (PAST_BULLETS[top]) out.push(PAST_BULLETS[top]);
  }
  if (out.length === 0) {
    return [
      'Стандартните програми не отчитат твоя метаболитен профил.',
      'Без корекция на хормоните усилията не се превръщат в резултат.',
      'Без подкрепа е лесно да се откажеш на 14-я ден.',
      'Едно решение за всички работи за никого.',
    ];
  }
  return out;
}

const VALID_SLEEP = new Set<string>(['lt5', '5-6', '6-7', '7-8', '8plus']);
const VALID_STRESS = new Set<string>(['low', 'medium', 'high', 'burnout']);
const VALID_DIET = new Set<string>(['free', 'mindful', 'planned', 'yoyo', 'none']);
const VALID_PAST = new Set<string>(['gym', 'diets', 'youtube', 'supplements', 'pt', 'nothing']);

export function parsePersonalizeParams(sp: Record<string, string | undefined>): PersonalizeInput {
  const sleep = sp.sleep && VALID_SLEEP.has(sp.sleep) ? (sp.sleep as SleepAnswer) : undefined;
  const stress = sp.stress && VALID_STRESS.has(sp.stress) ? (sp.stress as StressAnswer) : undefined;
  const diet = sp.diet && VALID_DIET.has(sp.diet) ? (sp.diet as DietAnswer) : undefined;
  const past = sp.past
    ? sp.past
        .split(',')
        .map((s) => s.trim())
        .filter((s): s is PastAttempt => VALID_PAST.has(s))
    : undefined;
  return { sleep, stress, diet, past };
}
