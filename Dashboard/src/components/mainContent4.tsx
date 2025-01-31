import Header from './header';
import Sidebar from './sidebar';
import { useState } from 'react';

function DesignerDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const designMetrics = {
        completedDesigns: 24,
        inReview: 8,
        iterations: 45,
        components: 186,
        userTests: 12,
        designSystem: 92,
        accessibility: 96,
        feedback: 34
    };

    const recentDesigns = [
        { date: 'Hoy', time: '15:30', type: 'UI', title: 'Nueva página de perfil', status: 'review', priority: 'high' },
        { date: 'Hoy', time: '12:00', type: 'Components', title: 'Sistema de botones actualizado', status: 'completed', priority: 'medium' },
        { date: 'Ayer', time: '17:45', type: 'UX', title: 'Flow de onboarding', status: 'iteration', priority: 'high' },
        { date: 'Ayer', time: '11:30', type: 'Research', title: 'Resultados de user testing', status: 'completed', priority: 'medium' }
    ];

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-section">
                <Header/>
                <div className="sections-container">
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Métricas de Diseño</h2>
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
                            </div>
                        </div>
                        <div className="analytics-grid">
                            <div className="analytics-item">
                                <h3>Diseños Completados</h3>
                                <p className="analytics-number">{designMetrics.completedDesigns}</p>
                                <div className="trend positive">↑ 12% vs último periodo</div>
                            </div>
                            <div className="analytics-item">
                                <h3>En Review</h3>
                                <p className="analytics-number">{designMetrics.inReview}</p>
                                <div className="trend neutral">= sin cambios</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Iteraciones</h3>
                                <p className="analytics-number">{designMetrics.iterations}</p>
                                <div className="trend positive">↓ 5% menos iteraciones</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Componentes</h3>
                                <p className="analytics-number">{designMetrics.components}</p>
                                <div className="trend positive">↑ 8 nuevos</div>
                            </div>
                        </div>
                        <div className="progress-metrics">
                            <div className="progress-item">
                                <span>Design System Coverage</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${designMetrics.designSystem}%`}}></div>
                                </div>
                                <span>{designMetrics.designSystem}%</span>
                            </div>
                            <div className="progress-item">
                                <span>Accessibility Score</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${designMetrics.accessibility}%`}}></div>
                                </div>
                                <span>{designMetrics.accessibility}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Actividad de Diseño</h2>
                            <button className="filter-btn">Filtrar por Tipo</button>
                        </div>
                        <div className="design-stats-grid">
                            <div className="design-stat-card">
                                <span className="design-stat-label">User Tests</span>
                                <span className="design-stat-number">{designMetrics.userTests}</span>
                            </div>
                            <div className="design-stat-card">
                                <span className="design-stat-label">Feedback Recibido</span>
                                <span className="design-stat-number">{designMetrics.feedback}</span>
                            </div>
                        </div>
                        <div className="designs-container">
                            <h3>Diseños Recientes</h3>
                            <ul className="designs-list">
                                {recentDesigns.map((design, index) => (
                                    <li key={index} className={`priority-${design.priority}`}>
                                        <div className="design-header">
                                            <span className="design-type">{design.type}</span>
                                            <span className="design-date">{design.date}</span>
                                            <span className="design-time">{design.time}</span>
                                        </div>
                                        <p className="design-title">{design.title}</p>
                                        <span className={`design-status status-${design.status}`}>
                                            {design.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesignerDashboard; 