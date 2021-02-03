// 文章管理=>发表文章页面
// 功能：1.获取所有文章分类列表
$(function() {
    const { form } = layui
    // 定义一个全局变量
    let state

    //接受列表页传来的查询参数

    console.log(location.search);

    //获取查询参数中的id值
    const arr = location.search.slice(1).split('=')
    const id = arr[1]
    console.log(arr);

    //发送请求到服务器，获取当前这条 id 的文章详情
    function getArtDetail(id) {
        axios.get(`/my/article/${id}`).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')

            //给form表单赋值数据
            form.val('edit-form', res.data)

            // 2.初始化富文本编辑器
            initEditor()

            //替换裁剪区中的封面图片
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        })
    }
    // getArtDetail(id)

    // 1.从服务器获取文章的分类列表
    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')

            // 1.4 遍历数组，渲染下拉组件的选项
            res.data.forEach(item => {
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            })

            // 手动更新表单
            form.render('select')

            getArtDetail(id)
        })
    }




    // 3.初始化裁剪区域
    const $image = $('#image')
    $image.cropper({
        //指定长宽比
        aspectRatio: 10 / 7,
        crop: function(event) {
            // console.log(event.detail.x); //裁剪框的坐标
            // console.log(event.detail.y); //裁剪框的坐标
        },
        //指定预览区
        preview: '.img-preview',
        viewMode: 3
    });

    // 4.为选择封面按钮绑定点击事件
    $('#choose-btn').click(function() {
        $('#file').click()
    })

    // 5.监听文件框状态改变事件change:file,checkbox,select
    $('#file').change(function() {
        // 获取用户上传的文件列表
        // console.log(this.files); //伪数组

        //判断用户是否上传
        if (this.files.length == 0) return

        //把文件转成url地址的形式
        const imgURL = URL.createObjectURL(this.files[0])
            // console.log(imgURL);

        //替换裁剪区的图片 方案二
        $image.cropper('replace', imgURL)

        // $image.cropper('destroy').prop('src', imgURL).cropper({
        //     //指定长宽比
        //     aspectRatio: 10 / 7,
        //     //指定预览区，提供元素的选择器
        //     preview: '.img-preview'
        // })
    })

    // 6.监听表单的提交事件(点击发布或存为草稿)
    $('.publish-form').submit(function(e) {
        e.preventDefault()

        // 7.3 获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toBlob(blob => {
            //获取表单中所有的内容(formdata格式)
            const fd = new FormData(this)

            // 7.2 向fd中新增state数据
            fd.append('state', state)

            // console.log(blob); //二进制图片数据
            // 7.4 把获取添加到formdata中
            fd.append('cover_img', blob)

            // 7.5 TODO发送请求，提交数据到服务器
            publishArticle(fd)
        })

    })

    // 7.点击发布
    $('.last-row button').click(function() {
        // 7.1获取自定义属性值
        state = $(this).data('state')
    })

    // 8.在外层封装一个发布文章请求的函数，参数为fd数据
    function publishArticle(fd) {
        //发送之前，向formdata数据中添加一条 id 数据
        fd.append('Id', id)
        axios.post('/my/article/edit', fd).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('发布失败!')
            layer.msg(state == '草稿' ? '已存至为草稿！' : '编辑文章成功！')

            // TODO: 跳转到文章列表页面,点击a链接
            location.href = './list.html' //全局路径
            window.parent.$('.layui-this').prev().find('a').click()
        })

    }
})