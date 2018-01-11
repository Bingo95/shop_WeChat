$(function() {
	/*json*/
	//二维码信息
	function orderQRcode_param() {
		var _param = {};
		var _data = {};

		_param.action_sort = "50110";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	/*ajax*/
	$(document).ready(function() {
		$.ajax({
			type: "POST",
			url: "shop",  
			data: orderQRcode_param(),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("二维码信息", data)
				if(flag_val == 1) {
					$(".merchant_QRcode").attr("src",data.Data);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
			complete: function() {
				$.hideLoading();
			}
		});
	});
})