//this is the client side script that will hendle displaying the data
//for the tracks search bars + buttons
const searchBarTracks = document.getElementById("searchBarTracks");
const searchButtonTracks = document.getElementById("searchButtonTracks");

//for the artist search bars + buttons
const searchBarArtist = document.getElementById("searchBarArtist");
const searchButtonArtist = document.getElementById("searchButtonArtist");

//for playlist
const addPlaylist = document.getElementById("addPlaylist");
const deleteList = document.getElementById("deleteList");

addPlaylist.addEventListener('click',createPlaylist);
deleteList.addEventListener('click',deletePlaylist)

document.getElementById("viewList").addEventListener('click',viewlist);
document.getElementById("addTrack").addEventListener('click',addTrack);

//for the search results that appear only after search
const dynamicResults = document.getElementById("intro");

dynamicResults.classList.add("close-search");

var playListTracks = {};
var durations = {};


//create new playlist front end WORKING
function createPlaylist(){

  //verifying the name only has wanted characters
  if(/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(document.getElementById("playlistName").value) !== false){
    alert("Please only include Alphanumeric characters!");
    return;
  }
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
        
       
        //works kinda
        if(data.noOfTracks >0){
        for(i =0; i<playListTracks[playListValue].length;i++)
       {
        
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(`track_id: ${playListTracks[playListValue][i][0]},  artist: ${playListTracks[playListValue][i][1]}, album: ${playListTracks[playListValue][i][2]}, playtime: ${playListTracks[playListValue][i][3]}, album: ${playListTracks[playListValue][i][4]}`));
        l.appendChild(item);

        //adding the durations to an array with the playlist name
        durations[playListValue].push(playListTracks[playListValue][i][3]);
    }
        var minutes =0;
        var seconds =0;
        var totalSeconds =0;
        totalSeconds = durations[playListValue].map(toSeconds).reduce(sum);
        minutes = Math. floor(totalSeconds / 60);
        seconds = totalSeconds - minutes * 60;
        texter.innerText = "Current Tracks\nNumber of tracks: "+ data.noOfTracks+"\nPlaylist Listening Time: "+minutes+":"+seconds;
      }
      else{
        texter.innerText = "Selected Playlist is empty"
      }
    })
    )
};
//the function to 
function addTrack(){
    let input = document.getElementById("trackName").value

    //testing the input for any unwanted characters, allows all languages
    
    if(/^\d+$/.test(input) == false){
      alert("Please enter digits between 0-9 only!");
      return;
    }
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
        const texter = document.getElementById("cTrack");
        const l = document.getElementById('listTracks');
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(`track_id: ${data.data[0].track_id},  artist: ${data.data[0].artist_name}, album: ${data.data[0].album_title}, playtime: ${data.data[0].track_duration}, album: ${data.data[0].album_title}`));
        l.appendChild(item);
        playListTracks[document.getElementById('playsL').value].push([data.data[0].track_id,data.data[0].artist_name,data.data[0].album_title,data.data[0].track_duration,data.data[0].album_title]);
        //playListTracks[document.getElementById('playsL').value].push(["hello"]);
        texter.innerText = "Current Tracks"
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

document.getElementById("sortArtist").addEventListener('click',sortListArtist);
document.getElementById("sortTrack").addEventListener('click',sortListTrack);
document.getElementById("sortAlbum").addEventListener('click',sortListAlbum);
document.getElementById("sortLength").addEventListener('click',sortListlength);


  //here will go sorter function :O
function sortListArtist() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("inventory");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByClassName("searchResult");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the artist
        
        console.log(b[i].innerText.toLowerCase().split("artist: ")[1].split(",")[0]);
        if (b[i].innerText.toLowerCase().split("artist: ")[1].split(",")[0] > b[i + 1].innerText.toLowerCase().split("artist: ")[1].split(",")[0]) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  //to sort by track
  function sortListTrack() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("inventory");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByClassName("searchResult");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the track_id
        console.log(b[i].innerText.toLowerCase());
        console.log(b[i].innerText.toLowerCase().split("name: ")[1].split("\n")[0]);
        if (b[i].innerText.toLowerCase().split("name: ")[1].split("\n")[0] > b[i + 1].innerText.toLowerCase().split("name: ")[1].split("\n")[0]) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  function sortListAlbum() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("inventory");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByClassName("searchResult");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the artist
        console.log(b[i].innerText.toLowerCase().split("album name: ")[1].split("\n")[0]);
        if (b[i].innerText.toLowerCase().split("album name: ")[1].split("\n")[0] > b[i + 1].innerText.toLowerCase().split("album name: ")[1].split("\n")[0]) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  function sortListlength() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("inventory");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByClassName("searchResult");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the track_id
        console.log(toSeconds(b[i].innerText.toLowerCase().split("duration: ")[1].split("\n")[0]));
        if (toSeconds(b[i].innerText.toLowerCase().split("duration: ")[1].split("\n")[0]) > toSeconds(b[i + 1].innerText.toLowerCase().split("duration: ")[1].split("\n")[0])) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  searchButtonArtist.addEventListener('click',searchArtistName);

  //the front end for query searches
  function searchArtistName(){
    let input = searchBarArtist.value;
    if(/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(input) !== false){
      alert("Please only include Alphanumeric characters!");
      return;
    }

    //making the search results section visible
    if(dynamicResults.classList.contains("close-search")){
      dynamicResults.classList.replace("close-search","open-search");}


    const l = document.getElementById('inventory');
    while(l.firstChild){
      l.removeChild(l.firstChild);
  }
    console.log(input);
    fetch("/api/artists?name="+input,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        console.log(data.data.length);

        //we will only show the first 5 results thats why i =5
        for(i = 0;i<5;i++){
        const l = document.getElementById('inventory');
        
        
        
        //Creating the info that we will populate
        const id = document.createTextNode("id: "+data.data[i].artist_id);
        bold = document.createElement('strong'),
        bold.appendChild(id);
        l.appendChild(bold);
        l.appendChild(document.createElement("br"));

        const handle = document.createTextNode("handle: "+data.data[i].artist_handle);
        l.appendChild(handle);
        l.appendChild(document.createElement("br"));

        const dateCreated = document.createTextNode("Date Created: "+data.data[i].artist_date_created);
        l.appendChild(dateCreated);
        l.appendChild(document.createElement("br"));

        const contact = document.createTextNode("Contact: "+ data.data[i].artist_contact);
        l.appendChild(contact);
        l.appendChild(document.createElement("br"));

        const assLabel = document.createTextNode("Associated Label: "+data.data[i].artist_associated_labels);
        l.appendChild(assLabel);
        l.appendChild(document.createElement("br"));

        const activeE = document.createTextNode("Active Year End: "+data.data[i].artist_active_year_end);
        l.appendChild(activeE);
        l.appendChild(document.createElement("br"));

        const activeB = document.createTextNode("Active Year Begin: "+data.data[i].artist_active_year_begin);
        l.appendChild(activeB);
        l.appendChild(document.createElement("br"));
        l.appendChild(document.createElement("br"));
        }
    })
    )
};

//for track query searching
searchButtonTracks.addEventListener('click',searchTrackName);

  //the front end for query searches
  function searchTrackName(){
    let input = searchBarTracks.value;

    //making the search results section visible
    if(dynamicResults.classList.contains("close-search")){
      dynamicResults.classList.replace("close-search","open-search");}

    if(/[`~!@#$%^&*()|+\-=?;:..’“'"<>,€£¥•،٫؟»«\{\}\[\]\\\/]/.test(input) !== false){
      alert("Please only include Alphanumeric characters!");
      return;
    }

    const l = document.getElementById('inventory');
    while(l.firstChild){
      l.removeChild(l.firstChild);
  }
    console.log(input);
    fetch("/api/tracks?name="+input,{
        method: 'GET',
        
    })
    .then(res =>res.json()
    .then(data => {
        console.log(data);
        console.log(data.data.length);

        //we will only show the first 5 results thats why i =5
        for(i = 0;i<5;i++){
        const l = document.getElementById('inventory');
        
        
        
        //Creating the info that we will populate
        div = document.createElement("div");
        div.classList.add("searchResult");
        const id = document.createTextNode("id: "+data.data[i].track_id);
        bold = document.createElement('strong'),
        bold.appendChild(id);
        div.appendChild(bold);
        div.appendChild(document.createElement("br"));

        const handle = document.createTextNode("Track Name: "+data.data[i].track_title);
        div.appendChild(handle);
        div.appendChild(document.createElement("br"));

        const dateCreated = document.createTextNode("Duration: "+data.data[i].track_duration);
        div.appendChild(dateCreated);
        div.appendChild(document.createElement("br"));

        const contact = document.createTextNode("Date Recorded: "+ data.data[i].track_date_recorded);
        div.appendChild(contact);
        div.appendChild(document.createElement("br"));

        const assLabel = document.createTextNode("Date Created: "+data.data[i].track_date_created);
        div.appendChild(assLabel);
        div.appendChild(document.createElement("br"));

        const activeE = document.createTextNode("Album Name: "+data.data[i].album_title);
        div.appendChild(activeE);
        div.appendChild(document.createElement("br"));

        const activeB = document.createTextNode("Track Number In Album: "+data.data[i].track_number);
        div.appendChild(activeB);
        div.appendChild(document.createElement("br"));

        const artistN = document.createTextNode("Recording Artist: "+data.data[i].artist_name);
        div.appendChild(artistN);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));

        l.appendChild(div);
        }
    })
    )
};

document.getElementById("deleteTrack").addEventListener('click',deleteTrackFromPlaylist);

//to delete a specific track from a playlist
function deleteTrackFromPlaylist(){
  var playListValue = document.getElementById('playsL').value;

  if(/^\d+$/.test(playListValue) == false){
    alert("Please enter digits between 0-9 only!");
    return;
  }
  
  const removeTrack={
      track_id: document.getElementById("trackNameDelete").value
  }
  fetch("/api/playlist/"+playListValue,{
      method: 'DELETE',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(removeTrack)
  })
  .then(res => {
      if(res.ok){
          res.json()
          .then(data => {
              console.log(data);
              //add the new playlist to drop down list
              //window.alert("success!");
              
              document.getElementById('status').innerText = `Created playlist ${playlist_name}`;
          })
          .catch(err => console.log('Failed to get json object'))
      }
      else{
          console.log('Error: ',res.status);
          
      }
  })
  .catch()
  
};

document.getElementById("closeBtn").addEventListener('click',closeResults);

function closeResults(){
  const l = document.getElementById('inventory');
    while(l.firstChild){
      l.removeChild(l.firstChild);
  }
  dynamicResults.classList.replace("open-search","close-search");
};

//FOR SORTING THE PLAYLIST NOT THE SEARCH RESULTS
document.getElementById("sortArtistPlaylist").addEventListener('click',sortPlaylistArtist);
document.getElementById("sortTrackPlaylist").addEventListener('click',sortPlaylistTrack);
document.getElementById("sortAlbumPlaylist").addEventListener('click',sortPlaylistAlbum);
document.getElementById("sortLengthPlaylist").addEventListener('click',sortPlaylistlength);


//for sorting the playlist
  //here will go sorter function :O
  function sortPlaylistArtist() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the artist
        
        console.log(b[i].innerText.toLowerCase().split("artist: ")[1].split(",")[0]);
        if (b[i].innerText.toLowerCase().split("artist: ")[1].split(",")[0] > b[i + 1].innerText.toLowerCase().split("artist: ")[1].split(",")[0]) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  //to sort by track
  function sortPlaylistTrack() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the track_id
        console.log(b[i].innerText.toLowerCase());
        console.log(parseInt(b[i].innerText.toLowerCase().split("track_id: ")[1].split(",")[0]));
        if (parseInt(b[i].innerText.toLowerCase().split("track_id: ")[1].split(",")[0]) > parseInt(b[i + 1].innerText.toLowerCase().split("track_id: ")[1].split(",")[0])) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  function sortPlaylistAlbum() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the artist
        console.log(b[i].innerText.toLowerCase().split("album: ")[1].split(",")[0]);
        if (b[i].innerText.toLowerCase().split("album: ")[1].split(",")[0] > b[i + 1].innerText.toLowerCase().split("album: ")[1].split(",")[0]) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };

  function sortPlaylistlength() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("listTracks");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */

        //to get just the track_id
        console.log(toSeconds(b[i].innerText.toLowerCase().split("playtime: ")[1].split(",")[0]));
        if (toSeconds(b[i].innerText.toLowerCase().split("playtime: ")[1].split(",")[0]) > toSeconds(b[i + 1].innerText.toLowerCase().split("playtime: ")[1].split(",")[0])) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  };