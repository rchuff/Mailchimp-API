//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is now running on port 3000");
});


app.get("/", function(req,res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req,res){
  //build the data to send to the API after the user posts their information
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;
  console.log(firstName, lastName, email);
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }

      }
    ]
  };

  var jsonData = JSON.stringify(data);

  //format options parameter to send to mailchimp
  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/c08107296e",
    method: "POST",
    headers: {
      "Authorization": "rchuff2017 76b236719d9ada6ff09ff460f6d848a5-us20"
    },
    body: jsonData
  };

//response based on successful request or a failure
  request(options, function(error, response, body){
    console.log(response.statusCode);
      if (error || response.statusCode !== 200) {
        res.sendFile(__dirname + "/failure.html");
      }
      else {
        if (response.statusCode === 200) {
          res.sendFile(__dirname + "/success.html");
        }
      }
  });


});

app.post("/failure", function(req, res){
  res.redirect("/");
});
