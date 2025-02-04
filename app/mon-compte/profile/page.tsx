import Skills from "@/components/Skills";
import { Suspense } from "react";
import SkillsLoader from "../../../components/SkillsLoader";
 
export default function Home() {
  return (
    <>
      <h1>Mes compétences</h1>
      <Suspense fallback={<SkillsLoader />}>
        <Skills />
      </Suspense>
    </>
  );
}