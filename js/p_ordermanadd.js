$(function() {
	//获取url参数
	var nickname = GetParameter('nickname');
	var headimgurl = GetParameter('headimgurl');
	var apply_text = GetParameter('msg');
	var msg_type = GetParameter('msg_type');
	var appid = GetParameter('app_id');
	//填充信息
	$(".shop_manadd_herd").attr("src", headimgurl);
	$(".nickname").text(nickname);
	$(".apply_text").text(apply_text);
	if(msg_type == 1) {
		$("#check_click").click(function() {
			window.location.href = "p_homepage_order.html?app_id=" + appid;
			//window.location.href = "choosemerchant?app_id=" + appid;
		})
	}
})