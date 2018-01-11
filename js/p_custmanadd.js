$(function() {
	//从url获取参数
	var nickname = GetParameter('nickname');
	var headimgurl = GetParameter('headimgurl');
	var apply_text = GetParameter('msg');
	var msg_type = GetParameter('msg_type');
	var appid = GetParameter('app_id');
	//获取参数赋值
	$(".shop_manadd_herd").attr("src", headimgurl);
	$(".nickname").text(nickname);
	$(".apply_text").text(apply_text);
	if(msg_type == 1) {
		$("#check_click").click(function() {
			window.location.href = "p_orderprodsearch.html?app_id=" + appid;
		})
	} 
})