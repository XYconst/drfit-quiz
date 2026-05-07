'use client';
import { useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { STEPS, getStep, resolveOptions, TOTAL_STEPS } from '@/lib/questions';
import {
  classifyAvatar,
  type Gender,
  type Goal,
  type BodyType,
  type AvatarOrBlocked,
} from '@/lib/avatars';
import { trackQuizStep, trackLead } from '@/lib/pixel';
import { QuestionShell } from './QuestionShell';
import { SingleSelect } from './SingleSelect';
import { MultiSelect } from './MultiSelect';
import { NumericCombo } from './NumericCombo';
import { EmailGate } from './EmailGate';
import { CalculatingScreen } from './CalculatingScreen';
import { InterstitialCard } from './InterstitialCard';
import { DateStep } from './DateStep';

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
      const next = cur.includes(action.value) ? cur.filter((v) => v !== action.value) : [...cur, action.value];
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
  const avatar: AvatarOrBlocked | null =
    gender && goal && bodyType ? classifyAvatar(gender, goal, bodyType) : null;

  // tracking
  useEffect(() => {
    trackQuizStep(state.currentStep, avatar && avatar !== 'blocked' ? avatar : undefined);
  }, [state.currentStep, avatar]);

  // blocked redirect
  useEffect(() => {
    if (avatar === 'blocked') router.push('/blocked');
  }, [avatar, router]);

  const step = getStep(state.currentStep);
  if (!step) return null;

  const onSingle = (v: string) => {
    dispatch({ type: 'answer', stepId: step.id, value: v });
    setTimeout(() => dispatch({ type: 'next' }), 220);
  };

  const onContinue = () => dispatch({ type: 'next' });

  const onEmailSubmit = async (values: Record<string, string>) => {
    dispatch({ type: 'answer', stepId: step.id, value: values });
    if (!avatar || avatar === 'blocked') return;
    const m = (state.answers.metrics ?? {}) as Record<string, number>;
    const kg = Math.abs(Math.round((m.weight ?? 0) - (m.targetWeight ?? 0)));
    await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...values, avatar, kg, answers: state.answers }),
    }).catch(() => {/* swallow — analytics-grade reliability */});
    trackLead(values.email, avatar);
    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    router.push(`/plan?avatar=${avatar}&kg=${kg}`);
  };

  // Calculating screen renders bare (no shell)
  if (step.type === 'calculating') {
    return (
      <CalculatingScreen
        headline={step.headline ?? ''}
        milestones={step.milestonesBg ?? []}
        durationMs={step.durationMs ?? 8000}
        onDone={onContinue}
      />
    );
  }

  let content: React.ReactNode = null;
  if (step.type === 'single-select') {
    content = (
      <SingleSelect
        options={resolveOptions(step, gender ?? undefined)}
        selected={state.answers[step.id] as string | undefined}
        onPick={onSingle}
      />
    );
  } else if (step.type === 'multi-select') {
    const selected = (state.answers[step.id] as string[] | undefined) ?? [];
    content = (
      <MultiSelect
        options={resolveOptions(step, gender ?? undefined)}
        selected={selected}
        minSelect={step.minSelect ?? 1}
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
  } else if (step.type === 'interstitial') {
    content = (
      <InterstitialCard
        headline={step.headline ?? ''}
        body={step.bodyBg ?? ''}
        ctaLabel={step.ctaBg ?? 'Продължи'}
        onContinue={onContinue}
      />
    );
  } else if (step.type === 'email-gate') {
    content = (
      <EmailGate
        fields={step.fields ?? []}
        ctaLabel={step.ctaBg ?? 'Продължи'}
        onSubmit={onEmailSubmit}
      />
    );
  }

  return (
    <QuestionShell
      progress={state.currentStep / TOTAL_STEPS}
      onBack={state.currentStep > 1 ? () => dispatch({ type: 'prev' }) : undefined}
      headline={step.type === 'interstitial' ? undefined : step.headline}
      subheadline={step.type === 'interstitial' ? undefined : step.subheadline}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
          className="flex flex-col flex-1"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </QuestionShell>
  );
}

// re-export for tooling
export { STEPS };
