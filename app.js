var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var base36 = require("./base36")
var Url = require("./models/url")
var validUrl = require('valid-url')
// var address = process.env.IP// used by cloud 9
var port = process.env.PORT || 3000

require("dotenv").load()
var homeUrl = process.env.HOME_URL

// mongoose.connect('mongodb://' + address + '/url_shortener')//local connection
mongoose.connect(process.env.MONGOLAB_URI, {useMongoClient: true})//set via command line (eg. export MONGOLAB_URI="mongodb://username:password@ds01316.mlab.com:1316/databasename") or .env file in root directory (loaded via dotenv)

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/shorten', function(req, res) {
    var longUrl = req.body.url
    handleShorten(req, res, longUrl)
})

app.get('/new/:longUrl(*)', function(req, res) {
    var longUrl = req.params.longUrl
    handleShorten(req, res, longUrl)
})

var handleShorten = function(req, res, longUrl) {
    var shortUrl = ''
    Url.findOne({long_url: longUrl}, function(err, doc) {
        if(err) throw err
        if (doc) {
            shortUrl = homeUrl + base36.encode(doc._id)
            res.send({'longUrl': longUrl, 'shortUrl': shortUrl})
        }
        else if (!validUrl.isUri(longUrl)) {
            res.send({'longUrl': longUrl, 'shortUrl': ''})
        }
        else {
            var newUrl = Url({long_url: longUrl})
            newUrl.save(function(err) {
                if (err) throw err
                shortUrl = homeUrl + base36.encode(newUrl._id)
                res.send({'longUrl': longUrl, 'shortUrl': shortUrl})
            })
        }
    })
}

app.get('/:shortUrl', function(req, res) {
    var base36_id = req.params.shortUrl
    var id = base36.decode(base36_id)
    Url.findOne({_id: id}, function(err, doc) {
        if (err) throw err
        if (doc) {
            res.redirect(doc.long_url)
        }
        else {
            res.redirect('/')
        }
    })
})

app.listen(port)
