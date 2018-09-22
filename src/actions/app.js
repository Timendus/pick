/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const UPDATE_SONG = 'UPDATE_SONG';
export const STORE_SONGS = 'STORE_SONGS';

export const navigate = (path) => (dispatch) => {
  if (path.startsWith("/pick")) {
    path = path.substring(5);
  }

  // Extract the page name from path.
  const page = path === '/' ? 'view3' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage = (page) => (dispatch) => {
  console.log(page);
  var parts = page.split('/');
  console.log(parts);

  switch(parts[0] || page) {
    // case 'view1':
    //   import('../components/my-view1.js').then((module) => {
    //     // Put code in here that you want to run every time when
    //     // navigating to view1 after my-view1.js is loaded.
    //   });
    //   break;
    case 'song':
      var song = 1 * parts[1];
      if (song > 0) {
        page = 'view2';
        import('../components/my-view2.js');
        dispatch(updateSong(song));
      } else {
        page = 'view404';
        import('../components/my-view404.js');
      }
      break;
    case 'view3':
      import('../components/my-view3.js');
      break;
    default:
      page = 'view404';
      import('../components/my-view404.js');
  }

  dispatch(updatePage(page));
};


const TESTING_SONGS = [
  {"id": 34876, "title": "Smoke on the water", "artist": "The Chainsmokers"},
  {"id": 25874, "title": "Helder", "artist": "Johnny and the chain wizards"}
];

export const fetchSongs = () => (dispatch, getState) => {
  // Here you would normally get the data from the server. We're simulating
  // that by dispatching an async action (that you would dispatch when you
  // succesfully got the data back)

  var request = new XMLHttpRequest();
  request.open('GET', 'https://limitless-bastion-37095.herokuapp.com/api/songs', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      try {
        var song_list = JSON.parse(request.responseText);
      } catch(e) {
        console.log("Error parsing JSON: ", e);
      }

      // You could reformat the data in the right format as well:
      const products = (song_list || TESTING_SONGS).reduce((obj, product) => {
        obj[product.id] = product
        return obj
      }, {});

      dispatch({
        type: STORE_SONGS,
        products: products
      });
    } else {
      console.log("Server returned an error:", request);
    }
  };
  request.onerror = function() { console.log("Could not connect", request); };
  request.send();
};


const updateSong = (song) => {
  console.log("hoi");
  return {
    type: UPDATE_SONG,
    song
  };
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wide) => (dispatch, getState) => {
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
};

export const updateDrawerState = (opened) => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
};
