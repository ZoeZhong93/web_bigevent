// 每次调用 $.get / $.post / $.ajax 的时候，会先调用这个$.ajaxPrefilter函数
// 在这个函数中可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax请求之前，统一拼接请求的根路径
    options.url = "http://ajax.frontend.itheima.net" + options.url;
});