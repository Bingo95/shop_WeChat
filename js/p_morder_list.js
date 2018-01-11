$(function() {
	/*json*/
	/*订单列表*/
	function morderlist_param(page_no, orderstat, searchtext) {
		var _param = {};
		var _data = {};
		_data.page_size = 10;
		_data.page_no = page_no;
		_data.orderstat = orderstat;
		_data.searchtext = searchtext;

		_param.action_sort = "10401";
		_param.data = _data;
		_param = JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}
	/*订单详情*/
	function morder_detail_param(ordercode) {
		var _param = {};
		var _data = {};
		_data.ordercode = ordercode;

		_param.action_sort = "10402";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*ajax*/
	/*订单列表*/
	var page_no = 1;
	morderlist_list(1, "", "");

	function morderlist_list(page_no, orderstat, searchtext) {
		if(orderstat == -1) {
			orderstat = "";
		}
		$.ajax({
			type: "post",
			dataType: "json",
			data: morderlist_param(page_no, orderstat, searchtext),
			contentType: "application/json",
			url: "merchant",
			success: function(data) {
				console.log("订单列表", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				var app_id = data.App_id;
				mian_list_js(app_id);
				if(flag_val == 1) {
					var _data = data.Data.List;
					var listcontent = $("#morderlist_content");
					var senddate;
					has_next = data.Data.has_next;
					if(_data.length == 0) {
						$("#login_up").hide();
						listcontent.append(
							"<div class='weui-flex'>" +
							"<div class='weui-flex__item text_align_center mag_top_15p' style='margin-top: 20%;'>" +
							"<label>系统没找到订单！</label>" +
							"</div>" +
							"</div>"
						)
					} else {
						for(var i = 0; i < _data.length; i++) {
							//订单审核状态，暂时全是已确认，不显示
							if(_data[i].checkstat == 1) {
								checkstat = "";
							} else {
								checkstat = "";
							}
							//日期格式替换默认日期为-，否则2017-10-10
							if(_data[i].senddate == "1900-01-01 00:00:00") {
								senddate = "-";
							} else {
								senddate = (_data[i].senddate).substring(0, 10);
							}

							listcontent.append(
								"<div class='weui-panel merchant_cont'>" +
								"<div class='onclick'>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>" + _data[i].receiver_name + "</label>" +
								"</div>" +
								"<div class='float_rt text_size_14'>" +
								"<label class ='ordercode'>" + _data[i].ordercode + "</label>" +

								"</div>" +
								"</div>" +
								"<div class='text_size_13'>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>订单金额：</label>" +
								"<label class='text_size_15 text_color_price'>" + (_data[i].totalmoney).toFixed(2) + "</label>" +
								"<span> 元</span>" +
								"<label class='float_rt merchant_cont_success'>" + checkstat + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>收货地址：</label>" +
								"</div>" +
								"<div class='weui-flex__item morder_list_mag'>" +
								"<label>" + _data[i].receiver_address + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label class='float_lt'>收货人：</label>" +
								"<div class='float_lt one_text_mag'>" +
								"<label class='mag_lt_-5p'>" + _data[i].receiver_mobile + "</label>" +
								"<label> " + _data[i].receiver_name + "</label>" +
								"</div>" +
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
								"<div class='float_rt'>" +
								"<label>" + _data[i].input_date.substring(0, 19) + "</label>" +
								"</div>" +
								"<div class='float_rt'>" +
								"<img src=" + _data[i].headimgurl + " class='merchant_cont_user_img' />" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"<div class='hide_list morder_list_hide'>" +
								"</div>"
							)
						}
					}

				} else {
					$("#login_up").hide();
					flag_type(flag_val, msg_val);
				}

			},
			error: function() {
				$("#login_up").hide();
				$.alert("服务器忙碌，请稍候重试。")
			},
			complete: function() {
				text_color();
				morderlist_click();
				loadmore(page_no, has_next);
			}
		});
	}

	//点击弹出详细数据
	function morderlist_click() {
		$('.onclick').unbind('click').bind('click', function() {
			var content = $(this).siblings(".hide_list");
			var ordercode = $(this).find(".ordercode").text();
			//判断是否已经有弹出数据。关闭已弹出，打开新弹出
			if(content.hasClass("morder_list_hide")) {
				$(".hide_list").hide(300);
				$(".hide_list").addClass("morder_list_hide");
				if(content.find(".shop_derlist_hidebox").length == 0) {
					$.ajax({
						type: "post",
						dataType: "json",
						data: morder_detail_param(ordercode),
						contentType: "application/json",
						url: "merchant",
						success: function(data) {
							//console.log("订单详情", data)
							flag_val = data.Flag;
							msg_val = data.Msg;
							if(flag_val == 1) {
								content.html(" ");
								var _data = data.Data;
								for(var i = 0; i < _data.length; i++) {
									content.append(
										"<div class='morder_list_hide_boder'>" +
										"<div class='weui-flex'>" +
										"<div class='weui-flex__item'>" +
										"<img src=" + _data[i].prodpic + " class='morder_list_img' />" +
										"</div>" +
										"<div class='weui-flex__item morder_list_text'>" +
										"<div class='weui-flex'>" +
										"<label>" + _data[i].prodname + "</label>" +
										"</div>" +
										"<div class='weui-flex'>" +
										"<label>" + _data[i].prodpriceout + "</label>" +
										"<span>元 /" + _data[i].unit_value + "</span>" +
										"<label>x</label>" +
										"<label>" + _data[i].amount + "</label>" +
										"<span>" + _data[i].unit_value + "</span>" +
										"<span>=</span>" +
										"<label>" + _data[i].cost + "</label>" +
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
							content.removeClass("morder_list_hide");
						}
					});
				} else {
					content.show(300);
					content.removeClass("morder_list_hide");
				}
			} else {
				content.hide(300);
				content.addClass("morder_list_hide");
			}
		})
	}

	//主目录点击事件
	function mian_list_js(app_id) {
		$(".mian_list").click(function() {
			window.location.href = "p_homepage_order.html?app_id=" + app_id;
		})
	}

	/*滚动加载*/
	function loadmore(page_no, has_next) {
		if(has_next > 0) {
			$("#login_up").show();
			++page_no;
			var loading = false; //状态标记
			var searchtext = $("#searchInput").val();
			var orderstat = $(".orderstat_select").find("option:selected").val();
			$(".morderlist_content").infinite().off("infinite").on("infinite", function() {
				if(loading) return;
				loading = true;
				setTimeout(function() {
					//订单列表加载
					morderlist_list(page_no, orderstat, searchtext);
				}, 500);
			});
		} else if(has_next == 0) {
			$("#login_up").hide();
		}
	}
	/*js*/
	/*输入框搜索*/
	$("#search_shop").click(search_list_on);

	/*回车搜索*/
	$("#searchInput").keydown(function() {
		if(event.keyCode == 13) { //回车键的键值为13
			search_list_on();
		}
	});

	/*下拉菜单搜索*/
	$(".orderstat_select").change(function() {
		search_list_on();
	})

	/*搜索*/
	function search_list_on() {
		//清空原有内容
		$("#morderlist_content").html("");
		var searchtext = $("#searchInput").val();
		var orderstat = $(".orderstat_select").find("option:selected").val();
		//列表更新
		morderlist_list(page_no, orderstat, searchtext);
	}

	//状态颜色-暂时无用
	function text_color() {
		$(".orderstat:contains('已确认')").css("color", "#1AAD19");
		$(".orderstat:contains('未确认')").css("color", "red");
	}
})