$(function () {
    app.init()
    $(window).resize(function () {
        app.resizeIframe()
    })
})

var app = {

    init: function () {
        this.slideToggle();
        this.resizeIframe()
        this.confirmDelete()
        this.changeStatus()
        this.changeNum()
    },

    slideToggle: function () {

        $('.aside>li:nth-child(6) ul').hide()
        $('.aside h4').click(function () {
            $(this).siblings('ul').slideToggle();
        })
    },
    resizeIframe: function () {
        $("#rightMain").height($(window).height() - 80)
    },
    // 删除操作提示
    confirmDelete: function () {
        $(".delete").click(function () {
            var flag = confirm("您确实要删除吗?")
            return flag
        })
    },

    //异步修改状态
    changeStatus: function () {
        // 获取点击事件
        $(".chStatus").click(function () {
            // 获取点击的标签中的自定义属性值
            var id = $(this).attr("data-id")
            var table = $(this).attr("data-table")
            var field = $(this).attr("data-field")
            var el = $(this)
            // 执行Ajax操作,调用上面定义的API接口
            $.get("/admin/main/changeStatus", {id: id, table: table, field: field}, function (response) {
                if (response.success) {
                    if (el.attr("src").indexOf("yes") != -1){
                        el.attr("src","/static/admin/images/no.gif")
                    }else {
                        el.attr("src","/static/admin/images/yes.gif")
                    }
                }else{
                    console.log(response)
                }
            })
        })
    },
    // 异步修改数字
    changeNum:function () {
        $(".chSpanNum").click(function () {
            var id = $(this).attr("data-id")
            var table = $(this).attr("data-table")
            var field = $(this).attr("data-field")
            var spanNum = $(this).attr("data-num")
            var spanEl = $(this)

            var input = $("<input value='' style='width:60px' />")
            $(this).html(input)
            $(input).trigger('focus').val(spanNum) // 输入框获取焦点,并获取值
            // 阻止冒泡
            $(input).click(function (e) {
                e.stopPropagation()
            })
            $(input).blur(function () {
                var inputNum = $(this).val()
                spanEl.html(inputNum)
                // 异步修改数字
                $.get("/admin/main/editNum", {id: id, table: table, field: field,num:inputNum}, function (response) {
                    if (!response.success) {
                        console.log(response)
                    }
                })
            })
        })
    }
}


