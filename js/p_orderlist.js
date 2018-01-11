$(function() {
	var app_id = GetParameter('app_id');
	/*json*/
	/*订单列表*/
	function orderlist_param(page_no) {
		var _param = {};
		var _data = {};
		_data.page_size = 10;
		_data.page_no = page_no;

		_param.action_sort = "40107";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	/*订单详情*/
	function order_detail_param(ordercode) {
		var _param = {};
		var _data = {};
		_data.ordercode = ordercode;

		_param.action_sort = "40108";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*ajax*/
	/*订单列表*/
	var page_no = 1;
	$("#orderlist_content").ready(orderlist_list(page_no));

	function orderlist_list(page_no) {
		$.ajax({
			type: "post",
			dataType: "json",
			data: orderlist_param(page_no),
			contentType: "application/json",
			url: "shop",
			success: function(data) {
				//console.log("订单列表", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data.List;
					var listcontent = $("#orderlist_content");
					var senddate;
					has_next = data.Data.has_next;
					if(_data.length == 0) {
						$("#login_up").hide();
						listcontent.append(
							"<div class='weui-flex'>" +
							"<div class='weui-flex__item text_align_center mag_top_15p' style='margin-top: 20%;'>" +
							"<label>SORRY,没有找到订单数据！</label>" +
							"</div>" +
							"</div>"
						)
					} else {
						for(var i = 0; i < _data.length; i++) {
							//状态填充暂时不用
							if(_data[i].checkstat == 1) {
								checkstat = "";
							} else {
								checkstat = "";
							}
							//时间格式修改
							if(_data[i].senddate == "1900-01-01 00:00:00") {
								senddate = "-";
							} else {
								senddate = (_data[i].senddate).substring(0, 10);
							}

							listcontent.append(
								"<div class='weui-panel shop_cont'>" +
								"<div class='onclick'>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label class='ordercode'>" + _data[i].ordercode + "</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<div class='float_rt'>" +
								"<label class='text_color_price'>" + (_data[i].totalmoney).toFixed(2) + "</label>" +
								"<span class='text_color_gray text_size_13'>元</span>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"<div class='text_color_gray text_size_13'>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>收货地址：</label>" +
								"</div>" +
								"<div class='weui-flex__item shop_derlist_adder'>" +
								"<label class=''>" + _data[i].receiver_address + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label class='float_lt'>收货人：</label>" +
								"<div class='float_lt one_text_mag'>" +
								"<label>" + _data[i].receiver_mobile + "</label>" +
								"<label>" + _data[i].receiver_name + "</label>" +
								"</div>" +
								"<label class='orderstat float_rt'>" + checkstat + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label class='float_lt'>订货备注：</label>" +
								"<div class='float_lt'>" +
								"<label>" + _data[i].orderothers + "</label>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>送货时间：</label>" +
								"<label>" + senddate + "</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<div class='mag_top_0 float_rt'>" +
								"<label>" + (_data[i].orderdate).substring(0, 19) + "</label>" +
								"</div>" +
								"<div class='float_rt'>" +
								"<img src=" + _data[i].headimgurl + " class='shop_derlist_img' />" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"<div class='hide_list hide_list2'>" +
								"</div>"
							)
						}
					}
					/*用户头像信息*/
					panel_heardimg = data.UserInfo.headimgurl;
					panel_username = data.UserInfo.nickname;
					panel_company = data.UserInfo.app_name;
					panel_user_mesg(panel_company, panel_heardimg, panel_username)
				} else {
					$("#login_up").hide();
					flag_type(flag_val, msg_val);
				}

			},
			error: function() {},
			complete: function() {
				//文字颜色
				text_color();
				//点击详细信息
				orderlist_click();
				//加载更多
				loadmore(page_no, has_next);
			}
		});
	}

	/*点击事件*/
	function orderlist_click() {
		//unbind解除绑定，在绑定，防止js事件重复
		$('.onclick').unbind('click').bind('click', function() {
			var content = $(this).siblings(".hide_list");
			var ordercode = $(this).find(".ordercode").text();
			//清楚样式再添加
			if(content.hasClass("hide_list2")) {
				$(".hide_list").hide(300);
				$(".hide_list").addClass("hide_list2");
				if(content.find(".shop_derlist_hidebox").length == 0) {
					$.ajax({
						type: "post",
						dataType: "json",
						data: order_detail_param(ordercode),
						contentType: "application/json",
						url: "shop",
						success: function(data) {
							//console.log("订单详情", data)
							flag_val = data.Flag;
							msg_val = data.Msg;
							if(flag_val == 1) {
								content.html(" ");
								var _data = data.Data;
								for(var i = 0; i < _data.length; i++) {
									content.append(
										"<div class='shop_derlist_hidebox'>" +
										"<div class='weui-flex'>" +
										"<div class='weui-flex__item'>" +
										"<div class='shop_derlist_img_box'>" +
										"<img src=" + _data[i].prodpic + " class='shop_derlist_hideimg' />" +
										"</div>" +
										"</div>" +
										"<div class='weui-flex__item shop_detail_cont'>" +
										"<div class='weui-flex'>" +
										"<label>" + _data[i].prodname + "</label>" +
										"</div>" +
										"<div class='weui-flex mag_top_0'>" +
										"<label>" + _data[i].prodpriceout + "</label>" +
										"<span class='text_mag_rt_add5'>元 / " + _data[i].unit + "</span>" +
										"<label>x</label>" +
										"<label>" + _data[i].amount + "</label>" +
										"<span>" + _data[i].unit + "</span>" +
										"<label class='text_mag_lt_add5'>=</label>" +
										"<label class='text_mag_lt_add5'>" + _data[i].cost + "</label>" +
										"<span>元 </span>" +
										"</div>" +
										"</div>" +
										"</div>" +
										"</div>" +
										"</div>"
									)
								}
							} else {
								flag_type(flag_val, msg_val);
							}
						},
						error: function() {},
						complete: function() {
							content.show(300);
							content.removeClass("hide_list2");
						}
					});
				} else {
					content.show(300);
					content.removeClass("hide_list2");
				}
			} else {
				content.hide(300);
				content.addClass("hide_list2");
			}
		})
	}

	/*滚动加载*/
	function loadmore(page_no, has_next) {
		if(has_next > 0) {
			$("#login_up").show();
			++page_no;
			var loading = false; //状态标记
			$(".orderlist_content").infinite().off("infinite").on("infinite", function() {
				if(loading) return;
				loading = true;
				setTimeout(function() {
					orderlist_list(page_no)
				}, 500);
			});
		} else if(has_next == 0) {
			$("#login_up").hide();
		}
	}
	/*js*/
	/*颜色*/
	function text_color() {
		$(".orderstat:contains('已确认')").css("color", "#1AAD19");
		$(".orderstat:contains('未确认')").css("color", "red");
	}
})