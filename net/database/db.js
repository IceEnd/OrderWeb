/**
 * Created by Cononico on 2015/12/24.
 * MongoDB配置文件
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/order');  //连接数据库
var db = mongoose.connection;
var Schema = mongoose.Schema; // 创建模型

/**
 * type:1 管理员
 *      2 用  户
 * @type {mongoose.Schema}
 */
var userSchema = new Schema({
    name: String,
    password: String,
    type:String
});

// 与users集合关联
exports.user = db.model('users', userSchema);

/**
 * state：1 未处理订单
 *        2 已处理订单
 *        3 客户取消订单
 *        4 交易完成
 *        5 管理员取消订单
 *
 *
 * @type {mongoose.Schema}
 */
var orderSchema = new Schema({
    ordernum:String,
    username:String,
    telphone:String,
    addr:String,
    goods:Array,
    amount:Array,
    date:String,
    handler:String,
    handledate:String,
    creater:String,
    state:String,
    comdate:String,
    candate:String,
    canadmin:String
});

exports.order = db.model('orders',orderSchema);

/**
 * goodsnum:货物编号
 * goodsname:货物名称
 * goodsstock：货物库存
 * des:物品描述
 * @type {mongoose.Schema}
 */
var goodsSchema = new Schema({
    goodsnum:Number,
    goodsname:String,
    goodsstock:Number,
    des:String
});

exports.goods = db.model('goods',goodsSchema);
