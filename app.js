require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:
app.get('/',(req, res) => {
    res.render('home.hbs');
});
app.get('/artist-search',(req, res) => {
const searchItem = req.query.artistSearch


spotifyApi
  .searchArtists(searchItem)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results.hbs', {searchResults:data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
    .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('Artist Album', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('albums.hbs', {albumResults:data.body.items})
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.get('/tracks/:trackId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.trackId,{limit:30})
  .then(data => {
    console.log('Album tracks', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    console.log(this.preview_url);
    res.render('tracks.hbs', {trackResults:data.body.items})
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
