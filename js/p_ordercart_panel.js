var app_id = GetParameter('app_id');

$(function() {
	//读取暂存信息购物车内容
	shop_data_js();
})

/*购物车暂存信息读取*/
function shop_data_js_param() {
	var _param = {};
	var _data = {};
	_data.draft_sort = 401;

	_param.action_sort = "9018002";
	_param.app_id = app_id;
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出商店暂存",_param)
	return _param;
}

/*读取暂存信息购物车内容-商品数量*/
function shop_data_js() {
	$.ajax({
		type: "post",
		dataType: "json",
		contentType: "application/json",
		data: shop_data_js_param(),
		url: "pubConfig",
		async: false,//同步
		success: function(data) {
			var num = "";
			flag_val = data.Flag;
			msg_val = data.Msg;
			if(flag_val == 1) {
				var shop_data = data;
				/*购物车列表数组部分*/
				/*判断是否存在*/
				if("Data" in shop_data) {
					shop_data = data.Data;
					if("sale_List" in shop_data) {
						shop_data = data.Data.sale_List;
						/*销售车数量显示*/
						if(shop_data == "[]" || shop_data.length == 0) {
							num = "";
						} else {
							num = shop_data.length;
						}
					}
				}
				//执行头部和侧滑填充
				order_nav(num);
				lect_panel(num);
			} else {
				flag_type(flag_val, msg_val);
			}
		},
		error: function() {
			$.alert("服务器忙碌！");
		},
		complete: function() {
			slider();
		}
	});
}

/*nav*/
function order_nav(num) {
	var shop = "";
	var count;
	//根据购物车数量填充不同内容
	if(num == "") {
		shop = "<div id='shopcar_box' class='weui-flex' style='width: 80%;' onclick='alert_tap();'>";
		count = "";
	} else {
		shop = "<div class='weui-flex' style='width: 80%;' onclick='win_shop();'>";
		count = "<label id='shop_amount' class='text_color_white text_size_15 shop_count'>" + num + "</label>";
	}
	var navcontent = $("#order_nav")
	navcontent.append(
		"<a id='overlay1'>" +
		"<div id='overlay' class='weui-popup__overlay weui-popup__overlay_add'></div>" +
		"</a>" +
		"<div class='weui-flex shop_nav'>" +
		"<div class='float_lt mag_lt_5p'>" +
		"<a id='left-panel-link' href='#left-panel'>" +
		"<img src='img/publist.png' class='pub_list_img'/>" +
		"<div class='shop_nav_con'>" +
		"<img src='' class='shop_nav_img user_heard_img' />" +
		"<label class='shop_nav_text'>个人中心 </label>" +
		"</div>" +
		"</a>" +
		"</div>" + shop +
		"<div class='weui-flex__item'>" +
		"<label class='float_rt mag_top_15p panel_company'></label>" +
		"<div id='shopcar' class='mag_top_8p float_rt'>" + count +
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>"
	);
}
/*left-panel*/
function lect_panel(num) {
	var shop = "";
	//根据购物车数量填充不同内容
	if(num == "") {
		shop = "<a id='panelcar' href='javascript:alert_tap();'><li>我的订货车</li></a>";
	} else {
		shop = "<a href='p_ordercart.html?app_id=" + app_id + "'><li>我的订货车（<span class='myshop_num'>" + num + "</span>）</li></a>";
	}
	var menucontent = $("#left-panel");
	menucontent.append(
		"<div class='weui-flex'>" +
		"<div class='weui-flex__item left_panel_userbox'>" +
		"<div class='left_panel_headbox'>" +
		"<img src='' class='left_panel_head user_heard_img' />" +
		"</div>" +
		"<div class='left_panel_username'>" +
		"<label id='user_name_text'></label>" +
		"</div>" +
		"</div>" +
		"</div>" +
		"<div class='weui-flex'>" +
		"<ul>" +
		"<a href='p_orderprodsearch.html?app_id=" + app_id + "'><li>商品目录</li></a>" + shop +
		"<a href='p_orderlist.html?app_id=" + app_id + "'><li>我的订单</li></a>" +
		"<a href='p_ordermanlist.html?app_id=" + app_id + "' class='cont_dispy_none'><li>订货人员</li></a> " +
		"<a href='p_ordercust_add.html?app_id=" + app_id + "' class='cont_dispy_none'><li>+订货人员</li></a>" +
		"<li id='panel_close'> 隐藏目录 </li>" +
		"</ul>" +
		"</div>"
	);
}
/*点击事件*/
function slider() {
	//遮罩层隐藏和侧滑初始化
	$("#overlay").hide();
	$('#left-panel-link').panelslider();
	//打开侧滑菜单
	$("#left-panel-link").click(panel_click);
	//侧滑点击事件，遮罩层显示
	function panel_click() {
		$("#overlay").show();
		$("#list").addClass("wrap2");
	};
	//侧滑关闭，遮罩层隐藏
	$("#panel_close").click(function() {
		$.panelslider.close();
		$("#overlay").hide();
	});
	//遮罩层点击隐藏
	$("#overlay1").click(function() {
		$("#overlay").hide();
	});
}
//用户信息字符截取填充
function panel_user_mesg(panel_company, panel_heardimg, panel_username) {
	var maxwidth = 32;
	var len = 0;
	var stringdata;
	for(var i = 0; i < panel_company.length; i++) {
		if(len < maxwidth) {
			var length = panel_company.charCodeAt(i);
			if(length >= 0 && length <= 128) {
				len += 1;
				stringdata += panel_company.charAt(i);
			} else {
				len += 2;
				stringdata += panel_company.charAt(i);
			}
		} else {
			if(panel_company.length > 16) {
				stringdata = stringdata.substring(0, stringdata.length - 1) + ".";
			} else {
				stringdata = stringdata;
			}
			break;
		}
	}
	panel_company = stringdata.substring(9);
	$(".panel_company").text(panel_company);
	$(".user_heard_img").attr("src", panel_heardimg);
	$("#user_name_text").text(panel_username);
}
//购物车无商品时购物车提示
function alert_tap() {
	$("#overlay").hide();
	$.panelslider.close();
	$.confirm("您还没有选购商品哦！是否前往商品目录？", function() {
		window.location.href = "p_orderprodsearch.html?app_id=" + app_id;
	}, function() {
		//点击取消后的回调函数
	});
}
//购物车有商品时跳转
function win_shop() {
	window.location.href = "p_ordercart.html?app_id=" + app_id;
}