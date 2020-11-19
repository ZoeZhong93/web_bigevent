$(function() {
    var layer = layui.layer;
    // 1.1获取裁剪区域的DOM元素
    var image = $("#image");
    // 1.2配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3创建裁剪区域
    image.cropper(options);

    // 监听上传按钮点击事件
    $("#btnChooseImage").on('click', function() {
        $("#file").click();
    });

    // 为文件选择框绑定change事件
    $("#file").on("change", function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg("请选择照片！");
        }
        // 拿到用户选择的文件
        var file = filelist[0];
        // 根据选择的文件，创建一个对应的URL地址
        var newImageURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // 为确定按钮，绑定点击事件
    $("#btnUpload").on('click', function() {
        // 要拿到用户裁剪之后的头像
        var dataUrl = image
            .cropper('getCroppedCanvas', { // 创建一个Canvas画布
                width: 100,
                height: 100
            }).toDataURL('image/png'); // 将Cancas画布上的内容，转化为base64格式的字符串
        // 用接口上传图片
        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: {
                avatar: dataUrl
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新头像失败！");
                }
                layer.msg("更新头像成功！");
                window.parent.getUserInfo();
            }
        });
    });
});