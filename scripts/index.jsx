const $ = window.jQuery = require('jquery');
import 'strangerScript';
import ReactDOM from 'react-dom';
import React from 'react';

const word1Mapping = {
    0: [],
    1: ['N1'],
    2: ['T1','N1'],
    3: ['T1','N1','G1'],
    4: ['T1','N1','G1','E'],
    5: ['T1','A','N1','G1','E'],
    6: ['T1','R1','A','N1','G1','E'],
    7: ['T1','R1','A','A','N1','G1','E'],
    8: ['T1','R1','A','A','N1','G1','G1','E'],
    9: ['T1','R1','R1','A','A','N1','G1','G1','E'],
    10: ['T1','R1','R1','A','A','N1','G1','G1','G1','E']
};

const word2Mapping = {
    0: [],
    1: ['N2'],
    2: ['I','N2'],
    3: ['H','I','N2'],
    4: ['H','I','N2','G2'],
    5: ['H','I','N2','G2','S2'],
    6: ['T2','H','I','N2','G2','S2'],
    7: ['T2','H','I','N2','G2','G2','S2'],
    8: ['T2','H','I','I','N2','G2','G2','S2'],
    9: ['T2','H','I','I','N2','G2','G2','G2','S2'],
    10: ['T2','T2','H','I','I','N2','G2','G2','G2','S2']
};

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

const makeTheStrangerIntro = function(opening){
    console.log(opening);
    var logo = opening.logo;
    var brk = logo.indexOf('\n');
    var word1 = logo.substring(0,brk);
    var word2 = logo.substring(brk+1);

    var firstWordLarges = [$('#firstLargeLeft'),$('#firstLargeRight')];
    var secondWordLarges = [$('#secondLargeLeft'),$('#secondLargeRight')];

    var toShow = secondWordLarges;
    var toHide = firstWordLarges;

    if(word1.length > word2.length && word1.length > 1){
        toShow = firstWordLarges;
        toHide = secondWordLarges;

        var firstChar = word1[0];
        var lastChar = word1[word1.length-1];
        word1 = word1.substring(1,word1.length-1);
        $('.title-word--second').removeClass('larger');
    }else if(word2.length > 1){
        var firstChar = word2[0];
        var lastChar = word2[word2.length-1];
        word2 = word2.substring(1,word2.length-1);
        $('.title-word--second').addClass('larger');
    }
    toShow[0].show();
    toShow[1].show();
    toHide[0].hide();
    toHide[1].hide();

    toShow[0].find('span').text(firstChar);
    toShow[1].find('span').text(lastChar);

    console.log(word1);
    console.log(word2);

    function parseWord(word, mappings,element){
        var mapping = mappings[word.length];
        element.empty();
        for(var i in word){
            var letter = $('<span></span>',{class:'title-word-letter',
                text:word[i],
                'data-letter':mapping[i]});
            element.append(letter);
        }
    };
    var firstWord = $('#firstWord');
    var secondWord = $('#secondWord');

    parseWord(word1,word1Mapping,firstWord);
    parseWord(word2,word2Mapping,secondWord);


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
                makeTheStrangerIntro(opening);
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
                <textarea ref="logo" id="f-logo" rows="2" spellCheck="false" maxLength="100" defaultValue="STRANGER&#13;&#10;THINGS" />
                <input ref="credits1" spellCheck="false" maxLength="100" defaultValue="A NETFLIX ORIGINAL SERIES" type="text"/>
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
