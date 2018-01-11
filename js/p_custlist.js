$(function() {
	var app_id = GetParameter('app_id');
	/*json*/
	//列表
	function custlist_param(page_no, price_sort, searchtext) {
		var _param = {};
		var _data = {};
		_data.page_no = page_no;
		_data.page_size = 10;
		_data.price_sort = price_sort;
		_data.searchtext = searchtext;

		_param.action_sort = "10101";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出", _param)
		return _param;
	}

	/*ajax*/
	var page_no = 1;
	custlist_list(1, "", "");
	//获取列表信息
	function custlist_list(page_no, price_sort, searchtext) {
		if(price_sort == -1) {
			price_sort = "";
		}
		$.ajax({
			type: 'post',
			dataType: "json",
			contentType: "application/json",
			data: custlist_param(page_no, price_sort, searchtext),
			url: "merchant",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					console.log("客户列表", data)
					var _data = data.Data.List;
					var mans_list = "";
					has_next = data.Data.has_next;
					/*列表填充*/
					var listcontent = $("#custlist_content");
					//判断是否有客户数据，有则填充数据，无则填充提示
					if(_data.length == 0) {
						$("#login_up").hide();
						listcontent.append(
							"<div class='weui-flex'>" +
							"<div class='weui-flex__item text_align_center mag_top_15p' style='margin-top: 20%;'>" +
							"<label>SORRY,没有找到客户数据!</label>" +
							"</div>" +
							"</div>"
						);
					} else {
						for(var i = 0; i < _data.length; i++) {
							var _data_man = _data[i].mans;
							mans_list = "";
							for(var a = 0; a < _data_man.length; a++) {
								mans_list += "<div class='weui-flex mag_top_5'>" +
									"<img src=" + _data_man[a].headimgurl + " class='merchant_cont_user_img' />" +
									"<div class='weui-flex__item'>" +
									"<label class='merchant_cont_rate mag_lt_5p'>" + _data_man[a].nickname + "</label>" +
									"<label> " + _data_man[a].inputdate.substring(0, 19) + "</label>" +
									"</div>" +
									"</div>";
							}

							//状态文字替换
							if(_data[i].cust_stat == 0) {
								cust_stat = "已通过";
							} else if(_data[i].cust_stat == 1) {
								cust_stat = "待审核";
							} else {
								cust_stat = "不通过";
							}

							//用户级别文字替换
							var sort_num = _data[i].price_sort;
							if(sort_num == 0) {
								price_sort = "待定级";
							} else if(sort_num == 1) {
								price_sort = "一星客户";
							} else if(sort_num == 2) {
								price_sort = "二星客户";
							} else if(sort_num == 3) {
								price_sort = "三星客户";
							} else if(sort_num == 4) {
								price_sort = "四星客户";
							} else if(sort_num == 5) {
								price_sort = "五星客户";
							} else if(sort_num == 6) {
								price_sort = "六星客户";
							}

							listcontent.append(
								"<div class='weui-panel merchant_cont custcheck'>" +
								"<div class='onclisk'>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>" + _data[i].cust_name + "</label>" +
								"<label class='cont_dispy_none cust_id'>" + _data[i].cust_id + "</label>" +
								"</div>" +
								"<div class='text_size_13'>" +
								"<label>" + _data[i].cust_inputdate.substring(0, 19) + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='merchant_cont_text'>" +
								"<div class='weui-flex'>" +
								"<label>联系地址:</label>" +
								"<div class='weui-flex__item merchant_cont_site'>" +
								"<label class='float_lt'>" + _data[i].cust_address + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label class='float_lt'>联系人:</label>" +
								"<div class='float_lt merchant_cont_human'>" +
								"<label>" + _data[i].cust_tel + "</label> " +
								"<label>" + _data[i].cust_con + "</label>" +
								"</div>" +
								"<label class='float_rt cust_stat'>" + cust_stat + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>客户级别:  </label>" +
								"<label class='merchant_cont_rate'>" + price_sort + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<label>备注: </label>" +
								"<label class='merchant_cont_rate'>" + _data[i].cust_others + "</label>" +
								"</div>" +
								"</div>" + mans_list + "</div>" +
								"</div>" +
								"</div>"
							);
						}
					}
				} else {
					$("#login_up").hide();
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$("#login_up").hide();
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				text_color();
				loadmore(page_no, has_next);
				product_Editor();
			}
		});
	}

	/*滚动加载*/
	function loadmore(page_no, has_next) {
		if(has_next > 0) {
			$("#login_up").show();
			++page_no;
			var loading = false; //状态标记
			var searchtext = $("#searchInput").val();
			var price_sort = $(".price_stat_select").find("option:selected").val();
			$(".custlist_content").infinite().on("infinite", function() {
				if(loading) return;
				loading = true;
				setTimeout(function() {
					//获取列表信息
					custlist_list(page_no, price_sort, searchtext)
				}, 500);
			});
		} else if(has_next == 0) {
			$("#login_up").hide();
		}
	}

	/*输入框搜索*/
	$("#search_shop").click(search_list_on);

	/*回车搜索*/
	$("#searchInput").keydown(function() {
		if(event.keyCode == 13) { //回车键的键值为13
			//搜索方法
			search_list_on();
		}
	});

	/*下拉菜单搜索*/
	$(".price_stat_select").change(function() {
		//搜索方法
		search_list_on();
	})

	/*搜索*/
	function search_list_on() {
		$("#custlist_content").html("");
		var searchtext = $("#searchInput").val();
		var price_sort = $(".price_stat_select").find("option:selected").val();
		//获取列表信息
		custlist_list(page_no, price_sort, searchtext)
	}
	/*js*/
	/*文字颜色*/
	function text_color() {
		$(".cust_stat:contains('已通过')").css("color", "#1AAD19");
		$(".cust_stat:contains('待审核')").css("color", "red");
	}

	/*点击跳转修改*/
	function product_Editor() {
		$(".custcheck").click(function() {
			var cust_id = $(this).find(".cust_id").text();
			window.location.href = "p_custcheck.html?cust_id=" + cust_id + "&app_id=" + app_id;
		})
	}
})