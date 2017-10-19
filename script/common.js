//图片上传预览    IE是用了滤镜。
function previewImage(file) {
	var MAXWIDTH = 100;
	var MAXHEIGHT = 100;
	var div = document.getElementById('preview');
	if(file.files && file.files[0]) {
		div.innerHTML = '<img id=imghead>';
		var img = document.getElementById('imghead');
		img.onload = function() {
			var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
			img.width = rect.width;
			img.height = rect.height;
			//                 img.style.marginLeft = rect.left+'px';
			// img.style.marginTop = rect.top+'px';
		}
		var reader = new FileReader();
		reader.onload = function(evt) { img.src = evt.target.result; }
		reader.readAsDataURL(file.files[0]);
	} else //兼容IE
	{
		var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
		file.select();
		var src = document.selection.createRange().text;
		div.innerHTML = '<img id=imghead>';
		var img = document.getElementById('imghead');
		img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
		var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
		status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
		div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
	}
}

function clacImgZoomParam(maxWidth, maxHeight, width, height) {
	var param = { top: 0, left: 0, width: width, height: height };
	if(width > maxWidth || height > maxHeight) {
		rateWidth = width / maxWidth;
		rateHeight = height / maxHeight;

		if(rateWidth > rateHeight) {
			param.width = maxWidth;
			param.height = Math.round(height / rateWidth);
		} else {
			param.width = Math.round(width / rateHeight);
			param.height = maxHeight;
		}
	}
	param.left = Math.round((maxWidth - param.width) / 2);
	param.top = Math.round((maxHeight - param.height) / 2);
	return param;
}

//上传图片
	$('.uploadImg').click(function(){
		layer.open({
			type: 1,
			title: "上传图片",
			area:['500px',''],
			offset: 'center',
			content: $('#Uploadpicture'), //捕获的元素
			success: function(obj, index) {
				$('.close').click(function(){
					layer.close(index);
				})
				$('#previewImg').change(function(){
				   		previewImage(file);
				   		
				   })
				$('#uploadImg').click(function(){
					var srcs=$('#imghead').attr('src');
					if(srcs){
						$('.company_logo').attr('src',srcs);
						layer.close(index);
					}else{
						layer.confirm("请选择公司logo！");
					}
				})
			}
		})
	})
	
//后端处理   引入ajaxfileupload.js
function ajaxFileUpload() {
    $.ajaxFileUpload({
        url: '/company/uploadImgLog', //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'previewImg', //文件上传域的ID
        dataType: 'json', //返回值类型 一般设置为json
        success: function (data) { //服务器成功响应处理函数
            alert(data)
            $("#logo").val(data);  //讲返回的图片路径加载隐藏域中
        },
        error: function (data){//服务器响应失败处理函数
            alert(data.message);
        }
    })
}