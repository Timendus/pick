define(["exports","./my-app.js"],function(_exports,_myApp){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.$counterDefault=_exports.decrement=_exports.increment=_exports.DECREMENT=_exports.INCREMENT=_exports.$counter$1=_exports.$counter=void 0;const INCREMENT="INCREMENT";_exports.INCREMENT=INCREMENT;const DECREMENT="DECREMENT";_exports.DECREMENT=DECREMENT;const increment=()=>{return{type:INCREMENT}};_exports.increment=increment;const decrement=()=>{return{type:DECREMENT}};_exports.decrement=decrement;_exports.$counter={INCREMENT:INCREMENT,DECREMENT:DECREMENT,increment:increment,decrement:decrement};class CounterElement extends _myApp.LitElement{render(){return _myApp.html`
      ${_myApp.ButtonSharedStyles}
      <style>
        span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
      </style>
      <div>
        <p>
          Clicked: <span>${this.clicks}</span> times.
          Value is <span>${this.value}</span>.
          <button @click="${()=>this._onIncrement()}" title="Add 1">${_myApp.plusIcon}</button>
          <button @click="${()=>this._onDecrement()}" title="Minus 1">${_myApp.minusIcon}</button>
        </p>
      </div>
    `}static get properties(){return{clicks:{type:Number},value:{type:Number}}}constructor(){super();this.clicks=0;this.value=0}_onIncrement(){this.value++;this.clicks++;this.dispatchEvent(new CustomEvent("counter-incremented"))}_onDecrement(){this.value--;this.clicks++;this.dispatchEvent(new CustomEvent("counter-decremented"))}}window.customElements.define("counter-element",CounterElement);const counter$1=(state={clicks:0,value:0},action)=>{switch(action.type){case INCREMENT:return{clicks:state.clicks+1,value:state.value+1};case DECREMENT:return{clicks:state.clicks+1,value:state.value-1};default:return state;}};_exports.$counterDefault=counter$1;_exports.$counter$1={default:counter$1};_myApp.store.addReducers({counter:counter$1});class MyView2 extends(0,_myApp.connect)(_myApp.store)(_myApp.PageViewElement){render(){return _myApp.html`
      ${_myApp.SharedStyles}
      <section>
        <a href="/">&laquo; Back to list</a>
        <h2>${this.song.song_name} - ${this.song.artist_name}</h2>
        <pre>${this.song.lyrics}</pre>
      </section>
    `}static get properties(){return{_song_id:{type:Number}}}_stateChanged(state){this.song=state.app.song}}window.customElements.define("my-view2",MyView2)});