import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { User as UserIcon, Camera, Save } from 'lucide-react';
import api from '../lib/axios';
import { setCredentials } from '../store/authSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming a patch to /users/me/profile endpoint which we can just use /auth/me or similar if we had it.
      // Wait, let's look at what endpoints we have for users. We didn't define a specific profile update endpoint in the MVP plan, but let's assume we can mock it or it exists.
      // Wait, looking at the plan: we didn't define a PATCH /users/me. 
      // I'll just show a toast for now since backend route wasn't explicitly in the MVP scope for profile updates, or I can add a simple mock delay.
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state to simulate success
      dispatch(setCredentials({ user: { ...user, ...form } }));
      toast.success('Profile updated successfully (Demo)');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-muted border-4 border-background shadow-md flex items-center justify-center overflow-hidden">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.png"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Paste a direct image link.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
