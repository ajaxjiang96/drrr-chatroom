var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
let nunjucks = require('nunjucks');

var db = require('./models/data')

var app = express();
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


// Set up to use a session
app.use(cookieParser('drrr'));
app.use(session({
    secret: 'drrr'
}));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// An array to store chat messages.  We will only store messages
// as long as the server is running.
var msgs = [];
const colors = {
    '1': '#EF9A9A',
    '2': '#F8BBD0',
    '3': '#CE93D8',
    '4': '#D1C4E9',
    '5': '#9FA8DA',
    '6': '#80DEEA',
    '7': '#A5D6A7',
    '8': '#DCE775'
};
// Returns a JSON object with one key/value pair.  The key is "name"
// and the value is the empty string if "name" is undefined in the
// session, or the value of the name field in the session object.
function getName(req, res) {
    // TODO : complete this function
    if (req.body.name == undefined) {
        return res.json({
            name: ""
        });
    } else {
        return res.json({
            name: req.body.name,
            user: req.user
        });
    }
}

// Add the username to the session
function setName(req, res) {
    console.log("setName ");
    console.log(req.body);
    if (!req.body.hasOwnProperty('name')) {
        res.statusCode = 400;
        return res.json({
            error: 'Invalid message'
        });
    } else {
        db.User.findOne({
            username: req.body.name
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                // return res.json({
                //     name: user.name,
                //     color: user.color,
                //     user: user
                // });
                console.log(user);
                return res.send({
                    name: user.name,
                    user: user
                })
            } else {
                user = new db.User({
                    username: req.body.name,
                    color: colors[Math.floor((Math.random() * 8) + 1)]
                })
                user.save(function(err) {
                    if (err) throw err;
                    // return res.json({
                    //     name: user.name,
                    //     color: user.color,
                    //     user: user
                    // });
                    return res.send({
                        name: user.name,
                        user: user
                    })
                });
            }
        });
    }
}

// Set the username to empty by clearing the session
function logout(req, res) {
    req.session = null;
    return res.json({});
}

// Get a message from a user
function addMessage(req, res) {
    // We find the message using the "text" key in the JSON object
    db.User.findOne({
            username: req.body.from
        }, function(err, user) {
            if (err) throw err;
            console.log(user);
            if (user) {
                req.body.color = user.color;
                console.log(req.body);
                var msg = new db.Message(req.body);
                msg.save()
                msgs.push(msg);
                res.send('Success');
            }
        });
    }


// Get the full list of messages
function getMessages(req, res) {
    res.send(JSON.stringify(msgs));
}


// Routes

app.get('/name', getName);
app.post('/name', setName);
app.get('/logout', logout);
app.post('/addmsg', addMessage);
app.get('/messages', getMessages);


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
