
import React from 'react';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    const colors = {
        'Admin': 'bg-primary/20 text-primary',
        'Editor': 'bg-green-500/20 text-green-400',
        'Viewer': 'bg-slate-500/20 text-slate-400',
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>{role}</span>
}

const Users: React.FC = () => {
    const { currentUser } = useAuth();
    const { users, updateUser } = useAppContext();
    const canEdit = currentUser?.role === UserRole.Admin;

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        if (!canEdit) return;
        updateUser(userId, { role: newRole });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Users & Permissions</h2>
                    <p className="text-text-secondary">Manage team members and their access levels.</p>
                </div>
                <button disabled={!canEdit} className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    Invite User
                </button>
            </div>
             <div className="bg-card rounded-lg border border-border overflow-hidden">
                 <table className="w-full text-sm">
                    <thead className="text-xs text-text-secondary uppercase bg-zinc-900">
                        <tr>
                            <th className="px-6 py-3 text-left">User</th>
                            <th className="px-6 py-3 text-left">Role</th>
                            {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                             <tr key={user.id} className="border-t border-border hover:bg-zinc-900/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full mr-3" />
                                        <div>
                                            <p className="font-medium text-text-primary">{user.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {canEdit ? (
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            className="bg-background border border-border rounded-md px-2 py-1 text-xs"
                                            disabled={user.id === currentUser?.id}
                                        >
                                            {Object.values(UserRole).map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <RoleBadge role={user.role} />
                                    )}
                                </td>
                                 {canEdit && (
                                     <td className="px-6 py-4 text-right">
                                        <button className="text-primary hover:underline text-xs" disabled>
                                            {user.id === currentUser?.id ? 'Current User' : 'Remove'}
                                        </button>
                                    </td>
                                 )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
