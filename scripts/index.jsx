var $ = window.jQuery = require('jquery');
import 'strangerScript';
import ReactDOM from 'react-dom';
import React from 'react';


window.showStrangerIntro = function(){
    $("#config").addClass('hide');
    $("#StrangerIntro").removeClass('hide');
    $("body").removeClass('overflow');
    document.querySelector("#video").pause();
};

window.stopStrangerIntro = function(){
    $("#config").removeClass('hide');
    $("#StrangerIntro").addClass('hide');
    $("body").addClass('overflow');
    document.querySelector("#video").play();
};

class App extends React.Component {

    constructor(){
        super();
        this.state={
            canPlay: null,
            editing: false,
            loading: false
        }
    }

    checkHash = (props,autoPlay = false)=>{
        if(props.hash){
            var url = "https://strangerthingsintrocreator.firebaseio.com/openings/-"+props.hash + ".json";
            $.ajax({
              url: url,
              success: (opening) => {
                this.unsetLoading();
                if(opening == null){
                    // TODO alert error not found
                }
                console.log(opening);
                if(autoPlay){
                    showStrangerIntro();
                    startStranger();
                }
               }
            });
        }
    }

    componentWillReceiveProps(props){
        if(props.hash){
            this.setState({
                loading: true,
                editing: false
            });
        }
        this.checkHash(props,true);
    }

    componentWillMount(){
        var state = {
            canPlay: null,
            editing: true
        };

        if(this.props.hash){
            state.editing = false;
            state.loading = true;
        }

        // Must-haves
        if (!Modernizr.audio || !Modernizr.cssanimations || !Modernizr.textshadow) {
          state.canPlay = 'cant';
        }
        // Should-haves
        else if (!Modernizr.textstroke) {
            state.canPlay = 'shouldnt';
        }
          // All good!
        else {
          state.canPlay = 'can';
        }
        this.setState(state);

        this.checkHash(this.props);
    }

    setLoading(){
        this.setState({loading: true});
    }

    unsetLoading(){
        this.setState({loading: false});
    }

    submitStranger = (e)=>{
        e.preventDefault();
        var opening ={
            logo: this.refs.logo.value,
            credits1: this.refs.credits1.value
        };

        // TODO check limits

        this.setLoading();
        $.ajax({
            url: "https://strangerthingsintrocreator.firebaseio.com/openings.json",
            method: "POST",
            data: JSON.stringify(opening),
            dataType: "json",
            success: (data)=>{
                var key = data.name.substring(1);
                // CreatedIntros.save(key,opening);
                location.hash = '!/'+key;
            }
        });
    }

    onClickPlay = (e)=>{
        e.preventDefault();
        showStrangerIntro();
        startStranger();
    }

    render(){

        var notice;
        if(this.state.canPlay == 'can'){
            notice = <p className="intro-text">
              The following animation is performance intensive, and will play audio. If you
              experience any issues, try sizing down your browser and refreshing.
            </p>
        }else if(this.state.canPlay == 'shouldnt'){
            notice = <p className="intro-text">
              Unfortunately this website uses many features only found in the latest
              version of Google Chrome. You can still run this, but it may not look
              as intended. Please try running it in Chrome for the best experience.
              <br/>
              <a className="intro-text-button" href="https://www.google.com/chrome/browser/">
                Download Chrome
              </a>
            </p>
        }else if(this.state.canPlay == 'cant'){
            notice = <p className="intro-text">
              Unfortunately your browser doesn't support this website. Please download
              Google Chrome, and try running it again.
              <br/>
              <a className="intro-text-button" href="https://www.google.com/chrome/browser/">
                Download Chrome
              </a>
            </p>
        }

        var content;
        if(this.state.editing && this.state.canPlay){
            content = <form id="stranger-form" onSubmit={this.submitStranger}>
                <textarea ref="logo" id="f-logo" rows="2" spellcheck="false" maxlength="100" defaultValue="STRANGER&#13;&#10;THINGS" />
                <input ref="credits1" spellcheck="false" maxlength="100" defaultValue="A NETFLIX ORIGINAL SERIES" type="text"/>
                  {notice}
                <button className="playButton" type="submit">
                  PLAY
                </button>
            </form>
        }else if(this.state.canPlay){
            content =  <div>
                {notice}
              <button className="playButton" onClick={this.onClickPlay}>
                PLAY
              </button>
            </div>;
        }else{
            content =  notice;
        }

        if(this.state.loading){
            content = <div className="intro-title" style={{lineHeight: "200px"}}>Loading...</div>
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
