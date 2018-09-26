class SongList {

  static allSongs() {
    return JSON.parse(localStorage.getItem('songList') || "{}");
  }

  static getSong(id) {
    return SongList.allSongs()[id];
  }

  static addSongs(list) {
    let newList = Object.assign(SongList.allSongs(), list);
    return localStorage.setItem('songList', JSON.stringify(newList));
  }

}
