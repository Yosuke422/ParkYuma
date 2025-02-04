// On s'assure qu'on est côté client :
"use client";
// Import des hooks :
import { useState, useEffect } from "react";
 
export default function Compteur() {
  const [count, setCount] = useState(0);
 
  // Utilisation de useEffect pour démarrer un intervalle lors du chargement du composant
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1); // Incrémente automatiquement toutes les secondes
    }, 1000);
 
    // Nettoyage : Arrête l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []); // Le tableau vide signifie que l'effet ne s'exécute qu'au chargement du composant
 
  return (
    <>
      <h1>Compteur automatique</h1>
      <p>Le compteur s&apos;incrémente toutes les secondes :</p>
      <h2>{count}</h2>
    </>
  );
}