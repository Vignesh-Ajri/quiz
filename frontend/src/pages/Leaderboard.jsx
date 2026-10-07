import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, User } from 'lucide-react';
import api from '../lib/axios';

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <span className="font-bold text-muted-foreground w-6 text-center">{rank}</span>;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/users/leaderboard');
        setLeaders(data.data.leaderboard);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
          <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground">Top performers across all quizzes on the platform.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-xl bg-card">
          <p>No attempts recorded yet. Be the first to take a quiz!</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-sm font-semibold text-muted-foreground hidden sm:grid">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-2 text-center">Quizzes</div>
            <div className="col-span-2 text-center">Avg Score</div>
            <div className="col-span-2 text-right">Total Pts</div>
          </div>

          {/* Rows */}
          <div className="divide-y">
            {leaders.map((leader, index) => (
              <div
                key={leader.userId}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-muted/50 ${
                  index < 3 ? 'bg-primary/5 dark:bg-primary/10' : ''
                }`}
              >
                {/* Mobile Rank/Avatar */}
                <div className="col-span-1 flex items-center gap-4 sm:justify-center">
                  <RankIcon rank={index + 1} />
                  {/* Mobile only layout helper */}
                  <div className="sm:hidden flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {leader.avatar ? (
                        <img src={leader.avatar} alt={leader.name} className="rounded-full" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{leader.name}</p>
                      <p className="text-xs text-muted-foreground">{leader.totalAttempts} quizzes • {leader.avgPercentage}% avg</p>
                    </div>
                  </div>
                  {/* Mobile only score */}
                  <div className="sm:hidden font-bold text-right text-primary">
                    {leader.totalScore}
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:flex col-span-5 items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {leader.avatar ? (
                      <img src={leader.avatar} alt={leader.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="font-semibold">{leader.name}</p>
                </div>
                
                <div className="hidden sm:block col-span-2 text-center text-sm">
                  {leader.totalAttempts}
                </div>
                
                <div className="hidden sm:block col-span-2 text-center">
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    leader.avgPercentage >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                    leader.avgPercentage >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30'
                  }`}>
                    {leader.avgPercentage}%
                  </span>
                </div>
                
                <div className="hidden sm:block col-span-2 text-right font-bold text-primary">
                  {leader.totalScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
