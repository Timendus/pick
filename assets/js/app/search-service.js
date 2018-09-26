// This is work in progress

class SearchService {

  constructor() {
    // Where does Bob's awesome API live?
    this.webservice = "https://limitless-bastion-37095.herokuapp.com/api/songs";
  }

  searchSong(e) {
    e.preventDefault();
    let query = document.getElementById("search-song").value;
    if ( query == "" ) { renderHistory(); return false; }
    var request = new XMLHttpRequest();
    request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs?query='+encodeURIComponent(query), true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        try {
          var song_list = JSON.parse(request.responseText);
        } catch(e) {
          console.log("Error parsing JSON: ", e);
        }

        let songlist = new SongList(song_list)
        songRepository.add(songlist);
        songListRenderer.draw(songlist, 'Search results');
      } else {
        console.log("Server returned an error:", request);
      }
    };
    request.onerror = function() { console.log("Could not connect", request); };
    request.send();
    return false;
  }

  // Displaying lists of sings
  searchChords(e){
    var chordsChecked = Array.from(document.getElementsByName('chords')).filter((checkbox) => checkbox.checked).map((checkbox) => `chord=${encodeURIComponent(checkbox.id)}`);
    var query = chordsChecked.join('&');
    if ( query == "" ) { renderHistory(); return false; }
    var request = new XMLHttpRequest();
    request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs?'+ query, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        try {
          var song_list = JSON.parse(request.responseText);
        } catch(e) {
          console.log("Error parsing JSON: ", e);
        }

        let songlist = new SongList(song_list)
        songRepository.add(songlist);
        songListRenderer.draw(songlist, 'Filter results');
      } else {
        console.log("Server returned an error:", request);
      }
    };
    request.onerror = function() { console.log("Could not connect", request); };
    request.send();
    return false;
  }

  _getRequest(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        try {
          var song_list = JSON.parse(request.responseText);
        } catch(e) {
          console.log("Error parsing JSON: ", e);
        }

        let songlist = new SongList(song_list)
        songRepository.add(songlist);
        songListRenderer.draw(songlist, 'Filter results');
      } else {
        console.log("Server returned an error:", request);
      }
    };
    request.onerror = function() { console.log("Could not connect", request); };
    request.send();
  }


}
