class SearchService {

  constructor() {
    // Where does Bob's awesome API live?
    this.webservice = "https://limitless-bastion-37095.herokuapp.com/api/songs";
  }

  // Expects a query string, an array of chords (in the form of strings) and a
  // callback function for when we have a response
  search(query, chords, callback) {
    let chordsQuery = chords.map((chord) => `chord=${encodeURIComponent(chord)}`).join('&');
    this._getRequest(`${this.webservice}?${query ? `query=${encodeURIComponent(query)}` : ``}${query && chordsQuery ? `&` : ``}${chords ? chordsQuery : ``}`, callback);
  }

  _getRequest(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        try {
          let songList = JSON.parse(request.responseText);
          callback(new SongList(songList));
        } catch(e) {
          console.log("Error parsing JSON: ", e);
        }
      } else {
        console.log("Server returned an error:", request);
      }
    };
    request.onerror = () => console.log("Could not connect", request);
    request.send();
  }

}
