const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
const geocodingClient = mbxGeocoding({accessToken: mapToken});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = "This is a secret which cannot be revealed";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "66424d056cc8e222604adce2"}));
  for (let i = 0; i < initData.data.length; i++) {
    const listing = initData.data[i];
    let geoResponse =  await geocodingClient.forwardGeocode({
      query: `${listing.location}  ${listing.country}`,
      limit: 1
    })
      .send()    
    listing.geometry = geoResponse.body.features[0].geometry;
  }
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();