import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface TeamSectionProps {
    filterTeam?: string;
}

function TeamSection({ filterTeam }: TeamSectionProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const currentUserRole = localStorage.getItem('userRole');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            // Load users from both users.json and localStorage
            const response = await fetch('/users.json');
            const jsonUsers = await response.json();
            
            const storedUsers = localStorage.getItem('registeredUsers');
            const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
            
            setUsers([...jsonUsers, ...registeredUsers]);
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Error al cargar usuarios');
        }
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        if (currentUserRole !== 'admin') {
            setError('Solo los administradores pueden cambiar roles');
            return;
        }

        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
                if (user.id === userId) {
                    return { ...user, role: newRole };
                }
                return user;
            });

            // Update localStorage for registered users
            const storedUsers = localStorage.getItem('registeredUsers');
            if (storedUsers) {
                const registeredUsers = JSON.parse(storedUsers);
                const updatedRegisteredUsers = registeredUsers.map((user: User) => {
                    if (user.id === userId) {
                        return { ...user, role: newRole };
                    }
                    return user;
                });
                localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
            }

            return updatedUsers;
        });

        setEditingUser(null);
    };

    const roles = ['admin', 'analyst', 'developer', 'designer', 'user'];

    return (
        <div className="users-list">
            {error && <p className="error">{error}</p>}
            {users.map((user) => (
                <div key={user.id} className="user-card">
                    <div className="user-info">
                        <h3>{user.name}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <div className="role-section">
                            <strong>Role: </strong>
                            {editingUser === user.id && currentUserRole === 'admin' ? (
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="role-select"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span onClick={() => currentUserRole === 'admin' && setEditingUser(user.id)}
                                      className={currentUserRole === 'admin' ? 'role-text editable' : 'role-text'}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TeamSection;