"use server";
import { CreateSkill } from "@/actions/CreateSkill";

export default async function SkillForm() {
  return (
    <form action={CreateSkill}>
      <label htmlFor="skill_name">Compétence : </label>
      <input
        type="text"
        name="skill_name"
        id="skill_name"
        placeholder="NextJS"
      />
      <br />
      <label htmlFor="skill_level">Niveau : </label>
      <br />
      <input
        type="range"
        name="skill_level"
        id="skill_level"
        min="1"
        max="5"
        step="1"
      />
      <br />
      <input type="submit" name="skill_add" value="Ajouter" />
    </form>
  );
}