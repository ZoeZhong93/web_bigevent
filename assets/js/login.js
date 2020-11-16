$(function() {
    $("#link_reg").on('click', function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link_login").on('click', function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    // 从layui中获取form对象
    var form = layui.form;
    // 从layui中获取layer对象
    var layer = layui.layer;
    form.verify({
        "pwd": [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        "repwd": function(value) {
            var pwd = $(".reg-box [name=password]").val()
            if (pwd !== value) {
                return '两次密码输入不一致，请确认';
            }
        }
    });

    // 监听表单注册事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        };
        $.post("/api/reguser", data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $("#link_login").click();
        });
    });

    // 监听登录事件
    $("#form_login").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // 将登录成功得到的 token 字符串，保存到localStorage中
                localStorage.setItem("token", res.token);
                // 跳转到后台主页
                location.href = "./index.html";
            }
        })
    });
});