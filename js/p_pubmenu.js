$(document).ready(function() {
	get_menulist();
});

function get_menulist() {

	$.ajax({
		type: "POST",
		url: "pubConfig",
		data: createQuery_param(),
		beforeSend: function() {
			$.showLoading();
		},
		dataType: "json",
		contentType: "application/json",
		success: function(data) {

			var obj = data;
			if(obj.Flag == "1") {
				var fieldname = "";
				var fieldtitle = "";
				var fieldcount = "";
				var d_val = "";
				var myobj = obj.Data;

				for(var i = 0; i < myobj.length; i++) {
					fieldname = myobj[i].fieldname;
					fieldtitle = myobj[i].fieldtitle;
					fieldcount = myobj[i].fieldcount;

					d_val = d_val + "<div class=\"weui-cell pubmod_list\" onclick=\"show_publist('" + fieldname + "');\">";
					d_val = d_val + "<div class=\"weui-cell__hd\">";
					d_val = d_val + "<label class=\"weui-label width_all\">" + fieldtitle + "（<span>" + fieldcount + "</span>）</label>";
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

function createQuery_param() {

	var _param = {};
	var _data = {};

	_param.action_sort = "90101";
	_param.data = _data;
	_param = JSON.stringify(_param);

	return _param;

}

function show_publist(fieldname) {
	var app_id = GetParameter('app_id');
	location.href = "p_publist.jsp?fieldname=" + fieldname + "&app_id=" + app_id;
}