import { useState, useEffect } from 'react';
import '../styles/sidebar.css';
import { useProjects } from '../context/ProjectContext';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

function Sidebar() {
    const [showMembers, setShowMembers] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const { projectCounts } = useProjects();

    useEffect(() => {
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
            }
        };

        loadUsers();
    }, []);

    // Group users by role
    const usersByRole = users.reduce((acc: Record<string, User[]>, user) => {
        if (!acc[user.role]) {
            acc[user.role] = [];
        }
        acc[user.role].push(user);
        return acc;
    }, {});

    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-icon">⊞</span>
                <h1>Titulo</h1>
            </div>
            
            <div className="sidebar-content">
                <div className="members-section">
                    <button 
                        className="menu-button"
                        onClick={() => setShowMembers(!showMembers)}
                    >
                    <span className="icon">👥</span>
                        <span>Miembros</span>
                        <span className="arrow">{showMembers ? '▼' : '▶'}</span>
                    </button>

                    {showMembers && (
                        <div className="members-list">
                            {Object.entries(usersByRole).map(([role, users]) => (
                                <div key={role} className="role-group">
                                    <span className="role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                    {users.map(user => (
                                        <div key={user.id} className="member-item">
                                            <div className="member-name">
                                                <span>{user.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="status-section">
                    <button 
                        className="menu-button"
                        onClick={() => setShowStatus(!showStatus)}
                    >
                        <span>Status</span>
                        <span className="arrow">{showStatus ? '▼' : '▶'}</span>
                    </button>

                    {showStatus && (
                        <ul className="status-list">
                            <li>Proyectos Activos ({projectCounts.active})</li>
                            <li>Proyectos en Pausa ({projectCounts.paused})</li>
                            <li>Proyectos Inconclusos ({projectCounts.unfinished})</li>
                        </ul>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;