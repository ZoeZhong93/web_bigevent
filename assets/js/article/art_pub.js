$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！");
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通知layui重新渲染表单的UI结构
                form.render();
            }
        });
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面按钮绑定点击事件
    $("#btnChooseImage").on('click', function() {
        $("#file").click();
    });

    // 监听coverFile事件
    $("#file").on('change', function(e) {
        // 获取文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return;
        }
        // 1.拿到用户选择的文件
        var file = files[0];
        // 2.根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        //3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // 定义文章状态
    var art_state = '已发布';
    // 为存为草稿按钮绑定点击事件
    $("#btnSave2").on('click', function() {
        art_state = "草稿";
    });

    // 为表单绑定submit提交事件
    $("#form-pub").on('submit', function(e) {
        e.preventDefault();
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态保存到formData中
        fd.append("state", art_state);
        fd.forEach(function(v, k) {
            console.log(k, v);
        });

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append("cover_img", blob);
            });
        // 发起ajax数据请求
        publishArticle(fd);
    });

    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意，如果向服务器提交的是FormData格式的数据，必须添加以下两个数据项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                location.href = "../../../article/art_list.html";
            }
        });
    }
});