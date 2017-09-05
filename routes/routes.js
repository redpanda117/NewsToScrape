var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
// Require Note and Article models
var Article = require('../models/articles.js');

module.exports = function (app) {
    // database check
    Article.on("error", function (error) {
        console.log("Database Error:", error);
    });

    // Main route (to render the webpage with handlebars)
    app.get("/", function (req, res) {
        res.render("index");
    });

    // Retrieve data from the db
    app.get("/all", function (req, res) {
        //  Query: In our database, go to the scrapedData collection, then "find" everything
        Article.find({}, function (error, found) {
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
    app.get("/scrape", function (req, res) {
        
        // Make a request for the news section of combinator
        request("http://www.newsmax.com/newsfront/", function (error, response, html) {
            // Load the html body from request into cheerio
            var $ = cheerio.load(html);
            // For each element with a "tag-item" class
            $("li.article_link").each(function (i, element) {
                //all scraped articles will be save into this empty array.    
                var results = {};

                // get the tittle,link,summary,image of each article enclosed in the current element and add them to the results array
                results.title = $(element).children("a").text();

                results.link = $(element).children("a").attr("href");

                results.summary = $(element).attr("id", "copy_small").text();

                results.image = $(element).find("img").attr("src");


                //take the scraped data to the article model
                var scrapeInfo = new Article(results);

                //save articles that where scraped into out mongodb 
                scrapeInfo.save(function (err, doc) {
                    // log any errors
                    if (err) {
                        console.log(err);
                    }
                    // or log the doc
                    else {
                        console.log(doc);
                    }
                });
            });
        });
    });
}
