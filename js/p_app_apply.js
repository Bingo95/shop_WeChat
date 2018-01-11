$(function() {
	/*json*/
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
	//递交申请数据
	function app_apply_param() {
		var _param = {};
		var _data = {};
		var app_name = $("#app_name").val();
		var app_tel = $("#app_tel").val();

		_data.app_name = app_name;
		_data.app_tel = app_tel;

		_param.action_sort = "10002";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	//页面加载获取openid。取到显示内容
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
					$("body").show();
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

	/*ajax*/
	function app_apply_js() {
		$.ajax({
			type: "POST",
			url: "merchant",
			data: app_apply_param(),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("递交信息", data)
				if(flag_val == 1) {
					$.hideLoading();
					$.toast("申请成功", function() {
						window.location.href = "p_merchantenter.html";
					})
				} else {
					$.hideLoading();
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.hideLoading();
				$.alert("服务器忙碌，请稍后再试!");
			},
			complete: function() {}
		});
	}

	//js
	//提交点击事件
	$("#upfrom").click(function() {
		var app_name = $("#app_name").val();
		var app_tel = $("#app_tel").val();
		if(app_name == "") {
			$.toast("请输入网店信息", "cancel");
		} else if(app_tel == "" || !app_tel.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$.toast("请输入正确手机号", "cancel");
		} else {
			app_apply_js();
		}
	});

	//分享显示隐藏遮罩层
	$("#share").click(function() {
		$(".over_liny").show();
	});

	$(".over_liny").click(function() {
		$(".over_liny").hide();
	});
})