import { useState } from 'react';

function ResourceSection() {
    const [resources] = useState([
        {
            name: "Laptop HP",
            status: "En uso",
            assignedTo: "Fulanito",
            project: "Proyecto A"
        },
        {
            name: "Monitor Dell",
            status: "Disponible",
            assignedTo: "-",
            project: "-"
        },
        {
            name: "Licencia Adobe",
            status: "En uso",
            assignedTo: "Pepito",
            project: "Proyecto B"
        },
        {
            name: "Sala de Reuniones",
            status: "Disponible",
            assignedTo: "-",
            project: "-"
        }
    ]);

    return (
        <div className="resources-list">
            {resources.map((resource, index) => (
                <div key={index} className="resource-card">
                    <h3>{resource.name}</h3>
                    <div className="resource-info">
                        <p>
                            <strong>Estado:</strong> 
                            <span className={`status ${resource.status === "Disponible" ? "available" : "in-use"}`}>
                                {resource.status}
                            </span>
                        </p>
                        <p><strong>Asignado a:</strong> {resource.assignedTo}</p>
                        <p><strong>Proyecto:</strong> {resource.project}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ResourceSection; 