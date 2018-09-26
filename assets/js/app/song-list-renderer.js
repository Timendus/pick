class SongListRenderer {

  constructor(element) {
    this.element = element;
  }

  draw(songlist, header) {
    let list = '';
    songlist.forEach((song) => {
      list += `<li><a class='song-link' data-page-link='song-page' data-song-link='${song.id}'>${song.song_name} - ${song.artist_name}</a></li>`;
    });

    this.element.innerHTML = `
      ${header ? `<h1>${header} (${songlist.length})</h1>` : ``}
      <ul>
        ${list}
      </ul>
    `;
  }

}
