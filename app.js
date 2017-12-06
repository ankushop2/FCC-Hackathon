var firebase = require("firebase");
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
//app.use(express.static("public"));


// FIREBASE CONFIG
var config = {
	apiKey: "AIzaSyCufIc48jvfrtzuichCuQ1TkrfWaF_jzs8",
	authDomain: "fcc-hack.firebaseapp.com",
	databaseURL: "https://fcc-hack.firebaseio.com/",
	projectId: "fcc-hack",
	storageBucket: "fcc-hack.appspot.com",
	//messagingSenderId: "542568699295"
};

firebase.initializeApp(config);
var ref = firebase.database().ref();


// ROUTES
app.get("/", function(req, res) {
    res.redirect("/login");
});

app.get("/login", function(req, res) {
	res.render("login");
});

app.post("/login",function(req,res){
		var email = req.body.email;
		var password = req.body.password;
		
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
			res.redirect("/loggedin/home");
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;

			if (errorCode === 'auth/wrong-password') {
				console.log('Wrong password...');
			} else {
				console.log(errorMessage);
			}
			console.log(error);
		});
});

app.get("/loggedin/home", function(req, res) {
    res.render("home");
});

app.get("/loggedin/events", function(req, res) {
	ref.once("value").then(function(snap) {
		var json = snap.val();
		var arr = [];

		for(var i in json)
		  arr.push( json[i] );

		res.render("events", {events: arr});
	});
});

app.post("/loggedin/events", function(req, res) {
	var event = ref.push();
	event.set({
		name: req.body.name,
		description: req.body.description,
		//date: req.body.date,
		//time: req.body.time
	});

	res.redirect("/loggedin/events");
});

app.get("/loggedin/events/new", function(req, res) {
	res.render("newEvent");
});

app.post("/logout", function(req, res) {
	firebase.auth().signOut().then(function() {
		console.log('Signed Out');
		res.redirect("/login");
	},function(error) {
		  console.error('Sign Out Error', error);
	});
});


// SERVER STARTUP
app.listen(3000, "localhost", function() {
    console.log("Server started on port number 3000...");
});