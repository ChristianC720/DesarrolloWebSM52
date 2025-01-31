import Header from './header';
import ProjectStats from './projectStats';
import ResourceSection from './resourceSection';
import Sidebar from './sidebar';
import TeamSection from './teamSection';

function MainContent() {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-section">
                <Header/>
                <ProjectStats />
                <div className="sections-container">
                    <div className="section-card">
                        <h2>Equipos</h2>
                        <TeamSection />
                    </div>
                    <div className="section-card">
                        <h2>Recursos</h2>
                        <ResourceSection />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContent;