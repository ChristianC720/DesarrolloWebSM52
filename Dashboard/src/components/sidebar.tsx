import { useState } from 'react';
import '../styles/sidebar.css';

function Sidebar() {
    const [progress] = useState(57);
    const [showMembers, setShowMembers] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-icon">⊞</span>
                <h1>Titulo</h1>
            </div>
            
            <div className="sidebar-content">
                <button className="menu-button">
                    <span className="icon">👥</span>
                    <span>Equipo</span>
                    <span className="arrow">▼</span>
                </button>

                <div className="members-section">
                    <button 
                        className="menu-button"
                        onClick={() => setShowMembers(!showMembers)}
                    >
                        <span>Miembros</span>
                        <span className="arrow">{showMembers ? '▼' : '▶'}</span>
                    </button>

                    {showMembers && (
                        <div className="members-list">
                            <div className="member-item">
                                <span className="role">Scrum Master</span>
                                <div className="member-name">
                                    <span className="arrow">▶</span>
                                    <span>Fulanito</span>
                                </div>
                            </div>
                            <div className="member-item">
                                <span className="role">Developer</span>
                                <div className="member-name">
                                    <span className="arrow">▶</span>
                                    <span>Pepito</span>
                                </div>
                            </div>
                            <div className="member-item">
                                <span className="role">Developer</span>
                                <div className="member-name">
                                    <span className="arrow">▶</span>
                                    <span>Perenganito</span>
                                </div>
                            </div>
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
                            <li>Proyectos Activos</li>
                            <li>Proyectos en Pausa</li>
                            <li>Proyectos Inconclusos</li>
                            <li>Equipos</li>
                            <li>Recursos</li>
                        </ul>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;