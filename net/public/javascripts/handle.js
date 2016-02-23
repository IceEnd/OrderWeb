/**
 * Created by Cononico on 2015/12/26.
 */
function adminOrderHandle(e){
    var admin = e.getAttribute("data-admin");
    var ordernum = e.getAttribute("data-ordernum");
    console.log(ordernum);
    $.ajax({
        type:'POST',
        url:'/admin-center/orderh',
        data:{admin:admin,ordernum:ordernum},
        success:function(data){
            if(data){
                console.log("成功");
                $(e).parent().parent().slideUp(500);
            }
            else{
                console.log("处理失败，请重试！");
            }
        }
    });
}

function adminOrderCancel(e){
    var admin = e.getAttribute("data-admin");
    var ordernum = e.getAttribute("data-ordernum");
    $.ajax({
        type:'POST',
        url:'/admin-center/orderc',
        data:{admin:admin,ordernum:ordernum},
        success:function(data){
            if(data){
                console.log("成功");
                $(e).parent().parent().slideUp(500);
            }
            else{
                alert("处理失败，请重试！");
            }
        }
    });
}

function userOrderCancel(e){
    var ordernum = parseFloat(e.getAttribute("data-ordernum"));
    console.log(ordernum);
    console.log(typeof(ordernum));
    $.ajax({
        type:'POST',
        url:'/orderc',
        data:{ordernum:ordernum},
        success:function(data){
            if(data){
                alert('订单取消成功！');
                $(e).parent().find('p').html("交易已取消");
                $(e).css({"display":"none"});
                return false;
            }
            else{
                alert('操作失败，请重试！');
            }
        }
    });
}

function userOrderHandle(e){
    var ordernum = e.getAttribute("data-ordernum");
    console.log(ordernum);
    $.ajax({
        type:'POST',
        url:'/orderh',
        data:{ordernum:ordernum},
        success:function(data){
            if(data){
                alert('交易成功');
                $(e).parent().find('p').html("交易完成");
                $(e).css({"display":"none"});
            }
            else{
                alert("操作失败，请重试！");
            }
        }
    });
}