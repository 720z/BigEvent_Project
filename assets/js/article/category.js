//文章管理=>文章类别管理页面
//功能：1.页面一加载渲染列表  2.添加类别  3.编辑类别  4.删除

$(function() {
    const { layer, form } = layui
    //定义弹出层的id (索引)
    let index

    // 1.从服务器获取文章列表，并渲染到页面(封装成一个函数)
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
            // 1.2判断请求失败
            if (res.status !== 0) return layer.msg('获取分类列表失败')

            // 1.4 请求成功TODO
            // 使用模版引擎渲染页面：1.引入插件 2.准备一个模版 3.调用一个模板函数template(id, 数据对象)
            const htmlStr = template('tpl', res)
                // console.log(htmlStr);
            $('tbody').empty()
            $('tbody').append(htmlStr)
        })
    }
    getCateList()

    // 2.点击添加按钮，添加一个文章分类
    $('.add-btn').click(function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('.add-form-container').html() //这里content是一个普通的String
        });
    })

    // 3.监听添加表单的提交事件
    // 注意：这个表单是点击之后添加的，后创建的元素绑定事件统一使用"事件委托"
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()

        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            console.log(res);
            //判断失败
            if (res.status !== 0) return layer.msg('获取列表失败!')

            layer.msg('添加成功!')

            //3.3成功TODO
            layer.close(index) //关闭弹框
            getCateList() //重新渲染
        })
    })


    // 4.点击编辑按钮，弹出编辑表单
    $(document).on('click', '.edit-btn', function() {
        // 4.1点击之后，显示一个弹出层
        index = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('.edit-form-container').html(),
        });

        // 4.2 获取自定义属性的值
        const id = $(this).data('id')

        // 4.3 发送请求，获取当前分类属性
        axios.get(`/my/article/cates/${id}`).then(res => {
            // console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')

            // 4.4 对编辑表单进行渲染赋值
            form.val("edit-form", res.data)
        })

    })

    // 5 .监听编辑表单的提交事件
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()

        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('提交失败!')

            layer.msg('修改成功!')
            layer.close(index) //关闭弹框
            getCateList() //重新渲染
        })
    })

    // 6.点击删除按钮
    $(document).on('click', '.del-btn', function() {
        // 获取自定义属性的值
        const id = $(this).data('id')
        console.log(id);

        //弹出"确认"框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //点击确定按钮，删除
            axios.get(`/my/article/deletecate/${id}`).then(res => {
                if (res.status !== 0) return layer.msg('删除失败!')
                layer.msg('删除文章分类成功!')
                getCateList() //重新渲染
            })

            layer.close(index);
        });
    })

})