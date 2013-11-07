var mongodb = require('./db');
function Coder(){

}
module.exports = Coder;

Coder.login = function(name,pwd,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name,
                pwd:pwd
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
Coder.save = function(name,pwd,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.count({
                name:name
            },function(err,count){
                if(count==0){
                    collection.insert({
                        name:name,
                        pwd:pwd,
                        avatar:'/avatar/airplane.png'
                    },{safe:true},function(err,result){
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
                else{
                    mongodb.close();
                    return callback('user exist.');
                }
            });
        });
    });
}
Coder.avatar = function(url,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                "$set":{
                    avatar:url
                }
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