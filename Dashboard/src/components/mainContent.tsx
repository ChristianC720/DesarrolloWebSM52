import React from 'react';
import Sidebar from './sidebar';

const MainContent: React.FC = () => {
    return (
        <>
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

export default MainContent;