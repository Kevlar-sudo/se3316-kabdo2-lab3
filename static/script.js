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

//for playlist
const addPlaylist = document.getElementById("addPlaylist");
const deleteList = document.getElementById("deleteList");


searchButtonArtistId.addEventListener('click',searchArtistId);
addPlaylist.addEventListener('click',createPlaylist);
deleteList.addEventListener('click',deletePlaylist)

document.getElementById("viewList").addEventListener('click',viewlist);
document.getElementById("addTrack").addEventListener('click',addTrack);


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
};
//create new playlist front end WORKING
function createPlaylist(){
    const newList={
        playlist_name: document.getElementById("playlistName").value
    }
    console.log(newList);
    fetch("/api/playlist/",{
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newList)
    })
    .then(res => {
        if(res.ok){
            res.json()
            .then(data => {
                console.log(data);
                //add the new playlist to drop down list
                var playsL = document.getElementById('playsL');
                var option = document.createElement("option");
                option.text = document.getElementById("playlistName").value;
                playsL.add(option);
                document.getElementById('status').innerText = `Created playlist ${playlist_name}`;
            })
            .catch(err => console.log('Failed to get json object'))
        }
        else{
            console.log('Error: ',res.status);
            document.getElementById('status').innerText = 'Failed to add item';
        }
    })
    .catch()
    
};
//delete playlist
function deletePlaylist(){
    var playListValue = document.getElementById('playsL').value;
    const removeList={
        playlist_name: document.getElementById("playsL").value
    }
    console.log(removeList);
    fetch("/api/playlist/",{
        method: 'DELETE',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(removeList)
    })
    .then(res => {
        if(res.ok){
            res.json()
            .then(data => {
                console.log(data);
                //add the new playlist to drop down list
                //window.alert("success!");
                var x = document.getElementById('playsL');
                x.remove(x.selectedIndex);
                document.getElementById('status').innerText = `Created playlist ${playlist_name}`;
            })
            .catch(err => console.log('Failed to get json object'))
        }
        else{
            console.log('Error: ',res.status);
            document.getElementById('status').innerText = 'Failed to add item';
        }
    })
    .catch()
    
};
//THIS WORKS TO SHOW ALL AVAILABLE TRACKS IN A CERTAIN PLAYLIST
function viewlist(){
    var playListValue = document.getElementById('playsL').value;
    console.log(playListValue);
    //this part is to clear the search upon consecutive view button clicks
    const l = document.getElementById('listTracks');
    //we loop through the list and while it has a child we remove them
    while(l.firstChild){
        l.removeChild(l.firstChild);
    }
    fetch("/api/playlist/"+playListValue,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('listTracks');
        
        for(i =0; i<data.data.length;i++)
       { 
        const item = document.createElement('li');
        item.appendChild(document.createTextNode("track_id: "+data.data[i].track_id));
        l.appendChild(item);}
        
    })
    )
};
//the function to 
function addTrack(){
     
    const newTrack={
        playlist_name: document.getElementById("playsL").value,
        track_id : document.getElementById("trackName").value
    }
    console.log(newTrack);
    fetch("/api/playlist/",{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newTrack)
    })
    .then(res => {
        if(res.ok){
            res.json()
            .then(data => {
                console.log(data);
                //add the object to the list
                const l = document.getElementById('listTracks');
                const item = document.createElement('li');
                item.appendChild(document.createTextNode("track_id: "+data.data[0].track_id));
                l.appendChild(item);
                
            })
            .catch(err => console.log('Failed to get json object'))
        }
        else{
            console.log('Error: ',res.status);
            document.getElementById('status').innerText = 'Failed to add item';
        }
    })
    .catch()

};
