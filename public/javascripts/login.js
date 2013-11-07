$(function(){
    $("#btnlogin").click(function(){
        var name = $('#username').val();
        var pwd = $("#password").val();
        console.log('user:'+name+",pwd:"+pwd);
        $.post('/login',{name:name,pwd:pwd},function(data,text){
            console.log(data);
            if(data){
                $("#lbmsg").text(data);
            }
            else{
                window.location.href = "/";
            }
        });
    });
});