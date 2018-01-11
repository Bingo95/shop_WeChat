$(function() {
	var app_id = GetParameter('app_id');
	var prodid = GetParameter('prodid')
	$(function() {
		app_select();
		popup_open_param();
	})
	/*json*/
	/*用户信息*/
	var cust_id;
	var cust_address; //用户地址
	var cust_con; //用户备注
	var cust_name; //用户姓名
	var cust_tel; //用户电话

	function app_select() {
		var _param = {};
		var p_data = {};

		_param.action_sort = "50102";
		_param.app_id = app_id;
		_param.data = p_data;
		_param = JSON.stringify(_param);

		var ajaxobj = {
			param: _param,
			ajaxurl: "shop",
		};

		var dfd = getData(ajaxobj);

		$.when(dfd)
			.done(function(data) {
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
			});
	}
	//获取商品详情
	function popup_open_param() {
		var _param = {};
		var p_data = {};
		p_data.prodid = prodid;

		_param.action_sort = "40102";
		_param.app_id = app_id;
		_param.data = p_data;
		_param = JSON.stringify(_param);

		var ajaxobj = {
			param: _param,
			ajaxurl: "shop",
		};

		var dfd = getData(ajaxobj);

		$.when(dfd)
			.done(function(data) {
				var _data = data.Data;
				//console.log("商品详情", data)
				$("#prodname").text(_data.prodname);
				$("#prodname2").text(_data.prodname);
				$("#proddes").text(_data.proddes);
				$("#proddes2").text(_data.proddes);
				$("#prodpriceout").text(_data.prodpriceout);
				$("#prodpriceout2").text(_data.prodpriceout);
				$("#totalmoney").text(_data.prodpriceout);
				$(".unit").text(_data.unit);
				$("#unit_val").text("/" + _data.unit_value);
				$("#unit_val2").text(_data.unit_value);
				$("#prodid").text(prodid);
				$("#detail_banner").attr("src", _data.prodpic);
				$(".img_url").text(_data.prodpic);
			});
	}

	//暂存信息读取
	function shop_data_js(stat) {
		var _param = {};
		var _data = {};
		_data.draft_sort = 401;

		_param.action_sort = "9018002";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);

		var ajaxobj = {
			param: _param,
			ajaxurl: "pubConfig",
		};

		var dfd = getData(ajaxobj);

		$.when(dfd)
			.done(function(data) {
				getobj(data, stat);
			})
	}

	/*暂存内容信息*/
	function save_data(obj) {
		//处理添加操作参数
		obj = addobjdata(obj);

		var _param = {};
		var _data = {};
		var app_id = GetParameter('app_id');
		var draft_json = {};

		_data.draft_sort = 401;
		draft_json.sale_List = obj.json_data;
		draft_json.sale_user = obj.json_userdata;

		_data.draft_json = draft_json;
		_param.app_id = app_id;
		_param.action_sort = "9018001";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出商店暂存内容",_param)
		var ajaxobj = {
			param: _param,
			ajaxurl: "pubConfig",
		};

		var dfd = getData(ajaxobj);

		$.when(dfd)
			.done(function() {
				/*关闭弹出框*/
				$.closePopup();
				$.toast("添加成功", 1000, function() {
					if(obj.stat == 5) {
						window.location.href = "p_ordercart.html?app_id=" + app_id;
					} else {
						window.location.href = "p_orderprodsearch.html?app_id=" + app_id;
					}
				});
			})
	}

	//暂存取数组方法
	var getobj = function(data, stat) {
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
			stat: stat
		};
		/*执行暂存方法*/
		if(prodid !== "") {
			save_data(obj1);
		}
	}

	var addobjdata = function(obj) {
		var shop_data = obj.shop_data;
		var user_data = obj.user_data;

		/*销售车数组定义*/
		var prodid = $("#prodid").text(); //编码0
		var prodname = $("#prodname2").text(); //商品名1
		var unit = $(".unit").text(); //单位id
		var unit_val = $("#unit_val2").text(); //单位2
		var prodpriceout = $("#prodpriceout2").text(); //单价3
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
		if(obj._data_type == 0) {
			/*不重复，数组填充*/
			shop_data.push(shop_array);
		} else if(obj._data_type == 1) {
			/*重复，数组赋值*/
			shop_data[obj._list_num] = shop_array;
		}
		/*销售车数量显示*/
		if($("#shop_amount").text() == "" && shop_data.length > 0) {
			$("#shopcar").append("<label id='shop_amount' class='text_color_white text_size_15 shop_count'></label>");
			$("#shopcar_box").attr("onclick", "win_shop()");
			$("#panelcar").append("<li>我的订货车（<span class='myshop_num'></span>）</li>");
			$("#panelcar").attr("href", "p_ordercart.html?app_id=" + app_id);
		}
		$("#shop_amount").text(shop_data.length);
		$(".myshop_num").text(shop_data.length);
		$("#shop_amount").show();

		if(obj.user_type == 0) {
			user_data.cust_id = cust_id;
			user_data.receiver_address = cust_address;
			user_data.orderothers = " ";
			user_data.receiver_name = cust_con;
			user_data.receiver_mobile = cust_tel;
		}

		var json_data = shop_data;
		var json_userdata = user_data;

		obj = {
			json_data: json_data,
			json_userdata: json_userdata,
			stat: obj.stat
		}

		return obj;
	}

	//加入订货车点击事件
	$(".btn_addone").click(function() {
		var amount = $("#amount").val();
		if(amount == "" || amount == 0) {
			$.alert("请输入数量");
		} else {
			//暂存
			shop_data_js(6);
		}
	});

	//完成开单
	$(".btn_end").click(function() {
		var amount = $("#amount").val();
		if(amount == "" || amount == 0) {
			$.alert("请输入数量");
		} else {
			//暂存
			shop_data_js(5);
		}
	});

	//返回
	$(".prod_detail_out").click(function() {
		window.location.href = "p_orderprodsearch.html?app_id=" + app_id;
	})

	/*js*/
	/*计算金额*/
	function total_price() {
		var price = $("#prodpriceout2").text(); //单价
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
})