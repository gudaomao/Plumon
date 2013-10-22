var Note = require('../model/note');
module.exports = function(app){
    app.get('/',function(req,res){
        res.render('index',{});
    });
    app.get('/getten',function(req,res){
        var page = parseInt(req.query.p);
        Note.getTen(page,function(err,docs){
            if(err){
                res.send('出现错误:'+err);
            }
            res.send(docs);
        })
    })
}