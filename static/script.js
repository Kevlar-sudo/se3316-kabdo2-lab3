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

//THIS WORKS lol but we need to format
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
        
        console.log(data.data[0].artist_handle);
        item.appendChild(document.createTextNode("id: "+data.data[0].artist_id+"\n,handle: "+data.data[0].artist_handle+"\n,Date Created: "+data.data[0].artist_date_created+"\n,Contact: "+ data.data[0].artist_contact+"\n,Associated Label: "+data.data[0].artist_associated_labels+"\n,Active Year End: "+data.data[0].artist_active_year_end+"\n,Active Year Begin: "+data.data[0].artist_active_year_begin));
        l.appendChild(item);
        
    })
    )
}