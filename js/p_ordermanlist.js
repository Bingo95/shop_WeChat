$(function() {
	var flag_val;
	var msg_val;
	var app_id = GetParameter('app_id');

	/*json*/
	/*列表*/
	function shop_list_param() {
		var _param = {};
		var _data = {};

		_param.action_sort = "50111";
		_param.data = _data;
		_param.app_id = app_id;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*审核*/
	function shop_check_param(openid, cust_id, stat) {
		var _param = {};
		var _data = {};

		_data.openid = openid;
		_data.cust_id = cust_id;
		_data.stat = stat;

		_param.action_sort = "50112";
		_param.data = _data;
		_param.app_id = app_id;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	/*ajax*/
	$(".shop_man_list").ready(ordercust_check_list);
	//获取人员列表
	function ordercust_check_list() {
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: shop_list_param(),
			beforeSend: function() {
				$.showLoading();
			},
			url: "shop",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					console.log("人员列表", data)
					var _data = data.Data;
					var listcontent = $(".shop_man_list");
					var stat;
					var lastdate;
					for(var i = 0; i < _data.length; i++) {
						//状态文字
						if(_data[i].stat == 1) {
							stat = "待审核"
						} else if(_data[i].stat == 0) {
							stat = "已通过"
						} else {
							stat = "不通过"
						}
						//时间格式
						if(_data[i].last_date == "") {
							lastdate = ""
						} else {
							lastdate = "更新:" + (_data[i].last_date).substring(0, 19);
						}
						listcontent.append(
							"<div class='shop_man_content weui-panel shop_man_padding'>" +
							"<div class='weui-flex'>" +
							"<div class='weui-flex__item'>" +
							"<div class='float_lt'>" +
							"<img src=" + _data[i].headimgurl + " class='shop_man_img' />" +
							"</div>" +
							"</div>" +
							"<div class='weui-flex__item shop_man_name'>" +
							"<div class='shop_man_name_text float_lt'>" +
							"<label class='nickname'>" + _data[i].nickname + "</label>" +
							"<label class='openid cont_dispy_none'>" + _data[i].openid + "</label>" +
							"<label class='cust_id cont_dispy_none'>" + _data[i].cust_id + "</label>" +
							"</div>" +
							"</div>" +
							"<div class='weui-flex__item shop_man_type'>" +
							"<div class='shop_man_type_mag'>" +
							"<label class='shop_color'>" + stat + "</label>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"<div class='weui-flex text_size_12'>" +
							"<div class='weui-flex__item float_lt text_color_gray'>" +
							"<div>" +
							"<label>" + (_data[i].inputdate).substring(0, 19) + "</label>" +
							"</div>" +
							"</div>" +
							"<div class='weui-flex__item float_rt text_color_gray'>" +
							"<div class='float_rt'>" +
							"<div><label class='lastdate'>" + lastdate + "</label>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>"
						);
					}
					/*用户头像信息*/
					panel_heardimg = data.UserInfo.headimgurl;
					panel_username = data.UserInfo.nickname;
					panel_company = data.UserInfo.app_name;
					panel_user_mesg(panel_company, panel_heardimg, panel_username)
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				//文字颜色
				text_color();
				//审核动作
				shop_man_check();
				$.hideLoading();
			}
		});
	}
	//审核递交
	function shop_check(openid, cust_id, stat) {
		$.ajax({
			type: "POST",
			url: "shop",
			data: shop_check_param(openid, cust_id, stat),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				$.hideLoading();
				if(flag_val == 1) {
					$.toast("审核完成!");
					$(".shop_man_list").html("");
					ordercust_check_list();
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
	/*js*/
	function shop_man_check() {
		$(".shop_man_content").click(function() {
			var nickname = $(this).find(".nickname").text();
			var openid = $(this).find(".openid").text();
			var cust_id = $(this).find(".cust_id").text();
			console.log("openid", openid);
			console.log("cust_id", cust_id);
			if($(this).find(".shop_color").text() == "已通过") {
				$.confirm({
					title: '撤销信息',
					text: "撤销【" + nickname + "】的订货权限？",
					onOK: function() {
						shop_check(openid, cust_id, 2)
					},
					onCancel: function() {}
				});
			} else if($(this).find(".shop_color").text() == "待审核") {
				$.modal({
					title: "审核信息",
					text: "通过【" + nickname + "】的申请订货？",
					buttons: [{
							text: "通过",
							onClick: function() {
								shop_check(openid, cust_id, 0)
							}
						},
						{
							text: "不通过",
							className: "warn",
							onClick: function() {
								shop_check(openid, cust_id, 2)
							}
						},
						{
							text: "取消",
							className: "default"
						},
					]
				});
			}
		})
	}

	/*颜色*/
	function text_color() {
		$(".shop_color:contains('已通过')").css("color", "#1AAD19");
		$(".shop_color:contains('待审核')").css("color", "red");
	}
})