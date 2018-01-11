$(function() {
	var cust_id;
	var mans;
	var appid = "";
	/*获取url参数*/
	$(document).ready(function() {
		cust_id = GetParameter('cust_id');
		if(cust_id == null) {
			$.alert("客户信息错误！", function() {
				history.go(-1);
				location.reload();
			});
		} else {
			cust_param(cust_id);
		}
	})

	/*json*/
	//客户信息
	function cust_param(cust_id) {
		var _param = {};
		var _data = {};
		_data.cust_id = cust_id;

		_param.action_sort = "10103";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	//保存
	function cust_save_param(cust_id) {
		var _param = {};
		var _data = {};

		var cust_name = $("#cust_name").val();
		var cust_con = $("#cust_con").val();
		var cust_address = $("#cust_address").val();
		var cust_tel = $("#cust_tel").val();
		var cust_others = $("#cust_others").val();
		var price_sort = $("#price_sort").find("option:selected").val();
		var cust_stat = $("#cust_stat").find("option:selected").val();

		_data.cust_id = cust_id;
		_data.cust_name = cust_name;
		_data.cust_con = cust_con;
		_data.cust_address = cust_address;
		_data.cust_tel = cust_tel;
		_data.cust_others = cust_others;
		_data.price_sort = price_sort;
		_data.cust_stat = cust_stat;

		_param.action_sort = "10102";
		_param.data = _data;
		_param = JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}

	/*ajax*/
	//客户信息
	$("#cust_content").ready(function() {
		$.ajax({
			type: "POST",
			url: "merchant",
			data: cust_param(cust_id),
			contentType: "application/json",
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("客户信息", data)
				if(flag_val == 1) {
					$.hideLoading();
					var _data = data.Data;
					appid = data.App_id;
					$("#cust_content").attr("name", appid);
					$("#cust_name").val(_data.cust_name);
					$("#cust_con").val(_data.cust_con);
					$("#cust_address").val(_data.cust_address);
					$("#cust_tel").val(_data.cust_tel);
					$("#cust_others").val(_data.cust_others);

					if(_data.price_sort == " ") {
						$("#price_sort").val(1);
					} else {
						$("#price_sort").val(_data.price_sort);
					}
					$("#cust_stat").val(_data.cust_stat);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
			complete: function() {
				$.hideLoading();
			}
		});
	})

	//保存ajax
	function cust_save_js() {
		$.ajax({
			type: "POST",
			url: "merchant",
			data: cust_save_param(cust_id),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("客户信息", data)
				$.hideLoading();
				if(flag_val == 1) {
					appid = $("#cust_content").attr("name");
					$.toast("保存成功", function() {
						window.location.href = "p_custlist.html?app_id=" + appid;
					});
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

	//保存事件
	$("#upfrom").click(function() {
		$.toast.prototype.defaults.duration = 800;

		var cust_name = $("#cust_name").val();
		var cust_con = $("#cust_con").val();
		var cust_address = $("#cust_address").val();
		var cust_tel = $("#cust_tel").val();
		var cust_stat = $("#cust_stat").find("option:selected").val();

		var price_sort = $("#price_sort").find("option:selected").val();
		if(cust_name == "") {
			$.toast("请输入客户名称", "cancel");
		} else if(cust_con == "") {
			$.toast("请输入联系人", "cancel");
		} else if(cust_address == "") {
			$.toast("请输入联系地址", "cancel");
		} else if(cust_tel == "" || !cust_tel.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$.toast("请输入正确手机号", "cancel");
		} else if(cust_stat == 1) {
			$.toast("请选择审核状态", "cancel");
		} else {
			cust_save_js();
		}
	})
})