const express = require("express");
var url = require("url");
const dotenv = require("dotenv");
dotenv.config();

const app = new express();

const getNLUInstance = () => {
  let api_key = "6eJI9S6gCItGYhvOhBJBHV59XUK7AA-PLN0U6xEp8YEa";
  let api_url =
    "https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/580b1c5d-79da-4cd4-911c-1cb7986db552";

  const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
  const { IamAuthenticator } = require("ibm-watson/auth");

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: "2021-03-25",
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });
  console.log("instance is created ");
  return naturalLanguageUnderstanding;
};

app.use(express.static("client"));

const cors_app = require("cors");

app.use(cors_app());

app.get("/", (req, res) => {
  res.render("index.html");
});

// ---------URL EMOTION-----------------
app.get("/url/emotion", (req, res, next) => {
  const naturalLanguageUnderstanding = getNLUInstance();
  console.log(req.query.url);

  //logic

  const analyzeParams = {
    url: req.query.url,
    features: {
      emotion: {},
    },
  };
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      console.log("sucess");
      //  console.log("respose" + JSON.stringify(analysisResults, null, 2));
      const results = JSON.stringify(analysisResults.result.emotion, null, 2);
      console.log(results);
      return res.send(results);
    })

    .catch((err) => {
      console.log("errroe");
      console.log("error:", err);
    });
});

// ---------URL Sentiments-----------------
app.get("/url/sentiment", (req, res) => {
  console.log("URL Sentiments");
  const analyzeParams = {
    features: {
      sentiment: {},
    },
    url: req.query.url,
  };
  const naturalLanguageUnderstanding = getNLUInstance();
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      console.log(
        "respose" + JSON.stringify(analysisResults.result.sentiment, null, 2)
      );
      // return res.send({"happy":"90","sad":"10"});

      return res.send(
        JSON.stringify(analysisResults.result.sentiment, null, 2)
      );
    })
    .catch((err) => {
      console.log("error:", err);
    });

  // return res.send("url sentiment for " + req.query.url);
});

// ---------TEXY EMOTION-----------------
app.get("/text/emotion", (req, res) => {
  console.log(req.query.text);
  const analyzeParams = {
    features: {
      emotion: {},
    },
    text: req.query.text,
  };
  //logic

  const naturalLanguageUnderstanding = getNLUInstance();
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      console.log(
        "respose" + JSON.stringify(analysisResults.result.emotion, null, 2)
      );
      // return res.send({"happy":"90","sad":"10"});
      return res.send(JSON.stringify(analysisResults.result.emotion, null, 2));
    })
    .catch((err) => {
      console.log("error:", err);
    });
});

// ---------text  Sentiment-----------------
app.get("/text/sentiment", (req, res) => {
  console.log("hello");
  console.log(req.query.text);
  const analyzeParams = {
    features: {
      sentiment: {},
    },
    text: req.query.text,
  };

  const naturalLanguageUnderstanding = getNLUInstance();
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      console.log(
        "respose" + JSON.stringify(analysisResults.result.sentiment, null, 2)
      );
      return res.send(
        JSON.stringify(analysisResults.result.sentiment, null, 2)
      );
    })
    .catch((err) => {
      console.log("error:", err);
    });

  // return res.send("text sentiment for " + req.query.text);
});

let server = app.listen(8080, () => {
  console.log("Listening", server.address().port);
});
