/**
 * Created by Cononico on 2015/12/25.
 */
var express = require('express');
var router = express.Router();

var order = require('../database/db.js').order;
var goods = require('../database/db.js').goods;
var user = require('../database/db.js').user;

/* GET users listing. */
router.post('/', function(req, res, next) {
    var query = {name: req.body.name, password: req.body.password,type:req.body.type};
    (function(){
        user.count(query, function(err, doc){
            if(doc == 1){
                console.log(query.name + ": login success in " + new Date());
                var handleQuery = {};
                var orderQuery = {};
                req.session.user = req.body.name;
                req.session.type = 1;
                console.log("session设置成功"+req.session.user);
                order.find({"state":"1"},function(err,docs){
                    handleQuery = docs;
                    order.find(function(err,docs){
                        orderQuery = docs;
                        //console.log(orderQuery);
                        //console.log(handleQuery);
                        res.render('admin-center',{title:req.body.name,handleItems:handleQuery,allItems:orderQuery});
                    });
                });
            }else{
                console.log(query.name + ": login failed in " + new Date());
                res.render('index',{title:'用户名或密码错误'});
            }
        });
    })(query);
});

router.get('/',function(req,res,next){
    if(req.session.type == 1){
        order.find({"state":"1"},function(err,docs){
            var handleQuery = {};
            var orderQuery = {};
            handleQuery = docs;
            order.find(function(err,docs){
                orderQuery = docs;
                //console.log(orderQuery);
                //console.log(handleQuery);
                res.render('admin-center',{title:req.session.user,handleItems:handleQuery,allItems:orderQuery});
            });
        });
    }
    else{
        res.render('index',{title:'请登录'});
    }
});


router.post('/orderh',function(req,res,next){
    var admin = req.body.admin;
    var ordernum = req.body.ordernum;
    var date = new Date();
    var sdate = date.getFullYear() + '/' + (date.getMonth()+1) + '/'+date.getDate() +' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    console.log("ajax 成功！"+ordernum+"  "+sdate);
    order.update({ordernum:ordernum},{state:'2',handler:admin,handledate:sdate},function(err,doc){
        if(err){
            res.send(false);
        }else{
            res.send(true);
        }
    });
});

router.post('/orderc',function(req,res,next){
    var admin = req.body.admin;
    var ordernum = req.body.ordernum;
    var date = new Date();
    var sdate = date.getFullYear() + '/' + (date.getMonth()+1) + '/'+date.getDate() +' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    console.log("ajax 成功！"+req.body.ordernum+"  "+sdate);
    order.update({"ordernum":ordernum},{'state':'5','canadmin':admin,'candate':sdate},function(err,doc){
        if(err){
            res.send(false);
        }else{
            res.send(true);
        }
    });
});

router.get('/goods',function(req,res,next){
    if(req.session.user){
        goods.find({},function(err,docs){
            var goodsquery = {};
            goodsquery = docs;
            res.render('add-goods',{user:req.session.user,goods:goodsquery});
        });
    }
    else{
        res.redirect('..')
    }
});

router.post('/addgoods',function(req,res,next){
    goods.count({},function(err,doc){
        var goodsnum = doc + 1;
        //console.log(req.body.goodsname);
        //console.log(req.body.goodsdes);
        //console.log(req.body.goodsstack);
        //console.log(typeof(req.body.goodsstack));
        var goo = new goods({
            goodsnum:goodsnum,
            goodsname:req.body.goodsname,
            goodsstock:req.body.goodsstock,
            des:req.body.goodsdes
        });
        console.log(goo);
        goo.save();
        res.send(true);
    });
});

router.post('/addstock',function(req,res,next){
    var goodsnum = req.body.goodsnum;
    var goodsstock = req.body.goodsstock;
    console.log(goodsnum);
    console.log(goodsstock);
    if(goodsnum.length == 1){
        goods.update({goodsnum:goodsnum},{goodsstock:goodsstock},function(err,doc){});
        res.send(true);
    }
    else if(goodsnum.length > 1){
        for(var i = 0; i < goodsnum.length; i++){
            goods.update({goodsnum:goodsnum[i]},{goodsstock:goodsstock[i]},function(err,doc){});
        }
        res.send(true);
    }
    else{
        res.send(false);
    }
});

module.exports = router;