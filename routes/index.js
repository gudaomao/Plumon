var DB = require('../models/db.js');

module.exports = function(app){
    app.get('/',function(req,res){
        console.log('get /');
        var p = req.param('p');
        var page = parseInt(p);
        var d = {};
        d.u = undefined;
        d.title = "";
        d.path = '/';
        if(req.session.user){
            d.u = {};
            d.u.name = req.session.user;
        }
        DB.Note_getTen(page,0,function(err,docs,count){
            d.docs = docs;
            res.render('index',d);
        });
    });
    app.get('/new',function(req,res){
        console.log('get /new');
        DB.NewObjectID(function(OID){
            console.log('oid:');
            console.log(OID);
            if(req.session.user){
                res.render('new',{
                    "u":{
                        "name": req.session.user,
                    },
                    "path":'/new',
                    "id":OID
                });
            }
            else{
                res.redirect('/login');
            }
        });
    });
//    app.get('/getten',function(req,res){
//        console.log('get /getten');
//        var p=req.param('p');
//        var page = parseInt(p);
//        DB.Note_getTen(page,function(err,docs){
//            var d = {msg:err,docs:docs};
//            res.send(d);
//        });
//    });
    app.post('/save',function(req,res){
        console.log('post /save');
        var title = req.param('title');
        var codes = req.param('codes');
        var tags = req.param('tags');
        var open = req.param('open');
        var user = req.session.user;
        var note = {
            title:title,
            codes:codes,
            tags:tags,
            pv:0,
            time: new Date().getTime(),
            source: {},
            user:user,
            open:open
        };
        DB.Note_save(note,function(err){
            if(err){
                res.send(err);
            }
            res.send('');
        });
    });
    app.get('/note/:id',function(req,res){
        console.log('get /note/id:'+req.params.id);
        var id = req.params.id;
        DB.Note_get(id,function(err,doc){
            res.render('note',{
                "u": {
                    "name":req.session.user
                },
                'path':'/note/',
                note:doc,
                err:err
            });
        });
    });
    app.post('/tags',function(req,res){
        console.log('post /tags');
        var tags = req.param('tags');
        DB.Note_saveTag(tags,function(err,result){
            if(err){
                //todo
            }
        });
    });
    app.get('/tag/:tag',function(req,res){
        console.log('get /tag/tag');
        var tag = req.params.tag;
        DB.Note_tag(tag,function(err,docs){
            if(err){
                res.send('');
            }
            else{
                var d = {};
                d.u = undefined;
                d.path = '/tag/';
                if(req.session.user){
                    d.u = {};
                    d.u.name = req.session.user;
                }
                d.title = "TAG: "+tag
                d.docs = docs;
                res.render('index',d);
            }
        })
    })
    app.get('/login',function(req,res){
        console.log('get /login');
        res.render('login',{
            u:null,
            path:'/login'
        });
    });
    app.post('/login',function(req,res){
        console.log('post /login');
        var name = req.param('name');
        var pwd = req.param('pwd');
        console.log('name:'+name+'pwd:'+pwd);
        DB.Coder_login(name,pwd,function(err,doc){
            if(err){
                res.send(err);
            }
            else{
                if(doc){
                    console.log(doc);
                    req.session.user = doc.name;
                    res.send('');
                }else{
                    res.send('Not exist this user or password is wrong.');
                }

            }
        });
    });
    app.get('/reg',function(req,res){
        console.log('get /reg');
        res.render('reg',{
            u:{
                name:req.session.user
            },
            path:'/reg'
        });
    })
    app.post('/reg',function(req,res){
        console.log('post /reg');
        var username = req.body.user;
        var password = req.body.pwd;
        if(username && password){
            DB.Coder_save(username,password,function(err){
                if(err){
                    res.send(err);
                }
                else{
                    res.send('');
                }
            });
        }
    });
    app.post('/zz',function(req,res){
        console.log('post /zz');
        var id = req.param('id');
        var user = req.param('user');
        console.log('id:'+id);
        console.log('user:'+user);
        DB.Note_copy(id,user,function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send('');
            }
        });
    });
    app.get('/my',function(req,res){
        console.log('get /my');
        var user = req.session.user;
        if(user){
            DB.Note_getMy(user,function(err,docs){
                if(err){
                    res.send(err);
                }
                else{
                    var d = {};
                    d.u = {};
                    d.u.name = user;
                    d.title = "我的代码段",
                    d.docs = docs;
                    d.path = '/my';
                    res.render('index',d)
                }
            });
        }
    });
    app.get('/hottags',function(req,res){
        console.log('get /hottags');
        DB.Tag_hotTags(function(err,docs){
            if(err){
                res.send('');
            }
            else{
                res.send(docs);
            }
        });
    });
    app.post('/del',function(req,res){
        var id = req.body.id;
        DB.Note_del(id,function(err){
            res.send(err);
        })
    });
    app.get('/user/:user',function(req,res){
        var user = req.params.user;
        DB.Note_getUserNote(user,0,function(err,docs,count){
            if(err){
                res.send(err);
            }
            else{
                var d = {};
                d.docs = docs;
                d.title = "用户："+user;
                d.u = {};
                if(req.session && req.session.user)
                    d.u.name = req.session.user;
                else
                    d.u = null;
                path = '/search';
                res.render('index',d);
            };
        });
    });
    app.post('/upload', function (req, res) {
        var id = req.body.id;
        //console.log(req);
        DB.File_save(req.files.upload_file.path,id,function(err,file){
            res.redirect("/upfiles/"+id);
        });
    });
    app.get('/upfiles/:id',function(req,res){
        var id = req.params.id;
        DB.File_getImages(id,function(err,files){
            //console.log('files:');
            //console.log(files);
            if(err){
                res.render('upfiles',{
                    imgs:[]
                });
//                res.send([]);
            }
            else{
                var imgs = [];
                for(var i=0;i<files.length;i++){
                    imgs.push(files[i].filename);
                }
//                res.send(imgs);
                console.log(imgs);
                res.render('upfiles',{
                    imgs:imgs
                });
            }
        });
    });
    app.get('/img/:fn',function(req,res){
        var fn = req.params.fn;
        DB.File_get(fn,function(err,data){
            if(err){
                res.writeHead('404');
            }
            else{
                res.writeHead('200',{"Content-Type":"image/jpg"});
                res.end(data,'binary');
            };
        });
    });
}