import Header from './header';
import Sidebar from './sidebar';
import { useProjects } from '../context/ProjectContext';
import { useState } from 'react';

function MainContent2() {
    const { projectCounts } = useProjects();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const analyticsData = {
        completedTasks: 157,
        pendingTasks: 43,
        totalHours: 320,
        efficiency: 85,
        projectProgress: 68,
        teamPerformance: 92,
        deadlinesMet: 78,
        budgetStatus: 95
    };

    const recentActivities = [
        { date: 'Hoy', time: '14:30', type: 'meeting', content: 'Reunión del Project Alpha', priority: 'high' },
        { date: 'Hoy', time: '11:00', type: 'milestone', content: 'Hito completado: Backend Integration', priority: 'medium' },
        { date: 'Ayer', time: '16:45', type: 'update', content: 'Nuevo miembro añadido a Project Beta', priority: 'low' },
        { date: 'Ayer', time: '09:15', type: 'deadline', content: 'Fecha límite: UI Design Review', priority: 'high' },
        { date: 'Hace 2 días', time: '15:20', type: 'issue', content: 'Bug crítico resuelto en producción', priority: 'high' }
    ];

    const getActivityIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            meeting: '🤝',
            milestone: '🎯',
            update: '📝',
            deadline: '⏰',
            issue: '🐛'
        };
        return icons[type] || '📌';
    };

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-section">
                <Header/>
                <div className="sections-container">
                    <div className="section-card analytics-section">
                        <div className="section-header">
                            <h2>Analítica</h2>
                            <div className="period-selector">
                                <button 
                                    className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                                    onClick={() => setSelectedPeriod('week')}
                                >
                                    Semana
                                </button>
                                <button 
                                    className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                                    onClick={() => setSelectedPeriod('month')}
                                >
                                    Mes
                                </button>
                                <button 
                                    className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
                                    onClick={() => setSelectedPeriod('year')}
                                >
                                    Año
                                </button>
                            </div>
                        </div>
                        <div className="analytics-grid">
                            <div className="analytics-item">
                                <h3>Tareas completadas</h3>
                                <p className="analytics-number">{analyticsData.completedTasks}</p>
                                <div className="trend positive">↑ 12% vs último periodo</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Tareas pendientes</h3>
                                <p className="analytics-number">{analyticsData.pendingTasks}</p>
                                <div className="trend negative">↑ 5% vs último periodo</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Total de horas</h3>
                                <p className="analytics-number">{analyticsData.totalHours}h</p>
                                <div className="trend neutral">= vs último periodo</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Eficiencia</h3>
                                <p className="analytics-number">{analyticsData.efficiency}%</p>
                                <div className="trend positive">↑ 8% vs último periodo</div>
                            </div>
                        </div>
                        <div className="progress-metrics">
                            <div className="progress-item">
                                <span>Progreso del Proyecto</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${analyticsData.projectProgress}%`}}></div>
                                </div>
                                <span>{analyticsData.projectProgress}%</span>
                            </div>
                            <div className="progress-item">
                                <span>Rendimiento del Equipo</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${analyticsData.teamPerformance}%`}}></div>
                                </div>
                                <span>{analyticsData.teamPerformance}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Reportes & Actividades</h2>
                            <button className="filter-btn">Filtrar</button>
                        </div>
                        <div className="reports-container">
                            <div className="report-item status-summary">
                                <h3>Resumen de Estados</h3>
                                <div className="status-grid">
                                    <div className="status-card">
                                        <span className="status-label">Activos</span>
                                        <span className="status-number">{projectCounts.active}</span>
                                    </div>
                                    <div className="status-card">
                                        <span className="status-label">En Pausa</span>
                                        <span className="status-number">{projectCounts.paused}</span>
                                    </div>
                                    <div className="status-card">
                                        <span className="status-label">Inconclusos</span>
                                        <span className="status-number">{projectCounts.unfinished}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="report-item">
                                <h3>Actividades Recientes</h3>
                                <ul className="activity-list">
                                    {recentActivities.map((activity, index) => (
                                        <li key={index} className={`priority-${activity.priority}`}>
                                            <div className="activity-header">
                                                <span className="activity-icon">
                                                    {getActivityIcon(activity.type)}
                                                </span>
                                                <span className="activity-date">{activity.date}</span>
                                                <span className="activity-time">{activity.time}</span>
                                            </div>
                                            <p className="activity-content">{activity.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContent2; 