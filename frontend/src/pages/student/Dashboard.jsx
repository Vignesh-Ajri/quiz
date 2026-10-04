import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BookOpen, Trophy, Target, CheckCircle2,
  XCircle, ArrowRight, Clock, BarChart2
} from 'lucide-react';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';

const statusColors = {
  submitted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  expired:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function StatCard({ icon: Icon, label, value, sub, color = 'text-primary' }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className={cn('h-4 w-4', color)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function AttemptRow({ attempt }) {
  const quiz = attempt.quizId;
  const passedBg = attempt.isPassed
    ? 'border-green-200 dark:border-green-900/40'
    : 'border-red-200 dark:border-red-900/40';

  return (
    <div className={cn('flex items-center gap-4 p-4 rounded-xl border', passedBg)}>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{quiz?.title || 'Quiz'}</p>
        <p className="text-xs text-muted-foreground capitalize">{quiz?.difficulty || ''}</p>
      </div>
      <div className="text-center hidden sm:block">
        <p className="text-lg font-bold">{attempt.percentage}%</p>
        <p className="text-xs text-muted-foreground">Score</p>
      </div>
      <div className="text-center hidden md:block">
        <p className="text-sm font-medium flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />{attempt.correctCount}
          <XCircle className="h-3.5 w-3.5 text-red-400 ml-2" />{attempt.wrongCount}
        </p>
        <p className="text-xs text-muted-foreground">Correct / Wrong</p>
      </div>
      <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full shrink-0', attempt.isPassed
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
        {attempt.isPassed ? 'Passed' : 'Failed'}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats]     = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, attemptsRes] = await Promise.all([
          api.get('/users/me/stats'),
          api.get('/users/me/attempts', { params: { limit: 5 } }),
        ]);
        setStats(statsRes.data.data);
        setAttempts(attemptsRes.data.data.attempts);
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, <span className="font-medium text-foreground">{user?.name}</span> 👋</p>
        </div>
        <Button asChild>
          <Link to="/quizzes">
            Browse Quizzes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={BookOpen}    label="Total Attempts"  value={stats?.totalAttempts ?? 0}   sub="Quizzes taken" />
          <StatCard icon={Trophy}      label="Avg Score"       value={`${stats?.avgScore ?? 0}%`}  sub="Overall average" color="text-yellow-500" />
          <StatCard icon={Target}      label="Accuracy"        value={`${stats?.avgAccuracy ?? 0}%`} sub="Correct answers rate" color="text-green-500" />
          <StatCard icon={BarChart2}   label="Pass Rate"       value={`${stats?.passRate ?? 0}%`} sub="Quizzes passed" color="text-blue-500" />
        </div>
      )}

      {/* Correct / Wrong summary */}
      {stats && stats.totalAttempts > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Answer Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-2.5 rounded-full bg-green-500 transition-all"
                  style={{ width: `${stats.totalCorrect / (stats.totalCorrect + stats.totalWrong + stats.totalSkipped) * 100 || 0}%` }} />
              </div>
              <span className="text-sm font-medium w-8 text-right">{stats.totalCorrect}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-2.5 rounded-full bg-red-500 transition-all"
                  style={{ width: `${stats.totalWrong / (stats.totalCorrect + stats.totalWrong + stats.totalSkipped) * 100 || 0}%` }} />
              </div>
              <span className="text-sm font-medium w-8 text-right">{stats.totalWrong}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-2.5 rounded-full bg-gray-400 transition-all"
                  style={{ width: `${stats.totalSkipped / (stats.totalCorrect + stats.totalWrong + stats.totalSkipped) * 100 || 0}%` }} />
              </div>
              <span className="text-sm font-medium w-8 text-right">{stats.totalSkipped}</span>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500 inline-block"/>Correct</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500 inline-block"/>Wrong</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-400 inline-block"/>Skipped</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Attempts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Attempts</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : attempts.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground mb-4">You haven't taken any quizzes yet.</p>
              <Button asChild><Link to="/quizzes">Take Your First Quiz</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {attempts.map(a => <AttemptRow key={a._id} attempt={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
