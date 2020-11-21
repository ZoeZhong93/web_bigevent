$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！");
                }
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr)
            }
        });
    }

    // 给添加类别按钮绑定点击事件
    var indexAdd = null;
    $("#btnAddCate").on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    });

    // 通过代理方式，为form-add表单绑定submit事件
    $("body").on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        });
    });

    // 通过代理方式，为编辑按钮绑定点击事件
    var indexEdit = null;
    $("tbody").on('click', ".btn-edit", function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $("#dialog-edit").html()
        });

        var id = $(this).attr("data-id");

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败!');
                }
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过代理方式，为form-edit表单绑定submit事件
    $("body").on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                // 根据索引关闭弹出层
                layer.close(indexEdit);
            }
        });
    });

    // 通过代理方式，为删除按钮绑定点击事件
    $("tbody").on('click', ".btn-del", function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    initArtCateList();
                }
            });
            layer.close(index);
        });
    });
});