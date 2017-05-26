var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var base36 = require("./base36")
var Url = require("./models/url")
var validUrl = require('valid-url')
var address = process.env.IP
var port = (process.env.PORT || 3000)

// mongoose.connect('mongodb://' + address + '/url_shortener')//local connection
mongoose.connect(process.env.MONGOLAB_URI)//set via command line (export MONGOLAB_URI="mongodb://username:password@ds01316.mlab.com:1316/databasename")

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/shorten', function(req, res) {
    var host = req.headers.referer//equates to homepage address
    var longUrl = req.body.url
    var shortUrl = ''
    Url.findOne({long_url: longUrl}, function(err, doc) {
        if(err) throw err
        if (doc) {
            shortUrl = host + base36.encode(doc._id)
            res.send({'longUrl': longUrl, 'shortUrl': shortUrl})
        }
        else if (!validUrl.isUri(longUrl)) {
            res.send({'longUrl': longUrl, 'shortUrl': ''})
        }
        else {
            var newUrl = Url({long_url: longUrl})
            newUrl.save(function(err) {
                if (err) throw err
                shortUrl = host + base36.encode(newUrl._id)
                res.send({'longUrl': longUrl, 'shortUrl': shortUrl})
            })
        }
    })
})

app.get('/new/:longUrl(*)', function(req, res) {
    var host = req.headers['x-forwarded-proto'] + '://' + req.headers.host + '/'
    var longUrl = req.params.longUrl
    var shortUrl = ''
    Url.findOne({long_url: longUrl}, function(err, doc) {
        if(err) throw err
        if (doc) {
            shortUrl = host + base36.encode(doc._id)
            res.send({'longUrl': longUrl, 'shortUrl': shortUrl})
        }
        else if (!validUrl.isUri(longUrl)) {
            res.send({"error": "Invalid url. Url must begin with 'http://' or 'https://' and have at least one '.' to be valid."})
        }
        else {
            var newUrl = Url({long_url: longUrl})
            newUrl.save(function(err) {
                if (err) throw err
                shortUrl = host + base36.encode(newUrl._id)
                res.send({'longUrl': longUrl, 'shortUrl': shortUrl})
            })
        }
    })
})

app.get('/:shortUrl', function(req, res) {
    var homepage = req.headers['x-forwarded-proto'] + '://' + req.headers.host + '/'
    var base36_id = req.params.shortUrl
    var id = base36.decode(base36_id)
    Url.findOne({_id: id}, function(err, doc) {
        if (err) throw err
        if (doc) {
            res.redirect(doc.long_url)
        }
        else {
            res.redirect(homepage)
        }
    })
})

app.listen(port)