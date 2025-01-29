import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <ul>
                <li>Proyectos Activos</li>
                <li>Proyectos en Pausa</li>
                <li>Proyectos Inconclusos</li>
                <li>Equipos</li>
                <li>Recursos</li>
            </ul>
        </aside>
    );
};

export default Sidebar;