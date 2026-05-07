// Avatar classification + per-avatar metadata for Dr.Fit quiz.

export type Gender = 'male' | 'female';

export type Goal =
  | 'lose-major'   // -15+ кг
  | 'tone-recomp'  // recomp: lose fat + build muscle (M); light loss + tone (F)
  | 'gain-mass'    // hardgainer (M only)
  | 'tone-only';   // tone, define, no/minimal weight loss (F)

export type BodyType = 'overweight' | 'skinny-fat' | 'skinny';

export type AvatarId = '01' | '02' | '03' | '04' | '05';

export type AvatarOrBlocked = AvatarId | 'blocked';

export interface AvatarProfile {
  id: AvatarId;
  labelEn: string;
  hookBg: string;
  resultHeadlineBg: (kg?: number) => string;
  resultSubBg: string;
  programAngle: 'fat-loss' | 'recomp' | 'lean-tone' | 'lean-gain';
}

export const AVATARS: Record<AvatarId, AvatarProfile> = {
  '01': {
    id: '01',
    labelEn: 'Overweight Man',
    hookBg: 'Свали сериозно тегло за 90 дни',
    resultHeadlineBg: (kg) => `Готов си да свалиш ${kg ?? '15+'} кг за 90 дни`,
    resultSubBg: 'Без глад. Без зала. С план, който работи за метаболизма ти.',
    programAngle: 'fat-loss',
  },
  '02': {
    id: '02',
    labelEn: 'Overweight Woman',
    hookBg: 'Свали сериозно тегло за 90 дни',
    resultHeadlineBg: (kg) => `Готова си да свалиш ${kg ?? '10+'} кг за 90 дни`,
    resultSubBg: 'Без йо-йо. Без забрани. План, изграден за женския метаболизъм.',
    programAngle: 'fat-loss',
  },
  '03': {
    id: '03',
    labelEn: 'Skinny-Fat Man',
    hookBg: 'Трансформирай тялото си за 90 дни',
    resultHeadlineBg: () => 'Готов си да трансформираш тялото си за 90 дни',
    resultSubBg: 'Едновременно сваляне на мазнини и изграждане на мускули.',
    programAngle: 'recomp',
  },
  '04': {
    id: '04',
    labelEn: 'Skinny-Fat Woman',
    hookBg: 'Стегни се за 90 дни',
    resultHeadlineBg: () => 'Готова си да се стегнеш за 90 дни',
    resultSubBg: 'Стегнат корем, дефинирани форми, без екстремни диети.',
    programAngle: 'lean-tone',
  },
  '05': {
    id: '05',
    labelEn: 'Skinny Man',
    hookBg: 'Качи чиста маса за 90 дни',
    resultHeadlineBg: (kg) => `Готов си да качиш ${kg ?? '5-10'} кг чиста мускулна маса за 90 дни`,
    resultSubBg: 'Контролирана анаболна програма за хардгейнъри.',
    programAngle: 'lean-gain',
  },
};

/**
 * Maps gender × goal × body-type into one of 5 avatars,
 * or 'blocked' for nonsensical combinations (e.g. skinny man wanting major weight loss).
 */
export function classifyAvatar(
  gender: Gender,
  goal: Goal,
  bodyType: BodyType,
): AvatarOrBlocked {
  if (gender === 'male') {
    if (goal === 'lose-major') {
      return bodyType === 'overweight' ? '01' : 'blocked';
    }
    if (goal === 'tone-recomp') return '03';
    if (goal === 'gain-mass') {
      return bodyType === 'skinny' || bodyType === 'skinny-fat' ? '05' : 'blocked';
    }
    return 'blocked';
  }
  // female
  if (goal === 'lose-major' && bodyType === 'overweight') return '02';
  // Skinny F + any goal → Avatar 04 (no separate skinny-F bucket)
  return '04';
}
