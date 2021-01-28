$(function() {
    //从layui中提取form表单模块 和layer弹框模块
    // var form = layui.form
    const { form, layer } = layui //解构赋值

    // 1.点击链接进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })

    //2.校验表单项
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePass: function(value) {
            if (value != $('#pass').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    //3.实现表单注册功能
    $('.reg-form').submit(function(e) {
        e.preventDefault() // 阻止默认提交行为

        //发送ajax
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res)

                //校验请求失败
                if (res.status !== 0) {
                    return layer.msg('注册失败！')
                }

                //自动跳转到登录
                layer.msg('注册成功！')
                $('.login-form a').click()
            })
    })

    //4.实现表单注册功能
    $('.login-form').submit(function(e) {
        e.preventDefault() // 阻止默认提交行为

        //发送ajax
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res)

                //校验请求失败
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }

                //登录成功后，首先吧token(个人身份凭证，令牌)保存到本地存储
                localStorage.setItem('token', res.token)
                layer.msg('登录成功！')

                //跳转到首页
                location.href = './index.html' //此处全局路径
            })
    })


})