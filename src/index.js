const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();
app.set("view engine", "ejs");

const url = process.env.MONGO_API;
//app.use(express.static("e/public"));
function findf(lat, lng, db, res) {
  console.log("more than 10 or error");
  const params = "waveHeight,airTemperature,waveDirection,humidity,gust";
  const st = new Date().toISOString();
  const end = new Date().toISOString();
  //fetch starts

  fetch(
    `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${st}&end=${end}`,
    {
      headers: {
        Authorization: process.env.STORM_API
      }
    }
  )
    .then((resp) => {
      return resp.json();
    })
    .then((response) => {
      console.log("fetched from API success");
      // console.log(response.json());
      response.hours[0].lat = response.meta.lat;
      response.hours[0].lng = response.meta.lng;
      let resp = response.hours[0];
      db.collection("weather").insertOne(response.hours[0], (err, result) => {
        if (err) {
          console.log("error in saving");
        } else {
          console.log("send response after fetching ");

          return res.json({
            resp
          });
        } //else
        //db collection
      });
      //then
    }); //then

  //end fetch all mongo lat long
}

app.use(express.json()); //Deal with incoming request as object and recognizes it as Json which is readable by nodejs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    const db = client.db("DbName1");
    app.use(express.json()); //Deal with incoming request as object and recognizes it as Json which is readable by nodejs
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.post("/", async (req, res, next) => {
      const collection = client.db("DbName1").collection("weather");
      const lat = req.body.lat;
      const lng = req.body.lng;
      //fetch all..

      var dst = 11;
      client
        .db("DbName1")
        .collection("weather")
        .find()
        .toArray((err, weathers) => {
          for (var i = 0; i < weathers.length; i++) {
            var lat1 = weathers[i].lat;
            var lng1 = weathers[i].lng;
            var radlat1 = (Math.PI * lat) / 180;
            var radlat2 = (Math.PI * lat1) / 180;
            var theta = lng - lng1;
            var radtheta = (Math.PI * theta) / 180;
            var dist =
              Math.sin(radlat1) * Math.sin(radlat2) +
              Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
              dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 0.8684;
            console.log("Distance", dist);
            if (dist <= 10) {
              dst = dist;
              console.log("less than eq to 10");
              console.log(weathers[i]);
              return res.send(weathers[i]);
            } //if
          }
          if (dst > 10) {
            findf(lat, lng, db, res);
          }
        });

      //find in collection
    });
  }
);
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(8080, () => {
  console.log("working");
});
