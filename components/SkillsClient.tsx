"use client";
 
import { Skill } from "@/types/Skill";
import { useEffect, useState } from "react";
 
export default function SkillsClient() {
  const [skillsList, setSkillsList] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
 
  // Catch delete action
  const handleDelete = (skill: Skill) => {
    deleteSkill(skill.rowid);
  };
 
  // Execute deletion
  const deleteSkill = async (skill_id: number | undefined) => {
    // Call API with DELETE method
    const response = await fetch(`/api/skills/delete/${skill_id}`, {
      method: "DELETE",
    });
 
    if (!response.ok || response.status >= 300) {
      setError("Une erreur est survenue");
      return;
    }
 
    // Update state with filter method to delete the row
    setSkillsList((prevList) =>
      prevList.filter((skill: Skill) => skill.rowid !== skill_id)
    );
  };

  const getSkills = async () => {
    const response = await fetch("/api/skills");
 
    if (!response.ok || response.status >= 300) {
      setError("Une erreur est survenue");
      return;
    }
 
    const skills = await response.json();
 
    // We need to keep in state the data only, not the HTML to easily delete the row later
    setSkillsList(skills.response);
    setIsLoading(false);
  };
 
  useEffect(() => {
    getSkills();
  }, []);
 
  return (
    <>
      {error && <p>{error}</p>}
      {isLoading ? (
        <p>Chargement des compétences</p>
      ) : skillsList.length > 0 ? (
        skillsList.map((skill: Skill, i: number) => {
          return (
            <p key={i}>
              {skill.skill_name} : {skill.level}/5
              <button onClick={() => handleDelete(skill)}>Supprimer</button>

            </p>
          );
        })
      ) : (
        <p>Aucune compétence associée à ce profil</p>
      )}
    </>
  );
}