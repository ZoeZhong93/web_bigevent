$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义美化事件的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        var year = dt.getFullYear();
        var month = padZero(dt.getMonth() + 1);
        var day = padZero(dt.getDay());
        var h = padZero(dt.getHours());
        var m = padZero(dt.getMinutes());
        var s = padZero(dt.getSeconds());
        return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    }

    // 定义补0的函数
    function padZero(n) {
        return n < 10 ? "0" + n : n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        // 默认请求第一页的数据
        pagenum: 1,
        // 默认每页显示两条
        pagesize: 2,
        // 文章分类id
        cate_id: '',
        // 文章发布状态
        state: ''
    }
    initTable();
    initCate();

    // 为筛选表单绑定submit提交事件
    $("#form-search").on('submit', function(e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 为查询参数对q中对应的额属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件忠祠内渲染表格的数据
        initTable();
    });

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                /* res.data[2] = {
                    title: '我的股市',
                    cate_name: "股市",
                    pub_date: '2020-11-19 11:30:30',
                    state: '已发布'
                }; */
                // 使用模板引擎渲染列表数据
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }

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

    // 定义渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            // 分页容器的id
            elem: 'pageBox',
            // 总数据条数
            count: total,
            // 每页显示几条数据
            limit: q.pagesize,
            // 设置默认被选择的分页
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10, 20],
            // 分页发生切换的时候，触发 jump回调函数
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调，此时first值为false
            // 2.只要调用了laypage.render方法，就会触发jump回调,此时first值为true
            jump: function(obj, first) {
                // 把最新的页码值赋值给q
                q.pagenum = obj.curr;
                // 把最新的条目数值赋值给q
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable();
                }

            }
        });
    }

    // 通过代理的方式，为删除按钮绑定点击事件
    $("tbody").on('click', '.btn-del', function() {
        var id = $(this).attr("data-id");
        // 获取删除按钮的个数
        var len = $(".btn-del").length();
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败！");
                    }
                    layer.msg("删除文章成功！");
                    // 当数据删除完成后，需判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1，再重新调用initTable方法
                    // 可以通过删除按钮的个数来判断当前这一页中有没有剩余数据
                    // 如果len值为1，则表示删除完之后这一页上没有数据
                    if (len === 1) {
                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });

            layer.close(index);
        });
    })
});