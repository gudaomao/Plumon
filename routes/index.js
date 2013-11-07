var Note = require('../model/note');
var Coder = require('../model/user');

module.exports = function(app){
    app.get('/',function(req,res){
        var p = req.param('p');
        var page = parseInt(p);
        var d = {};
        d.u = undefined;
        if(req.session.user){
            d.u = {};
            d.u.name = req.session.user;
            d.u.avatar = req.session.myavatar;
        }
        Note.getTen(page,function(err,docs){
            d.docs = docs;
            res.render('index',d);
        });
    });
    app.get('/new',function(req,res){
        res.render('new',{
            "u":req.session.user
        });
    })
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
        var note = new Note(title,codes,tags,{});
        console.log('route-title:'+note.title);
        console.log('route-content:'+note.codes);
        console.log('route-tags:'+note.tags);
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
                "u": req.session.user,
                note:doc,
                err:err
            });
        });
    });
    app.post('/tags',function(req,res){
        console.log('post tags');
        console.log(req.param('tags'));
        var tags = req.param('tags');
        Note.tagit(tags,function(err,result){
            if(err){
                console.log('tags error:');
                console.log(err);
            }
        });
    });
    app.get('/login',function(req,res){
        console.log('get /login');
        res.render('login',{});
    });
    app.post('/login',function(req,res){
        console.log('post /login');
        var name = req.param('name');
        var pwd = req.param('pwd');
        console.log('name:'+name+'pwd:'+pwd);
        Coder.login(name,pwd,function(err,doc){
            if(err){
                res.send(err);
            }
            else{
                if(doc){
                    console.log(doc);
                    req.session.user = doc.name;
                    req.session.myavatar = doc.avatar;
                    res.send('');
                }else{
                    res.send('Not exist this user or password is wrong.');
                }

            }
        });
    });
    app.get('/reg',function(req,res){
        console.log('get /reg');
        res.render('reg',{});
    })
    app.post('/reg',function(req,res){
        console.log('post /reg');
        var username = req.body.user;
        var password = req.body.pwd;
        if(username && password){
            Coder.save(username,password,function(err){
                if(err){
                    res.send(err);
                }
                else{
                    res.send('');
                }
            });
        }
    });
}