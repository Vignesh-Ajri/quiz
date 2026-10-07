import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../lib/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data.categories);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category created');
      }
      setForm({ name: '', icon: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, icon: c.icon });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
        <p className="text-muted-foreground">Create and edit quiz categories.</p>
      </div>

      <div className="bg-card border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Category' : 'Add New Category'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Category Name</label>
            <Input
              required
              placeholder="e.g. JavaScript"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="w-full sm:w-24 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Emoji Icon</label>
            <Input
              placeholder="e.g. ⚡"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {editingId && (
              <Button type="button" variant="outline" onClick={() => {
                setEditingId(null);
                setForm({ name: '', icon: '' });
              }}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="w-full sm:w-auto">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No categories found.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Icon</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-3 font-semibold text-muted-foreground">Slug</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-xl">{c.icon}</td>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(c._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
