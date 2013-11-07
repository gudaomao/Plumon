$(function(){
    loadlast();
    if(window.location.href.indexOf("#newnote")>-1){
        newnote();
    }
    $("#btnlogin").click(function(){
        var name = $("#username").val();
        var pwd  = $("#password").val();
        $.post('/login',{name:name,pwd:pwd},function(data,text){
            console.log(data);
            if(data){
                //$("#lbmsg").text(data);
                window.location.href='/login';
            }
            else{
                window.location.href = "/";
            }
        });
    })
});

function format(doc){
    var h= '<div class="notetitle"><a href="/note/'+doc._id+'">'+doc.title+'</a></div>';
    h+='<div>'+doc.codes+'</div>';
    return h;
}
function loadlast()
{
    $.get('/getone',function(data,text){
        if(data){
            if(data.errmsg){
            }
            else{
                $("#notelist").html("<div>"+data.doc.title+"</div><div>"+data,doc.codes+"</div>");
            }
        }
    })
}