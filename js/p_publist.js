$(document).ready(function() {
	var fieldname = $("#fieldname").html();
	get_publist(fieldname);
});

////列表////
function get_publist(fieldname) {

	$.ajax({
		type: "POST",
		url: "pubConfig",
		data: param_publist(fieldname),
		beforeSend: function() {
			$.showLoading();
		},
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			console.log(data)
			var obj = data;
			if(obj.Flag == "1") {

				var obj_data = obj.Data;
				var fieldname = obj_data.fieldname;
				var fieldtitle = obj_data.fieldtitle;
				var fieldcount = obj_data.fieldcount;

				$("#fieldtitle").html(fieldtitle);

				var id = "";
				var sysname = "";
				var sn = "";
				var stat = "0";
				var d_val = "";

				var myobj = obj_data.fieldlist;
				var d_sn = 0;

				for(var i = 0; i < myobj.length; i++) {

					d_sn = i + 1;
					id = myobj[i].id;
					sysname = myobj[i].sysname;
					//sysname=sysname.replace(new RegExp("\"","gm"),"")
					//sysname=sysname.replace(new RegExp("\'","gm"),"")
					sn = myobj[i].sn;
					stat = myobj[i].stat;

					d_val = d_val + "<div class=\"weui-cell\">";
					d_val = d_val + "<div class=\"weui-cell__hd pub_cont_num\">";
					d_val = d_val + "<label>" + d_sn + "</label>";
					d_val = d_val + "</div>";
					d_val = d_val + "<div class=\"weui-cell__bd\">";
					d_val = d_val + "<p><span id=sysname_"+id+">" + sysname + "</span><span class='pub_a'>(" + sn + ")<span></p>";
					d_val = d_val + "</div>";

					if(stat == "0") {
						d_val = d_val + "<div class=\"weui-cell__ft\">";
						d_val = d_val + "<a class=\"weui-btn weui-form-preview__btn pub_btn_edit\"  onclick=\"get_pubmodify(" + id + ");\">修改</a>";
						d_val = d_val + "</div>";
					}

					d_val = d_val + "<div class=\"weui-cell__ft\">";
					if(stat == "0") {
						d_val = d_val + "<a class=\"weui-btn weui-form-preview__btn pub_btn_del\" onclick=\"get_pubdel('" + id + "');\">删除</a>";
					} else {
						d_val = d_val + "<a class=\"weui-btn weui-form-preview__btn pub_btn_del\" onclick=\"get_pubundel('" + id + "');\">还原</a>";
					}
					d_val = d_val + "</div>";
					d_val = d_val + "</div>";
				}
				$("#list").html(d_val);
			} else {
				alert(obj.Msg);
			}
		},
		complete: function() {
			$.hideLoading();
		},
		error: function() {
			$.alert("服务器忙碌，请稍后再试!");
		},
	});
}

function param_publist(fieldname) {

	var _param = {};
	var _data = {};
	_data.fieldname = fieldname;
	_data.stat = "9";

	_param.action_sort = "9010201";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;

}

////列表删除////
function get_pubdel(id) {

	var fieldname = $("#fieldname").html();
	
    var sysname = $("#sysname_"+id).html();

	if(confirm("确实要删除【" + sysname + "】吗?")) {
		$.ajax({
			type: "POST",
			url: "pubConfig",
			data: param_pubdel(id),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {

				var obj = data;
				$.hideLoading();
				if(obj.Flag == "1") {
					$.toast("删除完成!");
					get_publist(fieldname);
				} else {
					alert(obj.Msg);
				}
			},
			complete: function() {
				$.hideLoading();
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
		});
	}
}

function param_pubdel(id) {
	var _param = {};
	var _data = {};
	_data.id = id;

	_param.action_sort = "9010204";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}

////列表还原////
function get_pubundel(id) {

	var fieldname = $("#fieldname").html();
	var sysname = $("#sysname_"+id).html();
	if(confirm("确实要还原【" + sysname + "】吗?")) {
		$.ajax({
			type: "POST",
			url: "pubConfig",
			data: param_pubundel(id),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {

				var obj = data;
				$.hideLoading();
				if(obj.Flag == "1") {
					$.toast("还原完成!");
					get_publist(fieldname);
				} else {
					alert(obj.Msg);
				}
			},
			complete: function() {
				$.hideLoading();
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
		});
	}
}

function param_pubundel(id) {

	var _param = {};
	var _data = {};
	_data.id = id;

	_param.action_sort = "9010205";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}

////列表新增////
function get_pubadd() {

	var fieldname = $("#fieldname").html();

	$.ajax({
		type: "POST",
		url: "pubConfig",
		data: param_pubadd(fieldname),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {

			var obj = data;
			if(obj.Flag == "1") {
				var obj_data = obj.Data;
				var sn = obj_data.sn;

				$("#sn_add").val(sn);
				$("#sysname_add").val("");

				$("#pop_add").popup();
			} else {
				alert(obj.Msg);
			}
		},
		complete: function() {},
		error: function() {
			$.alert("服务器忙碌，请稍后再试!");
		},
	});
}

function param_pubadd(fieldname) {

	var _param = {};
	var _data = {};
	_data.fieldname = fieldname;

	_param.action_sort = "90102021";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}
////列表新增保存////
function get_pubaddsave() {
	var fieldname = $("#fieldname").html();
	var fieldtitle = $("#fieldtitle").html();
	var sn = $("#sn_add").val();
	var sysname = $("#sysname_add").val();

	if(sn == "") {
		alert("请输入序号!");
	} else if(sysname == "") {
		alert("请输入名称!");
	} else {
		$.ajax({
			type: "POST",
			url: "pubConfig",
			data: param_pubaddsave(fieldname, sn, sysname, fieldtitle),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {

				var obj = data;
				$.hideLoading();
				if(obj.Flag == "1") {
					$.toast("保存完成!");
					$.closePopup();
					get_publist(fieldname);
				} else {
					alert(obj.Msg);
				}
			},
			complete: function() {
				$.hideLoading();
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
		});
	}
}

function param_pubaddsave(fieldname, sn, sysname, fieldtitle) {

	var _param = {};
	var _data = {};
	_data.fieldname = fieldname;
	_data.sn = sn;
	_data.sysname = sysname;
	_data.fieldtitle = fieldtitle;

	_param.action_sort = "90102022";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}
//列表修改
function get_pubmodify(id) {

	$.ajax({
		type: "POST",
		url: "pubConfig",
		data: param_pubmodify(id),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {

			var obj = data;
			if(obj.Flag == "1") {
				var obj_data = obj.Data;
				var sn = obj_data.sn;
				var sysname = obj_data.sysname;

				$("#id_modify").html(id);
				$("#sn_modify").val(sn);
				$("#sysname_modify").val(sysname);

				$("#pop_modify").popup();

			} else {
				alert(obj.Msg);
			}
		},
		error: function() {
			$.alert("服务器忙碌，请稍后再试!");
		},
	});
}

function param_pubmodify(id) {

	var _param = {};
	var _data = {};
	_data.id = id;

	_param.action_sort = "90102031";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}
////列表修改保存////
function get_pubmodifysave() {

	var fieldname = $("#fieldname").html();
	var id = $("#id_modify").html();
	var fieldtitle = $("#fieldtitle").html();
	var sn = $("#sn_modify").val();
	var sysname = $("#sysname_modify").val();

	if(sn == "") {
		alert("请输入序号!");
	} else if(sysname == "") {
		alert("请输入名称!");
	} else {
		$.ajax({
			type: "POST",
			url: "pubConfig",
			data: param_pubmodifysave(fieldname, id, sn, sysname, fieldtitle),
			beforeSend: function() {
				$.showLoading();
			},
			dataType: "json",
			contentType: "application/json",
			success: function(data) {

				var obj = data;
				$.hideLoading();
				if(obj.Flag == "1") {
					$.toast("保存完成!");
					$.closePopup();
					get_publist(fieldname);
				} else {
					alert(obj.Msg);
				}
			},
			complete: function() {
				$.hideLoading();
			},
			error: function() {
				$.alert("服务器忙碌，请稍后再试!");
			},
		});
	}
}

function param_pubmodifysave(fieldname, id, sn, sysname, fieldtitle) {

	var _param = {};
	var _data = {};
	_data.fieldname = fieldname;
	_data.id = id;
	_data.sn = sn;
	_data.sysname = sysname;
	_data.fieldtitle = fieldtitle;

	_param.action_sort = "90102032";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;
}

function text_color() {
	$(".pub_btn_del:contains('还原')").css("color", "gray");
}