import React, { createContext, useState, useContext } from 'react';

interface ProjectCounts {
    active: number;
    paused: number;
    unfinished: number;
}

interface ProjectContextType {
    projectCounts: ProjectCounts;
    updateProjectCounts: (counts: ProjectCounts) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [projectCounts, setProjectCounts] = useState<ProjectCounts>({
        active: 5,
        paused: 2,
        unfinished: 3
    });

    const updateProjectCounts = (counts: ProjectCounts) => {
        setProjectCounts(counts);
    };

    return (
        <ProjectContext.Provider value={{ projectCounts, updateProjectCounts }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
} 