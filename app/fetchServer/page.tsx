export default async function SSR() {
    const API_KEY = "45fa7385567b795d5d959da766d4a85e";
    const lat = 48.866667;
    const long = 2.333333;
   
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric&lang=fr`
    );
    const meteo = await data.json();
   
    return (
      <>
        <h1>{meteo.name}</h1>
        <p>{Math.round(meteo.main.temp)}C°</p>
      </>
    );
  }