var firebase = require("firebase");
var express = require('express');
var app = express();
var bodyParser =    require("body-parser");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(__dirname));

var config = {
	apiKey: "AIzaSyBiaHlS_llTEMatoz--lBnZzSW3VsrQ9wg",
	authDomain: "asdasd-2a11d.firebaseapp.com",
	databaseURL: "https://asdasd-2a11d.firebaseio.com",
	projectId: "asdasd-2a11d",
	storageBucket: "asdasd-2a11d.appspot.com",
	messagingSenderId: "542568699295"
};
firebase.initializeApp(config);

app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.get("/signin/home", function(req, res) {
    res.render("home.ejs");
});

app.post("/signin/home/logout", function(req, res) {
	firebase.auth().signOut().then(function() {
		console.log('Signed Out');
		res.render("index.ejs");
	},function(error) {
		  console.error('Sign Out Error', error);
	});
});

app.post("/signin",function(req,res){
		var email = req.body.email;
		var password = req.body.password;
		console.log(email);
		console.log(password);
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
			res.redirect("/signin/home");
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;

			if (errorCode === 'auth/wrong-password') {
				console.log('Wrong password.');
			} else {
				console.log(errorMessage);
			}
			console.log(error);
		});
});

app.listen(3000, "localhost", function() {
    console.log("Server started on port number 3000...");
});