function display_ct5() {
    // var x = new Date()
    // var ampm = x.getHours( ) >= 12 ? ' PM' : ' AM';
    var date = new Date();
    
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    
    var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    //var x1 =  (x.getHours()<10?'0'+x.getHours():x.getHours()) + ":" + (x.getMinutes()<10?'0'+x.getMinutes():x.getMinutes()) + ":" +  (x.getSeconds()<10?'0'+x.getSeconds():x.getSeconds()) + " " + ampm;
    
    document.getElementById('timeimp').innerHTML = time;
    
    const mytime=setTimeout(display_ct5,1000)
}