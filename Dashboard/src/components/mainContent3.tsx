import Header from './header';
import Sidebar from './sidebar';
import { useState } from 'react';

function DeveloperDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const devMetrics = {
        completedTickets: 47,
        openBugs: 12,
        codeReviews: 28,
        commitsMade: 156,
        testCoverage: 87,
        buildSuccess: 94,
        deployments: 8,
        mergeConflicts: 3
    };

    const recentCommits = [
        { date: 'Hoy', time: '14:30', branch: 'main', message: 'Fix: Authentication bug in login flow', impact: 'high' },
        { date: 'Hoy', time: '11:20', branch: 'feature/user-profile', message: 'Add: New user profile components', impact: 'medium' },
        { date: 'Ayer', time: '16:45', branch: 'hotfix/api', message: 'Fix: API endpoint timeout issue', impact: 'high' },
        { date: 'Ayer', time: '10:15', branch: 'feature/dashboard', message: 'Update: Dashboard analytics components', impact: 'medium' }
    ];

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-section">
                <Header/>
                <div className="sections-container">
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Métricas de Desarrollo</h2>
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
                                <h3>Tickets Completados</h3>
                                <p className="analytics-number">{devMetrics.completedTickets}</p>
                                <div className="trend positive">↑ 8% vs último periodo</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Bugs Abiertos</h3>
                                <p className="analytics-number">{devMetrics.openBugs}</p>
                                <div className="trend negative">↑ 2 nuevos</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Code Reviews</h3>
                                <p className="analytics-number">{devMetrics.codeReviews}</p>
                                <div className="trend positive">↑ 15% completados</div>
                            </div>
                            <div className="analytics-item">
                                <h3>Commits</h3>
                                <p className="analytics-number">{devMetrics.commitsMade}</p>
                                <div className="trend neutral">= promedio normal</div>
                            </div>
                        </div>
                        <div className="progress-metrics">
                            <div className="progress-item">
                                <span>Test Coverage</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${devMetrics.testCoverage}%`}}></div>
                                </div>
                                <span>{devMetrics.testCoverage}%</span>
                            </div>
                            <div className="progress-item">
                                <span>Build Success Rate</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${devMetrics.buildSuccess}%`}}></div>
                                </div>
                                <span>{devMetrics.buildSuccess}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Git Activity</h2>
                            <button className="filter-btn">Filtrar por Branch</button>
                        </div>
                        <div className="dev-stats-grid">
                            <div className="dev-stat-card">
                                <span className="dev-stat-label">Deployments</span>
                                <span className="dev-stat-number">{devMetrics.deployments}</span>
                            </div>
                            <div className="dev-stat-card">
                                <span className="dev-stat-label">Merge Conflicts</span>
                                <span className="dev-stat-number">{devMetrics.mergeConflicts}</span>
                            </div>
                        </div>
                        <div className="commits-container">
                            <h3>Recent Commits</h3>
                            <ul className="commits-list">
                                {recentCommits.map((commit, index) => (
                                    <li key={index} className={`impact-${commit.impact}`}>
                                        <div className="commit-header">
                                            <span className="commit-branch">{commit.branch}</span>
                                            <span className="commit-date">{commit.date}</span>
                                            <span className="commit-time">{commit.time}</span>
                                        </div>
                                        <p className="commit-message">{commit.message}</p>
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

export default DeveloperDashboard; 