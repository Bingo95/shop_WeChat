//flag参数判断
function flag_type(flag_val, msg_val) {
	//var url = window.location.pathname;
	var url = window.location.href; //获取带参数文件名
	var page = url.substring(url.lastIndexOf('/') + 1, url.length);
	//console.log(flag_val)
	//console.log(msg_val)
	if(flag_val == -1) { //
		window.location.href = "redirectPage.jsp?page=" + page;
	} else if(flag_val == -3) { //购物申请
		var appid;
		appid = GetParameter('app_id');
		window.location.href = "p_ordercust_apply.html?app_id=" + appid;
	} else if(flag_val == -4) { //审核
		window.location.href = "p_ordercheck.html?msg=" + msg_val;
	} else if(flag_val == -13) { //商家申请
		window.location.href = "p_app_apply.html";
	} else if(flag_val == -11) { //获取openid
		window.location.href = "redirectPage2.jsp?page=" + page;
	} else {
		$.toast(msg_val, "cancel");
	}
}

//返回上一页
$(".history_back").click(out_history);

function out_history() {
	window.history.back(-1);
}

//获取url参数
function GetParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURIComponent(r[2]);
	return null;
}

/*输入小数和数字*/
function clearNoNum(obj) {
	//修复第一个字符是小数点 的情况.  
	if(obj.value != '' && obj.value.substr(0, 1) == '.') {
		obj.value = "";
	}
	obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效  
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的       
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数       
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		if(obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
			obj.value = obj.value.substr(1, obj.value.length);
		}
	}
}

/*只能输入正整数*/
function integer_number(name) {
	if(!name.val().match(/^\d*$/)) {
		$.trim(name.val(1));
	}
}

var app_id = GetParameter('app_id');

$(".out_homepage").click(function() {
	window.location.href = "p_homepage_order.html?app_id=" + app_id;
})

$(".merchant_nav_title label").click(function() {
	window.location.href = "p_homepage_order.html?app_id=" + app_id;
})

//ajax
var getData = function(ajaxobj) {
	var dfd = $.Deferred();
	$.ajax({
		type: 'post',
		dataType: "json",
		data: ajaxobj.param,
		contentType: "application/json",
		url: ajaxobj.ajaxurl,
		success: function(data) {
			flag_val = data.Flag;
			msg_val = data.Msg;
			if(flag_val == 1) {
				dfd.resolve(data);
			} else {
				flag_type(flag_val, msg_val);
			}
		},
		error: function() {
			alert("服务器忙碌，请稍候重试！");
		}
	});
	return dfd.promise();
}