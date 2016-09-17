var $ = window.jQuery = require('jquery');
import 'strangerScript';
import ReactDOM from 'react-dom';
import React from 'react';


window.showStrangerIntro = function(){
    document.querySelector("#react-body").className = 'hide';
    document.querySelector("#StrangerIntro").className = '';
};

class App extends React.Component {

    constructor(){
        super();
        this.state={
            canPlay: false,
            text: null
        }
    }

    componentWillMount(){
        var bind = false;
        var text = null;

        // Must-haves
        if (!Modernizr.audio || !Modernizr.cssanimations || !Modernizr.textshadow) {
          text = 'cant';
        }
        // Should-haves
        else if (!Modernizr.textstroke) {
            bind = true;
            text = 'shouldnt';
        }
          // All good!
        else {
          bind = true;
          text = 'can';
        }

        this.setState({bind,text});
    }

    playIntro(e){
        e.preventDefault();
        console.log("AE");
        showStrangerIntro();
        startStranger();
    }

    render(){
        var text;
        if(this.state.text == 'can'){
            text = <p className="intro-text">
              The following animation is performance intensive, and will play audio. If you
              experience any issues, try sizing down your browser and refreshing.
            </p>
        }else if(this.state.text == 'shouldnt'){
            text = <p className="intro-text">
              Unfortunately this website uses many features only found in the latest
              version of Google Chrome. You can still run this, but it may not look
              as intended. Please try running it in Chrome for the best experience.
              <br/>
              <a className="intro-text-button" href="https://www.google.com/chrome/browser/">
                Download Chrome
              </a>
            </p>
        }else if(this.state.text == 'cant'){
            text = <p className="intro-text">
              Unfortunately your browser doesn't support this website. Please download
              Google Chrome, and try running it again.
              <br/>
              <a className="intro-text-button" href="https://www.google.com/chrome/browser/">
                Download Chrome
              </a>
            </p>
        }

        var content;
        if(this.state.bind){
            content = <form id="stranger-form">
                <textarea id="f-logo" rows="2" spellcheck="false" maxlength="100" defaultValue="STRANGER&#13;&#10;THINGS" />
                <input id="f-credits1" spellcheck="false" maxlength="100" defaultValue="A NETFLIX ORIGINAL SERIES" type="text"/>
                  {text}
                <button id="play" className="playButton" type="submit" onClick={this.playIntro}>
                  PLAY
                </button>
            </form>
        }else{
            content =  text;
        }
        return (
            <div className="STIC">
                <h1 className="intro-title">Stranger Things<br/>Intro Creator</h1>

                {content}
            </div>
        );
    }
};

$(window).on('hashchange', function() {

    var params = location.hash.replace('#!/', '').split('/');
    var key = params[0];
    ReactDOM.render(<App hash={key}/>, document.getElementById('react-body'));

});

$(document).ready(function() {
  window.dispatchEvent(new Event('hashchange'));
});
