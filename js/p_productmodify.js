$(function() {
	var prodid;
	var app_id = GetParameter('app_id');
	/*获取url参数*/
	$(document).ready(function() {
		prodid = GetParameter('prodid');
		if(prodid == null) {
			$.alert("商品信息错误！", function() {
				history.go(-1);
				location.reload();
			});
		}
	})
	/*json数据获取*/
	function productmodify_param(prodid) {
		var _param = {};
		var _data = {};
		_data.prodid = prodid;

		_param.action_sort = "10302";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
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

	/*商品单位*/
	function unit_param() {
		var _param = {};
		var _data = {};
		_data.fieldname = "unit";
		_data.stat = 0;

		_param.action_sort = "9010201";
		_param.data = _data;
		_param = JSON.stringify(_param);
		//console.log("输出",_param)
		return _param;
	}

	/*新单位*/
	function save_unit_param(sysname) {
		var _param = {};
		var _data = {};
		_data.fieldname = "unit";
		_data.sysname = sysname;
		_data.sn = 0;
		_data.fieldtitle = "单位";

		_param.action_sort = "90102022";
		_param.data = _data;
		_param = JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}

	/*新类型*/
	function save_prodsort_param(sysname) {
		var _param = {};
		var _data = {};
		_data.fieldname = "prodsort";
		_data.sysname = sysname;
		_data.sn = 0;
		_data.fieldtitle = "商品类型";

		_param.action_sort = "90102022";
		_param.data = _data;
		_param = JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}
	/*保存*/
	function save_data_param(prodname, unit, prodsort, prodpic) {
		var prod_barcode = "";

		var proddes = $("#proddes").val();
		var prodstat = $(".prodstat").find("option:selected").val();
		var prodpic = prodpic;
		var price1 = $("#price1").val();
		var price2 = $("#price2").val();
		var price3 = $("#price3").val();
		var price4 = $("#price4").val();
		var price5 = $("#price5").val();
		var price6 = $("#price6").val();

		var _param = {};
		var _data = {};
		var price = {};

		_data.prod_barcode = prod_barcode;
		_data.prodid = prodid;
		_data.prodname = prodname;
		_data.proddes = proddes;
		_data.prodsort = prodsort;
		_data.unit = unit;
		_data.prodstat = prodstat;
		_data.prodpic = prodpic;
		price.price1 = price1;
		price.price2 = price2;
		price.price3 = price3;
		price.price4 = price4;
		price.price5 = price5;
		price.price6 = price6;

		_data.price = price;
		_param.action_sort = "10306";
		_param.data = _data;
		_param = JSON.stringify(_param);
		console.log("输出", _param)
		return _param;
	}
	/*ajax*/

	/*数据填充*/
	$(".weui-tab__bd").ready(function() {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: productmodify_param(prodid),
			beforeSend: function() {
				$.showLoading();
			},
			url: "merchant",
			success: function(data) {
				flag_val = data.Flag;
				msg_val = data.Msg;
				console.log("商品信息", data)
				if(flag_val == 1) {
					var _data = data.Data;
					$("#prodname").val(_data.prodname);
					$("#proddes").val(_data.proddes);
					$("#prodsort").val(_data.prodsort_value);
					$("#unit").val(_data.unit_value);
					$('.img_editor').attr('src', _data.prodpic);
					$(".prodstat").val(_data.prodstat);
					$(".unit_id").text(_data.unit);
					$(".prodsort_id").text(_data.prodsort);

					$("#price1").val(_data.price1);
					$("#price2").val(_data.price2);
					$("#price3").val(_data.price3);
					$("#price4").val(_data.price4);
					$("#price5").val(_data.price5);
					$("#price6").val(_data.price6);
				} else {
					flag_type(flag_val, msg_val);
				}
				//$.toast("保存成功");
			},
			error: function() {
				$.alert("服务器忙碌，请稍候重试！");
			},
			complete: function() {
				textarea_num();
				$.hideLoading();
			}
		});
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
				console.log("商品类型", data)
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
			complete: function() {
				unit_select();
			}
		});
	})

	/*商品单位*/
	function unit_select() {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: unit_param(),
			url: "pubConfig",
			success: function(data) {
				console.log("单位", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data.fieldlist;
					var selectcontent = $(".unit_select");
					for(var i = 0; i < _data.length; i++) {
						selectcontent.append(
							"<option value=" + _data[i].id + ">" +
							_data[i].sysname + "</option>"
						)
					}
				} else {
					flag_type(flag_val, msg_val);
				}

			},
			error: function() {},
			complete: function() {}
		});
	}

	/*判断重复类型*/
	function repeat_prodsort() {
		var sysname = $(".prodsort").val();
		var prodsort_arr = $(".prodsort_select").find("option");
		//console.log("单位", prodsort_arr);
		var test;
		var prodsort_val;
		for(var i = 0; i < prodsort_arr.length; i++) {
			test += prodsort_arr[i].label + ",";
			prodsort_val += prodsort_arr[i].value + ",";
		}
		test = test.split(',');
		prodsort_val = prodsort_val.split(',');
		var suoyin = "";
		suoyin = $.inArray(sysname, test);
		if(suoyin == -1) {
			save_newprodsort(sysname);
		} else {
			var id = prodsort_val[suoyin];
			//console.log("类型已存在", id);
			$(".prodsort_id").text(id);
			//单位重复
			repeat_form();
		}
	}

	/*重复单位*/
	function repeat_form() {
		var sysname = $(".unit").val();
		var unit_arr = $(".unit_select").find("option");
		//console.log("单位", unit_arr);
		var test;
		var unit_val;
		for(var i = 0; i < unit_arr.length; i++) {
			test += unit_arr[i].label + ",";
			unit_val += unit_arr[i].value + ",";
		}
		test = test.split(',');
		unit_val = unit_val.split(',');
		var suoyin = "";
		suoyin = $.inArray(sysname, test);
		console.log(suoyin);
		if(suoyin == -1) {
			//保存新单位
			save_newunit(sysname);
		} else {
			var id = unit_val[suoyin];
			console.log("单位已存在", id);
			$(".unit_id").text(id);
			//图片上传
			img_uplode();
		}
	}

	/*保存新类型*/
	function save_newprodsort(sysname) {
		$.ajax({
			type: "post",
			dataType: "json",
			data: save_prodsort_param(sysname),
			contentType: "application/json",
			url: "pubConfig",
			success: function(data) {
				console.log("新类型", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data;
					$(".prodsort_id").text(_data);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {},
			complete: function() {
				//单位重复
				repeat_form();
			}
		});
	}

	/*保存新单位*/
	function save_newunit(sysname) {
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: save_unit_param(sysname),
			url: "pubConfig",
			success: function(data) {
				console.log("新单位", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					var _data = data.Data;
					$(".unit_id").text(_data);
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {},
			complete: function() {
				img_uplode();
			}
		});
	}

	/*保存*/
	$("#upfrom").unbind("click").bind("click", function() {
		/*先判断输入保存图片*/
		$.toast.prototype.defaults.duration = 1000;
		var type = 1;
		var price;
		$("#all_price").find(".price").each(function() {
			if($.trim($(this).val().length) == 0) {
				$.toast("请输入销售价格", "cancel");
				type = 0
			}
		})
		if(type == 1) {
			var prodsort_val = $(".prodsort").val();
			var unit_val = $(".unit").val();
			var prodname = $("#prodname").val();

			var unit = $(".unit_id").text();
			var prodsort = $(".prodsort_id").text();
			if(prodname == "") {
				$.toast("请输入商品名称", "cancel");
			} else if(prodsort_val == "" || prodsort == -1) {
				$.toast("请输入或选择商品类型", "cancel");
			} else if(unit_val == "" || unit == -1) {
				$.toast("请输入或者选择单位", "cancel");
			} else {
				$.showLoading();
				//判断类型是否重复
				repeat_prodsort();
			}
		}
	})

	/*图片上传ajax*/
	function img_uplode() {
		var prodpic = $('.weui-uploader__input-box img').attr("data-src");
		if(prodpic == undefined) {
			prodpic = $('.img_editor').attr('src');
			save_all_text(prodpic);
		} else {
			function dataURItoBlob(prodpic) {
				var byteString = atob(prodpic.split(',')[1]);
				var mimeString = prodpic.split(',')[0].split(':')[1].split(';')[0];
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				for(var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ab], {
					type: mimeString
				});
			}

			//构造FormData 
			var fd = new FormData();
			var blob = dataURItoBlob(prodpic);
			fd.append('file', blob);
			//console.log(blob)
			$.ajax({
				type: "post",
				data: fd,
				processData: false, // 必须
				contentType: false, // 必须
				url: "uploadpic",
				success: function(data) {
					console.log("保存图片成功", data);
					$('.img_editor').attr('src', data);
				},
				error: function() {},
				complete: function() {
					prodpic = $('.img_editor').attr('src');
					//console.log("图片",prodpic)
					save_all_text(prodpic)
				}
			});
		}
	}
	var unit;
	var prodsort;
	/*保存图片完成后执行方法*/
	function save_all_text(prodpic) {
		$.toast.prototype.defaults.duration = 1000;
		var prodsort_val = $(".prodsort").val();
		var unit_val = $(".unit").val();
		var prodname = $("#prodname").val();
		unit = $(".unit_id").html();
		prodsort = $(".prodsort_id").html();
		$.ajax({
			type: "post",
			dataType: "json",
			contentType: "application/json",
			data: save_data_param(prodname, unit, prodsort, prodpic),
			url: "merchant",
			success: function(data) {
				$.hideLoading();
				console.log("保存", data)
				flag_val = data.Flag;
				msg_val = data.Msg;
				if(flag_val == 1) {
					$.toast("更新成功", function() {
						window.location.href = "p_productlist.html?app_id=" + app_id;
					});
				} else {
					flag_type(flag_val, msg_val);
				}
			},
			error: function() {
				$.hideLoading();
			},
			complete: function() {}
		});
	}

	/*js*/
	/*图片压缩显示*/
	$('#uploaderInput').on('change', bcilck);
	$('#uploadercamera').on('change', bcilck);

	function bcilck() {
		var $this = $(this);
		// 获取上传文件信息集合
		var fileInfo = this.files[0];

		// 判断是否为图片格式
		if(fileInfo.type.indexOf('image') == -1) {
			alert('请选择图片');
			return;
		}

		// 获取图片暂存路径
		/*var url = (window.webkitURL ? webkitURL : window.URL).createObjectURL(fileInfo);*/
		url = (window.URL ? URL : window.URL).createObjectURL(fileInfo);
		if(url) {
			// 创建一个图片
			var img = new Image();
			// 把获取的图片路径赋值给他
			img.src = url;
			// 这个图片加载后
			img.onload = function() {
				var imgWidth = img.width;
				var imgHeight = img.height;
				var maxWidth = 600;
				var maxHeight = 600;
				var resultWidth = 0;
				var resultHeight = 0;
				var degree = 0;
				var flag;

				// 图片尺寸按照比例缩放
				if(imgWidth > imgHeight) {
					if(imgWidth > maxWidth) {
						resultWidth = maxWidth;
						resultHeight = maxWidth * imgHeight / imgWidth;
					} else {
						resultWidth = imgWidth;
						resultHeight = imgHeight;
					}
				} else {
					if(imgHeight > maxHeight) {
						resultHeight = maxHeight;
						resultWidth = maxHeight * imgWidth / imgHeight;
					} else {
						resultWidth = imgWidth;
						resultHeight = imgHeight;
					}
				}

				// 插入图片并显示
				$('.weui-uploader__input-box img').attr('src', url).show();
				// 给canvas赋值压缩后的宽高
				var canvas = document.querySelector('.weui-uploader__input-box canvas');
				canvas.width = resultWidth;
				canvas.height = resultHeight;

				// 绘图环境
				var ctx = canvas.getContext('2d');

				// 在canvas上存放图片
				ctx.drawImage(img, 0, 0, resultWidth, resultHeight);

				// canvas转base64，图片质量0.7
				var base64 = canvas.toDataURL('image/jpeg', 0.7);

				// 把压缩后的base64存放到img上，方便开发获取
				$('.weui-uploader__input-box img').attr('data-src', base64);
				//$('#imgbox').addClass("weui-uploader__input_2");
				$('.img_editor').addClass("cont_dispy_none");
				//$(".weui-uploader__input-box").hide();
				//$("#uploaderFiles").show();
				// 测试
				// $('body').append('<img src="'+base64+'" />');
			};
		}
	};

	/*select选择*/
	$("#prodsort_select").change(function() {
		var prodsort = $(".prodsort_select").find("option:selected").text();
		var prodsort_id = $(".prodsort_select").find("option:selected").val();
		$(".prodsort").val(prodsort);
		$(".prodsort_id").text(prodsort_id);
	})

	$("#unit_select").change(function() {
		var unit = $(".unit_select").find("option:selected").text();
		var unit_id = $(".unit_select").find("option:selected").val();
		$(".unit").val(unit);
		$(".unit_id").text(unit_id);
	})

	/*失去焦点文字靠左*/
	$(".price").blur(function() {
		$(".price").css("text-align", "left");
		price_change();
	})

	/*点击文字居中*/
	$(".price").focus(function() {
		$(this).css("text-align", "center");
		this.select();
	})

	/*金额变化*/
	$(".price").change(function() {
		price_change();
	})

	function price_change() {
		var price_copy = $(this).val();
		$("#all_price").find(".price").each(function() {
			if($(this).val() == "") {
				if(!price_copy.match(/^[0-9]+([.][0-9]+){0,1}$/)) {
					$(this).val(1)
				} else {
					$(this).val(price_copy);
				}
			}
		})
	}

	/*文本字数统计*/
	function textarea_num() {
		var text2 = $(".weui-textarea").val();
		var counter2 = text2.length;
		$(".textarea_num").text(counter2);
		$(".weui-textarea").on('blur keyup input', function() {
			var text2 = $(".weui-textarea").val();
			var counter = text2.length;
			$(".textarea_num").text(counter);
		});
	}
})