window.addEventListener('load', function() {

  let songRepository   = new SongRepository();
  let songHistory      = new SongHistory(songRepository);
  let songListRenderer = new SongListRenderer(document.getElementById("song-list"));
  let songRenderer     = new SongRenderer(document.getElementById("song"));
  let clickHandler     = new ClickHandler();
  let searchService    = new SearchService();

  // Bind click handlers
  clickHandler.register('[data-page-link]', selectPage);
  clickHandler.register('[data-song-link]', selectSong);
  clickHandler.register('[name=chords]',    search);

  // Bind form submit handler to the search function
  document.querySelectorAll('#search-control')
          .forEach((b) => b.addEventListener('submit', search));

  // Bootstrap song list
  renderHistory();

  // Helper event handlers

  function selectPage(elm) {
    document.querySelectorAll('.page').forEach((e) => {e.classList.remove('active')});
    document.getElementById(elm.getAttribute('data-page-link')).classList.add('active');
    window.scrollTo(0,0);
  }

  function selectSong(elm) {
    let song = songRepository.getSong(elm.getAttribute('data-song-link'));
    songRenderer.draw(song);
    songHistory.add(song);
  }

  function renderHistory() {
    songListRenderer.draw(songHistory.getSongList(), 'Recent songs');
  }

  function search(e) {
    let query  = document.getElementById("search-song").value;
    let chords = Array.from(document.getElementsByName('chords'))
                      .filter((checkbox) => checkbox.checked)
                      .map((checkbox) => checkbox.id);

    if ( query == "" && chords.length == 0 ) {
      renderHistory();
    } else {
      searchService.search(query, chords, (songList) => {
        songRepository.add(songList);
        songListRenderer.draw(songList, 'Search results');
      });
    }

    if (e.preventDefault) { e.preventDefault(); }
    return false;
  }

});
