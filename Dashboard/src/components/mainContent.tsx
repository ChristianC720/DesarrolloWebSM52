import React from 'react';

const MainContent: React.FC = () => {
    return (
        <main className="main-content">
            <div className="progress-bar">
                <div className="progress" style={{ width: '57%' }}></div>
            </div>
            <span>57%</span>
        </main>
    );
};

export default MainContent;