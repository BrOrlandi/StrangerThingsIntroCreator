const $ = window.jQuery = require('jquery');
import 'strangerScript';
import ReactDOM from 'react-dom';
import React from 'react';
import makeTheStrangerIntro from 'makeTheStrangerIntro';
import swal from 'sweetalert2';
import bowser from 'bowser';
import downloadVideo from './downloadVideo';
import ajaxErrorFunction from './errorFunction';
import { postUrl, getUrl } from './urls';
import './bitcoinEther';

const browser = bowser.getParser(window.navigator.userAgent);

swal.setDefaults({
    background: '#060606',
    customClass: 'stranger-alert',
});

const defaultOpening = {
    logo: `STRANGER
THINGS`,
    credits0: "A NETFLIX ORIGINAL SERIES",
    credits1: "WINONA RYDER",
    credits2: "DAVID HARBOUR",
    credits3: "FINN WOLFHARD\nMILLIE BOBBY BROWN",
    credits4: "GATEN MATARAZZO\nCALEB McLAUGHLIN",
    credits5: "NATALIA DYER\nCHARLIE HEATON",
    credits6: "CARA BUONO",
    credits7: "And\nMATTHEW MODINE",
    credits8: "Co-Executive Producer\nIAIN PATERSON",
    credits9: "Executive Producer\nKARL GAJDUSEK",
    credits10: "Executive Producers\nCINDY HOLLAND\nBRIAN WRIGHT\nMATT THUNELL",
    credits11: "Executive Producers\nSHAWN LEVY\nDAN COHEN",
    credits12: "Executive Producers\nTHE DUFFER BROTHERS",
    credits13: "Created By\nTHE DUFFER BROTHERS"
};

class App extends React.Component {

    constructor(){
        super();
        this.state={
            canPlay: null,
            editing: false,
            loading: false,
            alreadyPlayed: false,
            download: false,
            opening: defaultOpening,
            shouldAlertAboutSpace: true,
        }
    }

    checkHash = (props, autoPlay = false)=>{
        if(props.hash){
            var url = getUrl(props.hash);
            $.ajax({
              url: url,
              success: (opening) => {
                this.unsetLoading();
                if(opening == null){
                    swal("Oops...", "Opening not found!", "error");
                    return;
                }
                $('[name=custom]').val(props.hash);
                makeTheStrangerIntro(opening);
                if(autoPlay){
                    this.playIntro();
                }
                window.loadedOpening = {...opening};
                this.setState({opening,download: true});
                if(this.props.download) {
                    downloadVideo(props.hash);
                }
               },
                error: ajaxErrorFunction('Error when try to load the intro '+props.hash)
            });
        }
        ga('send', 'pageview', {
            'page': location.pathname + location.search  + location.hash
        });
    }

    playIntro = ()=>{
        showStrangerIntro();
        startStranger();
        this.setState({alreadyPlayed: true});
        $(window.music).bind('ended', (e)=>{
            this.setState({editing: true});
            stopStrangerIntro();
        });

    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state.alreadyPlayed != nextState.alreadyPlayed)
            return false;
        return true;
    }

    componentWillReceiveProps(props){
        if(props.hash){
            this.setState({
                loading: true,
                editing: false
            });
            this.checkHash(props,true);
        }else{
            location.reload(); // was seeing a intro before now needs to reload to go back to the home page.
        }
    }

    componentWillMount(){
        var state = {
            canPlay: null,
            editing: true
        };

        if(this.props.hash){
            state.loading = true;
            if(!this.props.edit && !this.props.download){
                state.editing = false;
            }
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
        var logo = this.refs.logo.value.toUpperCase().trim();

        if(logo.indexOf('\n') == -1)
            logo += '\n';

        var opening = this.state.opening;
        opening.logo = logo;

        var aLogo = opening.logo.split('\n');
        if(aLogo.length > 2){
            swal("Oops...", "Logo can't have more than 2 lines.", "warning");
            return;
        }

        this.setLoading();
        $.ajax({
            url: postUrl(),
            method: "POST",
            data: JSON.stringify(opening),
            dataType: "json",
            success: (data)=>{
                var key = 'A'+data.name.substring(1);
                // CreatedIntros.save(key,opening);
                location.hash = '!/'+key;
            },
            error: ajaxErrorFunction('Error when creating the intro.')
        });
    }

    onClickPlay = (e)=>{
        e.preventDefault();
        this.playIntro();
    }

    onClickMakeYourOwn = (e)=>{
        location.hash = "";
    }

    onClickDownload = (e) => {
        // check if the opening was not changed after loaded
        let actualOpening = {...this.state.opening, logo: this.refs.logo.value};
        let changed = JSON.stringify(window.loadedOpening) !== JSON.stringify(actualOpening);
        let openingKey = this.props.hash;

        if(changed){
            swal({
                title: '<h2>Text modified</h2>',
                html: '<p>'+
            'You have changed some of the text inputs. You need to play the new intro to save and request a download.</p>',
                showCancelButton: true,
                confirmButtonText: "Ok, play it!",
                confirmButtonColor: "#807300",
                animation: "slide-from-top"
            }).then(() => {
                this.submitStranger(e);
            },() => {
                console.log("cancel");
            });
            return;
        }

        downloadVideo(openingKey);
    }

    handleInputChange = (e)=>{
        var opening = this.state.opening;
        opening[e.target.name] = e.target.value;
        this.setState(opening);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.opening.logo !== prevState.opening.logo && this.refs.logo){
            this.refs.logo.value = this.state.opening.logo;
        }
    }

    shouldComponentUpdate(_, nextState) {
        if(nextState.shouldAlertAboutSpace !== this.state.shouldAlertAboutSpace) {
            return false;
        }
        return true;
    }

    _onKeyUpLogo = (event) => {
        if(' ' !== event.key) {
            return;
        }

        this.refs.logo.value = this.refs.logo.value.replace(' ','');

        if(this.state.shouldAlertAboutSpace) {
            swal("Sorry!", "White space is not allowed in the title! For a better animation try to use only one word per line.", "warning");
            this.setState({
                shouldAlertAboutSpace: false,
            })
        }
    }

    render(){
        const recommendChrome = 'We recommend using Google Chrome for the best experience.';
        const isNotChrome = !browser.isBrowser('chrome');

        var notice;
        if(this.state.canPlay == 'can'){
            notice = <p className="intro-text">
              The following animation is performance intensive, and will play audio. If you
              experience any issues, try sizing down your browser and refreshing.<br/><br/>
              {isNotChrome && recommendChrome}
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
        var opening = this.state.opening;

        if(this.state.editing && this.state.canPlay){
            var creditsInputs = [];
            for(var i=0;i<14;i++){
                var key = "credits"+i;
                creditsInputs.push(<textarea name={key} key={key} ref={key} rows="2" spellCheck="false" maxLength="300" value={opening[key]} onChange={this.handleInputChange}/>);
            }

            var downloadButton = this.state.download ? <span><button className="downloadButton" type="button" onClick={this.onClickDownload}>
                  DOWNLOAD
                </button><br/><br/></span> : null;

            content = <form id="stranger-form" onSubmit={this.submitStranger}>
                {downloadButton}
                <textarea ref="logo" id="f-logo" rows="2" spellCheck="false" maxLength="27" defaultValue={opening.logo} onKeyUp={this._onKeyUpLogo} autoFocus/>
                {creditsInputs}
                {/* <input ref="credits1" spellCheck="false" maxLength="100" defaultValue="A NETFLIX ORIGINAL SERIES" type="text"/> */}
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
              <br/><br/>
            <button className="playButton" onClick={this.onClickMakeYourOwn}>
                MAKE YOUR OWN
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
                <h1 className="intro-title">STRANGER THINGS<br/>Intro Creator</h1>
                {content}
            </div>
        );
    }
};

$(window).on('hashchange', function() {
    var params = location.hash.replace('#!/', '').split('/');
    var key = params[0];
    var edit = params[1] === "edit";
    var download = params[1] === "download";
    ReactDOM.render(<App hash={key} edit={edit} download={download} />, document.getElementById('react-body'));
});

var bg = require('../assets/bg.jpg');

$(document).ready(function() {
  var video = document.querySelector('#video');
  video.setAttribute('poster',bg);
  window.dispatchEvent(new Event('hashchange'));
});
