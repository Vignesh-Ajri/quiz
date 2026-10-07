import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../lib/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function QuizForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    instructions: '',
    categoryId: '',
    difficulty: 'easy',
    duration: 0,
    passingScore: 60,
    status: 'DRAFT',
  });

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data.data.categories);
        
        if (isEdit) {
          const quizRes = await api.get(`/quizzes/${id}`);
          const q = quizRes.data.data.quiz;
          setForm({
            title: q.title,
            description: q.description || '',
            instructions: q.instructions || '',
            categoryId: q.categoryId?._id || '',
            difficulty: q.difficulty,
            duration: q.duration,
            passingScore: q.passingScore,
            status: q.status,
          });
        }
      } catch (err) {
        toast.error('Failed to load data');
        navigate('/admin/quizzes');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, navigate, isEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.patch(`/quizzes/${id}`, form);
        toast.success('Quiz updated');
      } else {
        const { data } = await api.post('/quizzes', form);
        toast.success('Quiz created! Now add some questions.');
        navigate(`/admin/quizzes/${data.data.quiz._id}/questions`);
        return;
      }
      navigate('/admin/quizzes');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-4 -ml-4">
        <Link to="/admin/quizzes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Update quiz settings and metadata.' : 'Set up the basic details for a new quiz.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-xl p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required value={form.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <textarea
            id="instructions"
            name="instructions"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Shown to the user before they start the quiz."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty *</Label>
            <select
              id="difficulty"
              name="difficulty"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" name="duration" type="number" min="0" value={form.duration} onChange={handleChange} />
            <p className="text-xs text-muted-foreground">0 for unlimited time.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score (%)</Label>
            <Input id="passingScore" name="passingScore" type="number" min="0" max="100" value={form.passingScore} onChange={handleChange} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.status}
              onChange={handleChange}
            >
              <option value="DRAFT">Draft (Hidden from students)</option>
              <option value="PUBLISHED">Published (Visible to students)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/quizzes')}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </div>
  );
}
