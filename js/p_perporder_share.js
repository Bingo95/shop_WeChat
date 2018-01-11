var page_url;
var appid_ajax;
var timestamp_ajax;
var nonceStr_ajax;
var signature_ajax;

page_url = window.location.href;

function perprod_share_param(page_url) {
	var _param = {};
	var _data = {};
	
	//page_url =encodeURIComponent(page_url);
	_data.url = page_url;
	 
	_param.action_sort = "901900";
	_param.data = _data; 
	_param = JSON.stringify(_param);
	//console.log("输出",_param)
	return _param;
} 

/*ajax获取配置参数*/
$.ajax({
	type: 'post',
	dataType: "json",
	contentType: "application/json",
	async: false,
	data: perprod_share_param(page_url),
	url: "pubConfig",
	success: function(data) {
		appid_ajax = data.appid;
		timestamp_ajax = data.timestamp;
		nonceStr_ajax = data.nonceStr;
		signature_ajax = data.signature;
	},
	error: function() {
		$.alert("服务器忙碌。");
	},
});

/*通过config接口注入权限验证配置*/
wx.config({
	debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	appId: appid_ajax, // 必填，公众号的唯一标识
	timestamp: timestamp_ajax, // 必填，生成签名的时间戳
	nonceStr: nonceStr_ajax, // 必填，生成签名的随机串
	signature: signature_ajax, // 必填，签名，见附录1
	jsApiList: // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		[
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'hideMenuItems'
		]
});

wx.ready(function() {
	wx.hideMenuItems({ // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
		menuList: [
			"menuItem:share:qq",
			"menuItem:share:weiboApp",
			"menuItem:share:facebook",
			"menuItem:share:QZone",
			"menuItem:copyUrl",
			"menuItem:openWithQQBrowser",
			"menuItem:openWithSafari",
			"menuItem:favorite",
			"menuItem:share:brand",
			"menuItem:share:email",
			"menuItem:readMode",
			"menuItem:editTag",
			"menuItem:delete",
			"menuItem:originPage",
		]
	});

	/*获取“分享到朋友圈”按钮点击状态及自定义分享内容接口*/
	wx.onMenuShareTimeline({

		title: "来订货", // 分享标题

		link: page_url,

		imgUrl: "http://order.jidisoft.com/img/logo_order.jpg", // 分享图标

	});

	// 获取“分享给朋友”按钮点击状态及自定义分享内容接口
	wx.onMenuShareAppMessage({

		title: "来订货", // 分享标题

		desc: "订货系统就用【来订货】", // 分享描述

		link: page_url,

		imgUrl: "http://order.jidisoft.com/img/logo_order.jpg", // 分享图标

		type: 'link', // 分享类型,music、video或link，不填默认为link

	});
});