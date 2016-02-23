var express = require('express');
var router = express.Router();

var user = require('../database/db.js').user;
var order = require('../database/db.js').order;
var goods = require('../database/db.js').goods;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '订货管理系统' });
});

/*登陆*/
router.post('/center', function (req,res,next) {
  console.log("User: "+req.body.name+","+req.body.password+","+req.body.type);
  var query = {name: req.body.name, password: req.body.password,type:req.body.type};
  (function(){
    user.count(query, function(err, doc){
      if(doc == 1){
        console.log(query.name + ": login success in " + new Date());
        order.find({"username":req.body.name},function(err,docs){
          //console.log(docs);
          req.session.user = req.body.name;
          req.session.type = 2;
          //console.log(req.session.user);
          res.render('center', {username:req.body.name,orderItems:docs});
        });
      }
      else{
        console.log(query.name + ": login failed in " + new Date());
        console.log(doc);
        res.render('index',{title:'用户名或密码错误'});
      }
    });
  })(query);
});

/* 返回中心 */
router.get('/center',function(req,res,next){
  if(req.session.user){
    order.find({"username":req.session.user},function(err,docs){
      res.render('center', {username:req.session.user,orderItems:docs});
    });
  }
  else{
    res.render('index',{title:'请登录'});
  }
});

/*注册*/
router.post('/register',function(req,res){
  console.log("User: "+req.body.name+","+req.body.password+","+req.body.type);
  var query = {name: req.body.name, type:req.body.type};
  (function(){
    user.count(query,function(err,doc){
      if(doc >= 1){
        console.log(query.name + ": 用户名重复 " + new Date());
        res.render('index',{title:'用户名已占用'});
      }
      else{
        var u = new user({
          name:req.body.name,
          password: req.body.password,
          type:req.body.type
        });
        u.save();
        res.render('index',{title:'注册成功'});
      }
    });
  })(query);
});

router.get('/logout',function(req,res,next){
  delete req.session.user;
  delete req.session.type;
  console.log("session删除成功！");
  res.redirect('/');
});

/*用户取消订单*/
router.post('/orderc',function(req,res){
  var ordernum =  req.body.ordernum;
  console.log('sssssssssss用户取消订单:'+ordernum);
  console.log(typeof(ordernum));
  var date = new Date();
  var sdate = date.getFullYear() + '/' + (date.getMonth()+1) + '/'+date.getDate() +' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  order.update({"ordernum":ordernum},{"state":"3","candate":sdate},function(err,doc){
    if(err){
      res.send(false);
    }
    else{
      res.send(true);
    }
  });
});

/* 确认收货 */
router.post('/orderh',function(req,res){
  var ordernum =  req.body.ordernum;
  var date = new Date();
  var sdate = date.getFullYear() + '/' + (date.getMonth()+1) + '/'+date.getDate() +' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  order.update({"ordernum":ordernum},{"state":"4","comdate":sdate},function(err,doc){
    if(err){
      res.send(false);
    }
    else{
      res.send(true);
    }
  });
});

/* 新建订单 */
router.get('/add',function(req,res,next){
  if(req.session.user){
    var user = req.session.user;
    var type = req.session.type;
    console.log(user+"   "+ type);
    goods.find({},function(err,docs){
      //console.log(docs);
      res.render('add-order',{user:user,type:type,goods:docs});
    });
  }
  else{
    console.log('返回主页');
    res.redirect('/');
  }
});


/*提交订单 */
router.post('/orders',function(req,res){
  var date = new Date();
  var sdate = date.getFullYear() + '/' + (date.getMonth()+1) + '/'+date.getDate() +' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  order.count({},function(err,doc){
    if(err){
      res.send(false);
    }
    else{
      var ordercount = doc;
      ordercount++;
      console.log(ordercount);
      if(req.session.type == "1"){
        var ord = new order({
          ordernum:ordercount,
          username:req.body.user,
          telphone:req.body.tel,
          addr:req.body.addr,
          goods:req.body.names,
          amount:req.body.nums,
          creater:req.session.user,
          date:sdate,
          state:'1'
        });
      }
      else if(req.session.type == "2"){
        var ord = new order({
          ordernum:ordercount,
          username:req.session.user,
          telphone:req.body.tel,
          addr:req.body.addr,
          goods:req.body.names,
          amount:req.body.nums,
          creater:req.session.user,
          date:sdate,
          state:'1'
        });
      }
      else{
        res.send({result:false});
      }
      var ids = req.body.ids;
      var nums = req.body.nums;
      var sums = req.body.sums;
      console.log(ids);
      console.log(sums);
      if(ids.length == 1){
        goods.update({"goodsnum":ids},{"goodsstock":sums},function(err,doc){});
        console.log(sums);
      }
      else if(ids.length > 1){
        for(var i = 0; i < ids.length; i++){
          goods.update({"goodsnum":ids[i]},{"goodsstock":sums[i]},function(err,doc){});
          console.log(sums[i]);
        }
      }
      else{
        res.send({result:false});
      }

      ord.save();
      console.log(ord);
      res.send({result:true,type:req.session.type});
    }
  });
});

module.exports = router;