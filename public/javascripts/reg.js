$(function(){
    $("#btnreg").click(function(){
        var name = $("#tbusername").val();
        var pwd1 = $("#tbpassword").val();
        var pwd2 = $("#tbpasswordagain").val();
        if(pwd1!=pwd2){
            $("#lbmsg").text("两次输入的密码不一致");
            return ;
        }
        $.post('/reg',{user:name,pwd:pwd1},function(data,text){
            if(data){
                $("#lbmsg").text(data);
            }
            window.location.href='/login';
        });
    });
});