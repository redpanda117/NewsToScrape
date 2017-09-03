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
// Set up a static folder (view) for our web app
//app.use(express.static("views"));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "scraperHW";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

/* Basic route that sends the user first to the AJAX Page from the htmlRoutes. The get to show the html and css on the website*/
//require("./app/routing/routes.js")(app);

// Main route (to render the webpage with handlebars)
app.get("/", function(req, res) {
  res.render("index");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  //  Query: In our database, go to the scrapedData collection, then "find" everything
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the result of this query to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    db.scrapedData.remove({});
  // Make a request for the news section of ycombinator
  request("http://www.newsmax.com/newsfront/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "tag-item" class
    $("li.article_link").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");
      var summary = $(element).attr("id","copy_small").text();    
      var image = $(element).find("img").attr("src");  
        
      // If this found element had both a title and a link
      if (title && link && summary && image) {
        // Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          link: link,
          summary: summary,
          image:image    
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });
console.log(res);
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});