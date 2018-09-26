window.addEventListener('load', function() {

  let songRepository   = new SongRepository();
  let songHistory      = new SongHistory(songRepository);
  let songListRenderer = new SongListRenderer(document.getElementById("song-list"));
  let songRenderer     = new SongRenderer(document.getElementById("song"));
  let clickHandler     = new ClickHandler();
  let searchService    = new SearchService();

  clickHandler.register('[data-page-link]', selectPage);
  clickHandler.register('[data-song-link]', selectSong);
  clickHandler.register('[name=chords]',    searchChords);

  // Bind a submit of the search form to the search function
  document.querySelectorAll('#search-control').forEach(function(b) {
    b.addEventListener('submit', searchSong);
  });

  // Bootstrap song list
  renderHistory();

  // Helper functions

  function selectPage(elm) {
    document.querySelectorAll('.page').forEach((e) => {e.classList.remove('active')});
    document.getElementById(elm.getAttribute('data-page-link')).classList.add('active');
    window.scrollTo(0,0);
  }

  function selectSong(elm) {
    let song = songRepository.getSong(elm.getAttribute('data-song-link'));
    songRenderer.draw(song);
    songHistory.add(song);
    selectPage(elm);
  }

  function renderHistory() {
    songListRenderer.draw(songHistory.getSongList(), 'Recent songs');
  }

  // Searching

  function searchSong(e) {
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
  function searchChords(e){
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

});
