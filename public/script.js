var mymap = L.map("mapid").setView([0, 78], 3);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">Openstreet</a> contributers';
const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

L.tileLayer(tileUrl, { attribution }).addTo(mymap);
var returnData;
mymap.on("click", async function (e) {
  const popLocation = e.latlng;
  const lat = popLocation.lat;
  const lng = popLocation.lng;
  const r = { lat, lng };
  console.log(r);
  await fetch(`/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(r)
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      //console.log(jsonData.hours[0]);

      var popup = L.popup()
        .setLatLng(popLocation)
        .setContent(`<p>Latitude: ${lat} <br /> Longitude: ${lng}</p>`)
        .openOn(mymap);

      const returnData = jsonData.resp || jsonData;
      console.log(returnData);
      var airt = document.getElementById("air_temperature");
      airt.textContent = "";
      var h = (document.createElement("h3").innerHTML = "AIR TEMPERATURE");
      airt.append(h);

      for (const [key, value] of Object.entries(returnData.airTemperature)) {
        console.log(`${key}: ${value}`);
        let lis = document.createElement("span");
        lis.innerHTML = `${key}: ${value}`;
        airt.append(lis);
      }

      const gust = document.getElementById("gust");
      gust.textContent = "";
      var gs = (document.createElement("h3").innerHTML = "Gust");
      gust.append(gs);

      for (const [key, value] of Object.entries(returnData.gust)) {
        console.log(`${key}: ${value}`);
        let lis = document.createElement("span");
        lis.innerHTML = `${key}: ${value}`;
        gust.append(lis);
      }
      const humid = document.getElementById("humidity");
      humid.textContent = "";
      var hu = (document.createElement("h3").innerHTML = "Humidity");
      humid.append(hu);

      for (const [key, value] of Object.entries(returnData.humidity)) {
        console.log(`${key}: ${value}`);
        let lis = document.createElement("span");
        lis.innerHTML = `${key}: ${value}`;
        humid.append(lis);
      }
      const wvh = document.getElementById("wave_height");
      wvh.textContent = "";
      var wh = (document.createElement("h3").innerHTML = "Wave Heights");
      wvh.append(wh);

      for (const [key, value] of Object.entries(returnData.waveHeight)) {
        console.log(`${key}: ${value}`);
        let lis = document.createElement("span");
        lis.innerHTML = `${key}: ${value}`;
        wvh.append(lis);
      }
      const wvd = document.getElementById("wave_direction");
      wvd.textContent = "";
      var wd = (document.createElement("h3").innerHTML = "Wave Direction");
      wvd.append(wd);

      for (const [key, value] of Object.entries(returnData.waveDirection)) {
        console.log(`${key}: ${value}`);
        let lis = document.createElement("span");
        lis.innerHTML = `${key}: ${value}`;
        wvd.append(lis);
      }
      // Do something with response data.
    });
  // .catch((err) => {
  //   console.log(err);
  // });
}); //fetch
