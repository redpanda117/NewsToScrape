// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public/javascript"));
// Set up a static folder (public) for our web app
app.use(express.static("public/stylesheets"));
// Set up a static folder (view) for our web app
app.use(express.static("views"));

// Database configuration
var databaseUrl = "scraperHW";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  //empty table     
    db.scrapedData.remove({});
  // Make a request for the news section of ycombinator
  request("http://www.newsmax.com/us/", function(error, response, html) {
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
      if (title && link) {
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

  // When "Scrape Complete"
    // Query: In our database, go to the animals collection, then "find" everything
  db.scrapedData.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});