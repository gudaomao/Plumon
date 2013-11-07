$(function(){
    $("#tbcontent")[0].focus();

    $("#btnsave").click('click',function(){
        var title = $("#tbtitle").val();
        var codes = $("#tbcontent").val();
        var tags = $("#tags").tagsinput('items');
        $.post('/save',{title:title,codes:codes,tags:tags},function(data,text){
            if(data){
                //alert(data);
            }
            else{
                console.log('tags:');
                console.log(tags);
                $.post('/tags/',{tags:tags},function(){});
                //window.location.href='/';
            }
        });
    });
    $("#btncancel").click(function(){
        window.location.href='/';
    })
})