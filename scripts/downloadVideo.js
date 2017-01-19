const $ = require('jquery');

import swal from 'sweetalert2';

const calcTime = function(queue){
    let minutes = (queue+1)*50;
    let hours = Math.floor(minutes/60);
    let days = Math.floor(hours/24);
    let time = "";
    if(days > 0){
        time += days + " days";
    }
    if(days < 3){
        hours = hours%24;
        minutes = minutes%60;
        if(hours > 0){
            time += " " +hours + " hours";
        }
        if(minutes > 0){
            time += " " +minutes + " minutes";
        }
    }
    return time;
};

const requestVideo = function(donate,key, email){
    if(email === false) return false;

    var url = "https://upsidedown.nihey.org/request?code="+ key +"&email=" + email;
    $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        success: function(data){
            var queue = data.queue;
            swal({
                title: '<h2>Video Request Sent</h2>',
                html:'<p>'+
                'Your video has been queued. Your current position on the queue is <b>'+
                (queue+1) + '</b>, which will take up to <b>'+ calcTime(queue) +'</b>.<br>'+
                'The link to download the video will be sent to the e-mail:<br>'+
                '</p><span class="email">'+email+'</span>'+
                (
                  donate ?
                  (
                   '<p style="margin-top: 15px;">But as you donated, we will bump you up on the queue.'+
                    '  Thank you so much for supporting us! You should receive the confirmation email within a few minutes.'+
                   '</p>'
                  ) :
                  ''
              ) +
              '<p style="margin-top: 15px;">By using this website you are agreeing to our <a href="termsOfService.html" target="_blank">Terms of Service</a>.</p>'
            });
        }
    });
};

export default function downloadVideo(){
    // check if the opening was not changed after loaded
        let actualOpening = {...this.state.opening, logo: this.refs.logo.value};
        let changed = JSON.stringify(window.loadedOpening) !== JSON.stringify(actualOpening);
        let OpeningKey = this.props.hash;

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

        // check if download is available:

        $.ajax({
            url: "https://upsidedown.nihey.org/status?code="+OpeningKey,
            crossDomain: true,
            success: (data) => {
                var queue = data.queue;

                // video already rendered
                if(data.url){
                    swal({
                        title: '<h2>Download</h2>',
                        html: '<p>'+
                        'This video has already been generated, click the link below to download.<br><br>'+
                        '<a href="'+data.url+'">'+data.url+'</a></p>',
                    });
                    return ;
                }

                var generateAlert = {
                    title: '<h2>Video Download</h2>',
                    html: '<p>'+
                    'Type your email bellow and you will receive a message with the URL to download your video when it\'s ready'+
                    '</p>',
                    input: 'email',
                    showCancelButton: true,
                    inputPlaceholder: "Your e-mail...",
                    showLoaderOnConfirm: true,
                };

                swal({
                        title: '<h2>Donate and Download</h2>',
                        html: '<p>'+
                        'We want to provide videos for free, but we have to use a server to render it, which costs money.<br>'+
                        'There are <b>'+(queue+1)+' videos</b> in front of you and it will take <b>'+calcTime(queue)+'</b> to be processed.<br>'+
                        'Can\'t wait for it? Donate at least <b>5 dollars</b>, you will jump the queue and your video will be ready in few hours.<br>'+
                        'The video will be rendered in Full HD quality and MP4 file. To see a sample video click '+
                        '<a href="https://youtu.be/Q0eEXKyA540" target="_blank">here</a>. '+
                        'Attention! Make sure there are no typos in your text, there will be no correction after the video rendering.<br>'+
                        'By using this website you are agreeing to our <a href="termsOfService.html" target="_blank">Terms of Service</a>.'+
                        '</p>',
                          showCancelButton: true,
                          confirmButtonText: "Yes, donate!",
                          cancelButtonText: "No, I'll get in the queue!",
                          animation: "slide-from-top"
                }).then((_success_) => {

                    var donateText = [
                              '<p>',
                              '  Please, use the same email from you PayPal account.',
                              "  You'll be able to add as many e-mails as you want to",
                              '  <b>this video</b> without having to donate again. Just add',
                              '  your other emails after the first one, without donating.',
                              '  Attention! Make sure there are no typos in your text, you will need to request a new video download and donate again.',
                              '  By using this website you are agreeing to our <a href="termsOfService.html" target="_blank">Terms of Service</a>.',
                              '</p>'
                            ].join('');
                            
                     generateAlert.title = '<h2>Donate</h2>';
                     generateAlert.html = '<p>Click on the button bellow:</p>'
                            +'<iframe src="./donateButtons.html#!/' + OpeningKey + '" height="135"></iframe>'+generateAlert.html+donateText;
                    
                    swal(generateAlert).then(requestVideo.bind(window, true, OpeningKey));
                },(_cancel_) => {
                    swal(generateAlert).then(requestVideo.bind(window, false, OpeningKey));
                });

            }

        });
};
