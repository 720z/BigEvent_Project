//文章管理=>文章列表页面
//功能：表格的增删改查
$(function() {
    const { form, laypage } = layui

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

            // 1.5坑:动态穿件的表单元素需要手动更新表单
            form.render('select')
        })
    }

    // 2. 定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码页，第几页
        pagesize: 4, //表示每页显示的数据条数
        cate_id: '', //表示文章的分类id
        state: '' //表示文章的状态
    }

    // 3.发送请求到服务器，封装函数
    renderTable()

    function renderTable() {
        // 3.1 发送请求
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            if (res.status !== 0) return layer.msg('获取失败!')

            //7. 处理时间格式(在调用模版引擎之前)
            template.defaults.imports.dateFormat = function(time) {
                return moment(time).format('YYYY-MM-DD HH:mm:ss')
            }

            // 3.2 使用模版引擎渲染页面
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)

            // 3.4 渲染分页器
            renderPage(res.total)
        })
    }

    // 4.把服务端获取的数据，渲染成分页器
    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的数量
            limits: [2, 3, 4, 5], //每页的数据条数
            curr: query.pagenum, //当前的页面值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的布局排版
            //切换
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //4.2修改查询对象的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit

                //首次不执行
                if (!first) {
                    //4.3非首次进去页面，重新渲染表格数据
                    renderTable()
                }
            }

        })
    }

    // 5.表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault()

        // 5.1获取下拉选择器的分类和状态this.seralize()
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        console.log(cate_id, state);

        // 5.2 把获取到的值重新赋值给query对象
        query.cate_id = cate_id
        query.state = state

        // 5.3重新调用渲染表格函数
        renderTable()
    })

    // 6.点击删除按钮，删除当前的文章
    $(document).on('click', '.del-btn', function() {
        //6.1获取自定义属性值
        const id = $(this).data('id')
        console.log(id);

        // 6.2 弹出一个询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //点击确定按钮，删除
            axios.get(`/my/article/delete/${id}`).then(res => {
                if (res.status !== 0) return layer.msg('删除失败!')
                layer.msg('删除成功!')

                //⭐填坑处理：当前页只有一条数据，且不处于第一页时，那么我们点击删除数据之后，应手动更新上一页数据
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum = query.pagenum - 1
                }

                //小细节：提交发送请求之前，修改页码值为第一页的内容
                query.pagenum = 1


                renderTable() //重新渲染
            })

            layer.close(index);
        });
    })

    // 7.点击“编辑”，跳转到编辑页面
    $(document).on('click', '.edit-btn', function() {
        //获取当前文章id
        const id = $(this).data('id')

        //把当前编辑的文章id 传入到编辑页面
        location.href = `./edit.html?id=${id}`

        //左边导航条更新，自动触发文章列表页a 链接的点击事件
        window.parent.$('.layui-this').next().find('a').click()
    })



})