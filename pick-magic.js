window.addEventListener('load', function() {

  console.log("Initializing");

  window.globalSongList = {};

  window.selectSong = function(id) {
    function markupChords(lyrics) {
      return lyrics;
    }

    var song = window.globalSongList[id];
    document.getElementById("song-title").innerHTML = song.song_name + " - " + song.artist_name;
    document.getElementById("song-lyrics").innerHTML = markupChords(song.lyrics);
    selectPage('song-page');
  }

  window.selectPage = function(page) {
    document.querySelectorAll('.page').forEach(function(e) {e.classList.remove('active')});
    document.getElementById(page).classList.add('active');
  }

  window.searchSong = function() {
      query = document.getElementById("search-song").value;
      var request = new XMLHttpRequest();
      request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs?query='+query, true);
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
  }

  function redraw() {
    console.log("redraw!");
    console.log(globalSongList);

    document.getElementById("song-list").innerHTML = generateSongList(window.globalSongList);
  }

  function generateSongList(songList) {
    var html = "";
    Object.entries(songList).forEach(function(song) {
      html += "<li onclick='selectSong("+song[0]+")'>"+song[1].song_name+" - "+song[1].artist_name+"</li>";
    });
    return html;
  }

  function loadList() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs', true);
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
  }

  loadList();

});
