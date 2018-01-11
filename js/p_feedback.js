$(function() {
	//json
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
	//递交 
	function feedback_content_param(user_tel, feedback_content) {
		var _param = {};
		var _data = {};

		_data.user_tel = user_tel;
		_data.feedback_content = feedback_content;

		_param.action_sort = "99001";
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

	//发送内容
	function feedback_content_js(user_tel, feedback_content) {
		$.ajax({
			type: "POST",
			url: "pubConfig",
			data: feedback_content_param(user_tel, feedback_content),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				$.hideLoading();
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$("#popup_end").popup();
				} else {
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

	//发送点击事件
	$("#send_data").click(function() {
		var feedback_content = $("#feedback_content").val();
		var user_tel = $("#user_tel").val();
		if(feedback_content == "") {
			$.toast("请填写反馈内容！", "cancel");
		} else if(user_tel == "" || !user_tel.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$.toast("请输入正确的手机号！", "cancel");
		} else {
			feedback_content_js(user_tel, feedback_content);
		}
	})

	/*关闭微信浏览器*/
	$(".win_close").click(function() {
		WeixinJSBridge.call('closeWindow');
	})

	//文本字数统计
	textarea_num();

	function textarea_num() {
		var text2 = $(".weui-textarea").val();
		var counter2 = text2.length;
		$(".textarea_num").text(counter2);
		$(".weui-textarea").on('blur keyup input', function() {
			var text2 = $(".weui-textarea").val();
			var counter = text2.length;
			$(".textarea_num").text(counter);
		});
	}
})