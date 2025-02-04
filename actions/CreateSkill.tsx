"use server";
 
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addSkill } from "./AddSkill";
 
// Define rules for the form data
const SkillSchema = z.object({
  rowid: z.number(),
  skill_name: z.string().min(1).max(255),
  skill_level: z.enum(["1", "2", "3", "4", "5"]),
  user: z.number(),
});
 
// Ignore rowid and user in the form
const ZodCreateSkill = SkillSchema.omit({ rowid: true, user: true });
 
export async function CreateSkill(formData: FormData) {
  try {
    // Validate the form
    const { skill_name, skill_level } = ZodCreateSkill.parse({
      skill_name: formData.get("skill_name"),
      skill_level: formData.get("skill_level"),
    });
 
    // Add the skill (see "/actions/AddSkill.tsx" in few steps)
    const add = await addSkill(skill_name, skill_level);
 
    // If there is an error during skill add process
    if (!add.ok || add.status >= 300) {
      const { message } = await add.json();
      throw new Error(message);
    }
 
    // Here, skill was successfully added
    revalidatePath("/mon-compte/profil"); // it will update the set with the new data
  } catch (error) {
    // If it's a form validation error
    if (error instanceof z.ZodError) {
      const errors: Array<string> = [];
      // Get all errors
      error.issues.forEach((issue) => {
        errors.push(issue.message);
      });
 
      throw new Error(errors.join(", "));
    } else if (typeof error === "object") {
      // catch errors like "skill already exist"
      throw new Error(error?.toString());
    }
    throw new Error("An error occured");
  }
 
  redirect("/mon-compte/profil");
}