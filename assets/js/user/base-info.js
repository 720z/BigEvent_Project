// 基本资料功能
$(function() {
    const { layer, form } = layui
    // 1.页面一加载就获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            //校验请求失败
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            const { data } = res //解构res
            // 渲染页面
            // 注意: edit-userinfo是表单lay-filter属性的值  data对象中属性名和表单name值一一对应
            form.val('edit-userinfo', data)
        })
    }

    initUserInfo()

    // 2.表单验证
    form.verify({
        nick: [
            /^\S{1,6}$/,
            '昵称长度必须在1 ~ 6 个字符之间'
        ]
    })

    // 3.提交修改
    $('.base-info-form').submit(function(e) {
        e.preventDefault()

        //发送ajax请求
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                //校验失败
                if (res.status !== 0) {
                    return layer.msg('修改信息失败！')
                }

                layer.msg('修改信息成功！')
                    //更新用户信息
                    // console.log(window.parent.document.querySelector('.nickname'));
                window.parent.getUserInfo()
            })
    })

    // 4.重置功能
    $('#btnReset').click(function(e) {
        e.preventDefault()

        //重新渲染用户信息
        initUserInfo()
    })

})