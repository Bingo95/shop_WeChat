<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

	<head>
		<title>微信认证中...</title>
		<link rel="stylesheet" type="text/css" href="css/weui.min.css" />
		<link rel="stylesheet" type="text/css" href="css/jquery-weui.min.css" />
	</head>

	<body onload="redirect();">
		<script>
			function redirect() {
				$.showLoading();
				var page = '<%=request.getParameter("page")%>';
				window.location.href =
					"http://wx.jidisoft.com/oauthpub_redirect.jsp?r_url=http://192.168.1.70:8080/p_erp_order/merchantenter?page=" + page;
			}
		</script>
	</body>
	<script src="js/jquery-3.2.1.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/jquery-weui.min.js" type="text/javascript" charset="utf-8"></script>

</html>