/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the elements needed by this element.
import './song-item.js';

// These are the actions needed by this element.
import { fetchSongs } from '../actions/app.js';

// These are the elements needed by this element.
import { addToCartIcon } from './my-icons.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';

class SongList extends connect(store)(LitElement) {
  render() {
    return html`
      ${ButtonSharedStyles}
      <style>
        :host { display: block; }
      </style>
      <ul>
      ${Object.keys(this._products).map((key) => {
        const item = this._products[key];
        return html`
          <li>
            <a href="/song/${item.id}">${item.song_name} - ${item.artist_name}</a>
          </li>
        `
      })}
      </ul>
    `;
  }

  static get properties() { return {
    _products: { type: Object }
  }}

  firstUpdated() {
    store.dispatch(fetchSongs());
  }

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._products = state.app.products;
  }
}

window.customElements.define('song-list', SongList);
