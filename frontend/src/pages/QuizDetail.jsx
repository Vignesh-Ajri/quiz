import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, BookOpen, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const difficultyColors = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600',
};

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/${id}`);
        setQuiz(data.data.quiz);
      } catch (err) {
        toast.error('Quiz not found');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleStart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to take quizzes');
      navigate('/login');
      return;
    }
    setStarting(true);
    try {
      const { data } = await api.post(`/quizzes/${id}/attempts`);
      const attemptId = data.data.attempt._id;
      navigate(`/quiz/${id}/attempt/${attemptId}`);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to start quiz');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-2 text-sm text-muted-foreground">
          {quiz.categoryId?.name} / {quiz.title}
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-muted-foreground mb-8">{quiz.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{quiz.totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{quiz.duration > 0 ? quiz.duration : '∞'}</p>
            <p className="text-xs text-muted-foreground">{quiz.duration > 0 ? 'Minutes' : 'No Limit'}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className={`text-2xl font-bold capitalize ${difficultyColors[quiz.difficulty]}`}>{quiz.difficulty}</p>
            <p className="text-xs text-muted-foreground">Difficulty</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{quiz.passingScore}%</p>
            <p className="text-xs text-muted-foreground">To Pass</p>
          </div>
        </div>

        {quiz.instructions && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{quiz.instructions}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Before you begin</CardTitle>
            <CardDescription>Make sure you understand the rules</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Once started, the timer cannot be paused</li>
              <li>You can navigate between questions freely</li>
              <li>Your answers are auto-saved as you go</li>
              <li>Results are shown immediately after submission</li>
              {quiz.duration > 0 && <li>Quiz will auto-submit when the timer expires</li>}
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/quizzes')}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={handleStart}
            disabled={starting}
            className="flex-1"
          >
            {starting ? 'Starting...' : isAuthenticated ? 'Start Quiz' : 'Login to Start'}
          </Button>
        </div>
      </div>
    </div>
  );
}
