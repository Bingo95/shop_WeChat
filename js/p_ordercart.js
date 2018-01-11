$(function() {
	var flag_val;
	var msg_val;
	var cust_id;
	var app_id = GetParameter('app_id');
	/*json传值*/
	/*列表信息*/
	function ordercart_list_param() {
		var _param = {};
		var _data = {};
		_data.draft_sort = 401;

		_param.app_id = app_id;
		_param.action_sort = "9018002";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出列表", _param)
		return _param;
	}
	/*暂存*/
	function save_ordercart_list_param(json_data, json_userdata) {
		var _param = {};
		var _data = {};
		var draft_json = {};
		_data.draft_sort = 401;

		draft_json.sale_List = json_data;
		draft_json.sale_user = json_userdata;

		_data.draft_json = draft_json;
		_param.action_sort = "9018001";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出暂存", _param)
		return _param;
	}

	/*暂存清空*/
	function clear_data_param(json_data) {
		var _param = {};
		var _data = {};
		var draft_json = {};
		_data.draft_sort = 401;

		draft_json.sale_List = json_data;

		_data.draft_json = draft_json;
		_param.action_sort = "9018001";
		_param.app_id = app_id;
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}

	/*保存*/
	function save_all_param(json_userdata) {
		var _param = {};

		_param.action_sort = "40105";
		_param.app_id = app_id;
		_param.data = json_userdata;
		_param = JSON.stringify(_param);
		//console.log("输出保存", _param)
		return _param;
	}
	/*ajax*/
	/*商品列表+用户信息读取*/
	ordercart_list();

	function ordercart_list() {
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: ordercart_list_param(),
			url: "pubConfig",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					//console.log("订单列表", data)
					var _data = data.Data.sale_List;
					var _data_user = data.Data.sale_user;
					var listcontent = $(".shop_list_content");
					/*列表填充*/
					if(_data.length > 0) {
						for(var i = 0; i < _data.length; i++) {
							listcontent.append(
								"<div class='weui-panel mag_top_0 ordercart_list_data'>" +
								"<div class='weui-flex'>" +
								"<label class='prodid cont_dispy_none'>" + _data[i].prodid + "</label>" +
								"<div class='weui-flex__item mag_lt_5 text_size_15 prodname'>" + _data[i].prodname + "</div>" +
								"</div>" +
								"<div class='weui-flex mag_top_5'>" +
								"<div class='weui-flex__item text_size_15 mag_auto'>" +
								"<label class='shop_list_del'>X</label>" +
								"</div>" +
								"<div class='weui-flex__item shop_list_img_mag'>" +
								"<div class='shop_list_img_cont'>" +
								"<img src=" + _data[i].prodpic + " class='shop_list_img prodpic' />" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex__item shop_list_text_mag'>" +
								"<div class='weui-flex text_justify_align shop_price_mag'>" +
								"<label class='text_color_gray'>单价:</label>" +
								"<div class='text_size_14'>" +
								"<label class='prodpriceout text_color_black'>" + _data[i].prodpriceout + "</label>" +
								"<span class='text_color_gray'>元 / </span><span class='cont_dispy_none unit'>" + _data[i].unit + "</span><span class='text_color_gray unit_val'>" + _data[i].unit_val + "</span>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex text_justify_align mag_top_dow10 shop_num_mag' style='padding-right:15px'>" +
								"<div class='float_lt'>" +
								"<label class='text_color_gray'>数量:</label>" +
								"</div>" +
								"<div class='shop_input_num'>" +
								"<span class='shop_btn_minus'>-</span>" +
								"<input type='text' value=" + _data[i].amount + " class='amount shop_input'  onkeyup='clearNoNum(this)'/>" +
								"<span class='shop_btn_add'>+</span>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex mag_top_dow10 text_justify_align'>" +
								"<label class='text_color_gray'>金额:</label>" +
								"<div class='text_size_14'>" +
								"<label class='totalmoney text_color_black'>" + _data[i].cost + "</label>" +
								"<span class='text_color_gray'>元</span>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>"
							);
						}
						/*用户信息填充*/
						cust_id = _data_user.cust_id;
						$("#cust_name").val(_data_user.receiver_name);
						$("#cust_address").val(_data_user.receiver_address);
						$("#cust_con").val(_data_user.orderothers);
						$("#cust_tel").val(_data_user.receiver_mobile);
						$("#senddate").val(_data_user.senddate);
					} else {
						$.alert("订货车为空，请先添加商品", function() {
							window.location.href = "p_orderprodsearch.html?app_id=" + app_id;
						});
					}
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				//需要等内容填充完才能产生效果的js，部分js初始化读取
				ordercart_other();
			}
		});
	}

	//获取列表用户信息
	function get_ordercart_list(stat, _data, obj) {
		var input_all = $(".ordercart_list_data");

		for(var i = 0; i < input_all.length; i++) {
			var prodid = $(".prodid").eq(i).text(); //编码0
			var prodname = $(".prodname").eq(i).text(); //商品名1
			var unit = $(".unit").eq(i).text();
			var prodpriceout = $(".prodpriceout").eq(i).text(); //单价3
			var amount = $(".amount").eq(i).val(); //数量4
			var cost = $(".totalmoney").eq(i).text(); //总价5
			var shop_array = {};
			var unit_val = $(".unit_val").eq(i).text(); //单位2
			if(stat == 1) {
				shop_array.unit_val = unit_val;
				var prodpic = $(".prodpic").eq(i).attr("src"); //图
				shop_array.prodpic = prodpic;
			}

			/*json对象获取*/
			shop_array.prodid = prodid;
			shop_array.prodname = prodname;
			shop_array.unit = unit_val;
			shop_array.prodpriceout = prodpriceout;
			shop_array.amount = amount;
			shop_array.cost = cost;

			/*数组填充*/
			_data.push(shop_array);

		}

		/*客户信息数组部分*/
		cust_id = cust_id;
		var totalmoney = $("#totalmoney").text();
		var senddate = $.trim($(".senddate").val());
		var receiver_address = $("#cust_address").val();
		var receiver_mobile = $("#cust_tel").val();
		var receiver_name = $("#cust_name").val();
		var orderothers = $("#cust_con").val();

		obj.cust_id = cust_id;
		obj.totalmoney = totalmoney;
		obj.senddate = senddate;
		obj.receiver_address = receiver_address;
		obj.receiver_mobile = receiver_mobile;
		obj.receiver_name = receiver_name;
		obj.orderothers = orderothers;

		/*json转义*/
		/*var json_data = JSON.stringify(_data);
		var json_userdata = JSON.stringify(obj);*/
		//console.log("暂存列表", json_data)
		//console.log("暂存客户", json_userdata)
	}

	/*暂存方法*/
	function save_ordercart_list() {
		var _data = [];
		var obj = {};
		var input_all = $(".ordercart_list_data");
		if(input_all.length == 0) {
			$.toast("请添加产品", "cancel");
		} else {
			/*销售结算数组定义*/
			get_ordercart_list(1, _data, obj);
			var json_data = _data;
			var json_userdata = obj;
			//console.log(json_userdata)
			$.ajax({
				type: "post",
				dataType: "json",
				contentType: "application/json",
				data: save_ordercart_list_param(json_data, json_userdata),
				url: "pubConfig",
				success: function(data) {
					//console.log("暂存返回内容", data);
					flag_val = data.Flag;
					msg_val = data.Msg;
					if(flag_val == 1) {

					} else {
						flag_type(flag_val, msg_val);
					}
					//$.toast("保存成功");
				},
				error: function() {
					$.alert("服务器忙碌，请稍候重试！");
				},
				complete: function() {}
			});
		}
	}

	/*暂存清空*/
	function clear_data(stat, data_num) {
		//console.log(data_num)
		var json_data = [];
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: clear_data_param(json_data),
			url: "pubConfig",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$(".shop_list_show").html("");
					//根据stat值跳转不同页面，清空跳转商城，保存跳转订单
					if(stat == 0) {
						window.location.href = "p_orderprodsearch.html?app_id=" + app_id;
					} else if(stat == 1) {
						window.location.href = "p_orderdetail.html?data_num=" + data_num + "&app_id=" + app_id;
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
	}

	/*保存*/
	$("#save_all").click(function() {
		var cust_name = $("#cust_name").val();
		var cust_address = $("#cust_address").val();
		var cust_tel = $("#cust_tel").val();
		if(cust_name == "") {
			$.toast("请输入姓名", "cancel");
		} else if(cust_address == "") {
			$.toast("请输入地址", "cancel");
		} else if(cust_tel == "") { /*|| !cust_tel.match(/^1(3|4|5|7|8)\d{9}$/)*/
			$.toast("请输入正确手机号", "cancel");
		} else {
			var _data = [];
			var obj = {};
			var input_all = $(".ordercart_list_data");
			if(input_all.length == 0) {
				$.toast("请添加产品", "cancel");
			} else {
				/*销售结算数组定义*/
				get_ordercart_list(2, _data, obj);
				obj.List = _data;
				var json_userdata = obj;
				//console.log(json_userdata)
				$.showLoading();
				$.ajax({
					type: "post",
					dataType: "json",
					contentType: "application/json",
					data: save_all_param(json_userdata),
					url: "shop",
					success: function(data) {
						flag_val = data.Flag;
						msg_val = data.Msg;
						var data_num = data.Data;
						//console.log("保存返回信息", data_num);
						$.hideLoading();
						if(flag_val == 1) {
							clear_data(1, data_num)
						} else {
							flag_type(flag_val, msg_val);
						}
					},
					error: function() {
						$.hideLoading();
						$.alert("服务器忙碌，请稍候重试！");
					},
					complete: function() {}
				});
			}
		}
	})

	/*js*/
	function ordercart_other() {
		/*时间选择器插件*/
		$("#senddate").calendar({
			value: [next_time()],
			minDate: now_time(),
		});

		/*获取当前时间后一天*/
		function next_time() {
			//为单数加个0
			function day_zero(s) {
				return s < 10 ? '0' + s : s;
			}
			var myDate = new Date();
			myDate.setDate(myDate.getDate() + 1);
			//获取当前年
			var year = myDate.getFullYear();
			//获取当前月
			var month = myDate.getMonth() + 1;
			//获取当前日
			var date = myDate.getDate();
			/*当前时间*/
			var now = year + '-' + day_zero(month) + "-" + day_zero(date);
			var time_show = [];
			time_show.push(now)
			return time_show;
		};

		/*获取当前时间*/
		function now_time() {
			//为单数加个0
			function day_zero2(s) {
				return s < 10 ? '0' + s : s;
			}
			var myDate = new Date();
			myDate.setDate(myDate.getDate() - 1);
			//获取当前年
			var year = myDate.getFullYear();
			//获取当前月
			var month = myDate.getMonth() + 1;
			//获取当前日
			var date = myDate.getDate();
			/*当前时间*/
			var now = year + '-' + day_zero2(month) + "-" + day_zero2(date);
			return now;
		};

		/*清空时间*/
		$(".time_del").click(function() {
			$(".senddate").val("");
		})

		/*计算金额*/
		function total_price() {
			$('.amount').each(function() {
				var price = $(this).closest('.shop_list_text_mag').find(".prodpriceout").text(); //单价
				var num = $(this).closest('.shop_list_text_mag').find(".amount").val(); //数量
				total_price2 = price * num;
				$(this).closest('.shop_list_text_mag').find(".totalmoney").html((total_price2).toFixed(2));
			})
			//计算总金额
			account();
		}
		//金额改变和退出，删除等操作执行一次暂存方法：save_ordercart_list
		/*计算总金额*/
		function account() {
			var inputs = $(".totalmoney");
			var sum = 0;
			for(var i = 0; i < inputs.length; i++) {
				var a = inputs[i].textContent;
				sum += Number(a);
			}
			save_ordercart_list();
			$(".totalmoney_all").text(sum.toFixed(2));
			$("#totalmoney").text(sum.toFixed(2));
		};

		total_price();

		/*计算列表数量*/
		function acount_list() {
			var inputs = $(".ordercart_list_data");
			var sum_list = inputs.length;
			$("#sum_list").text(sum_list);
		}
		acount_list();

		$(".amount").change(function() {
			var num = $(this).val();
			if(num == 0 || num == "") {
				$(this).val(1);
			}
			total_price();
		});

		/*点击减号*/
		$(".shop_btn_minus").click(function() {
			var num = $(this).siblings(".amount").val();
			//console.log(num)
			if(num > 1) {
				$(this).siblings(".amount").val(num - 1);
			}
			total_price();
		})

		/*点击加号*/
		$(".shop_btn_add").click(function() {
			var num = $(this).siblings(".amount");
			if(num.val() == "") {
				num.val(1);
			} else {
				num.val(parseInt(num.val()) + 1);
			}
			total_price();
		})

		/*返回按钮点击*/
		$(".merchant_nav_back").click(function() {
			save_ordercart_list();
			window.location.href = "p_orderprodsearch.html?app_id=" + app_id;
		})

		/*点击弹出下一步内容隐藏原内容*/
		$("#shop_next_from").click(function() {
			var input_all = $(".shop_list_content").find(".weui-panel");
			if(input_all.length == 0) {
				$.toast("请添加产品！", "cancel");
			} else {
				$("#shop_next_page").popup();
				$(".weui-tab").hide();
			}
		});

		/*关闭下一步内容显示原页面*/
		$("#exit").click(function() {
			save_ordercart_list();
			$(".weui-tab").show();
		});

		/*购物车清空*/
		$("#shop_empty").click(function() {
			$.confirm("确认清空订货车？", function() {
				clear_data(0);
			}, function() {
				//点击取消后的回调函数
			});
		})

		/*删除一条商品*/
		$(".shop_list_del").click(function() {
			var div_list = $(this).parents(".ordercart_list_data");
			var title = div_list.find(".prodname").text();
			var num;

			$.confirm("确认删除" + title + "吗？", function() {
				div_list.fadeOut(600, function() {
					div_list.remove();
					account();
					acount_list();
					num = $("#sum_list").text();
					//console.log(num)
					if(num == 0) {
						clear_data(0);
					} else {
						save_ordercart_list();
					}
				})
			}, function() {
				//点击取消后的回调函数
			});
		})

		/*数量正整数*/
		/*var name = $("#amount");
		$("#amount").keyup(function() {
			integer_number(name);
		})*/

		/*数量正整数*/
		/*$("#amount").blur(function() {
			integer_number(name);
		})*/
	}
})