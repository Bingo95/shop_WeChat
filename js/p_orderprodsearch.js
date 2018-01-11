$(function() {
	var flag_val;
	var msg_val;
	var app_id = GetParameter('app_id');
	/*传值*/
	/*分类列表*/
	function search_list_param() {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');
		_data.fieldname = "prodsort";
		_data.stat = 0;

		_param.action_sort = "9010201";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*商品列表*/
	function shop_list_param(page, searchtext, prodsort) {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');
		_data.page_no = page;
		_data.page_size = 10;
		_data.searchtext = searchtext;
		_data.prodsort = prodsort;

		_param.action_sort = "40101";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}

	/*详情*/
	function popup_open_param(prodid) {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');
		_data.prodid = prodid;

		_param.action_sort = "40102";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*用户信息*/
	function user_mesg_param() {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');

		_param.action_sort = "50102";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*暂存信息读取*/
	function shop_data_js_param() {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');
		_data.draft_sort = 401;

		_param.action_sort = "9018002";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出商店暂存",_param)
		return _param;
	}

	/*暂存内容信息*/
	function save_data_param(json_data, json_userdata) {
		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');
		var draft_json = {};
		_data.draft_sort = 401;
		draft_json.sale_List = json_data;
		draft_json.sale_user = json_userdata;

		_data.draft_json = draft_json;
		_param.app_id = app_id;
		_param.action_sort = "9018001";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出商店暂存内容",_param)
		return _param;
	}

	/*ajax*/
	/*分类项目*/
	$("#search_list").ready(function() {
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: search_list_param(),
			url: "pubConfig",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					//console.log("配置列表", data)
					var _data = data.Data.fieldlist;
					var listcontent = $("#search_list");
					for(var i = 0; i < _data.length; i++) {
						listcontent.append(
							"<li value='" + _data[i].id + "'>" + _data[i].sysname + "</li>"
						);
					}
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

	/*商品列表*/
	var page = 1;
	shop_list_detail(1, "", "");

	function shop_list_detail(page, searchtext, prodsort) {
		flag_val = "";
		//console.log("页数", page);
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: shop_list_param(page, searchtext, prodsort),
			url: "shop",
			success: function(data) {
				var num = Math.random();
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$("#orderprordsearch_a").attr("href", "p_orderprodsearch.html?app_id=" + app_id + "&random=" + num);
					$("#orderlist_a").attr("href", "p_orderlist.html?app_id=" + app_id);
					$("#ordermanlist_a").attr("href", "p_ordermanlist.html?app_id=" + app_id);
					$("#ordercust_a").attr("href", "p_ordercust_add.html?app_id=" + app_id);
					$("#flag_val").text(flag_val);
					//console.log("商品列表", data)
					var _data = data.Data.List;
					var listcontent = $(".right_div");
					has_next = data.Data.has_next;
					if(_data.length == 0) {
						$("#login_up").hide();
						listcontent.append(
							"<div id='shop_none' class='text_align_center mag_top_dow10'>" +
							"<img src='img/119.png' style='width: 68px;height: 65px;' />" +
							"<div class='weui-flex'>" +
							"<label class='text_size_15 mag_auto'>SORRY,没有找到商品数据！</label>" +
							"</div>" +
							"</div>"
						);
						//console.log("listcontent", _data.length)
					} else {
						for(var i = 0; i < _data.length; i++) {
							listcontent.append(
								"<div class='prod_cont_box'>" +
								"<a style='display: block;' href='p_orderproddetail.html?prodid=" + _data[i].prodid + "&app_id=" + app_id + "'>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item text_align_center'>" +
								"<div class='prod_cont_imgbox'>" +
								"<img src=" + _data[i].prodpic + " class='prod_cont_img' />" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</a><a class='open-popup' data-target='#detail_from' style='display: block;overflow: auto;'>" +
								"<div class='weui-flex'>" +
								"<div class='prod_cont_name text_color_gray'>" +
								"<label class='mag_lt_5p'>" + _data[i].prodname + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='float_lt text_size_12 mag_top_2p mag_lt_5 btn_border' style='color:#EC7777'>订</div>" +
								"<div class='weui-flex mag_top_0 float_rt'>" +
								"<div class='text_color_gray text_size_12'>" +
								"￥<label class='text_color_red text_size_13'>" + (_data[i].prodpriceout).toFixed(2) + "</label>/<span class='cont_dispy_none'>" + _data[i].unit + "</span><span style='margin-right:2px'>" + _data[i].unit_value + "</span>" +
								"<div class='id cont_dispy_none'>" + _data[i].prodid + "</div>" +
								"</div>" +
								"</div>" +
								"</a></div>"
							);
						}
					}
				} else {
					$("#login_up").hide();
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				var flag_type = $("#flag_val").text();
				if(flag_type == 1) {
					$("#login_up").hide();
					//详情信息
					popup_open();
					//滚动加载
					loadmore(page, has_next);
				}
			}
		});
	}

	/*滚动加载*/
	function loadmore(page, has_next) {
		//console.log(page)
		//console.log(has_next)
		if(has_next > 0) {
			$("#login_up").show();
			++page;
			var loading = false; //状态标记
			var searchtext = $("#searchInput").val();
			var prodsort = $(".page_left").find(".active").val();
			if(prodsort == "0") {
				prodsort = "";
			}
			$(".page_right").infinite().off("infinite").on("infinite", function() {
				if(loading) return;
				loading = true;
				setTimeout(function() {
					//列表更新
					shop_list_detail(page, searchtext, prodsort)
				}, 500);
			});
		} else {
			$("#login_up").hide();
		}
	}

	/*点击详细信息*/
	function popup_open() {
		$(".prod_cont_box").click(function() {
			$("#amount").val(1);
			var prodid = $(this).find(".id").text();
			$.ajax({
				type: 'post',
				dataType: "json",
				contentType: "application/json",
				data: popup_open_param(prodid),
				url: "shop",
				success: function(data) {
					flag_val = data.Flag;
					msg_val = data.Msg;
					if(flag_val == 1) {
						var _data = data.Data;
						//console.log("商品详情", data)
						$("#prodname").text(_data.prodname);
						$("#proddes").text(_data.proddes);
						$("#prodpriceout").text(_data.prodpriceout);
						$(".unit").text(_data.unit);
						$("#unit_val").text(_data.unit_value);
						$("#prodid").text(prodid);
						$(".img_url").text(_data.prodpic);
					} else {
						flag_type(flag_val, msg_val);
					}
				},
				error: function() {
					$.alert("服务器忙碌，请稍候重试！");
				},
				complete: function() {
					total_price();
				}
			});
		})
	}

	/*用户信息*/
	var cust_id;
	var cust_address; //用户地址
	var cust_con; //用户备注
	var cust_name; //用户姓名
	var cust_tel; //用户电话
	function user_mesg() {
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: user_mesg_param(),
			url: "shop",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data;
					//console.log("用户信息", data)
					cust_id = _data.cust_id;
					cust_address = _data.cust_address;
					cust_con = _data.cust_con;
					cust_name = _data.cust_name;
					cust_tel = _data.cust_tel;

					panel_heardimg = data.UserInfo.headimgurl;
					panel_username = data.UserInfo.nickname;
					panel_company = _data.app_name;
					//用户信息显示方法
					panel_user_mesg(panel_company, panel_heardimg, panel_username)
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {}
		});
	}
	user_mesg();
	/*加入销售车点击事件*/
	$(".btn_addone").click(function() {
		var amount = $("#amount").val();
		if(amount == "" || amount == 0) {
			$.alert("请输入数量");
		} else {
			//暂存
			shop_data_js();
		}
	});
	/*完成开单*/
	$(".btn_end").click(function() {
		var amount = $("#amount").val();
		if(amount == "" || amount == 0) {
			$.alert("请输入数量");
		} else {
			//暂存
			shop_data_js(5);
		}
	});
	/*加入销售车事件、暂存起始*/
	function shop_data_js(stat) {
		var prodid = $("#prodid").text(); //编码0
		/*取数据*/
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: shop_data_js_param(),
			url: "pubConfig",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				//console.log("加入销售车时暂存数据返回", data);
				if(flag_val == 1) {
					var shop_data = data;
					var user_data = data;
					var _data_type = 0;
					var user_type = 1;
					var _list_num;
					/*购物车列表数组部分*/
					/*判断是否存在*/
					if("Data" in shop_data) {
						shop_data = data.Data;
						if("sale_List" in shop_data) {
							shop_data = data.Data.sale_List;

							/*销售车数量显示*/
							if(shop_data == "[]" || shop_data.length == 0) {
								$("#shop_count").text("");
								$(".myshop_num").text("");
								shop_data = [];
							} else {
								$("#shop_count").text(shop_data.length);
								$(".myshop_num").text("（" + shop_data.length + "）");
								$("#shop_count").show();
							}
							for(var i = 0; i < shop_data.length; i++) {
								if(shop_data[i].prodid == prodid) {
									/*获取数组下标*/
									_data_type = 1;
									_list_num = i;
								}
							}
						}
					} else {
						shop_data = [];
					}

					/*用户信息数组部分*/
					if("Data" in user_data) {
						user_data = data.Data;
						if("sale_user" in user_data) {
							user_data = data.Data.sale_user;
							//console.log("用户信息",user_data)
						} else {
							user_type = 0;
							user_data = {};
						}
					} else {
						user_type = 0;
						user_data = {};
					}

					/*整合传递所需值*/
					var obj1 = {
						shop_data: shop_data,
						user_data: user_data,
						_data_type: _data_type,
						user_type: user_type,
						_list_num: _list_num,
					};
					/*执行暂存方法*/
					if(prodid !== "") {
						save_data(obj1);
					}
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，添加失败，请稍候重试！");
			},
			complete: function() {
				if(stat == 5) {
					window.location.href = "p_ordercart.html?app_id=" + app_id;
				}
			}
		});
	}

	/*暂存*/
	function save_data(obj1) {
		var shop_data = obj1.shop_data;
		var user_data = obj1.user_data;

		/*销售车数组定义*/
		var prodid = $("#prodid").text(); //编码0
		var prodname = $("#prodname").text(); //商品名1
		var unit = $(".unit").text(); //单位id
		var unit_val = $("#unit_val").text(); //单位2
		var prodpriceout = $("#prodpriceout").text(); //单价3
		var amount = $("#amount").val(); //数量4
		var cost = $("#totalmoney").text(); //总价5
		var prodpic = $(".img_url").text(); //商品图片
		var shop_array = {};

		/*json对象获取*/
		/*购物车信息*/
		shop_array.prodid = prodid;
		shop_array.prodname = prodname;
		shop_array.unit_val = unit_val;
		shop_array.unit = unit;
		shop_array.prodpriceout = prodpriceout;
		shop_array.amount = amount;
		shop_array.cost = cost;
		shop_array.prodpic = prodpic;

		//console.log("暂存前",shop_array)
		if(obj1._data_type == 0) {
			/*不重复，数组填充*/
			shop_data.push(shop_array);
		} else if(obj1._data_type == 1) {
			/*重复，数组赋值*/
			shop_data[obj1._list_num] = shop_array;
		}
		/*销售车数量显示*/
		$("#shop_count").text(shop_data.length);
		$(".myshop_num").text("（" + shop_data.length + "）");
		$("#shop_count").show();

		if(obj1.user_type == 0) {
			user_data.cust_id = cust_id;
			user_data.receiver_address = cust_address;
			user_data.orderothers = " ";
			user_data.receiver_name = cust_con;
			user_data.receiver_mobile = cust_tel;
		}

		//console.log("用户信息", user_data)
		/*用户信息*/
		/*json转义*/
		var json_data = shop_data;
		var json_userdata = user_data;
		//console.log("暂存的商品信息json",json_data)
		//console.log("暂存的用户信息json",json_userdata) 
		$.ajax({
			type: "post",
			dataType: "json",
			data: save_data_param(json_data, json_userdata),
			url: "pubConfig",
			contentType: "application/json",
			success: function(data) {
				//console.log(data)
				if(data.Flag == 1) {
					/*关闭弹出框*/
					$.closePopup();
					$.toast("添加成功", 1000);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，添加失败，请稍候重试！");
			},
			complete: function() {}
		});
	}

	shop_data_js();

	/*js*/
	/*计算金额*/
	function total_price() {
		var price = $("#prodpriceout").text(); //单价
		var num = $("#amount").val(); //数量
		total_price2 = price * num;
		$("#totalmoney").html((total_price2).toFixed(2));
	}

	/*点击减号*/
	$(".btn_minus").click(function() {
		var num = $("#amount").val();
		//console.log(num)
		if(num > 1) {
			$("#amount").val(num - 1);
		}
		total_price();
	})

	/*点击加号*/
	$(".btn_add").click(function() {
		var num = $("#amount");
		if(num.val() == "") {
			num.val(1);
		} else {
			num.val(parseInt(num.val()) + 1);
		}
		total_price();
	})
	//数值改变计算
	$("#amount").change(total_price);
	/*左列表点击对象,类别搜索*/
	$(".page_left").off("click", "li").on("click", "li", function() {
		$(".right_div").html("");
		// 设index为当前点击
		var index = $(this).index();
		var prodsort = $(this).val();
		var searchtext = $("#searchInput").val();
		//console.log("prodsort", prodsort)
		if(prodsort == "0") {
			prodsort = "";
			page = 1;
		}
		//console.log("prodsort2", prodsort)
		shop_list_detail(page, searchtext, prodsort);
		// 点击添加样式利用siblings清除其他兄弟节点样式
		$(this).addClass("active").siblings().removeClass("active");
		// 同理显示与隐藏
	})

	/*输入框搜索*/
	/*回车搜索*/
	$("#searchInput").keydown(function() {
		if(event.keyCode == 13) { //回车键的键值为13
			search_list_on();
		}
	});

	/*点击搜索*/
	$("#search_shop").click(function() {
		search_list_on();
	});

	//搜索方法
	function search_list_on() {
		$(".right_div").html("");
		var searchtext = $("#searchInput").val();
		var prodsort = $(".page_left").find(".active").val();
		if(prodsort == "0") {
			prodsort = "";
		}
		shop_list_detail(page, searchtext, prodsort);
	}

	/*购物车跳转*/
	$(".prod_search_shop").click(function() {
		var shop_amount = $("#shop_count").text();
		if(shop_amount == "") {
			$.alert("您还没有选购商品哦！")
		} else {
			window.location.href = "p_ordercart.html?app_id=" + app_id;
		}
	})

	$("#prod_search_shop").click(function() {
		var shop_amount = $("#shop_count").text();
		if(shop_amount == "") {
			$.panelslider.close();
			$.alert("您还没有选购商品哦！");
		} else {
			window.location.href = "p_ordercart.html?app_id=" + app_id;
		}
	})

	/*侧滑*/
	$("#overlay").hide();
	$('#left-panel-link').panelslider();
	$('#left-panel-link2').panelslider();

	$("#left-panel-link").click(panel_click);
	$("#left-panel-link2").click(panel_click)

	function panel_click() {
		$("#overlay").show();
		$("#list").addClass("wrap2");
	};

	$("#panel_close").click(function() {
		$.panelslider.close();
		$("#overlay").hide();
	});
	//商家信息填充
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

})

//遮罩层侧滑显示
function overlay1() {
	$("#overlay").hide();
	$("#list").removeClass("wrap2");
};