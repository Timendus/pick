class SongHistory {

  constructor(repository) {
    this.repository = repository;
  }

  getSongList() {
    return new SongList(this._list().map((id) => {
      return this.repository.getSong(id);
    }));
  }

  add(song) {
    if ( this._includes(song) ) {
      // Optional TODO: Push this song to the end of the list
      return;
    } else {
      let songHistory = this._list();
      songHistory.unshift(song.id);
      songHistory = songHistory.slice(0,10);
      localStorage.setItem('songHistory', JSON.stringify(songHistory));
    }
  }

  _list() {
    return JSON.parse(localStorage.getItem('songHistory') || "[]");
  }

  _includes(song) {
    return this._list().includes(song.id);
  }

}
