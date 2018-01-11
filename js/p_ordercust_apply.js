$(function() {
	var flag_val;
	var msg_val;
	var appid;
	appid = GetParameter('app_id');
	//获取openid
	function openid_param() {
		var _param = {};
		var _data = {};
		_param.action_sort = "10003";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	//ajax获取openid
	$(document).ready(function() {
		$.ajax({
			type: "POST",
			url: "merchant",
			data: openid_param(),
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$("#content").show();
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
			complete: function() {}
		});
	});

	/*递交申请*/
	function user_apply_param() {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');

		/*申请信息数组定义*/
		var cust_name = $("#cust_name").val(); //姓名
		var cust_address = $("#cust_address").val(); //地址
		var cust_con = $("#cust_con").val(); //联系人
		var cust_tel = $("#cust_tel").val(); //电话
		var cust_others = $("#cust_others").val(); //备注

		/*json对象获取*/
		_data.cust_name = cust_name;
		_data.cust_address = cust_address;
		_data.cust_con = cust_con;
		_data.cust_tel = cust_tel;
		_data.cust_others = cust_others;

		_param.action_sort = "50101";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);

		return _param;
	}

	function user_apply() {

		//console.log("申请数组"，json_data)
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: user_apply_param(),
			beforeSend: function() {
				$.showLoading();
			},
			url: "shop",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				$.hideLoading();
				if(flag_val == 1) {
					msg_val = "申请已递交，请等待审核。";
					window.location.href = "p_ordercheck.html?msg=" + msg_val;
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.hideLoading();
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {}
		});
	}
	/*内容判断*/
	$("#upfrom").click(function() {
		var cust_name = $("#cust_name").val();
		var cust_address = $("#cust_address").val();
		var cust_tel = $("#cust_tel").val();
		var cust_con = $("#cust_con").val();
		if(cust_name == "") {
			$(".shop_prompt").text("请输入名称");
		} else if(cust_address == "") {
			$(".shop_prompt").text("请输入联系地址");
		} else if(cust_con == "") {
			$(".shop_prompt").text("请输入联系人");
		} else if(cust_tel == "" || !cust_tel.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$(".shop_prompt").text("请输入正确手机号");
		} else {
			user_apply();
			$(".shop_prompt").text("");
		}
	})
})