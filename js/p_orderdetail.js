$(function() {
	var app_id = GetParameter('app_id');
	$(document).ready(function() {
		/*获取url参数*/
		var data_num = GetParameter('data_num');

		if(data_num == null) {
			$.alert("订单未生成！");
		} else {
			//console.log(data_num);
			detail_content(data_num);
		}
	})

	/*获取信息*/
	function detail_content_param(data_num) {
		var _param = {};
		var _data = {};
		_data.ordercode = data_num;
		_param.action_sort = "40106";
		_param.data = _data;
		_param.app_id = app_id;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	//订单详情
	function detail_content(data_num) {
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: detail_content_param(data_num),
			beforeSend: function() {
				$.showLoading();
			},
			url: "shop",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					//console.log("订单列表", data)
					var _data = data.Data.Detail;
					//列表填充
					var listcontent = $("#detail_list_content");
					for(var i = 0; i < _data.length; i++) {
						listcontent.append(
							"<div class='weui-flex shop_detail_list_box'>" +
							"<div class='weui-flex__item'>" +
							"<div class='shop_detail_img-box'>" +
							"<img src=" + _data[i].prodpic + " class='shop_detail_img' />" +
							"</div>" +
							"</div>" +
							"<div class='weui-flex__item shop_detail_cont'>" +
							"<div class='weui-flex'>" +
							"<label>" + _data[i].prodname + "</label>" +
							"</div>" +
							"<div class='weui-flex mag_top_dow10'>" +
							"<label>" + (_data[i].prodpriceout).toFixed(2) + "</label>" +
							"<span class='text_mag_rt_add5'>元 /" + _data[i].unit + "</span>" +
							"<label> x </label>" +
							"<label>" + _data[i].amount + "</label>" +
							"<span>" + _data[i].unit + "</span>" +
							"<label class='text_mag_lt_add5'>=</label>" +
							"<label class='text_mag_lt_add5'>" + (_data[i].cost).toFixed(2) + "</label>" +
							"<span>元 </span>" +
							"</div>" +
							"</div>" +
							"</div>"
						);
					}
					//用户头像信息
					panel_heardimg = data.UserInfo.headimgurl;
					panel_username = data.UserInfo.nickname;
					panel_company = data.UserInfo.app_name;
					panel_user_mesg(panel_company, panel_heardimg, panel_username)
					//用户信息填充
					var senddate = (data.Data.senddate).substring(0, 10);
					if(senddate == "1900-01-01") {
						senddate = "-";
					}

					$(".totalmoney").text(data.Data.totalmoney);
					$(".senddate").text(senddate);
					$(".receiver_name").text(data.Data.receiver_name);
					$(".receiver_mobile").text(data.Data.receiver_mobile);
					$(".receiver_address").text(data.Data.receiver_address);
					$(".orderothers").text(data.Data.orderothers);
					$(".ordercode").text(data.Data.ordercode);
					appid = data.App_id;
					shop_end(appid);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				$.hideLoading();
			}
		});
	}

	//点击返回商城
	function shop_end(appid) {
		$(".shop_detail_btn").click(function() {
			window.location.href = "p_orderprodsearch.html?app_id=" + appid;
		})
	}
})