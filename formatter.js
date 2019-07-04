//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var content;
const formattedContent = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


app.get("/", function(req, res) {

  res.render("home", {
    Content: content === null ? "" : content,
    FormattedContent: formattedContent === null ? "" : returnContent(formattedContent),
  });
});

app.post("/format", function(req, res) {

  formattedContent.length = 0;
  content = req.body.postBody;

  var result = content.split(/\r?\n/);

  result.forEach(function(element) {

    var splitValues = [];

    if (!element.includes(":")) {
      return;
    }

    if (element.toLowerCase().includes("referer")) {
      var temp = element.split(":");
      var key = temp[0];
      var value = temp.slice(1).join(":");
      splitValues.push(key);
      splitValues.push(value);
    } else {
      splitValues = element.split(":", 2);
    }

    if (splitValues.length != 2) {
      return;
    }

    formattedContent.push(splitValues);
  });

  res.redirect("/");
});

app.post("/reset", function(req, res) {
  content = null;

  formattedContent.length = 0;
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

function returnContent(input) {
  var result = "";

  input.forEach(function(element) {
    result += "{ \"" + element[0].trim() + "\", \"" + element[1].trim() + "\" },\n"
  });

  return result.substring(0, result.length - 2);
}
