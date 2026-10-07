import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import api from '../../lib/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function QuestionsManager() {
  const { id: quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    text: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctOptionId: 'A',
    explanation: '',
    points: 1,
  });

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const fetchData = async () => {
    try {
      const [quizRes, qRes] = await Promise.all([
        api.get(`/quizzes/${quizId}`),
        api.get(`/quizzes/${quizId}/questions`), // Admin endpoint
      ]);
      setQuiz(quizRes.data.data.quiz);
      setQuestions(qRes.data.data.questions);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (id, text) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((o) => (o.id === id ? { ...o, text } : o)),
    }));
  };

  const handleAddOption = () => {
    const nextId = String.fromCharCode(form.options[form.options.length - 1].id.charCodeAt(0) + 1);
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { id: nextId, text: '' }],
    }));
  };

  const handleRemoveOption = (idToRemove) => {
    if (form.options.length <= 2) return toast.warning('Minimum 2 options required');
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter(o => o.id !== idToRemove),
      correctOptionId: prev.correctOptionId === idToRemove ? prev.options[0].id : prev.correctOptionId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.options.some((o) => !o.text.trim())) {
      return toast.error('All options must have text');
    }
    try {
      if (editingId) {
        await api.patch(`/questions/${editingId}`, form);
        toast.success('Question updated');
      } else {
        await api.post(`/quizzes/${quizId}/questions`, { ...form, order: questions.length });
        toast.success('Question added');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Action failed');
    }
  };

  const handleDelete = async (qId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/questions/${qId}`);
      toast.success('Question deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const startEdit = (q) => {
    setIsEditing(true);
    setEditingId(q._id);
    setForm({
      text: q.text,
      options: q.options,
      correctOptionId: q.correctOptionId,
      explanation: q.explanation || '',
      points: q.points || 1,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      text: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      correctOptionId: 'A',
      explanation: '',
      points: 1,
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-4 -ml-4">
        <Link to="/admin/quizzes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
        </Link>
      </Button>

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Questions</h1>
          <p className="text-muted-foreground">Quiz: <span className="font-semibold text-foreground">{quiz?.title}</span></p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-card border rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Question Text *</Label>
              <textarea
                required
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="What is the output of..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Options * (Select the correct one via radio button)</Label>
              </div>
              <div className="space-y-3">
                {form.options.map((opt) => (
                  <div key={opt.id} className={`flex items-center gap-3 p-2 rounded-lg border ${form.correctOptionId === opt.id ? 'border-primary bg-primary/5' : ''}`}>
                    <input
                      type="radio"
                      name="correctOption"
                      className="w-4 h-4 text-primary focus:ring-primary ml-2"
                      checked={form.correctOptionId === opt.id}
                      onChange={() => setForm({ ...form, correctOptionId: opt.id })}
                    />
                    <span className="font-bold w-6 text-center">{opt.id}</span>
                    <Input
                      className="flex-1"
                      required
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                      placeholder={`Option ${opt.id}`}
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveOption(opt.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Explanation (Optional)</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                placeholder="Explain why the answer is correct..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingId ? 'Update Question' : 'Save Question'}</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-16 bg-card border rounded-xl text-muted-foreground">
              <p className="mb-4">No questions added yet.</p>
              <Button onClick={() => setIsEditing(true)}>Add your first question</Button>
            </div>
          ) : (
            questions.map((q, i) => (
              <div key={q._id} className="bg-card border rounded-xl p-5 flex gap-4 group">
                <div className="text-muted-foreground/30 group-hover:text-muted-foreground cursor-grab mt-1 hidden sm:block">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="font-semibold">
                      <span className="text-muted-foreground mr-2">{i + 1}.</span>
                      {q.text}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(q)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(q._id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-md border ${
                          opt.id === q.correctOptionId ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400 font-medium' : 'bg-muted/50 border-transparent text-muted-foreground'
                        }`}
                      >
                        <span className="font-bold mr-2">{opt.id}.</span>
                        {opt.text}
                        {opt.id === q.correctOptionId && <span className="float-right">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
