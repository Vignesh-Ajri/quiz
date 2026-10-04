import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Clock, BarChart3, Search } from 'lucide-react';
import api from '../lib/axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function QuizCard({ quiz }) {
  return (
    <Link
      to={`/quizzes/${quiz._id}`}
      className="group flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {quiz.title}
          </h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColors[quiz.difficulty] || difficultyColors.easy}`}>
            {quiz.difficulty}
          </span>
        </div>
        {quiz.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{quiz.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {quiz.totalQuestions} Qs
          </span>
          {quiz.duration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {quiz.duration} min
            </span>
          )}
          {quiz.categoryId && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              {quiz.categoryId.name}
            </span>
          )}
        </div>
      </div>
      <div className="px-6 py-3 border-t bg-muted/30 rounded-b-xl">
        <span className="text-sm font-medium text-primary">Start Quiz →</span>
      </div>
    </Link>
  );
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, categoriesRes] = await Promise.all([
          api.get('/quizzes', { params: { category: selectedCategory || undefined, difficulty: selectedDifficulty || undefined } }),
          api.get('/categories'),
        ]);
        setQuizzes(quizzesRes.data.data.data);
        setCategories(categoriesRes.data.data.categories);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, selectedDifficulty]);

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Quizzes</h1>
        <p className="text-muted-foreground">Pick a quiz and test your knowledge.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => {
            if (e.target.value) setSearchParams({ category: e.target.value });
            else setSearchParams({});
          }}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No quizzes found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
