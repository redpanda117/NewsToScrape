//get any articles if in database
    $.getJSON("/all", function (data) {
        // Call our function to generate a table body
        if(data != 0){
        $("#noArticles").hide();    
        //displayScrapedArticles(data);
        console.log(data);
        }
        });

$("#dispalyArticles").on("click", function () {
    //ask the back end for json with all articles from the scrapedData collection
    //hide the opening text 
    $("#noArticles").hide();
    $.getJSON("/all", function (data) {
        console.log(data);
    });
});
// When user clicks the scrape button, display the table sorted by name
$("#scrapeButton").on("click", function () {
    //clearing out the table of old articles
    $(".card-deck").empty();
    // Do an api call to the back end for json will scrape the data from the webpage 
    $.getJSON("/scrape", function () {
        console.log("Articles are scraped");
    });
});

/*$("commentButton").on("click", function(){
    
})*/
