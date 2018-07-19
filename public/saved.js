$("#clear_button").click(function() {
  $.getJSON("/deletesaved", function() {}).then(function(){
    location.reload();
    });
});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-toggle='modal' data-target='#myModal' data-id='" + data[i]._id + "'><b>" + data[i].title + "</b>&nbsp;&nbsp;<button style='height:2.5em' type='button' data-id='" + data[i]._id + "' class='btn btn-secondary' id='add_note_button' value='scrape'><font size='2'>Add a note to this article</font></button>&nbsp;&nbsp;<button style='height:2.5em' type='button' data-id='" + data[i]._id + "' class='btn btn-secondary' id='remove_button' value='remove'><font size='2'>Remove article</font></button><br /><a target='_blank' href='" + data[i].link + "'>https://www.umassmed.edu" + data[i].link + "</a></p><br>");
  }
  if(String($("#articles").html()).length == 0){
    $("#articles").append("No articles saved yet.")
  }; 
});

// Whenever someone clicks a p tag
$(document).on("click", "#add_note_button", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      //console.log(data);
      // The title of the article
      $("#notes").append("<div class='modal-content'><div class='modal-header'><button type='button' onclick='close_note()' class='close'>&times;</button><h4 class='modal-title'>" + data.title + "</h4><input id='titleinput' name='title' ></div><div class='modal-body'><textarea id='bodyinput' name='body'></textarea></div><div class='modal-footer'><button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Save Note</button></div></div>");
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});


// Whenever someone clicks a p tag
$(document).on("click", "#remove_button", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/delete/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      //console.log(data);
      // The title of the article
      $("#notes").append("<div class='modal-content'><div class='modal-header'><button type='button' onclick='close_note()' class='close'>&times;</button><h4 class='modal-title'>Remove article</h4></div><div class='modal-body'><h4>Do you want to delete this article from your 'saved articles'?</h4></div><div class='modal-footer'><button class='btn btn-default' data-id='" + data._id + "' id='remove'>Remove</button></div></div>");
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      //console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// When you click the savenote button
$(document).on("click", "#remove", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      //console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

    location.reload();
});

function close_note(){$("#notes").empty();};
