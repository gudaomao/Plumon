var mongodb = require('./db');
module.exports = Note;
function Note(title,codes){
    this.title = title;
    this.codes = codes;
}

Note.prototype.save = function(callback){
    mongodb.open(function(err,db){
        if(err){
            callback(err);
        }
        db.collection('notes',function(err,collection){
            if(err){
                mongodb.close();
                callback(err);
            }
            var doc = {
                title: this.title,
                codes: this.codes
            };
            collection.insert({},{safe:true},function(err,result){
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null);
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
            collection.find({

            },{
                limit:10,
                skip: page*10
            })
            .sort(function(){
                time:-1
            })
            .toArray(function(err,docs){
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