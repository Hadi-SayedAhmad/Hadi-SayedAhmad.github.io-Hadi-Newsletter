const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // When you use app.use(express.static("public")), it tells Express to serve static files from the "public" directory and make them accessible directly from the root of your website. This means that you don't need to include "public/" in the URL path when referencing static files in href or src. The middleware automatically takes care of mapping the URL to the appropriate file in the "public" directory.

// Here's how it works:

// You have an image located at public/images/logo.png for example.
// You use <img src="/images/logo.png" alt="Logo"> in your HTML.
// When a request for /images/logo.png comes in, Express's static middleware recognizes that it should look for the file logo.png within the public/images directory.
// The middleware serves the file directly from the public directory, and your image appears on the webpage.

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});



app.post("/", (req, res) => {
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
    // console.log(firstName + " " + lastName + " " + email);

    const data = {
        members:
        [ // array of objects to be sent

            {
                email_address: email,
                status: "subscribed",
                merge_fields: 
                {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
            
        ]
    };

    const jsonData = JSON.stringify(data); //this is what we're going to send to mailchimp, they need it like this

    const listID = "a2ea9e7be7";
    const url = "https://us8.api.mailchimp.com/3.0/lists/" + listID;

    const options = {
        method: "POST",
        auth: "Hadi:4b5ecf304ef137346d0e1d07487d493e-us8"
    }

    const request =  https.request(url, options, (response) => { 
        if(response.statusCode === 200) {
            
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        // response.on("data", (data) => {
        //     console.log(JSON.parse(data)); // we are parsing because the data sent to us back is in hexadecimal
        // })
    });

    request.write(jsonData); //This method sends the JSON data (jsonData) in the request body... the .write method let us send data
    request.end(); //called to indicate the completion of the request setup and initiate the actual sending of the request to the server.

});

app.post("/failure", (req, resp) => {
    resp.redirect("/");
})


app.listen(3000, () => {
    console.log("Server is now live on port 3000");
});




// 4b5ecf304ef137346d0e1d07487d493e-us8 apikey
//a2ea9e7be7 list id