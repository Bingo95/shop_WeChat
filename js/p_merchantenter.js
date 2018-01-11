$(function() {
	/*json*/
	//商店列表获取
	function merchantenterlist_param() {
		var _param = {};
		var _data = {};

		_param.action_sort = "10000";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	/*ajax*/
	//商店信息获取ajax
	$("#merchantenterlist").ready(function() {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: merchantenterlist_param(),
			beforeSend: function() {
				$.showLoading();
			},
			url: "merchant",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("商家信息", data)
				if(flag_val == 1) {
					$(".weui-cells__title").show();
					var app_stat;
					var _data = data.Data;
					var merchantenterlist = $("#merchantenterlist")
					if(_data.length == 1) {
						merchantenter_click(_data[0].app_id);
					} else {
						for(var i = 0; i < _data.length; i++) {
							//审核状态文字替换
							if(_data[i].app_stat == 0) {
								app_stat = "";
							} else {
								app_stat = "（待审核）";
							}
							merchantenterlist.append(
								"<a class='weui-cell weui-cell_access' href='javascript:merchantenter_click(" + _data[i].app_id + "," + _data[i].stat + ");'>" +
								"<div class='weui-cell__bd'>" +
								"<p>" + _data[i].app_name + " <label class='app_stat'>" + app_stat + "</label></p>" +
								"</div>" +
								"<div class='weui-cell__ft'>" +
								"</div>" +
								"</a>"
							)
						}
					}
					$.hideLoading();
				} else {
					$.hideLoading();
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.hideLoading();
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				text_color();
			}
		});
	})
})

/*文字颜色*/
function text_color() {
	$(".weui-cell__bd:contains('待审核')").css("color", "#b8b8b8");
}

//商城入口跳转
function merchantenter_click(appid, appstat) {
	if(appstat == 1) {} else {
		//赋予随机数，防止缓存
		var num = Math.random();
		window.location.href = "p_homepage_order.html?app_id=" + appid + "&random=" + num;
	}
}