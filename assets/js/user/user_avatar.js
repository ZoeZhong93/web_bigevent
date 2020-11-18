$(function() {
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
});