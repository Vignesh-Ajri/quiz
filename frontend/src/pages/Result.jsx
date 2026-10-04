import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, MinusCircle, Trophy, Clock, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';

function ScoreBadge({ percentage, isPassed }) {
  return (
    <div
      className={cn(
        'w-36 h-36 rounded-full flex flex-col items-center justify-center border-8 mx-auto mb-6',
        isPassed
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
      )}
    >
      <span className={cn('text-4xl font-extrabold', isPassed ? 'text-green-600' : 'text-red-600')}>
        {percentage}%
      </span>
      <span className={cn('text-sm font-semibold', isPassed ? 'text-green-600' : 'text-red-600')}>
        {isPassed ? 'Passed 🎉' : 'Failed'}
      </span>
    </div>
  );
}

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">No result found.</p>
        <Button className="mt-4" onClick={() => navigate('/quizzes')}>Browse Quizzes</Button>
      </div>
    );
  }

  const { attempt, questions } = result;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Quiz Results</h1>
        <p className="text-muted-foreground">Here's how you did.</p>
      </div>

      <ScoreBadge percentage={attempt.percentage} isPassed={attempt.isPassed} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{attempt.correctCount}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{attempt.wrongCount}</p>
            <p className="text-xs text-muted-foreground">Wrong</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MinusCircle className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <p className="text-2xl font-bold">{attempt.skippedCount}</p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{formatTime(attempt.timeSpent)}</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Score bar */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-muted-foreground w-16">Score</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={cn('h-3 rounded-full transition-all', attempt.isPassed ? 'bg-green-500' : 'bg-red-500')}
                style={{ width: `${attempt.percentage}%` }}
              />
            </div>
            <span className="text-sm font-bold">{attempt.score}/{attempt.totalPoints}</span>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      {questions && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Question Review</h2>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div
                key={q._id}
                className={cn(
                  'rounded-xl border p-5',
                  q.isCorrect ? 'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10' :
                  q.userAnswer ? 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10' :
                  'border-border bg-card'
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="shrink-0 mt-0.5">
                    {q.isCorrect
                      ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                      : q.userAnswer
                      ? <XCircle className="h-5 w-5 text-red-500" />
                      : <MinusCircle className="h-5 w-5 text-gray-400" />
                    }
                  </span>
                  <p className="font-medium text-sm">Q{i + 1}. {q.text}</p>
                </div>
                <div className="pl-8 space-y-1.5">
                  {q.options.map((opt) => {
                    const isCorrect = opt.id === q.correctOptionId;
                    const isUserAnswer = opt.id === q.userAnswer;
                    return (
                      <div
                        key={opt.id}
                        className={cn(
                          'text-xs px-3 py-2 rounded-md flex items-center gap-2',
                          isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold' :
                          isUserAnswer && !isCorrect ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 line-through' :
                          'text-muted-foreground'
                        )}
                      >
                        <span className="font-bold w-4 shrink-0">{opt.id}.</span>
                        {opt.text}
                        {isCorrect && <span className="ml-auto text-green-600">✓ Correct</span>}
                        {isUserAnswer && !isCorrect && <span className="ml-auto text-red-600">✗ Your answer</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="pl-8 mt-3 text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="flex-1" onClick={() => navigate('/quizzes')}>
          Browse More Quizzes
        </Button>
        <Button className="flex-1" onClick={() => navigate('/dashboard')}>
          <Trophy className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
