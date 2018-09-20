/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { increment, decrement } from '../actions/counter.js';

// We are lazy loading its reducer.
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});

// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyView2 extends connect(store)(PageViewElement) {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <a href="/">&laquo; Back to list</a>
        <h2>${this.song.song_name} - ${this.song.artist_name}</h2>
        <pre>${this.song.lyrics}</pre>
      </section>
    `;
  }

  static get properties() { return {
    // This is the data from the store.
    _song_id: { type: Number }
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this.song = state.app.song;
  }
}

window.customElements.define('my-view2', MyView2);
