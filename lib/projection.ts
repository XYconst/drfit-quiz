// Shared projection math for both the full plan-page BmiProjection and the
// compact MiniProjectionChart on the projection-preview screen. Keeping this
// in one module ensures both visualisations sit on identical curves.

export const TOTAL_DAYS = 90;
export const MILESTONE_DAYS = [0, 30, 60, 90] as const;

/** easeOutQuad: faster at the start, slower toward the goal. Matches typical
 *  fat-loss / recomposition pacing where early progress is largest. */
export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/** Interpolated body-weight on a given day along the eased curve. */
export function projectWeight(
  currentKg: number,
  targetKg: number,
  day: number,
  totalDays: number = TOTAL_DAYS,
): number {
  const t = Math.max(0, Math.min(1, day / totalDays));
  return currentKg + (targetKg - currentKg) * easeOutQuad(t);
}

/** Dense sample for drawing the smooth curve as a polyline. 19 points by default. */
export function denseProjection(
  currentKg: number,
  targetKg: number,
  totalDays: number = TOTAL_DAYS,
  stepDays: number = 5,
): Array<{ day: number; kg: number }> {
  const out: Array<{ day: number; kg: number }> = [];
  for (let d = 0; d <= totalDays; d += stepDays) {
    out.push({ day: d, kg: projectWeight(currentKg, targetKg, d, totalDays) });
  }
  return out;
}

/** 4 milestone dots at days 0/30/60/90, on the same eased curve. */
export function milestoneProjection(
  currentKg: number,
  targetKg: number,
): Array<{ day: number; kg: number }> {
  return MILESTONE_DAYS.map((d) => ({ day: d, kg: projectWeight(currentKg, targetKg, d) }));
}

/** Build an SVG polyline `d` attribute from already-mapped XY points. */
export function buildCurvePath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return '';
  return points.reduce(
    (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
    '',
  );
}
