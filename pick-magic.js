"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Okay, so why do we need this? Why a whole class to implement our own version
 * of click handling? Am I insane?
 *
 * Well, maybe, but not because of this.
 *
 * This class installs one single click handler on the whole document, and
 * evaluates which callback to call at click time, based on the element that has
 * been clicked. This allows us to swap out and rerender whole sections of the
 * DOM without having to reinstall a bunch of click handlers each time. This
 * nicely decouples the render logic from the click event management logic.
 */
var ClickHandler =
/*#__PURE__*/
function () {
  function ClickHandler() {
    var _this = this;

    _classCallCheck(this, ClickHandler);

    document.addEventListener('click', function (e) {
      return _this._handleClick(e);
    });
    this._handlers = {};
  }

  _createClass(ClickHandler, [{
    key: "register",
    value: function register(selector, callback) {
      this._handlers[selector] = callback;
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(e) {
      var _this2 = this;

      Object.keys(this._handlers).forEach(function (selector) {
        if (e.target.matches(selector)) {
          _this2._handlers[selector](e);
        }
      });
    }
  }]);

  return ClickHandler;
}();
"use strict";

window.addEventListener('load', function () {
  var songRepository = new SongRepository();
  var songHistory = new SongHistory(songRepository);
  var songListRenderer = new SongListRenderer(document.getElementById("song-list"));
  var songRenderer = new SongRenderer(document.getElementById("song"));
  var clickHandler = new ClickHandler();
  var searchService = new SearchService(); // Bind click handlers

  clickHandler.register('[data-page-link]', selectPage);
  clickHandler.register('[data-song-link]', selectSong);
  clickHandler.register('[name=chords]', search); // Bind form submit handler to the search function

  document.querySelectorAll('#search-control').forEach(function (b) {
    return b.addEventListener('submit', function (e) {
      search();
      e.preventDefault();
      return false;
    });
  }); // Bootstrap song list

  renderHistory(); // Helper event handlers

  function selectPage(e) {
    document.querySelectorAll('.page').forEach(function (p) {
      return p.classList.remove('active');
    });
    document.getElementById(e.target.getAttribute('data-page-link')).classList.add('active');
    window.scrollTo(0, 0);
  }

  function selectSong(e) {
    var song = songRepository.getSong(e.target.getAttribute('data-song-link'));
    songRenderer.draw(song);
    songHistory.add(song);
  }

  function renderHistory() {
    songListRenderer.draw(songHistory.getSongList(), 'Recent songs');
  }

  function search() {
    var query = document.getElementById("search-song").value;
    var chords = Array.from(document.getElementsByName('chords')).filter(function (checkbox) {
      return checkbox.checked;
    }).map(function (checkbox) {
      return checkbox.id;
    });

    if (query == "" && chords.length == 0) {
      renderHistory();
    } else {
      searchService.search(query, chords, function (songList) {
        songRepository.add(songList);
        songListRenderer.draw(songList, 'Search results');
      });
    }
  }
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

var SearchService =
/*#__PURE__*/
function () {
  function SearchService() {
    _classCallCheck(this, SearchService);

    // Where does Bob's awesome API live?
    this._webservice = "https://limitless-bastion-37095.herokuapp.com/api/songs";
  } // Expects a query string, an array of chords (in the form of strings) and a
  // callback function for when we have a response


  _createClass(SearchService, [{
    key: "search",
    value: function search(query, chords, callback) {
      var parameters = chords.map(function (chord) {
        return "chord=".concat(encodeURIComponent(chord));
      });
      if (query) parameters.push("query=".concat(encodeURIComponent(query)));

      this._getRequest("".concat(this._webservice, "?").concat(parameters.join('&')), callback);
    }
  }, {
    key: "_getRequest",
    value: function _getRequest(url, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          try {
            var songList = JSON.parse(request.responseText);
            callback(new SongList(songList));
          } catch (e) {
            console.log("Error parsing JSON: ", e);
          }
        } else {
          console.log("Server returned an error:", request);
        }
      };

      request.onerror = function () {
        return console.log("Could not connect", request);
      };

      request.send();
    }
  }]);

  return SearchService;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SongHistory =
/*#__PURE__*/
function () {
  function SongHistory(repository) {
    _classCallCheck(this, SongHistory);

    this._repository = repository;
  }

  _createClass(SongHistory, [{
    key: "getSongList",
    value: function getSongList() {
      var _this = this;

      return new SongList(this._list().map(function (id) {
        return _this._repository.getSong(id);
      }));
    }
  }, {
    key: "add",
    value: function add(song) {
      if (this._includes(song)) {
        // Optional TODO: Push this song to the end of the list
        return;
      } else {
        var songHistory = this._list();

        songHistory.unshift(song.id);
        songHistory = songHistory.slice(0, 10);
        localStorage.setItem('songHistory', JSON.stringify(songHistory));
      }
    }
  }, {
    key: "_list",
    value: function _list() {
      return JSON.parse(localStorage.getItem('songHistory') || "[]");
    }
  }, {
    key: "_includes",
    value: function _includes(song) {
      return this._list().includes(song.id);
    }
  }]);

  return SongHistory;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SongListRenderer =
/*#__PURE__*/
function () {
  function SongListRenderer(element) {
    _classCallCheck(this, SongListRenderer);

    this._element = element;
  }

  _createClass(SongListRenderer, [{
    key: "draw",
    value: function draw(songlist, header) {
      var list = '';
      songlist.forEach(function (song) {
        list += "<li><a class='song-link' data-page-link='song-page' data-song-link='".concat(song.id, "'>").concat(song.song_name, " - ").concat(song.artist_name, "</a></li>");
      });
      this._element.innerHTML = "\n      ".concat(header ? "<h1>".concat(header, " (").concat(songlist.length, ")</h1>") : "", "\n      <ul>\n        ").concat(list, "\n      </ul>\n    ");
    }
  }]);

  return SongListRenderer;
}();
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SongList =
/*#__PURE__*/
function (_Array) {
  _inherits(SongList, _Array);

  function SongList(songs) {
    var _this;

    _classCallCheck(this, SongList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SongList).call(this));

    if (Array.isArray(songs)) {
      songs.forEach(function (song) {
        return _this.push(song);
      });
    }

    return _this;
  }

  return SongList;
}(_wrapNativeSuper(Array));
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SongRenderer =
/*#__PURE__*/
function () {
  function SongRenderer(element) {
    _classCallCheck(this, SongRenderer);

    this._element = element;
  }

  _createClass(SongRenderer, [{
    key: "draw",
    value: function draw(song) {
      this._element.innerHTML = "\n      <h1>".concat(song.song_name, " - ").concat(song.artist_name, "</h1>\n      <pre>").concat(this._markupChords(song.lyrics), "</pre>\n    ");
    }
  }, {
    key: "_markupChords",
    value: function _markupChords(lyrics) {
      return lyrics.replace(/\[ch\]([\w\#\/\\]*)\[\/ch\]/gi, "<span class='chord'>$1</span>");
    }
  }]);

  return SongRenderer;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SongRepository =
/*#__PURE__*/
function () {
  function SongRepository() {
    _classCallCheck(this, SongRepository);

    this._repository = JSON.parse(localStorage.getItem('songList') || "{}");
  }

  _createClass(SongRepository, [{
    key: "add",
    value: function add(songlist) {
      var _this = this;

      songlist.forEach(function (song) {
        return _this._addSong(song, false);
      });

      this._saveToLocalStorage();
    }
  }, {
    key: "getSong",
    value: function getSong(id) {
      return this._repository[id];
    }
  }, {
    key: "getSongList",
    value: function getSongList() {
      return new SongList(Object.values(this._repository));
    }
  }, {
    key: "_addSong",
    value: function _addSong(song) {
      var saveToLocalStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this._repository[song.id] = song;
      if (saveToLocalStorage) this._saveToLocalStorage();
    }
  }, {
    key: "_saveToLocalStorage",
    value: function _saveToLocalStorage() {
      localStorage.setItem('songList', JSON.stringify(this._repository));
    }
  }]);

  return SongRepository;
}();

//# sourceMappingURL=pick-magic.js.map