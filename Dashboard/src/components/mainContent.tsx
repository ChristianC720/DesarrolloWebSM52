import Header from './header';
import ProjectStats from './projectStats';
import Sidebar from './sidebar';

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
                        {/* Teams content */}
                    </div>
                    <div className="section-card">
                        <h2>Recursos</h2>
                        {/* Resources content */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContent;