axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // console.log('----发送ajax请求前', config)

    // 在发送请求之前判断是否有 /my开头的请求路径
    //如果有，手动添加headers 请求头
    // 方法1：startsWith   方法2：正则表达式 /^\/my/.test()  方法3：indexOf('/my') == 0
    // console.log(config.url);
    const token = localStorage.getItem('token') || ''
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }

    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // console.log('----接收ajax响应前', response)

    const { message, status } = response.data
        //先判断身份验证是否成功
    if (message == '身份认证失败！' && status == 1) {
        //清除本地存储的token
        localStorage.removeItem('token')

        //跳转到登录页
        location.href = './login.html'
    }
    // 对响应数据做点什么
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});