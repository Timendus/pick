window.addEventListener('load', function() {

  console.log("Initializing Pick");

  window.globalSongList = {};

  function selectSong(id) {
    function markupChords(lyrics) {
      return lyrics;
    }

    var song = window.globalSongList[id];
    document.getElementById("song-title").innerHTML = song.song_name + " - " + song.artist_name;
    document.getElementById("song-lyrics").innerHTML = markupChords(song.lyrics);
    selectPage('song-page');
  }

  function selectPage(page) {
    document.querySelectorAll('.page').forEach(function(e) {e.classList.remove('active')});
    document.getElementById(page).classList.add('active');
    window.scrollTo(0,0);
  }

  function searchSong(e) {
      query = document.getElementById("search-song").value;
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

          // You could reformat the data in the right format as well:
          const products = song_list.reduce((obj, product) => {
            obj[product.id] = product
            return obj
          }, {});

          window.globalSongList = products;
          redraw();
        } else {
          console.log("Server returned an error:", request);
        }
      };
      request.onerror = function() { console.log("Could not connect", request); };
      request.send();

      e.preventDefault();
      return false;
  }

  function redraw() {
    console.log("redraw!");
    console.log(globalSongList);

    document.getElementById("song-list").innerHTML = generateSongList(window.globalSongList);
    document.querySelectorAll('.song-link').forEach(function(b) { b.addEventListener('click', function(e) { console.log(e); selectSong(e.target.getAttribute('song-id')); });});
  }

  function generateSongList(songList) {
    var html = "";
    Object.entries(songList).forEach(function(song) {
      html += "<li><a class='song-link' song-id='"+song[0]+"'>"+song[1].song_name+" - "+song[1].artist_name+"</a></li>";
    });
    return html;
  }

  // Attach events to buttons
  document.getElementById('search-control').addEventListener('submit', searchSong);
  document.querySelectorAll('.back-button').forEach(function(b) { b.addEventListener('click', function() { selectPage('list-page'); }); });

});

// Load and register pre-caching Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js');
  });
}
