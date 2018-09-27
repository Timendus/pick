class SearchService {

  constructor() {
    // Where does Bob's awesome API live?
    this._webservice = "https://limitless-bastion-37095.herokuapp.com/api/songs";
  }

  // Expects a query string, an array of chords (in the form of strings) and a
  // callback function for when we have a response
  search(query, chords, callback) {
    let parameters = chords.map((chord) => `chord=${encodeURIComponent(chord)}`);
    if (query) parameters.push(`query=${encodeURIComponent(query)}`);

    this._getRequest(`${this._webservice}?${parameters.join('&')}`, callback);
  }

  _getRequest(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = () => {
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
