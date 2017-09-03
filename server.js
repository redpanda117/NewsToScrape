// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Sets up the Express app to handle data parsing
/*app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));*/

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Basic route that sends the user first to the AJAX Page from the htmlRoutes.
require("./routes/routes.js")(app);

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});