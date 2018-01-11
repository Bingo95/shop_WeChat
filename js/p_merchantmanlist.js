$(document).ready(function() {
	get_list();
});

function get_list() {

	// alert("mechant");

	$.ajax({
		type: "POST",
		url: "merchant",
		contentType: "application/json",
		data: param_list(),
		beforeSend: function() {
			$.showLoading();
		},
		dataType: "json",
		success: function(data) {
			console.log("列表", data)
			var obj = data;
			if(obj.Flag == "1") {

				//alert("ok"); 	

				var headimgurl = "";
				var inputdate = "";
				var last_operator = "";
				var lastdate = "";
				var nickname = "";
				var openid = "";
				var stat = "";
				var stat_val = "";

				var d_val = "";
				var myobj = obj.Data;

				for(var i = 0; i < myobj.length; i++) {

					headimgurl = myobj[i].headimgurl;
					inputdate = (myobj[i].inputdate).substring(0, 19);
					last_operator = myobj[i].last_operator;
					lastdate = (myobj[i].lastdate).substring(0, 19);
					nickname = myobj[i].nickname;
					openid = myobj[i].openid;
					stat = myobj[i].stat;

					if(stat == "1") {
						stat_val = "待审核";
					} else if(stat == "0") {
						stat_val = "已通过";
					} else {
						stat_val = "不通过";
					}

					// alert(stat_val);

					if(stat == "1") {
						d_val = d_val + "<div class=\"weui-panel merchant_man_padding\" onclick=\"get_listcheck('" + openid + "','" + nickname + "');\">";
					} else if(stat == "0") {
						d_val = d_val + "<div class=\"weui-panel merchant_man_padding\" onclick=\"out_listcheck('" + openid + "','" + nickname + "');\">";
					} else {
						d_val = d_val + "<div class=\"weui-panel merchant_man_padding\">";
					}

					d_val = d_val + "<div class=\"weui-flex\">";
					d_val = d_val + "<div class=\"weui-flex__item\">";
					d_val = d_val + "<div>";
					d_val = d_val + "<img src=\"" + headimgurl + "\" class=\"merchant_man_head\"/>";
					d_val = d_val + "</div>";
					d_val = d_val + "</div>";
					d_val = d_val + "<div class=\"weui-flex__item merchant_man_name\">";
					d_val = d_val + "<div class=\"float_lt merchant_man_name_text\">";
					d_val = d_val + "<label>" + nickname + "</label>";
					d_val = d_val + "</div>";
					d_val = d_val + "</div>";
					d_val = d_val + "<div class=\"float_rt\">"

					d_val = d_val + "<div class=\"float_lt merchant_man_name_text\">";
					d_val = d_val + "<label class='merchant_color'>" + stat_val + "</label>";
					d_val = d_val + "</div>";

					d_val = d_val + "</div></div>";

					d_val = d_val + "<div class=\"weui-flex\">";
					d_val = d_val + "<div class=\"weui-flex__item merchant_man_time\">";
					d_val = d_val + "<div><label>" + inputdate + "</label></div>";
					d_val = d_val + "</div>";
					d_val = d_val + "<div class=\"weui-flex__item merchant_man_time\">";
					d_val = d_val + "<div class=\"float_rt\">";
					if(lastdate != "") {
						d_val = d_val + "更新:<label>" + lastdate + "</label>";
					}
					d_val = d_val + "</div></div></div></div></div>";
				}

				$("#list").html(d_val);

			} else {
				alert(obj.Msg);
			}

		},
		complete: function() {
			$.hideLoading();
			text_color();
		},
		error: function() {
			$.alert("服务器忙碌，请稍后再试!");
		},
	});
}

function param_list() {

	var _param = {};
	var _data = {};

	_param.action_sort = "10502";
	_param.data = _data;
	_param = JSON.stringify(_param);
	console.log("json", _param)
	return _param;
}
//////////////////////////////
function get_listcheck(openid, nickname) {
	$.modal({
		title: "审核信息",
		text: "通过【" + nickname + "】的申请？",
		buttons: [{
				text: "通过",
				onClick: function() {
					get_listchecksave(openid, 0)
				}
			},
			{
				text: "不通过",
				className: "warn",
				onClick: function() {
					get_listchecksave(openid, 2)
				}
			},
			{
				text: "取消",
				className: "default"
			},
		]
	});

}

function out_listcheck(openid, nickname) {
	$.modal({
		title: "审核信息",
		text: "是否撤销【" + nickname + "】的申请？",
		buttons: [{
				text: "撤销",
				onClick: function() {
					get_listchecksave(openid, 1)
				}
			},
			{
				text: "取消",
				className: "default"
			},
		]
	});

}
////////////////////////////////
function get_listchecksave(openid, stat) {
	$.ajax({
		type: "POST",
		url: "merchant",
		data: param_listchecksave(openid, stat),
		beforeSend: function() {
			$.showLoading();
		},
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			var obj = data;
			if(obj.Flag == "1") {
				$.toast("审核完成!");
				get_list();
			} else {
				$.alert(obj.Msg);
			}
		},
		complete: function() {
			$.hideLoading();
		},
		error: function() {
			$.alert("服务器忙碌，请稍后再试!");
		},
	});
}

function param_listchecksave(openid, stat) {
	var _param = {};
	var _data = {};
	_data.openid = openid;
	_data.stat = stat;

	_param.action_sort = "10503";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}

/*颜色*/
function text_color() {
	$(".merchant_color:contains('已通过')").css("color", "#1AAD19");
	$(".merchant_color:contains('待审核')").css("color", "red");
}
text_color();