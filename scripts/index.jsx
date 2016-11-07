const $ = window.jQuery = require('jquery');
import 'strangerScript';
import ReactDOM from 'react-dom';
import React from 'react';
import makeTheStrangerIntro from 'makeTheStrangerIntro';
import swal from 'sweetalert2';

swal.setDefaults({
    background: 'black',
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
            opening: defaultOpening
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
                    swal("Oops...", "Opening not found!", "error");
                    return;
                }
                makeTheStrangerIntro(opening);
                if(autoPlay){
                    this.playIntro();
                }
                this.setState({opening});
               }
            });
        }
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
            if(!this.props.edit){
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
        // TODO check limits, check 2 line only

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
        this.playIntro();
    }

    onClickMakeYourOwn = (e)=>{
        location.hash = "";
    }

    handleInputChange = (e)=>{
        var opening = this.state.opening;
        opening[e.target.name] = e.target.value;
        this.setState(opening);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.opening.logo !== prevState.opening.logo){
            this.refs.logo.value = this.state.opening.logo;
        }
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
        var opening = this.state.opening;
        if(this.state.editing && this.state.canPlay){
            var creditsInputs = [];
            for(var i=0;i<14;i++){
                var key = "credits"+i;
                creditsInputs.push(<textarea name={key} key={key} ref={key} rows="2" spellCheck="false" maxLength="300" value={opening[key]} onChange={this.handleInputChange}/>);
            }
            content = <form id="stranger-form" onSubmit={this.submitStranger}>
                <textarea ref="logo" id="f-logo" rows="2" spellCheck="false" maxLength="27" defaultValue={opening.logo} />
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
            <div>
                <div className="STIC">
                    <h1 className="intro-title">STRANGER THINGS<br/>Intro Creator</h1>
                    {content}
                </div>
                <div className="footer">
                <a id="termsOfService" href="termsOfService.html">Terms of Service</a><br/>
                <span>Developed by <a href="https://github.com/BrOrlandi" target="2">Bruno Orlandi</a> and <a href="https://github.com/nihey" target="2">Nihey Takizawa</a> based on <a href="http://wbobeirne.com/stranger-things/" target="2">William O'Beirne</a> work.</span>
                </div>
            </div>
        );
    }
};

$(window).on('hashchange', function() {
    var params = location.hash.replace('#!/', '').split('/');
    var key = params[0];
    var edit = params[1] === "edit";
    ReactDOM.render(<App hash={key} edit={edit}/>, document.getElementById('react-body'));
});

$(document).ready(function() {
  window.dispatchEvent(new Event('hashchange'));
});
