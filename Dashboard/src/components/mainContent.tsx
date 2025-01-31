import Header from './header';
import Sidebar from './sidebar';

function mainContent() {
    
    return (
        <>
        
            <Header/>
            <Sidebar/>
            <main className="main-content">
                <div className="progress-bar">
                    <div className="progress" style={{ width: '57%' }}></div>
                </div>
                <span>57%</span>
            </main>
            </>
    );
};

export default mainContent;