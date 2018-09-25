window.addEventListener('load', function() {

  console.log("Initializing Pick");

  // Service worker install

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }

  // PWA install prompt

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Show the install button
    document.querySelectorAll('.install-button').forEach(function(b) {
      b.classList.add('active');
      b.addEventListener('click', install2HS);
    });
  });

  function install2HS() {
    // Hide install button
    document.querySelectorAll('.install-button').forEach(function(b) {
      b.classList.remove('active');
    });

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome !== 'accepted') {
        document.querySelectorAll('.install-button').forEach(function(b) {
          b.classList.add('active');
        });
      }
    });
  }

  // Global song list

  function getSongList() {
    return JSON.parse(localStorage.getItem('songList') || "{}");
  }

  function getSong(id) {
    return getSongList()[id];
  }

  function addSongs(list) {
    var newList = Object.assign(getSongList(), list);
    localStorage.setItem('songList', JSON.stringify(newList));
  }

  // Global song history

  function updateSongHistory(song) {
    var songHistory = JSON.parse(localStorage.getItem('songHistory') || "[]");
    if ( songHistory.includes(song.id) ) { return; }
    songHistory.push(song.id);
    songHistory = songHistory.slice(0,10);
    localStorage.setItem('songHistory', JSON.stringify(songHistory));
  }

  // Navigation

  function selectPage(page) {
    document.querySelectorAll('.page').forEach(function(e) {e.classList.remove('active')});
    document.getElementById(page).classList.add('active');
    window.scrollTo(0,0);
  }

  // Searching

  function searchSong(e) {
      e.preventDefault();
      query = document.getElementById("search-song").value;
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

          // You could reformat the data in the right format as well:
          const products = song_list.reduce((obj, product) => {
            obj[product.id] = product
            return obj
          }, {});

          addSongs(products);
          render(products);
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

        // You could reformat the data in the right format as well:
        const products = song_list.reduce((obj, product) => {
          obj[product.id] = product
          return obj
        }, {});

        addSongs(products);
        render(products);
      } else {
        console.log("Server returned an error:", request);
      }
    };
    request.onerror = function() { console.log("Could not connect", request); };
    request.send();
    return false;
  }

  function renderHistory() {
      var songHistory = JSON.parse(localStorage.getItem('songHistory') || "[]");
      var songHistoryList = songHistory.map(function(id) { return getSong(id); });
      render(songHistoryList.reverse(), false);
  }

  function render(songList, searchResults=true) {
    // Refresh list
    document.getElementById("song-list").innerHTML = generateSongList(songList);
    if ( searchResults ) {
      document.querySelector("#list-page h1").innerText = "Search results";
    } else {
      document.querySelector("#list-page h1").innerText = "Recent songs";
    }

    // Update event handlers
    document.querySelectorAll('.song-link').forEach(function(b) {
      b.addEventListener('click', function(e) {
        selectSong(e.target.getAttribute('song-id'));
      });
    });
  }

  function generateSongList(songList) {
    var html = "";
    Object.entries(songList).forEach(function(song) {
      html += "<li><a class='song-link' song-id='"+song[1].id+"'>"+song[1].song_name+" - "+song[1].artist_name+"</a></li>";
    });
    return html;
  }

  // Displaying individual songs

  function markupChords(lyrics) {
    return lyrics.replace(/\[ch\]([\w\#\/\\]*)\[\/ch\]/gi, "<span class='chord'>$1</span>");
  }

  function selectSong(id) {
    var song = getSong(id);
    document.getElementById("song-title").innerHTML = song.song_name + " - " + song.artist_name;
    document.getElementById("song-lyrics").innerHTML = markupChords(song.lyrics);
    selectPage('song-page');
    updateSongHistory(song);
  }



  // Attach events to buttons
  document.querySelectorAll('#search-control').forEach(function(b) {
    b.addEventListener('submit', searchSong);
  });
  document.querySelectorAll('.back-button').forEach(function(b) {
    b.addEventListener('click', function() {
      selectPage('list-page');
    });
  });
  document.getElementsByName('chords').forEach(el => el.addEventListener('click', searchChords));

  renderHistory();
});
