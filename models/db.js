var settings = require('../settings');
var mongo = require('mongodb');
var mongodb = mongo.Db;
var Server = mongo.Server;
var ObjectID = mongo.ObjectID;

var db = new mongodb(
    settings.db,
    new Server(
        settings.host,
        settings.port,
        {
            auto_reconnect:true
        }
    ),
    {
        w:1
    }
);
db.open(function(e,d){
    if(e){

        console.log('e:');
        console.log(e);
    }
    else{
        console.log('connected to database :: '+settings.db);
    }
});

var notes = db.collection(settings.notetable);
var coder = db.collection(settings.codertable);
var tagscollection = db.collection(settings.tagtable);
var files = db.collection('fs.files');

exports.NewObjectID = function(callback){
    return callback(new ObjectID());
}

//var note = {
//    title:this.title,
//    codes:this.codes,
//    tags:this.tags,
//    pv:0,
//    time: new Date().getTime(),
//    source: this.source,
//    user:'LLS'
//};
exports.Note_save = function(doc,callback){
    notes.insert(doc,{safe:true},function(err,result){
        return callback(err);
    });
};
exports.Note_get = function(id,callback){
    var oid = new require('mongodb').ObjectID(id);
    notes.findOne({
        "_id":oid
    },function(err,doc){
        if(err){
            return callback(err);
        }
        return callback(null,doc);
    });
    notes.update({
        "_id":oid
    },{
        "$inc":{"pv":1}
    },{
        "upsert":true
    },function(){});
};
exports.Note_getTen = function(user,page,callback){
    var doc = {
        "$or":[
            {
                "user":user
            },
            {
                "open":"public"
            }
        ]
    };
    notes.count(doc,function(err,count){
        if(err){
            return callback(err);
        }
        notes.find(doc,{
            limit:20,
            sort:[["time","desc"]]
        }).toArray(function(err,docs){
            if(err){
                return callback(err);
            }
                console.log(callback);
            return callback(null,docs,count);
        });
    });
};
exports.Note_getMy = function(user,callback){
    notes.count({
        user:user
    },function(err,count){
        if(err){
            return callback(err);
        }
        notes.find({
            user:user
        },{
            limit:20,
            sort:[['time','desc']]
        }).toArray(function(err,docs){
                if(err){
                    return callback(err);
                }
                return callback(null,docs,count);
            });

    });
};
exports.Note_remove = function(id,callback){
    var oid = new require('mongodb').ObjectID(id);
    notes.remove({
        "_id":oid
    },function(err,result){
        return callback(err);
    });
};
exports.Note_saveTag = function(tags,callback){
    tags.forEach(function(tag,index){
        if(tag){
            tagscollection.update({
                tag:tag
            },{
                "$inc":{"pv":1}
            },{
                "upsert":true
            },function(){});
        };
    });
};
exports.Note_copy = function(id,u,callback){
    var oid = new require('mongodb').ObjectID(id);
    notes.findOne({
        "_id":oid
    },function(err,doc){
        if(err){
            return callback(err);
        }
        else{
            if(doc){
                doc.time = new Date().getTime();
                var id = doc._id;
                delete doc._id;
                console.log('doc source:');
                console.log(doc.source);
                if(!doc.source || !doc.source.id){
                    doc.source  = {};
                    doc.source.user = doc.user;
                    doc.source.id = id;
                }
                doc.user = u;
                console.log('new doc');
                console.log(doc);
                notes.insert(doc,function(err,result){
                   return callback(err);
                });
            }
        }
    });
};
exports.Note_del = function(id,callback){
    var oid = new require('mongodb').ObjectID(id);
    notes.remove({
        "_id":oid
    },function(err,result){
        return callback(err);
    });
};
exports.Note_tag = function(tag,callback){
    notes.find({
        tags:tag
    },{
        limit:20
    }).toArray(function(err,docs){
        if(err){
            return callback(err);
        }
        return callback(null,docs);
    })
}
exports.Tag_hotTags = function(callback){
    tagscollection.find({
    },{
        sort:[["pv",'desc']],
        limit:20
    }).toArray(function(err,docs){
        if(err){
            return callback(err);
        }
        return callback(null,docs);
    });
};
exports.Note_getUserNote = function(user,page,callback){
    notes.count({
        user:user,
        "open":"public"
    },function(err,count){
        if(err){
            return callback(err);
        }
        notes.find({
            user:user,
            open:"public"
        },{
            limit:20,
            sort:[["time","desc"]]
        }).toArray(function(err,docs){
                if(err){
                    return callback(err);
                }
                else{
                    return callback(null,docs,count);
                }
            });
    });
}
exports.Coder_login = function(name,pwd,callback){
    coder.findOne({
        name:name,
        pwd:pwd
    },function(err,doc){
        console.log(err);
        if(err){
            return callback(err);
        }
        return callback(null,doc);
    });
}
exports.Coder_save = function(name,pwd,callback){
    coder.count({
        name:name
    },function(err,count){
        if(count==0){
            coder.insert({
                name:name,
                pwd:pwd,
                avatar:'/avatar/airplane.png'
            },{safe:true},function(err,result){
                return callback(err);
            });
        }
        else{
            return callback('user exist.');
        }
    });
}
exports.Coder_set_avatar = function(coder,url,callback){
    coder.update({
            name:coder
        },
        {
        "$set":{
            avatar:url
        }
    },function(err,result){
        return callback(err);
    });
};
exports.File_save = function(file,relid,callback){
    var extname = file.substring(file.lastIndexOf('.'));
    var gridStore = new mongo.GridStore(db,new ObjectID()+extname,'w',{
        "metadata":{
            "relid":relid
        }
    });
    gridStore.open(function(err,gridStore){
        gridStore.writeFile(file,function(err,fileInfo){
            if(err){
                return callback(err);
            }
            else{
                return callback(null,fileInfo);
            }
        });
    });
};
exports.File_get = function(name,callback){
    var gs = new mongo.GridStore(db,name,'r');
    gs.open(function(err,gs){
        if(err){
            console.log(err);
        }
        else{
            gs.read(function(err,data){
                if(err){
                    return callback(err);
                }
                return callback(null,data);
            });
        }
    });
};
exports.File_getImages = function(relid,callback){
    files.find({
        "metadata.relid":relid
    }).toArray(function(err,imgs){
            if(err){
                return callback(err);
            }
            return callback(null,imgs);
        });
};

