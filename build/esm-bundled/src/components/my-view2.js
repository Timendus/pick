import{LitElement,html,plusIcon,minusIcon,ButtonSharedStyles,PageViewElement,connect,store,SharedStyles}from"./my-app.js";const INCREMENT="INCREMENT",DECREMENT="DECREMENT",increment=()=>{return{type:INCREMENT}},decrement=()=>{return{type:DECREMENT}};var counter={INCREMENT:INCREMENT,DECREMENT:DECREMENT,increment:increment,decrement:decrement};class CounterElement extends LitElement{render(){return html`
      ${ButtonSharedStyles}
      <style>
        span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
      </style>
      <div>
        <p>
          Clicked: <span>${this.clicks}</span> times.
          Value is <span>${this.value}</span>.
          <button @click="${()=>this._onIncrement()}" title="Add 1">${plusIcon}</button>
          <button @click="${()=>this._onDecrement()}" title="Minus 1">${minusIcon}</button>
        </p>
      </div>
    `}static get properties(){return{clicks:{type:Number},value:{type:Number}}}constructor(){super();this.clicks=0;this.value=0}_onIncrement(){this.value++;this.clicks++;this.dispatchEvent(new CustomEvent("counter-incremented"))}_onDecrement(){this.value--;this.clicks++;this.dispatchEvent(new CustomEvent("counter-decremented"))}}window.customElements.define("counter-element",CounterElement);const counter$1=(state={clicks:0,value:0},action)=>{switch(action.type){case INCREMENT:return{clicks:state.clicks+1,value:state.value+1};case DECREMENT:return{clicks:state.clicks+1,value:state.value-1};default:return state;}};var counter$2={default:counter$1};store.addReducers({counter:counter$1});class MyView2 extends connect(store)(PageViewElement){render(){return html`
      ${SharedStyles}
      <section>
        <a href="/">&laquo; Back to list</a>
        <h2>${this.song.song_name} - ${this.song.artist_name}</h2>
        <pre>${this.song.lyrics}</pre>
      </section>
    `}static get properties(){return{_song_id:{type:Number}}}_stateChanged(state){this.song=state.app.song}}window.customElements.define("my-view2",MyView2);export{counter as $counter,counter$2 as $counter$1,INCREMENT,DECREMENT,increment,decrement,counter$1 as $counterDefault};