"use strict";

window.addEventListener('load', function () {
  console.log("Initializing Pick"); // Global song history

  function updateSongHistory(song) {
    var songHistory = JSON.parse(localStorage.getItem('songHistory') || "[]");

    if (songHistory.includes(song.id)) {
      return;
    }

    songHistory.push(song.id);
    songHistory = songHistory.slice(0, 10);
    localStorage.setItem('songHistory', JSON.stringify(songHistory));
  } // Navigation


  function selectPage(page) {
    document.querySelectorAll('.page').forEach(function (e) {
      e.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
    window.scrollTo(0, 0);
  } // Searching


  function searchSong(e) {
    e.preventDefault();
    var query = document.getElementById("search-song").value;

    if (query == "") {
      renderHistory();
      return false;
    }

    var request = new XMLHttpRequest();
    request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs?query=' + encodeURIComponent(query), true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        try {
          var song_list = JSON.parse(request.responseText);
        } catch (e) {
          console.log("Error parsing JSON: ", e);
        } // You could reformat the data in the right format as well:


        var products = song_list.reduce(function (obj, product) {
          obj[product.id] = product;
          return obj;
        }, {});
        SongList.addSongs(products);
        render(products);
      } else {
        console.log("Server returned an error:", request);
      }
    };

    request.onerror = function () {
      console.log("Could not connect", request);
    };

    request.send();
    return false;
  } // Displaying lists of sings


  function searchChords(e) {
    var chordsChecked = Array.from(document.getElementsByName('chords')).filter(function (checkbox) {
      return checkbox.checked;
    }).map(function (checkbox) {
      return "chord=".concat(encodeURIComponent(checkbox.id));
    });
    var query = chordsChecked.join('&');

    if (query == "") {
      renderHistory();
      return false;
    }

    var request = new XMLHttpRequest();
    request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs?' + query, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        try {
          var song_list = JSON.parse(request.responseText);
        } catch (e) {
          console.log("Error parsing JSON: ", e);
        } // You could reformat the data in the right format as well:


        var products = song_list.reduce(function (obj, product) {
          obj[product.id] = product;
          return obj;
        }, {});
        SongList.addSongs(products);
        render(products);
      } else {
        console.log("Server returned an error:", request);
      }
    };

    request.onerror = function () {
      console.log("Could not connect", request);
    };

    request.send();
    return false;
  }

  function renderHistory() {
    var songHistory = JSON.parse(localStorage.getItem('songHistory') || "[]");
    var songHistoryList = songHistory.map(function (id) {
      return SongList.getSong(id);
    });
    render(songHistoryList.reverse(), false);
  }

  function render(songList) {
    var searchResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    // Refresh list
    document.getElementById("song-list").innerHTML = generateSongList(songList);

    if (searchResults) {
      document.querySelector("#list-page h1").innerText = "Search results";
    } else {
      document.querySelector("#list-page h1").innerText = "Recent songs";
    } // Update event handlers


    document.querySelectorAll('.song-link').forEach(function (b) {
      b.addEventListener('click', function (e) {
        selectSong(e.target.getAttribute('song-id'));
      });
    });
  }

  function generateSongList(songList) {
    var html = "";
    Object.entries(songList).forEach(function (song) {
      html += "<li><a class='song-link' song-id='" + song[1].id + "'>" + song[1].song_name + " - " + song[1].artist_name + "</a></li>";
    });
    return html;
  } // Displaying individual songs


  function markupChords(lyrics) {
    return lyrics.replace(/\[ch\]([\w\#\/\\]*)\[\/ch\]/gi, "<span class='chord'>$1</span>");
  }

  function selectSong(id) {
    var song = SongList.getSong(id);
    document.getElementById("song-title").innerHTML = song.song_name + " - " + song.artist_name;
    document.getElementById("song-lyrics").innerHTML = markupChords(song.lyrics);
    selectPage('song-page');
    updateSongHistory(song);
  } // Attach events to buttons


  document.querySelectorAll('#search-control').forEach(function (b) {
    b.addEventListener('submit', searchSong);
  });
  document.querySelectorAll('.back-button').forEach(function (b) {
    b.addEventListener('click', function () {
      selectPage('list-page');
    });
  });
  document.getElementsByName('chords').forEach(function (el) {
    return el.addEventListener('click', searchChords);
  });
  renderHistory();
});
"use strict";

// Install Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
} // PWA install prompt
//
// let deferredPrompt;
// window.addEventListener('beforeinstallprompt', (e) => {
//   // Prevent Chrome 67 and earlier from automatically showing the prompt
//   e.preventDefault();
//   // Stash the event so it can be triggered later.
//   deferredPrompt = e;
//   // Show the install button
//   document.querySelectorAll('.install-button').forEach(function(b) {
//     b.classList.add('active');
//     b.addEventListener('click', install2HS);
//   });
// });
//
// function install2HS() {
//   // Hide install button
//   document.querySelectorAll('.install-button').forEach(function(b) {
//     b.classList.remove('active');
//   });
//
//   deferredPrompt.prompt();
//   deferredPrompt.userChoice.then((choiceResult) => {
//     if (choiceResult.outcome !== 'accepted') {
//       document.querySelectorAll('.install-button').forEach(function(b) {
//         b.classList.add('active');
//       });
//     }
//   });
// }
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SongList =
/*#__PURE__*/
function () {
  function SongList() {
    _classCallCheck(this, SongList);
  }

  _createClass(SongList, null, [{
    key: "allSongs",
    value: function allSongs() {
      return JSON.parse(localStorage.getItem('songList') || "{}");
    }
  }, {
    key: "getSong",
    value: function getSong(id) {
      return SongList.allSongs()[id];
    }
  }, {
    key: "addSongs",
    value: function addSongs(list) {
      var newList = Object.assign(SongList.allSongs(), list);
      return localStorage.setItem('songList', JSON.stringify(newList));
    }
  }]);

  return SongList;
}();

//# sourceMappingURL=pick-magic.js.map