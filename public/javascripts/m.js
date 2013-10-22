$(function(){
    $.get('/getten',{p:0},function(data,text){
        if(data.substring(0,4) == "出现错误"){
            alert(data);
        }
        else{
            var h = "";
            data.forEach(function(doc,index){
                h+=format(doc);
            })
            $("#notelist").html(h);
        }
    });
});

function format(doc){
    return '<div class="notetitle">'+doc.title+'</div>';
}