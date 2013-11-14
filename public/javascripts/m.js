$(function(){
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
    });
    getTags();
});

function format(doc){
    var h= '<div class="notetitle"><a href="/note/'+doc._id+'">'+doc.title+'</a></div>';
    h+='<div>'+doc.codes+'</div>';
    return h;
}

function getTags()
{
    $.get('/hottags',{},function(data,status){
        if(data){
            var h = "";
            data.forEach(function(tag,index){
                h+="<span class='t'><a href='/tag/"+tag.tag+"'>"+tag.tag+"</a></span>";
            });
            $("#hottags").html(h);
        }
    });
}