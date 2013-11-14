$(function(){
    $("#tbcontent")[0].focus();
    $("#btnsave").click('click',function(){
        var title = $("#tbtitle").val();
        var codes = $("#tbcontent").val();
        var tags = $("#tags").tagsinput('items');
        var open = $("input[name='open']:checked").val();
        $.post('/save',{title:title,codes:codes,tags:tags,open:open},function(data,text){
            if(data){
                alert(data);
            }
            else{
                $.post('/tags/',{tags:tags},function(){});
                window.location.href='/';
            }
        });
    });
    $("#btncancel").click(function(){
        window.location.href='/';
    });

})