$("#scrape_button").click(function() {
  $.getJSON("/scrape", function(result) {}).then(alert("Scrapping, please wait. The page will be realoaded once the scrapping is completed."));   
});

$("#clear_button").click(function() {
  $.getJSON("/delete", function() {}).then(function(){
    location.reload();
    });
});

new Promise(function(resolve, reject) {
  $.getJSON("/saved", function (res, err) {
    for (var i = 0; i < res.length; i++) {
      $("#articles").append("<p data-toggle='modal' data-target='#myModal' data-id='" + res[i]._id + "'><b>" + res[i].title + "</b>&nbsp;&nbsp;<button style='height:2.5em' type='button' data-id='" + res[i]._id + "' class='btn btn-secondary' id='add_article_button' value='scrape'><font size='2'>Save Article</font></button><br /><a target='_blank' href='https://www.umassmed.edu" + res[i].link + "'>https://www.umassmed.edu" + res[i].link + "</a></p><br>");
    };
  });
  setTimeout(() => resolve(1), 500);
}).then(function(result) {
  if(parseInt(String($("#articles").html()).length) == 0){
    location.reload();
  };
});

// Whenever someone clicks a p tag
$(document).on("click", "#add_article_button", function() {
  // Empty the notes from the note section
  $("#save_popup").empty();
  var thisId = $(this).attr("data-id");
  var thisLink = $(this).attr("data-link");
  var thisTitle = $(this).attr("data-title");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/saved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      // The title of the article
      $("#save_popup").append("<div class='modal-content'><div class='modal-header'><button type='button' onclick='close_note()' class='close'>&times;</button></div><div class='modal-body'><h4>Do you want to saved this article?</h4></div><div class='modal-footer'><button class='btn btn-default' data-title='"+ data.title +"' data-link='"+ data.link +"' data-id='" + data._id + "' id='savearticle'>Save Article</button></div></div>");
    });
});

$(document).on("click", "#savearticle", function() {
  var thisId = $(this).attr("data-id");
  var thisLink = $(this).attr("data-link");
  var thisTitle = $(this).attr("data-title");

  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
    data: {
      title: thisTitle,
      link: "https://www.umassmed.edu" + thisLink
    }
  })
    .then(function(result) {
      //console.log(result);
      $("#save_popup").empty();
    });
  $("#save_popup").empty();
});

function close_note(){$("#save_popup").empty();};