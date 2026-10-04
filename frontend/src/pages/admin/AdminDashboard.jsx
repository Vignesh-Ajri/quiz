import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Users, FileText, BarChart3, Trophy, TrendingUp, BookOpen } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../lib/axios';

function StatCard({ icon: Icon, label, value, sub, color = 'bg-primary/10 text-primary' }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, quizzesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users', { params: { limit: 5 } }),
          api.get('/admin/quizzes', { params: { limit: 5 } }),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data.data);
        setQuizzes(quizzesRes.data.data.data);
      } catch (err) {
        console.error('Admin load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Format chart data
  const chartData = stats?.recentAttempts?.map(d => ({
    date: d._id.slice(5), // MM-DD
    attempts: d.count,
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview and management.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl"/>)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={Users}     label="Total Students"  value={stats?.totalUsers ?? 0}     color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <StatCard icon={FileText}  label="Total Quizzes"   value={stats?.totalQuizzes ?? 0}   color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
          <StatCard icon={BarChart3} label="Total Attempts"  value={stats?.totalAttempts ?? 0}  color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
          <StatCard icon={Trophy}    label="Platform Avg"    value={`${stats?.avgScore ?? 0}%`} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
        </div>
      )}

      {/* Chart + Quick Links */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Attempts (Last 7 Days)
            </CardTitle>
            <CardDescription>Daily quiz submission count</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attempts"
                    stroke="hsl(221.2, 83.2%, 53.3%)"
                    strokeWidth={2}
                    fill="url(#colorAttempts)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { to: '/admin/categories', label: '📁  Manage Categories' },
              { to: '/admin/quizzes',    label: '📝  Manage Quizzes'    },
              { to: '/admin/users',      label: '👤  Manage Users'      },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg border bg-muted/30 text-sm font-medium hover:bg-muted transition-colors"
              >
                {item.label}
                <span className="text-muted-foreground">→</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent data tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg"/>)}</div>
            ) : (
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Recent Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg"/>)}</div>
            ) : (
              <div className="space-y-2">
                {quizzes.map(q => (
                  <div key={q._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium truncate max-w-[180px]">{q.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{q.difficulty} · {q.totalQuestions} Qs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{q.attemptCount || 0}</p>
                      <p className="text-xs text-muted-foreground">attempts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
