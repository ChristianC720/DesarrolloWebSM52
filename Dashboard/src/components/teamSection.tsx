import { useState } from 'react';

interface TeamSectionProps {
    filterTeam?: string;
}

function TeamSection({ filterTeam }: TeamSectionProps) {
    const [teams] = useState([
        {
            name: "Equipo Alpha",
            members: ["Fulanito", "Pepito"],
            project: "Proyecto A"
        },
        {
            name: "Equipo Beta",
            members: ["Perenganito", "Pepito"],
            project: "Proyecto B"
        },
        {
            name: "Equipo Gamma",
            members: ["Fulanito", "Perenganito"],
            project: "Proyecto C"
        }
    ]);

    const filteredTeams = filterTeam 
        ? teams.filter(team => team.name === filterTeam)
        : teams;

    return (
        <div className="teams-list">
            {filteredTeams.map((team, index) => (
                <div key={index} className="team-card">
                    <h3>{team.name}</h3>
                    <div className="team-info">
                        <p><strong>Proyecto:</strong> {team.project}</p>
                        <p><strong>Miembros:</strong> {team.members.join(", ")}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TeamSection;