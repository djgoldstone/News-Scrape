var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// var PORT = 3000;

var app = express();

// app.use(logger("dev"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var databaseUrl = "mongodb://localhost/warriorsScraper";

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
}
else {
	mongoose.connect(databaseUrl);
};

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/warriorsScraper";

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// mongoose.connect("mongodb://localhost/warriorsScraper", { useNewUrlParser: true });
//how to connec to mongoDB

app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
    //   res.json(dbArticle);
    res.render("index", {data: dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    // res.render("index");
})
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.goldenstateofmind.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      console.log("scraping");
      // Now, we grab every h2 within an article tag, and do the following:
      $(".c-entry-box--compact").each(function(i, element) {
          console.log("Inside loop");
        // Save an empty result object
        var result = {};
        var title = $(this).find("h2").text();
        var summary = $(this).find("p").text();
        var url = $(this).find("a").attr("href");
        result.title = title;
        result.summary = summary;
        result.link = url;
          console.log(result);
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  app.put("/api/articles/:id", function(req, res) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {saved: true})
      .then(function(response) {
          res.json(response);
      }).catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  })

  // app.listen(PORT, () => {
  //     console.log("App is listening");
  // })

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });