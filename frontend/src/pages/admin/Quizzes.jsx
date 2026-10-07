import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, List } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../lib/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await api.get('/quizzes');
      setQuizzes(data.data.data);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete all questions and attempts associated with this quiz.')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted');
      fetchQuizzes();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const filtered = quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Quizzes</h1>
          <p className="text-muted-foreground">Create, edit, and manage quiz content.</p>
        </div>
        <Button asChild>
          <Link to="/admin/quizzes/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No quizzes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Title</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Category</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Difficulty</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground text-center">Questions</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground text-center">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((q) => (
                  <tr key={q._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium truncate max-w-[200px]">{q.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{q.categoryId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 capitalize">{q.difficulty}</td>
                    <td className="px-6 py-4 text-center">{q.totalQuestions}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        q.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="mr-1">
                        <Link to={`/admin/quizzes/${q._id}/questions`} title="Manage Questions">
                          <List className="h-4 w-4 text-blue-500" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="mr-1">
                        <Link to={`/admin/quizzes/${q._id}/edit`} title="Edit Quiz Settings">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(q._id)} title="Delete Quiz">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
