$(function() {
    // 从layui中提取模块
    const { layer } = layui
    //1.获取用户的个人信息
    function getUserInfo() {

        //发送ajax请求
        axios.get('/my/userinfo').then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }

            const { data } = res //解构res
            //渲染用户信息
            // 1.获取用户名
            const name = data.nickname || data.username
                // 2.渲染昵称
            $('.nickname').text(`欢迎 ${name}`).show()
                // 3.渲染头像
            if (data.user_pic) {
                $('.avatar').prop('src', data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                $('.text-avatar').text(name[0].toUpperCase()).show()
                $('.avatar').hide()
            }
        })
    }

    getUserInfo()

    // 2.点击退出
    $('#logout').click(function() {
        //请求接口(模拟)
        // 1.清除token令牌
        localStorage.removeItem('token')

        // 2.跳转到登录页
        location.href = './login.html'
    })

})