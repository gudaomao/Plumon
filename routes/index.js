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
        var title = req.param('title');
        var codes = req.param('codes');
        var tags = req.param('tags');
        var note = new Note(title,codes,tags);
        console.log('route-title:'+note.title);
        console.log('route-content:'+note.codes);
        note.save(function(err){
            if(err){
                res.send(err);
            }
            res.send('');
        });
    });
    app.get('/note/:title',function(req,res){
        console.log('/note/title'+req.params.title);
        var title = req.params.title;
        Note.get(title,function(err,doc){
            console.log(doc);
            res.render('note',{
                note:doc,
                err:err
            });
        })
    })
}