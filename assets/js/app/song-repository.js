class SongRepository {

  constructor() {
    this.repository = JSON.parse(localStorage.getItem('songList') || "{}");
  }

  add(songlist) {
    songlist.forEach((song) => this._addSong(song, false));
    this._saveToLocalStorage();
  }

  getSong(id) {
    return this.repository[id];
  }

  getSongList() {
    return new SongList(Object.values(this.repository));
  }

  _addSong(song, saveToLocalStorage=true) {
    this.repository[song.id] = song;
    if (saveToLocalStorage) this._saveToLocalStorage();
  }

  _saveToLocalStorage() {
    localStorage.setItem('songList', JSON.stringify(this.repository));
  }

}
