class SongRepository {

  constructor() {
    this._repository = JSON.parse(localStorage.getItem('songList') || "{}");
  }

  add(songlist) {
    songlist.forEach((song) => this._addSong(song, false));
    this._saveToLocalStorage();
  }

  getSong(id) {
    return this._repository[id];
  }

  getSongList() {
    return new SongList(Object.values(this._repository));
  }

  _addSong(song, saveToLocalStorage=true) {
    this._repository[song.id] = song;
    if (saveToLocalStorage) this._saveToLocalStorage();
  }

  _saveToLocalStorage() {
    localStorage.setItem('songList', JSON.stringify(this._repository));
  }

}
