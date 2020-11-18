$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        "pwd": [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        "samePwd": function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新密码与原密码不能相同！";
            }
        },
        // 校验两次密码是否一致的规则
        "repwd": function(value) {
            var pwd = $("[name=newPwd]").val()
            if (pwd !== value) {
                return '新密码与确认新密码不一致，请确认';
            }
        }
    });

    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 重置表单
                $(".layui-form")[0].reset();
            }
        });
    })
});