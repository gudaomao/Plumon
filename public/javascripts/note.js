$(function(){
    $("#zz").click(function(){
        var id = $("#hdid").val();
        var user = $("#hduser").val();
        console.log('id:'+id);
        console.log('user:'+user);
        $.post('/zz',{user:user,id:id},function(data,text){
            if(data){
                alert(data);
            }
            else{
                alert('转帖成功');
            }
        })
    });
    $("#del").click(function(){
        var id=$("#hdid").val();
        $.post('/del',{id:id},function(data,status){
            if(data){alert(data);}
            else{alert("删除成功");window.location.href='/';}
        })
    })
});