$(function() {

	/*json数据*/
	function productlist_param(page, searchtext, prodsort) {
		var _param = {};
		var _data = {};
		_data.page_no = page;
		_data.page_size = 10;
		_data.prodsort = prodsort;
		_data.searchtext = searchtext;

		_param.action_sort = "10301";
		_param.data = _data;
		_param = JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}

	/*商品类型*/ 
	function prodsort_param() {
		var _param = {};
		var _data = {};
		_data.fieldname = "prodsort";
		_data.stat = 0;

		_param.action_sort = "9010201";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}
	/*商品列表加载*/
	var page = 1;
	porductlist_data(1, "", "");

	function porductlist_data(page, searchtext, prodsort) {
		//console.log("页数", page)
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: productlist_param(page, searchtext, prodsort),
			url: "merchant",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("商品列表", data)
				if(flag_val == 1) {
					var _data = data.Data.List;
					var appid = data.App_id;
					var prodstat;
					var productlist = $("#productlist_content");
					$("#add_product").attr("href","p_productadd.html?app_id=" + appid);
					if(_data.length > 0) {
						for(var i = 0; i < _data.length; i++) {
							if(_data[i].prodstat == 0) {
								prodstat = "上架";
							} else {
								prodstat = "下架";
							}
							productlist.append(
								"<div class='weui-panel mag_top_0 productmodify'>" +
								"<div class='weui-flex mag_top_5'>" +
								"<div class='weui-flex__item'>" +
								"<div class='uctlict_img_box'>" +
								"<img src=" + _data[i].prodpic + " class='uctlict_img' />" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex__item uctlict_text_mag'>" +
								"<div class='weui-flex text_size_15'>" +
								_data[i].prodname +
								"<span class='prodid cont_dispy_none'>" + _data[i].prodid +
								"</span></label></div>" +
								"<div class='weui-flex'>" +
								"<span>描述：</span>" +
								"<div id='' class='weui-flex__item'>" +
								_data[i].proddes + "</div>" +
								"</div>" +
								"<div class='weui-flex'>" +
								"<div class='weui-flex__item'>" +
								"<span>单位：</span>" +
								"<label>" + _data[i].unit_value + "</label>" +
								"</div>" +
								"<div class='weui-flex__item' style='margin-left: -20%;'>" +
								"<span>类型：</span>" + 
								"<label>" + _data[i].prodsort_value + "</label>" +
								"</div>" +
								"<div class='weui-flex__item' style='margin-left: -40%;'>" +
								"<label class='prodstat_color float_rt mag_rt_10p'>" + prodstat + "</label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex uctlict_price'>" +
								"<div class='weui-flex__item'>" +
								"<span>一星价:</span>" +
								"<label class='dispy_block'>" + (_data[i].price1).toFixed(2) + "<span>元</span></label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<span>二星价:</span>" +
								"<label class='dispy_block'>" + (_data[i].price2).toFixed(2) + "<span>元</span></label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<span>三星价:</span>" +
								"<label class='dispy_block'>" + (_data[i].price3).toFixed(2) + "<span>元</span></label>" +
								"</div>" +
								"</div>" +
								"<div class='weui-flex uctlict_price cont_dispy_none'>" +
								"<div class='weui-flex__item'>" +
								"<span>价格4:</span>" +
								"<label>" + (_data[i].price4).toFixed(2) + "</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<span>价格5:</span>" +
								"<label>" + (_data[i].price5).toFixed(2) + "</label>" +
								"</div>" +
								"<div class='weui-flex__item'>" +
								"<span>价格6:</span>" +
								"<label>" + (_data[i].price6).toFixed(2) + "</label>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>"
							)
						}
					} else {
						$("#login_up").hide();
						productlist.append(
							"<div class='weui-flex' style='margin-top: 20%;'>" +
							"<div class='weui-flex__item text_align_center'>" +
							"<label>系统没有找到商品！</label>" +
							"</div>" +
							"</div>" +
							"<div class='weui-flex mag_top_15p'>" +
							"<a href='p_productadd.html?app_id="+appid+"' class='weui-btn weui-btn_primary width_50'>添加</a>" +
							"</div>"
						)
					}
					has_next = data.Data.has_next;
				} else {
					$("#login_up").hide();
					flag_type(flag_val, msg_val);
				}
				//$.toast("保存成功");
			},
			error: function() {
				$("#login_up").hide();
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				product_Editor();
				text_color();
				loadmore(page, has_next);
			}
		});
	}

	/*滚动加载*/
	function loadmore(page, has_next) {

		if(has_next > 0) {
			$("#login_up").show();
			++page;
			console.log("页数2", page)
			console.log("下一页", has_next)
			var loading = false; //状态标记
			var searchtext = $("#searchInput").val();
			var prodsort = $(".prodsort_select").find("option:selected").val();
			if(prodsort == -1) {
				prodsort = "";
			}
			$(".productlist_content").infinite().off("infinite").on("infinite", function() {
				if(loading) return;
				loading = true;
				setTimeout(function() {
					porductlist_data(page, searchtext, prodsort)
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
		if(event.keyCode == 13) {
			search_list_on();
		}
	})
	//搜索方法
	function search_list_on() {
		$("#productlist_content").html("");
		var searchtext = $("#searchInput").val();
		var prodsort = $(".prodsort_select").find("option:selected").val();
		if(prodsort == -1) {
			prodsort = "";
		}
		porductlist_data(page, searchtext, prodsort);
	}

	/*下拉菜单搜索*/
	$(".prodsort_select").change(function() {
		search_list_on();
	})
	/*商品类型*/
	$(".prodsort_select").ready(function() {
		$.ajax({
			type: "post",
			dataType: "json",
			data: prodsort_param(),
			contentType: "application/json",
			url: "pubConfig",
			success: function(data) {
				//console.log("商品类型", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data.fieldlist;
					var selectcontent = $(".prodsort_select");
					for(var i = 0; i < _data.length; i++) {
						selectcontent.append(
							"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
						)
					}
				} else {
					flag_type(flag_val, msg_val);
				}

			},
			error: function() {},
			complete: function() {}
		});
	})

	/*上架颜色*/
	function text_color() {
		$(".prodstat_color:contains('上架')").css("color", "#1AAD19");
	}

	/*点击跳转修改*/
	function product_Editor() {
		$(".productmodify").click(function() {
			var app_id = GetParameter('app_id');
			var prodid = $(this).find(".prodid").text();
			window.location.href = "p_productmodify.html?prodid=" + prodid + "&app_id=" + app_id;
		})
	}
})