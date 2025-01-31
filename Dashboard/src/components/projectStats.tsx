import { useProjects } from '../context/ProjectContext';

function ProjectStats() {
    const { projectCounts } = useProjects();

    return (
        <div className="project-stats">
            <div className="stat-card">
                <h3>Proyectos Activos</h3>
                <div className="stat-value">{projectCounts.active}</div>
            </div>
            <div className="stat-card">
                <h3>Proyectos en Pausa</h3>
                <div className="stat-value">{projectCounts.paused}</div>
            </div>
            <div className="stat-card">
                <h3>Proyectos Inconclusos</h3>
                <div className="stat-value">{projectCounts.unfinished}</div>
            </div>
        </div>
    );
}

export default ProjectStats; 