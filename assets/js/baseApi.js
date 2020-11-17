// 每次调用 $.get / $.post / $.ajax 的时候，会先调用这个$.ajaxPrefilter函数
// 在这个函数中可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax请求之前，统一拼接请求的根路径
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    // 统一为有权限的接口，设置headers请求头
    // headers 就是请求头配置对象
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        };
    }
    // 全局统一挂在 complete回调函数
    // 不论成功还是失败，最终都会调用complete
    options.complete = function(res) {
        // 在complete回调函数中可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空本地存储中的token
            localStorage.removeItem("token");
            // 2.跳到登录页
            location.href = "./login.html";
        }
    }
});