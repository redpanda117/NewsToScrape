//a function that takes the information from the database and display it onto the webpage
function displayScrapedArticles(data) {
    //clearing out the table of old articles
    $(".card-deck").empty();
    //loop through the mongo database to get all of the data 
    for (var i = 0; i < data.length; i++) {
        var $newCard = $("<div class= 'col-lg-4'>");
        var $newImg = $("<img class='card-img-top'>");
        var $newCardBody = $("<div class='card-body'>");
        var $newTitle = $("<h4 class='card-title'>");
        var $newSummary = $("<p class='card-text'>");
        var $newLink = $("<a class='btn btn-primary'>");

        //adding source image 
        $newImg.attr("src", "http://www.newsmax.com" + data[i].image);
        //adding the heading
        $newTitle.text(data[i].title);
        //add summary
        $newSummary.text(data[i].summary);
        //adding the direct link to news article
        $newLink.attr("href", data[i].link);
        $newLink.text("Link to original Article");

        //appending title,summary,link to body of card
        $newCardBody.append($newTitle);
        $newCardBody.append($newSummary);
        $newCardBody.append($newLink);

        //adding img and the body to the newCard
        $newCard.append($newImg);
        $newCard.append($newCardBody);

        //apending it to the div on the html
        $(".card-deck").append($newCard);
    }
}

$.getJSON("/all", function (data) {
    // Call our function to generate a table body
    //displayScrapedArticles(data);
});

// When user clicks the scrape button, display the table sorted by name
$("#scrape").on("click", function() {
    
  // Do an api call to the back end for json will scrape the data from the webpage 
  $.getJSON("/scrape", function(data) {
    displayScrapedArticles(data);
      console.log(data);
});
  });
    

