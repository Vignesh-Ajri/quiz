import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import api from '../lib/axios';
import { Button } from '../components/ui/button';

// ─── Timer Component ──────────────────────────────────────────────────────────
function Timer({ expiresAt, onExpire }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
      setRemaining(diff);
      if (diff === 0) onExpire();
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isWarning = remaining <= 60;

  return (
    <div className={`flex items-center gap-2 font-mono font-bold text-lg px-4 py-2 rounded-lg ${
      isWarning ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-muted text-foreground'
    }`}>
      <Clock className="h-4 w-4" />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

// ─── Question Panel ───────────────────────────────────────────────────────────
function QuestionPanel({ question, index, total, selectedOption, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Question {index + 1} of {total}</p>
        <h2 className="text-xl font-semibold leading-relaxed">{question.text}</h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <span className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}>
                {option.id}
              </span>
              <span className="text-sm">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Quiz Engine ─────────────────────────────────────────────────────────
export default function QuizEngine() {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [attemptRes, questionsRes] = await Promise.all([
          api.get(`/attempts/${attemptId}`),
          api.get(`/quizzes/${quizId}/questions/attempt`),
        ]);
        setAttempt(attemptRes.data.data.attempt);
        const qs = questionsRes.data.data.questions;
        setQuestions(qs);

        // Pre-populate any already-saved answers
        const pre = {};
        attemptRes.data.data.attempt.answers?.forEach((a) => {
          if (a.selectedOptionId) pre[a.questionId] = a.selectedOptionId;
        });
        setAnswers(pre);
      } catch (err) {
        toast.error('Failed to load quiz');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quizId, attemptId, navigate]);

  const saveAnswer = useCallback(async (questionId, selectedOptionId) => {
    try {
      await api.patch(`/attempts/${attemptId}/answer`, { questionId, selectedOptionId });
    } catch (err) {
      console.error('Autosave failed:', err);
    }
  }, [attemptId]);

  const handleSelect = (optionId) => {
    const questionId = questions[currentIndex]._id;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Debounced autosave
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveAnswer(questionId, optionId), 600);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post(`/attempts/${attemptId}/submit`);
      navigate(`/results/${attemptId}`, { state: { result: data.data } });
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  const onExpire = useCallback(() => {
    toast.warning('Time is up! Auto-submitting...');
    handleSubmit();
  }, [attemptId, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Header bar */}
      <div className="sticky top-16 z-10 bg-background border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-sm font-medium">{answeredCount}/{questions.length} answered</span>
          {attempt?.expiresAt && <Timer expiresAt={attempt.expiresAt} onExpire={onExpire} />}
          <Button size="sm" onClick={() => setShowConfirm(true)} disabled={submitting}>
            <Flag className="h-4 w-4 mr-1" />
            Submit
          </Button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-1 bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid md:grid-cols-[1fr_280px] gap-6 max-w-5xl">
        {/* Question Area */}
        <div className="bg-card rounded-xl border p-6 md:p-8">
          <QuestionPanel
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            selectedOption={answers[currentQuestion._id]}
            onSelect={handleSelect}
          />
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === questions.length - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Navigator */}
        <div className="bg-card rounded-xl border p-4 self-start sticky top-32">
          <p className="text-sm font-medium mb-3">Question Navigator</p>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const isAnswered = !!answers[q._id];
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-9 w-full rounded-md text-xs font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isAnswered
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-primary inline-block" />
              Current
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-green-500/30 border border-green-500/50 inline-block" />
              Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-muted inline-block" />
              Skipped
            </div>
          </div>
          <Button
            className="w-full mt-4"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
          >
            Submit Quiz
          </Button>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Submit Quiz?</h3>
            <p className="text-sm text-muted-foreground mb-1">
              You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                {questions.length - answeredCount} question(s) are unanswered.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Keep Reviewing
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Yes, Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
