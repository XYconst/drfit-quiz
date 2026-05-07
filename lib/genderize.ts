import type { Gender } from './avatars';

/**
 * Resolve Bulgarian gender-shorthand patterns in copy based on the picked gender.
 *
 * Recognised pattern: `<base>/-<suffix>` where the male form is `<base>` and the
 * female form is derived from `<base>` + `<suffix>` per the rule below.
 *
 * Rules (applied in order):
 *  1. If `<base>` (case-insensitive) is in IRREGULARS, use the mapped female form.
 *  2. If `<suffix>` is 2+ chars and `<base>` ends in `ен`, drop the last 2 chars
 *     of `<base>` and append `<suffix>` (covers активен → активна).
 *  3. Otherwise, append `<suffix>` to `<base>` (covers the common `-а` append).
 *
 * Case is preserved from the original base (capitalised first letter is kept).
 */
const IRREGULARS: Record<string, string> = {
  // base (lowercase) → female form (lowercase)
  сигурен: 'сигурна',
  спокоен: 'спокойна',
  доволен: 'доволна',
};

function preserveCase(original: string, replacement: string): string {
  if (!original) return replacement;
  const firstChar = original.charAt(0);
  if (firstChar === firstChar.toLocaleUpperCase('bg')) {
    return replacement.charAt(0).toLocaleUpperCase('bg') + replacement.slice(1);
  }
  return replacement;
}

export function genderize(text: string | undefined, gender: Gender | undefined | null): string {
  if (!text) return text ?? '';
  if (!gender) return text;

  return text.replace(/(\p{L}+)\/-(\p{L}+)/gu, (_match, base: string, suffix: string) => {
    if (gender === 'male') return base;

    const lower = base.toLocaleLowerCase('bg');
    if (IRREGULARS[lower]) {
      return preserveCase(base, IRREGULARS[lower]);
    }

    if (suffix.length >= 2 && lower.endsWith('ен')) {
      return base.slice(0, -2) + suffix;
    }

    return base + suffix;
  });
}
