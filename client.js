const express = require("express");
const fs = require("fs");
const app = express();


let filesDirectory = "/dist/";

function checkHttps(req, res, next) { // thx https://support.glitch.com/t/solved-auto-redirect-http-https/2392
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps);

let api = express();

app.use("/api", api);

api.get("/", function(req, res) {
  res.send(JSON.stringify({
    
  }));
});

api.get("*", function(req, res) {
  res.send(`"Unknown request"`);
});

app.get("*", function(req, res) {
  let file = req.path;
  
  if(file[0] === "/") file = file.slice(1);
  if(file.endsWith("/")) file = file.slice(-1);
  
  if(!file) file = "index.html";
  
  
  fs.access(__dirname + filesDirectory + file, fs.constants.F_OK, function(err) {
    if(err) file = "index.html"; // file not exists
    
    res.sendFile(__dirname + filesDirectory + file);
  });
})
app.listen(process.env.PORT, function() {
  console.log(`Your app is listening on port ${this.address().port}`);
});