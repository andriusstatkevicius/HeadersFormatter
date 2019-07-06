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
    Content: "",
    FormattedContent: "",
  });
});

app.get("/formatted", function(req, res) {

  res.render("home", {
    Content: content,
    FormattedContent: returnContent(formattedContent),
  });
});

app.post("/format", function(req, res) {

  formattedContent.length = 0;
  content = req.body.postBody;

  var result = content.split(/\r?\n/);

  if (result[0] !== "") {

    result.forEach(function(element) {

      var splitValues = [];

      if (!element.includes(":")) {
        return;
      }

      var temp = element.split(/:(.+)/);
      var key = temp[0];
      var value = temp[1];

      splitValues.push(key);
      splitValues.push(value);

      formattedContent.push(splitValues);
    });

    res.redirect("/formatted");
  } else {
    res.redirect("/");
  }
});

app.post("/reset", function(req, res) {
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
