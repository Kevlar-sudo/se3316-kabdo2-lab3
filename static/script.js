//this is the client side script that will hendle displaying the data
//for the tracks search bars + buttons
const searchBarTracks = document.getElementById("searchBarTracks");
const searchBarTracksId = document.getElementById("searchBarTracksId");
const searchButtonTracks = document.getElementById("searchButtonTracks");
const searchButtonTracksId = document.getElementById("searchButtonTracksId");

//for the artist search bars + buttons
const searchBarArtist = document.getElementById("searchBarArtist");
const searchBarArtistId = document.getElementById("searchBarArtistId");
const searchButtonArtist = document.getElementById("searchButtonArtist");
const searchButtonArtistId = document.getElementById("searchButtonArtistId");


searchButtonArtistId.addEventListener('click',searchArtistId)


function searchArtistId(){
    let input = searchBarArtistId.value;
    console.log(input);
    fetch("/api/artists/"+input,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('inventory');
        
        const item = document.createElement('li');
        
        item.appendChild(document.createTextNode(JSON.stringify(data)));
        l.appendChild(item);
        
    })
    )
}