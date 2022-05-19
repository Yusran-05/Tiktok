'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  return n;
}

/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

// if no file specified, return the main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/compare.html");
});

// if no file specified, return the main page
app.get("/GetTwoVideos", async (req, res) => {
  const preference = await win.getAllPrefs();
  if (preference.length >= 15) {
    res.send({ res: "pick winner" });
  }
  else {
    const Videos = await win.getAllVideos();
    if (Videos.length) {
      const firstVideoIndex = getRandomInt(Videos.length - 1);

      const videoObject = [Videos.splice(firstVideoIndex, 1)[0]];

      const secondVideoIndex = getRandomInt(Videos.length - 1);

      if (Videos.length)
        videoObject.push(Videos.splice(secondVideoIndex, 1)[0]);

      res.send(videoObject);
    }
    else {
      res.send([]);
    }
  }


});

app.post("/insertPref", async (req, res) => {

  await win.insertPreference(req.body.better, req.body.worse);
  const preference = await win.getAllPrefs();
  if (preference.length >= 15) {
    res.send("pick winner");
  }

  res.send("continue");

});

app.get("/winner", (req, res) => {
  res.sendFile(__dirname + "/public/winner.html");
});

app.get("/getWinner", async function (req, res) {
  try {
    const preference = await win.getAllPrefs();
    if (preference.length >= 15) {
      // change parameter to "true" to get it to computer real winner based on PrefTable 
      // with parameter="false", it uses fake preferences data and gets a random result.
      // winner should contain the rowId of the winning video.
      let winner = await win.computeWinner(8, false);

      // you'll need to send back a more meaningful response here.
      res.json(winner);
    }
    else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Page not found
app.use(function (req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

