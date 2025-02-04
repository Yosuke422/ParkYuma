"use client";
 
import { useEffect, useState } from "react";
 
export default function Fetch() {
  const API_KEY = "45fa7385567b795d5d959da766d4a85e";
  // Préparation de variables dynamiques :
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [city, setCity] = useState<string | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
 
  // Appelé une fois au chargement de la page car aucun paramètre dans le tableau :
  useEffect(() => {
    // Récupération de la géolocalisation de l'utilisateur :
    navigator.geolocation.getCurrentPosition((position) => {
      // Sauvegarde des données :
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, []);
 
  const handleClick = () => {
    // Call API :
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric&lang=fr`
    ).then((response) => {
      // Récupération du body :
      response.json().then((data) => {
        // Sauvegarde des données :
        setCity(data.name);
        setTemp(Math.round(data.main.temp));
      });
    });
  };
  return (
    <>
      <button onClick={handleClick}>Météo</button>
      {city && <p>{city}</p>}
      {temp && <p>{temp}C°</p>}
    </>
  );
}