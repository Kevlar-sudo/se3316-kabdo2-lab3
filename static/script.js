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

var playListTracks = {};
var durations = {};


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
    

    if(durations[document.getElementById('playsL').value] == undefined)
    {durations[document.getElementById('playsL').value] = [];}
    
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
        const texter = document.getElementById("cTrack");
        
       
        
        
        for(i =0; i<playListTracks[playListValue].length;i++)
       {
        
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(`track_id: ${playListTracks[playListValue][i][0]},  artist: ${playListTracks[playListValue][i][1]}, album: ${playListTracks[playListValue][i][2]}, playtime: ${playListTracks[playListValue][i][3]}, album: ${playListTracks[playListValue][i][4]}`));
        l.appendChild(item);

        //adding the durations to an array with the playlist name
        durations[playListValue].push(playListTracks[playListValue][i][3]);
    }
        var totalSeconds = durations[playListValue].map(toSeconds).reduce(sum);
        var minutes = Math. floor(totalSeconds / 60);
        var seconds = totalSeconds - minutes * 60;
        texter.innerText = "Current Tracks\nNumber of tracks: "+ data.noOfTracks+"\nPlaylist Listening Time: "+minutes+":"+seconds;
    })
    )
};
//the function to 
function addTrack(){
    let input = document.getElementById("trackName").value
    //make sure our json object has an array for the playlist name so we can push later on in the function
    if(playListTracks[document.getElementById('playsL').value] == undefined)
    {playListTracks[document.getElementById('playsL').value] = [];}
    
    fetch("/api/tracks/"+input,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        
        if(data['success'] == true){
        const l = document.getElementById('listTracks');
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(`track_id: ${data.data[0].track_id},  artist: ${data.data[0].artist_name}, album: ${data.data[0].album_title}, playtime: ${data.data[0].track_duration}, album: ${data.data[0].album_title}`));
        l.appendChild(item);
        playListTracks[document.getElementById('playsL').value].push([data.data[0].track_id,data.data[0].artist_name,data.data[0].album_title,data.data[0].track_duration,data.data[0].album_title]);
        //playListTracks[document.getElementById('playsL').value].push(["hello"]);
        
        }
        //checking if the track exists in the database
        if(data['success'] == false){
            alert("This track doesn't exist!");
            return;
        }
        
    })
    )
    //basically we have to fetch /playlist/:name to get no of tracks and display it 
    
     
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
                
                //add the object to the list
                // const l = document.getElementById('listTracks');
                // const item = document.createElement('li');
                // item.appendChild(document.createTextNode("track_id: "+data.data[0].track_id));
                // l.appendChild(item);
                
                
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
//to convert our durations to seconds
function toSeconds(time) {
    var minutes = Number(time.slice(0, 2));
    var seconds = Number(time.slice(3));
    return seconds + minutes * 60;
  }
  
  function sum(a, b) {
    return a + b;
  }
  
