$(function() {
	//获取提示信息
	var apply_text = GetParameter('msg');
	$(".apply_text").text(apply_text);

	/*用户信息*/
	function user_mesg_param() {
		var _param = {};
		var _data = {};

		_param.action_sort = "901201";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	$.ajax({
		type: 'post',
		dataType: "json",
		contentType: "application/json",
		data: user_mesg_param(),
		url: "pubConfig",
		success: function(data) {
			flag_val = data.Flag;
			msg_val = data.Msg;
			if(flag_val == 1) {
				var _data = data.Data;
				//console.log("用户信息", data)
				$(".shop_manadd_herd").attr("src", _data.headimgurl);
				$(".nickname").text(_data.nickname);
			} else {
				flag_type(flag_val, msg_val);
			}
		},
		error: function() {
			$.alert("服务器忙碌，请稍候重试！");
		},
		complete: function() {}
	});
})