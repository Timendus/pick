class SongList extends Array {

  constructor(songs) {
    super();
    if (Array.isArray(songs)) {
      songs.forEach((song) => {this.push(song);});
    }
  }

}
