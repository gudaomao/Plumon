$(function(){
    $("#btnsave").click('click',function(){
        var title = $("#tbtitle").val();
        var codes = $("#tbcontent").val();
        var tags = $("#tags").tagsinput('items');
        console.log(tags);
        $.post('/save',{title:title,codes:codes,tags:tags},function(data,text){
            if(data){
                //alert(data);
                window.location.reload();
            }
            else{
                loadlast();
            }
        });
    });
    $("#newplumon").click(function(){
        $(".newnotebox").show('fast');
        $("#tbcontent")[0].focus();
        $(this).hide();
    });
    $("#btncancel").click(function(){
        $(".newnotebox").hide();
        $("#newplumon").show();
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