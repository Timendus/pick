define(["./my-app.js"],function(_myApp){"use strict";class MyView404 extends _myApp.PageViewElement{render(){return _myApp.html`
      ${_myApp.SharedStyles}
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/">home</a> and try again?
        </p>
      </section>
    `}}window.customElements.define("my-view404",MyView404)});