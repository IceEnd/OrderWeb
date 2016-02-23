/**
 * Created by Cononico on 2015/12/24.
 */
(function(){
    $('.login_a').click(function () {
        $('.index_action').stop(true,false).animate({"left":"0"},500);
    });
    $('.res_a').click(function(){
        $('.index_action').stop(true,false).animate({"left":"-700"},500);
    });

    $('.login_form').submit(function () {
        if($('.login_form_name').val() == '' || $('.login_form_passwd').val() == ''){
            alert("不能为空");
            return false;
        }
        else{
            if($('.login_form select').val() == 1){
                $('.login_form').attr('action','admin-center');
                console.log('sss');
                return true;
            }
            return true;
        }
    });

    $('.register_form').submit(function(){
        if($('.register_name').val() == '' || $('.register_pwd').val() == '' || $('.register_pwd2').val() == ''){
            alert('不能为空');
            return false;
        }
        if($('.register_pwd').val() != $('.register_pwd2').val()){
            alert('两次密码不一样');
            return false;
        }
    });

    $('.order_nav_handle').click(function(){
        $('.admin_nav a').removeClass('admin_nav_on');
        $(this).addClass('admin_nav_on');
        $('.admin_ul').stop(true,false).animate({"left":"0"},500);
    });

    $('.order_nav_all').click(function(){
        $('.admin_nav a').removeClass('admin_nav_on');
        $(this).addClass('admin_nav_on');
        $('.admin_ul').stop(true,false).animate({"left":"-100%"},500);
    });

    $('.add_order_form').submit(function(){
        if($('.order_user').val() == '' || $('.order_tel').val() == '' || $('.order_addr').val() == ''){
            alert("用户信息不能为空");
            return false;
        }
        else{
            var user = $('.order_user').val();
            var tel = $('.order_tel').val();
            var addr = $('.order_addr').val();
            var ids = [];
            var nums = [];
            var names = [];
            var sums = [];
            var inputs = $('.order_input');
            console.log(inputs.length);
            for(var i = 0; i < inputs.length; i++){
                if(inputs[i].value == 0){
                    console.log('ss');
                    continue;
                }
                else{
                    ids.push(parseFloat(inputs[i].getAttribute("data-id")));
                    nums.push(parseFloat(inputs[i].value));
                    names.push(inputs[i].getAttribute("data-name"));
                    sums.push(parseFloat(inputs[i].getAttribute("data-max")) - parseFloat(inputs[i].value));
                }
            }
            console.log(user+' '+tel+' '+addr);
            console.log(ids);
            console.log(nums);
            console.log(names);
            console.log(sums);
            $.ajax({
                type:'POST',
                url:'/orders',
                dataType:'json',
                traditional:true,
                data:{user:user,
                      tel:tel,
                      addr:addr,
                      ids:ids,
                      nums:nums,
                      names:names,
                      sums:sums
                },
                success:function(data){
                    if(data.result){
                        alert('交易成功');

                        if(data.type == "1"){
                            location.href="/admin-center";
                        }
                        else{
                            location.href="/center";
                        }
                    }
                    else{
                        alert("操作失败，请重试！");
                    }
                }
            });
            return false;
        }
    });

    $('.add_goods_form').submit(function(){
        if($('.goodsname').val() == '' || $('.goodsdes').val() == '' || $('.goodsstack').val() == ''){
            alert('商品信息不能为空');
            return false;
        }
        else{
            var goodsname = $('.goodsname').val();
            var goodsdes = $('.goodsdes').val();
            var goodsstock = parseInt($('.goodsstock').val());
            console.log(goodsname + "  " + goodsdes +"  " +goodsstock);
            $.ajax({
                type:'POST',
                url:'/admin-center/addgoods',
                dataType:'json',
                traditional:true,
                data:{
                    goodsname:goodsname,
                    goodsdes:goodsdes,
                    goodsstock:goodsstock
                },
                success:function(data){
                    if(data){
                        alert('操作成功');
                        location.reload();
                        return false;
                    }
                    else{
                        alert('操作失败！');
                    }
                }
            });
            return false;
        }
    });

    $('.add_stack_form').submit(function(){
        var inputs = $('.goods_input');
        if(inputs.length == 0){
            alert("没有商品！");
            return false;
        }
        else{
            var flag = false;
            for(var i = 0; i < inputs.length; i++){
                if(inputs[i].value != ''){
                    flag = true;
                    break;
                }
            }
            if(flag){
                var goodsnum = [];
                var goodsstock = [];
                var tem;
                for(var i = 0; i < inputs.length; i++){
                    if(inputs[i].value == "0"){
                        console.log('ss');
                        continue;
                    }
                    else{
                        goodsnum.push(parseInt(inputs[i].getAttribute("data-id")));
                        tem = parseInt(inputs[i].getAttribute("data-yu")) + parseInt(inputs[i].value);
                        goodsstock.push(tem);
                    }
                }
                console.log(goodsnum);
                console.log(goodsstock);
                $.ajax({
                    type:'POST',
                    url:'/admin-center/addstock',
                    dataType:'json',
                    traditional:true,
                    data:{
                        goodsnum:goodsnum,
                        goodsstock:goodsstock
                    },
                    success:function(data){
                        if(data){
                            alert("添加成功！");
                            location.reload();
                        }
                        else{
                            alert("操作失败");
                            return false;
                        }
                    }
                });
            }
            else{
                alert("没有增加库存！");
                return false;
            }
        }
    });
})(jQuery);
