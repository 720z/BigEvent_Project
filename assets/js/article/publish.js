// 文章管理=>发表文章页面
// 功能：1.获取所有文章分类列表
$(function() {
    const { form } = layui
    // 定义一个全局变量
    let state

    // 1.从服务器获取文章的分类列表
    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')

            // 1.4 遍历数组，渲染下拉组件的选项
            res.data.forEach(item => {
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            })

            // 1.5坑:动态穿件的表单元素需要手动更新表单
            form.render('select')
        })
    }

    // 2.初始化富文本编辑器
    initEditor()


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

        // 6.1获取表单中所有的内容(formdata格式)
        //相关方法：append() set() get() forEach()
        const fd = new FormData(this)
        fd.forEach(item => {
            // console.log(item);
        })

        // 7.2 向fd中新增state数据
        fd.append('state', state)

        // 7.3 获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toBlob(blob => {
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
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('发布失败!')
            layer.msg(state == '草稿' ? '已存至为草稿！' : '发布文章成功！')

            // TODO: 跳转到文章列表页面,点击a链接
            location.href = './list.html' //全局路径
            window.parent.$('.layui-this').prev().find('a').click() //通过类名layui-this往上一层跳一格，控制高亮区域
        })

    }
})