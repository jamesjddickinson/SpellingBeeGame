import "../App.css";
import React, { useEffect, useState } from "react";

export default function Weather() {
  const apiKey = "a254ee84398840a3a5743936222212";
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [condition, setCondition] = useState();
  const [temp, setTemp] = useState();
  const [feelsLike, setFeelsLike] = useState();
  const [humidity, setHumidity] = useState();
  const [image, setImage] = useState();

  //   const [latitude, setLatitude] = useState("12.7046789");

  useEffect(() => {
    getLocation();
    getWeather();
  });

  function getWeather() {
    fetch(
      "https://api.weatherapi.com/v1/current.json?key=" +
        apiKey +
        "&q=" +
        latitude +
        "," +
        longitude
    )
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setCity(res.location.name);
          setCountry(res.location.country);
          setCondition(res.current.condition.text);
          setImage("https:" + res.current.condition.icon);
          setTemp(res.current.temp_c);
          setFeelsLike(res.current.feelslike_c);
          setHumidity(res.current.humidity);
          console.log(res);
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position) {
    const crd = position.coords;
    setLongitude(crd.longitude);
    setLatitude(crd.latitude);
    // console.log(` New Latitude : ${latitude}`);
  }

  return (
    <>
      <p>
        {city}, {country}
      </p>
      <p>{temp}</p>
      <p>Feels like {feelsLike}</p>
      <p>{condition}</p>
      <p>{humidity}</p>
      <img src={image} alt={condition + " icon"} />
    </>
  );
}
