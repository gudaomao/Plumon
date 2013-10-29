var Note = require('../model/note');
module.exports = function(app){
    app.get('/',function(req,res){
        var p = req.param('p');
        var page = parseInt(p);
        Note.getTen(page,function(err,docs){
            res.render('index',{
                docs:docs
            });
        });
    });
    app.get('/getten',function(req,res){
        var p=req.param('p');
        var page = parseInt(p);
        Note.getTen(page,function(err,docs){
            var d = {msg:err,docs:docs};
            res.send(d);
        });
    });
    app.get('/getone',function(req,res){
        Note.getLastOne(function(err,doc){
            var r ={
                errmsg:err,
                doc:doc
            };
            res.send(r);
        });
    });
    app.post('/save',function(req,res){
        var note = new Note(req.param('title'),req.param('codes'));
        console.log('route-title:'+note.title);
        console.log('route-content:'+note.codes);
        note.save(function(err){
            if(err){
                res.send(err);
            }
            res.send('');
        })
    })
}