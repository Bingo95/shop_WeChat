<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
 <%   
  String fieldname=request.getParameter("fieldname");
 %>
<!DOCTYPE html> 
<html lang="zh-cmn-Hans">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
	<title>配置列表</title>
		<link rel="stylesheet" type="text/css" href="css/weui.min.css" />
		<link rel="stylesheet" type="text/css" href="css/jquery-weui.min.css" />
		<link rel="stylesheet" type="text/css" href="css/pub.css"/>
		<link rel="stylesheet" type="text/css" href="css/p_ordercart_style.css"/>
	

	</head>
	<style type="text/css">
		.weui-cell:before {
			left: 0px;
		}
		
		.weui-navbar {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			position: absolute;
			z-index: 9;
			top: 0;
			width: 100%;
			background-color: #fafafa;
		}
		
		.weui-popup__container,
		.weui-popup__overlay {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			z-index: 10;
			background-color: rgba(6, 6, 6, 0.2);
		}
	</style>


	<body>
		<!-- 容器 -->
		<div class="weui-tab">
			<!--nav-->
			<div class="weui-navbar">
				<div class="weui-flex width_all">
					<div class="weui-flex__item">
						<img class="merchant_nav_back history_back" src="img/pub_back.png" />
					</div>
					<div class="weui-flex__item uctlist_nav_title text_color_black">
						<label class="out_homepage">主目录</label>
					</div>
					<div class="weui-flex__item">
						<a class="weui-btn weui-form-preview__btn pub_btn_add" onclick="get_pubadd();">新增</a>
					</div>
				</div>
			</div>
			<!--content-->
			<div class="weui-tab__bd">
				<div class="weui-tab__bd-item weui-tab__bd-item--active mag_top_up10">
					<div class="weui-cells__title text_size_17" id="fieldtitle"></div>
					<div id="fieldname" style="display:none;"><%=fieldname%></div>
					<div class="weui-cells pub_cont_list">
						<div id="list"></div> 
					</div>
				</div>

			</div>
		</div>

		<div id="pop_add" class="weui-popup__container popup-bottom">
			<div class="weui-popup__overlay"></div>
			<div class="weui-popup__modal">
				<div class="weui-cells__title text_size_17">
					<label>新增</label>
				</div>
				
				<div class="weui-cells weui-cells_form pub_about_box">
					<div class="weui-cell pub_about_lt">
						<div class="weui-cell__hd">
							<label class="mag_rt_10p text_color_gray">名称</label>
						</div>
						<div class="weui-cell__bd">
							<input id="sysname_add" class="weui-input" type="text" maxlength="5">
						</div>
					</div>
					<div class="weui-cell pub_about_lt">
						<div class="weui-cell__hd">
							<label class="mag_rt_10p text_color_gray">排序</label>
						</div>
						<div class="weui-cell__bd">
							<input id="sn_add" class="weui-input" type="text" maxlength="8">
						</div>
					</div>
				</div>

				<div class="weui-form-preview__ft">
					<a id="" class="weui-form-preview__btn weui-form-preview__btn_default pub_about_keep" onclick="get_pubaddsave();">保存</a>
					<a id="" class="weui-form-preview__btn weui-form-preview__btn_primary close-popup pub_about_close">取消</a>
				</div>
			</div>
		</div>
	
	
			<div id="pop_modify" class="weui-popup__container popup-bottom">
			<div class="weui-popup__overlay"></div>
			<div class="weui-popup__modal">
				<div class="weui-cells__title text_size_17">
					<label>修改</label>
				</div>
				<div id="id_modify" style="display:none;"></div>
				<div class="weui-cells weui-cells_form pub_about_box">
					<div class="weui-cell pub_about_lt">
						<div class="weui-cell__hd">
							<label class="mag_rt_10p text_color_gray">名称</label>
						</div>
						<div class="weui-cell__bd">
							<input id="sysname_modify" class="weui-input" type="text" maxlength="5">
						</div>
					</div>
					<div class="weui-cell pub_about_lt">
						<div class="weui-cell__hd">
							<label class="mag_rt_10p text_color_gray">排序</label>
						</div>
						<div class="weui-cell__bd">
							<input id="sn_modify" class="weui-input" type="text" maxlength="8">
						</div>
					</div>
				</div>

				<div class="weui-form-preview__ft">
					<a id="" class="weui-form-preview__btn weui-form-preview__btn_default pub_about_keep" onclick="get_pubmodifysave();">保存</a>
					<a id="" class="weui-form-preview__btn weui-form-preview__btn_primary close-popup pub_about_close">取消</a>
				</div>
			</div>
		</div>
		
	</body>
	<!--jquery+weui-->
	<script src="js/jquery-3.2.1.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/jquery-weui.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/p_perporder_pub.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/p_publist.js" type="text/javascript" charset="utf-8"></script>
</html>