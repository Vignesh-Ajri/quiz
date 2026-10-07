import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { User as UserIcon, ShieldAlert, Check } from 'lucide-react';
import api from '../../lib/axios';
import { Button } from '../../components/ui/button';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to change role');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">View platform users and manage roles.</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="px-6 py-3 font-semibold text-muted-foreground">Joined</th>
                  <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="rounded-full" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role === 'student' ? (
                        <Button variant="outline" size="sm" onClick={() => handleRoleChange(u._id, 'admin')}>
                          <ShieldAlert className="h-4 w-4 mr-2 text-purple-500" /> Make Admin
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleRoleChange(u._id, 'student')}>
                          <UserIcon className="h-4 w-4 mr-2 text-blue-500" /> Make Student
                        </Button>
                      )}
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
