(function ($) {

    var app = {
        init: function () {

            this.initSwiper();
            this.initContenTabs();
            this.initNavSlide();
            this.initContentColor();
        },
        initSwiper: function () {
            new Swiper('.swiper-container', {
                loop: true,
                autoplay:true,
                speed:2000,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                effect:'fade',
            });
        },
        initNavSlide: function () {
            $("#nav_list>li").hover(function () {
                $(this).find('.children-list').stop().fadeIn();
            }, function () {
                $(this).find('.children-list').stop().fadeOut();
            });

            $(".all_goods_cate > li").each(function () {
                var th = $(this)
                $(this).mousemove(function () {
                    th.children().css("color", "white")
                }).mouseout(function () {
                    th.children().css("color", "black")
                })
            });
        },
        initContenTabs: function () {
            $('.detail_info .detail_info_item:first').addClass('active');
            $('.detail_list li:first').addClass('active');
            $('.detail_list li').click(function () {
                var index = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $('.detail_info .detail_info_item').removeClass('active').eq(index).addClass('active');

            })
        },
        initContentColor: function () {
            var _that = this
            $("#color-list .banben").click(function () {
                $(this).addClass("active").siblings().removeClass("active")
                $("#color_name").html($("#color-list .active .yanse").html())
                var color_id = $(this).attr("color_id")
                var goods_id = $(this).attr("goods_id")
                $.get("/product/getImgList", {"goods_id": goods_id, "color_id": color_id}, function (response) {
                    if (response.success) {
                        var data = response.result
                        var str = ""
                        for (var i = 0; i < data.length; i++) {
                            str += '<div class="swiper-slide"><img src="'+'http://bee.sunyj.xyz/'+data[i].img_url+'"> </div>'
                        }
                        $("#item_focus").html(str)
                        _that.initSwiper()
                    }
                })
            })
        }
    }

    $(function () {


        app.init();
    })


})($)
