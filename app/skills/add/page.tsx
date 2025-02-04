"use server";
 
import SkillForm from "@/components/SkillForm";
 
export default async function SkillAdd() {
  return (
    <>
      <h1>Ajouter une compétence</h1>
      <SkillForm />
    </>
  );
}