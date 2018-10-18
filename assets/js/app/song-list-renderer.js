class SongListRenderer {

  constructor(element) {
    this._element = element;
  }

  draw(songlist, header) {
    if (songlist.length != 0) {
      let list = '';
      songlist.forEach((song) => {
        list += `<li><a class='song-link' data-page-link='song-page' data-song-link='${song.id}'>${song.song_name} - ${song.artist_name}</a></li>`;
      });

      this._element.innerHTML = `
        ${header ? `<h1>${header} (${songlist.length})</h1>` : ``}
        <ul>
          ${list}
        </ul>
      `;
    } else {
      this._element.innerHTML = `<h1>No results found</h1>`;
    }
  }

}
