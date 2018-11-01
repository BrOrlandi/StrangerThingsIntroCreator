const $ = window.jQuery = require('jquery');

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

const letterNMapping = {
    0:-1,
    1:0,
    2:1,
    3:1,
    4:1,
    5:2,
    6:3,
    7:4,
    8:4,
    9:5,
    10:5
}

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
  $("#kasselLogo").addClass('hide');
  $("#StrangerIntro").removeClass('hide');
  $("body").removeClass('overflow');
  document.querySelector("#video").pause();
};

window.stopStrangerIntro = function(){
  $("#config").removeClass('hide');
  $("#kasselLogo").removeClass('hide');
  $("#StrangerIntro").addClass('hide');
  $("body").addClass('overflow');
  document.querySelector("#video").play();

  $('.title--full').removeClass('title--show');
  $('.credits-final').removeClass('credits-group--show');
};

const makeTheStrangerIntro = function(opening){
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

    function parseWord(word, mappings, element, extraChar, extraPos){
        if(word.length > 10){ // will create extra characters mapping
            var mapping = Object.assign([],mappings[10]);
            var extraChars = [];
            var qty = word.length - 10;
            for(var i=0;i<qty;i++) {
                extraChars.push(extraChar);
            }
            mapping.splice(extraPos,0,...extraChars);
        }else{
            var mapping = mappings[word.length];
        }
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

    parseWord(word1,word1Mapping,firstWord,'R1',1);
    parseWord(word2,word2Mapping,secondWord,'I',3);

    var ln = letterNMapping[word1.length];
    $('#letterN').text(word1[ln]);
    $('#letterG').text(word1[ln+1]);

    // END OF LOGO PREPARATION
    // START OF CREDITS

    function generateCredits(element, text) {
        $(element).text('');
        var creditsLines = text.split('\n');
        creditsLines.forEach((e)=>{
            var creditsElement = $('<div></div>',{class:'credits-group-credit',
                text:e,
                'data-text':e});
            $(element).append(creditsElement);
        });
    }

    var credits = document.querySelectorAll('.credits-group');
    var creditsFinal = document.querySelector('.credits-final');
    for(var i=0;i<13;i++){
        generateCredits(credits[i], opening['credits'+i]);
    }
    generateCredits(creditsFinal, opening['credits13']);
};

export default makeTheStrangerIntro;
