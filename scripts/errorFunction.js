import swal from 'sweetalert2';

export default function ajaxErrorFunction(bodyMessage){
  var body = encodeURI("Hi, the website didn't work as expected. \n\n"+bodyMessage);
  return function (){
    swal({
      title: '<h2 style="font-family: BenguiatITCW01-BoldCn;">An error has occured</h2>',
      html: '<p style="text-align: left">Something went wrong! Sorry about that! Please try again, if this error repeats please contact us: : '+
            '<br><a style="color: #C11B1F;" href="mailto:brorlandi@gmail.com,nihey.takizawa@gmail.com?Subject=STIC%20Problem&Body='+body+'" target="_blank">brorlandi@gmail.com<br> nihey.takizawa@gmail.com</a></p>',
      type: "error",
      confirmButtonText: "Ok",
    });
  };
}