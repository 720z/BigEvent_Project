// 修改密码模块
$(function() {
    const { form } = layui

    //1.表单验证
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        confirmPass: function(val) {
            if (val !== $('#pass').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    // 2.表单提交
    $('.layui-form').submit(function(e) {
        e.preventDefault()

        //发送ajsx请求
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改密码失败！')
                }
                //提示用户
                layer.msg('修改密码成功！')
            })

    })
})