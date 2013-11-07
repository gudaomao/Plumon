var mongodb = require('./db');
module.exports = Note;
function Note(title,codes,tags,source){
    this.title = title;
    this.codes = codes;
    this.tags = tags;
    this.source =source;
}

Note.prototype.save = function(callback){
    console.log('start save');
    var note = {
        title:this.title,
        codes:this.codes,
        tags:this.tags,
        pv:0,
        time: new Date().getTime(),
        source: this.source,
        user:'LLS'
    };
    mongodb.open(function(err,db){
        if(err){
            console.log('err:'+err);
            return callback(err);
        }
        console.log('db openned');
        db.collection('notes',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('collection:notes');
            console.log('title:'+note.title);
            console.log('content:'+note.codes);

            collection.insert(note,{safe:true},function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            });
        });
    });
}

Note.get = function(title,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('notes',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                title:title
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            });
            collection.update({
                title:title
            },{
                $inc:{pv:1}
            },{
                upsert:true
            });
        });
    });
}

Note.getLastOne = function(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('notes',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                user:"LLS"
            },{
                sort:[['time',-1]]
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(doc);
            })
//            collection.findOne({
//
//            }).sort({
//                    time:-1
//                },function(err,doc){
//                mongodb.close();
//                if(err){
//                    return callback(err);
//                }
//                return callback(null,doc);
//            });
        });
    });
}
Note.getTen = function(page,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('notes',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('finding');
            collection.find({},{
                limit:20,
                sort:[['time',-1]]
            })
            .toArray(function(err,docs){
                    console.log('get ten occure error:');
                    console.log(err);
                //console.log(docs);
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs);
            });
        });
    });
}

Note.remove = function(title,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('notes',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                title:title
            },function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            });
        });
    });
}
Note.tagit = function(tags,callback){
    console.log('model author tag start. ');
    console.log(tags);
    mongodb.open(function(err,db){
        if(err){
            callback(err);
        }
        db.collection('tags',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err)
            }
            tags.forEach(function(tag,index){
                if(tag){
                collection.update({
                    tag:tag
                },{
                    "$inc":{"pv":1}
                },{
                    "upsert":true
                });
                }
            });
            mongodb.close();
        });
    });
}
