'use client';
import { useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { STEPS, getStep, resolveOptions, resolveCardVariant, TOTAL_STEPS } from '@/lib/questions';
import { TESTIMONIALS, pickInterstitialTestimonial } from '@/lib/testimonials';
import {
  classifyAvatar,
  type Gender,
  type Goal,
  type BodyType,
  type AvatarOrBlocked,
} from '@/lib/avatars';
import { trackQuizStep, trackLead } from '@/lib/pixel';
import { genderize } from '@/lib/genderize';
import { pickCharacter, characterImagePath, FALLBACK_CHARACTER } from '@/lib/character';
import type { OptionSpec } from '@/lib/questions';
import { QuestionShell } from './QuestionShell';
import { SingleSelect } from './SingleSelect';
import { MultiSelect } from './MultiSelect';
import { NumericCombo } from './NumericCombo';
import { EmailGate } from './EmailGate';
import { CalculatingScreen } from './CalculatingScreen';
import { InterstitialCard } from './InterstitialCard';
import { DateStep } from './DateStep';
import { GoalSelect } from './GoalSelect';
import { ProjectionPreview } from './ProjectionPreview';
import { ConfirmDialog } from './ConfirmDialog';
import { RotateCcwIcon } from '@/components/icons';

const STORAGE_KEY = 'drfit_quiz_state_v1';

type AnswerValue = string | string[] | number | Record<string, unknown>;
type Answers = Record<string, AnswerValue>;
interface State { currentStep: number; answers: Answers }

type Action =
  | { type: 'answer'; stepId: string; value: AnswerValue }
  | { type: 'multi-toggle'; stepId: string; value: string }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'hydrate'; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'answer':
      return { ...state, answers: { ...state.answers, [action.stepId]: action.value } };
    case 'multi-toggle': {
      const raw = state.answers[action.stepId];
      const cur: string[] = Array.isArray(raw) ? raw : [];
      let next: string[];
      if (cur.includes(action.value)) {
        next = cur.filter((v) => v !== action.value);
      } else if (action.value === 'whole-body') {
        // Selecting "whole body" clears any other selections — they're redundant.
        next = ['whole-body'];
      } else {
        // Selecting any other option clears "whole body".
        next = [...cur.filter((v) => v !== 'whole-body'), action.value];
      }
      return { ...state, answers: { ...state.answers, [action.stepId]: next } };
    }
    case 'next':
      return { ...state, currentStep: Math.min(TOTAL_STEPS, state.currentStep + 1) };
    case 'prev':
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };
    case 'hydrate':
      return action.state;
  }
}

export function QuizContainer() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, { currentStep: 1, answers: {} });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', state: JSON.parse(raw) });
    } catch {/* ignore */}
  }, []);

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {/* ignore */}
  }, [state]);

  const gender = (state.answers.gender as Gender | undefined) ?? null;
  const goal = state.answers.goal as Goal | undefined;
  const bodyType = state.answers.bodyType as BodyType | undefined;
  const age = state.answers.age as string | undefined;
  const avatar: AvatarOrBlocked | null =
    gender && goal && bodyType ? classifyAvatar(gender, goal, bodyType) : null;
  const character = pickCharacter(gender, age) ?? FALLBACK_CHARACTER;

  // tracking
  useEffect(() => {
    trackQuizStep(state.currentStep, avatar && avatar !== 'blocked' ? avatar : undefined);
  }, [state.currentStep, avatar]);

  const step = getStep(state.currentStep);
  if (!step) return null;

  const onSingle = (v: string) => {
    dispatch({ type: 'answer', stepId: step.id, value: v });
    setTimeout(() => dispatch({ type: 'next' }), 220);
  };

  const onContinue = () => dispatch({ type: 'next' });

  const confirmResetFresh = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    dispatch({ type: 'hydrate', state: { currentStep: 1, answers: {} } });
    setShowResetConfirm(false);
  };

  const onEmailSubmit = async (values: Record<string, string>) => {
    dispatch({ type: 'answer', stepId: step.id, value: values });
    if (!avatar || avatar === 'blocked') return;
    const heightAns = (state.answers.height ?? {}) as Record<string, number>;
    const weightAns = (state.answers.weight ?? {}) as Record<string, number>;
    const targetWeightAns = (state.answers.targetWeight ?? {}) as Record<string, number>;
    const heightCm = heightAns.height ?? 0;
    const weightKg = weightAns.weight ?? 0;
    const targetKg = targetWeightAns.targetWeight ?? 0;
    const kg = Math.abs(Math.round(weightKg - targetKg));
    await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...values, avatar, kg, answers: state.answers }),
    }).catch(() => {/* swallow — analytics-grade reliability */});
    trackLead(values.email, avatar);
    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    const sleep = state.answers.sleep as string | undefined;
    const stress = state.answers.stress as string | undefined;
    const diet = state.answers.dietStyle as string | undefined;
    const past = state.answers.pastAttempts as string[] | undefined;
    const blockers = state.answers.blockers as string[] | undefined;
    const motivation = state.answers.motivation as string[] | undefined;
    const targetDate = state.answers.targetDate as { date?: string; label?: string } | undefined;
    const bodyTypeAns = state.answers.bodyType as string | undefined;
    const params = new URLSearchParams({ avatar, kg: String(kg) });
    if (sleep) params.set('sleep', sleep);
    if (stress) params.set('stress', stress);
    if (diet) params.set('diet', diet);
    if (past && past.length) params.set('past', past.join(','));
    if (blockers && blockers.length) params.set('blockers', blockers.join(','));
    if (motivation && motivation.length) params.set('mot', motivation.join(','));
    if (heightCm) params.set('h', String(heightCm));
    if (weightKg) params.set('w', String(weightKg));
    if (targetKg) params.set('tw', String(targetKg));
    const td = targetDate?.label || targetDate?.date;
    if (td) params.set('td', td);
    if (character) params.set('char', character);
    if (bodyTypeAns) params.set('bt', bodyTypeAns);
    if (values.email) params.set('email', values.email);
    if (values.name) params.set('name', values.name);
    router.push(`/plan?${params.toString()}`);
  };

  // Calculating screen renders bare (no shell)
  if (step.type === 'calculating') {
    return (
      <CalculatingScreen
        headline={genderize(step.headline ?? '', gender)}
        milestones={(step.milestonesBg ?? []).map((m) => genderize(m, gender))}
        durationMs={step.durationMs ?? 8000}
        onDone={onContinue}
        midQuestions={step.midQuestions}
        onMidAnswer={(stepId, value) => dispatch({ type: 'answer', stepId, value })}
        stepLabel={`${state.currentStep} / ${TOTAL_STEPS}`}
        characterImageSrc={characterImagePath(character, 'goal')}
      />
    );
  }

  const genderizeOpts = (opts: OptionSpec[]): OptionSpec[] =>
    opts.map((o) => ({
      ...o,
      label: genderize(o.label, gender),
      sub: o.sub ? genderize(o.sub, gender) : o.sub,
      // Resolve {char} placeholder in imageUrl to the matched character code.
      imageUrl: o.imageUrl ? o.imageUrl.replace('{char}', character) : o.imageUrl,
    }));

  let content: React.ReactNode = null;
  if (step.type === 'single-select' && step.id === 'goal') {
    const opts = genderizeOpts(resolveOptions(step, gender ?? undefined));
    content = (
      <GoalSelect
        options={opts}
        selected={state.answers[step.id] as string | undefined}
        onPick={onSingle}
      />
    );
  } else if (step.type === 'single-select') {
    const opts = genderizeOpts(resolveOptions(step, gender ?? undefined));
    const variant = resolveCardVariant(step, opts.length);
    const splitPhotoSrc =
      variant === 'split-photo' && step.splitPhotoSlot
        ? characterImagePath(character, step.splitPhotoSlot)
        : undefined;
    content = (
      <SingleSelect
        options={opts}
        selected={state.answers[step.id] as string | undefined}
        variant={variant}
        splitPhotoSrc={splitPhotoSrc}
        onPick={onSingle}
      />
    );
  } else if (step.type === 'multi-select') {
    const opts = genderizeOpts(resolveOptions(step, gender ?? undefined));
    const selected = (state.answers[step.id] as string[] | undefined) ?? [];
    const variant = resolveCardVariant(step, opts.length);
    const splitPhotoSrc =
      variant === 'split-photo' && step.splitPhotoSlot
        ? characterImagePath(character, step.splitPhotoSlot)
        : undefined;
    content = (
      <MultiSelect
        options={opts}
        selected={selected}
        minSelect={step.minSelect ?? 1}
        maxSelect={step.maxSelect}
        variant={variant}
        splitPhotoSrc={splitPhotoSrc}
        onToggle={(v) => dispatch({ type: 'multi-toggle', stepId: step.id, value: v })}
        onContinue={onContinue}
      />
    );
  } else if (step.type === 'numeric-combo') {
    content = (
      <NumericCombo
        inputs={step.inputs ?? []}
        initial={(state.answers[step.id] as Record<string, number>) ?? {}}
        onContinue={(values) => {
          dispatch({ type: 'answer', stepId: step.id, value: values });
          setTimeout(onContinue, 100);
        }}
      />
    );
  } else if (step.type === 'date') {
    const prev = state.answers[step.id] as { date: string; label: string } | undefined;
    content = (
      <DateStep
        initial={prev?.date}
        onContinue={(date, label) => {
          dispatch({ type: 'answer', stepId: step.id, value: { date, label } });
          setTimeout(onContinue, 100);
        }}
      />
    );
  } else if (step.type === 'projection') {
    const h = (state.answers.height ?? {}) as Record<string, number>;
    const w = (state.answers.weight ?? {}) as Record<string, number>;
    const tw = (state.answers.targetWeight ?? {}) as Record<string, number>;
    const heightCm = h.height ?? 170;
    const currentKg = w.weight ?? 80;
    const targetKg = tw.targetWeight ?? 70;
    const kgDelta = currentKg - targetKg;
    const td = state.answers.targetDate as { date?: string; label?: string } | undefined;
    const targetDateLabel = td?.label || td?.date;
    content = (
      <ProjectionPreview
        headline={genderize(step.headline, gender)}
        subheadline={genderize(step.subheadline, gender)}
        reassure={step.reassureBg}
        ctaLabel={step.ctaBg ?? 'Виж моя план'}
        heightCm={heightCm}
        currentKg={currentKg}
        targetKg={targetKg}
        kgDelta={kgDelta}
        targetDateLabel={targetDateLabel}
        targetDateIso={td?.date}
        gender={gender ?? 'male'}
        onContinue={onContinue}
      />
    );
  } else if (step.type === 'interstitial') {
    const ageRange = typeof state.answers.age === 'string' ? state.answers.age : undefined;
    const ageMid =
      ageRange === '18-29'
        ? 24
        : ageRange === '30-39'
          ? 35
          : ageRange === '40-49'
            ? 45
            : ageRange === '50+'
              ? 55
              : 35;
    const goal = typeof state.answers.goal === 'string' ? state.answers.goal : undefined;
    const wantsLoss = !goal || !goal.startsWith('gain');
    const pickedTestimonial = step.testimonialPick
      ? pickInterstitialTestimonial({
          gender: gender ?? 'male',
          wantsLoss,
          ageMid,
          rankOffset: step.testimonialPick.rank,
        })
      : undefined;
    const testimonialId = !pickedTestimonial && step.testimonialIdByGender
      ? step.testimonialIdByGender[gender ?? 'male']
      : undefined;
    const testimonial = pickedTestimonial
      ?? (testimonialId ? TESTIMONIALS.find((t) => t.id === testimonialId) : undefined);
    const imageSrc = !testimonial && step.imageUrl
      ? step.imageUrl.replace('{char}', character).replace('{gender}', gender ?? 'male')
      : !testimonial && step.splitPhotoSlot
        ? characterImagePath(character, step.splitPhotoSlot)
        : undefined;
    const caption = !testimonial && step.testimonialByGender
      ? step.testimonialByGender[gender ?? 'male']
      : undefined;
    content = (
      <InterstitialCard
        headline={genderize(step.headline ?? '', gender)}
        body={genderize(step.bodyBg ?? '', gender)}
        ctaLabel={step.ctaBg ?? 'Продължи'}
        imageSrc={imageSrc}
        caption={caption}
        testimonial={testimonial}
        showStoreBadges={step.showStoreBadges}
        onContinue={onContinue}
      />
    );
  } else if (step.type === 'email-gate') {
    content = (
      <EmailGate
        fields={step.fields ?? []}
        ctaLabel={step.ctaBg ?? 'Продължи'}
        characterImageSrc={characterImagePath(character, 'goal')}
        onSubmit={onEmailSubmit}
      />
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <QuestionShell
        progress={Math.pow(state.currentStep / TOTAL_STEPS, 0.45)}
        onBack={
          step.type === 'email-gate'
            ? () => setShowResetConfirm(true)
            : state.currentStep > 1
              ? () => dispatch({ type: 'prev' })
              : undefined
        }
        headline={
          step.type === 'interstitial' || step.type === 'projection'
            ? undefined
            : genderize(step.headline, gender)
        }
        subheadline={
          step.type === 'interstitial' || step.type === 'projection'
            ? undefined
            : genderize(step.subheadline, gender)
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex flex-col flex-1"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </QuestionShell>

      <ConfirmDialog
        open={showResetConfirm}
        title="Започни отначало?"
        body="Всички твои отговори ще бъдат изтрити и ще се върнеш на първата стъпка."
        confirmLabel="Започни отначало"
        cancelLabel="Отказ"
        onConfirm={confirmResetFresh}
        onCancel={() => setShowResetConfirm(false)}
        icon={<RotateCcwIcon width={26} height={26} />}
      />
    </MotionConfig>
  );
}

// re-export for tooling
export { STEPS };
