$(function() {
    // 调用getUserInfo函数，获取用户信息
    getUserInfo();

    var layer = layui.layer;
    $("#btnLogout").on('click', function() {
        // 弹出提示框，提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地存储中的token
            localStorage.removeItem("token");
            // 2.跳到登录页
            location.href = "./login.html";
            layer.close(index);
        });
    });
});

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用renderAvatar函数渲染用户头像
            renderAvatar(res.data);
        }
    });
}

// 渲染用户投降
function renderAvatar(user) {
    // 设置欢迎文本
    var username = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp" + username);
    // 按需渲染用户的头像
    var user_pic = user.user_pic;
    if (!user_pic) {
        // 渲染文本头像
        $(".layui-nav-img").hide();
        var first = username[0].toUpperCase();
        $(".text-avatar").html(first).show();
    } else {
        // 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    }
}