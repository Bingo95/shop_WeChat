$(function() {

	/*json*/
	function shopenterlist_param() {
		var _param = {};
		var _data = {};

		_param.action_sort = "40100";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	/*ajax*/
	//获取网店列表
	$("#shopenterlist").ready(function() {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: shopenterlist_param(),
			beforeSend: function() {
				$.showLoading();
			},
			url: "shop",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("网店信息", data)
				if(flag_val == 1) {
					$(".weui-cells__title").show();
					var app_stat;
					var _data = data.Data;
					var shopenterlist = $("#shopenterlist");
					//判断是否存在多家网点，不存在啧进入网店。
					if(_data.length == 1) {
						shopenter_click(_data[0].app_id);
					} else {
						for(var i = 0; i < _data.length; i++) {
							if(_data[i].stat == 0) {
								app_stat = "";
							} else {
								app_stat = "（待审核）";
							}

							shopenterlist.append(
								"<a class='weui-cell weui-cell_access' href='javascript:shopenter_click(" + _data[i].app_id + "," + _data[i].stat + ");'>" +
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

/*颜色*/
function text_color() {
	$(".weui-cell__bd:contains('待审核')").css("color", "#b8b8b8");
}
/*点击事件*/
function shopenter_click(appid, appstat) {
	if(appstat == 1) {

	} else {
		var num = Math.random();
		window.location.href = "p_orderprodsearch.html?app_id=" + appid + "&random=" + num;
	}
}