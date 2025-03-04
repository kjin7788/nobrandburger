$(document).ready(function () {
     new Swiper('.swiper', {
        loop: true, 
        slidesPerView: 1, 
        spaceBetween: 0, 
        // autoplay: {
        //     delay: 5000, 
        //     disableOnInteraction: false,
        //   },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              const formattedIndex = (index + 1).toString().padStart(2, '0');
              return '<span class="' + className + '">' + formattedIndex + '</span>';
            },
          },
        navigation: {
          nextEl: '.btn-next',
          prevEl: '.btn-prev', 
        },
    });

    AOS.init({
        duration: 1200,
        once: false   
    });

    const $cards = $(".card");
    VanillaTilt.init($cards.get(), {
        max: 5,
        speed: 500,
        glare: true,
        "max-glare": 1,
    });

    // 풀페이지
    let sectionSpeed = 500;
    let sectionPos = [];
    let sectionIndex = 0;

    let isScrolling = false;
    let wheeling = true;   
    const sectionMenu = $(".section-menu")
    function wheelCheckFn() {
        let windowWidth = window.innerWidth;
        console.log(windowWidth);
        if (windowWidth <= 1000) {
            wheeling = false;
            sectionMenu.hide();
        } else {
            wheeling = true;
            sectionMenu.show();
        }
    }
    wheelCheckFn();
    const section = $(".wrap section")

    const footer = $(".footer")
    function sectionPosFn() {
        $.each(section, function (index, item) {
            let tempPos = $(this).offset().top
            tempPos = Math.ceil(tempPos);
            sectionPos[index] = tempPos;
        })
        sectionPos[sectionPos.length] = Math.ceil(footer.offset().top);
    }
    sectionPosFn();
    let sectionTotal = sectionPos.length;
    function resizeFn() {
        wheelCheckFn()
        sectionPosFn()
        sectionLabel() 
        if (wheeling) {
            $("html,body").stop().animate({
                scrollTop: sectionPos[sectionIndex]
            },500,function(){
                isScrolling = false;
            })
        }
    }
    let resizeTimer
    $(window).on("resize", function () {
        window.clearTimeout(resizeTimer)
        resizeTimer = setTimeout(resizeFn, 500)  
    })
    $(window).on("mousewheel DOMMouseScroll", function (event) {
        let wheelDirection = event.originalEvent.wheelDelta;
        if (wheeling !== true) return;  
        if (isScrolling) return;  
        isScrolling = true;
        if (wheelDirection < 0) { 
            sectionIndex++;
            if (sectionIndex >= sectionTotal) {
                sectionIndex = sectionTotal - 1;
            }
        } else { 
            sectionIndex--;
            if (sectionIndex <= 0) {
                sectionIndex = 0;
            }
        }
        $("html,body").stop().animate({
            scrollTop: sectionPos[sectionIndex]
        },800,function(){
            isScrolling = false;
        })
        sectionLabel() 
    })
    $(window).scroll(function () {
        if (wheeling) return;
        let currentScrollY = $(window).scrollTop();
        currentScrollY = Math.ceil(currentScrollY);
        for (let i = sectionTotal - 1; i >= 0; i--){
            let tempMax = sectionPos[i]
            if (currentScrollY >= tempMax) {
                sectionIndex = i;
                break;
            }
        }
    })
    $("html,body").animate({
        scrollTop:sectionPos[sectionIndex]
    }, 500, function () {
        isScrolling=false
    })
    const sectionLink = $(".section-menu a")
    $.each(sectionLink, function (index, item) {
        $(this).click(function (e) {
            e.preventDefault()
            goToSection(index)
        })
    })
    function goToSection(idx) {
        sectionIndex = idx
        sectionLabel() 
        $("html,body").animate({
            scrollTop:sectionPos[sectionIndex]
        }, 1000, function () {
            isScrolling=false
        })
    }

    function sectionLabel() {
        sectionLink.removeClass("active");
        sectionLink.eq(sectionIndex).addClass("active")
        sectionLink.removeClass("yellow")
        if (sectionIndex !== 0 && sectionIndex !== 2 && sectionIndex !== 4) {
            sectionLink.addClass("yellow")
        }
        
    }
    sectionLabel();
// 올메뉴버튼
const $allMenu = $('.all-menu'),
    $allMenuBtn = $('.all-menu-btn'),
    $sectionMenu = $('.section-menu'),
    $flex = $('.flex-box'),
    $head = $('.header');
let currentScrollPosition = 0;

$allMenuBtn.on('click', function () {
    if ($allMenu.hasClass('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

function openMenu() {
    $allMenu.addClass('active');
    $sectionMenu.hide();
    $allMenuBtn.addClass('active');
    $flex.addClass('active');
    $head.css('height','0')
    currentScrollPosition = $(window).scrollTop();
}

function closeMenu() {
    $allMenu.removeClass('active');
    $sectionMenu.show();
    $allMenuBtn.removeClass('active');
    $flex.removeClass('active');
    $head.css('height','')
    $('html, body').animate({ scrollTop: currentScrollPosition });
}
$(window).on('resize', function () {
    if ($(window).width() <= 840 && $allMenu.hasClass('active')) {
        closeMenu();
    }
});
    // 모바일메뉴버튼
    const $mbBtn = $('.mb-bt'),
    $mbNav = $('.mb-nav'),
    $mbMenuMask = $('.mb-menu-mask'),
    $mbMenuList = $(".mb-menu > li"),
    $mbMainMenu = $(".mb-mainMenu"),
    $mbSubMenu = $(".mb-subMenu");
    // 모바일 메뉴 버튼 클릭 이벤트
    $mbBtn.on("click", function () {
        if ($mbBtn.hasClass('active')) {
            $mbBtn.removeClass('active');
            $mbNav.removeClass('active');
            $mbMenuMask.removeClass('active');
            $mbMenuList.each(function (index) {
                $(this).css('height', '50px');
                $mbMainMenu.eq(index).removeClass('open');
            });
        } else {
            $mbBtn.addClass('active');
            $mbNav.addClass('active');
            $mbMenuMask.addClass('active');
        }
    });

    // 서브 메뉴의 높이값 계산 및 저장
    const mbSubMenuHeight = [];
    $mbSubMenu.each(function (index) {
        let count = $(this).find("li").length;
        mbSubMenuHeight[index] = 50 * count + 20;
    });

    // 모바일 메뉴 펼치기 (아코디언)
    $mbMainMenu.each(function (idx) {
        $mbMenuList.eq(idx).css('height', '50px');
        $(this).on("click", function (event) {
            event.preventDefault();
            if (idx === 1 || idx === 4) return;
            const $submenu = $(this).next(".mb-subMenu");
            const newHeight = $(this).hasClass("open") ? '50px' : ($submenu.outerHeight(true) + 50 + 'px');
            $mbMenuList.eq(idx).css('height', newHeight);
            $(this).toggleClass("open");
        });
    }); 
    // 화면 사이즈 체크 이벤트
    $(window).on("resize", function () {
        let winWidth = $(window).width();
        console.log(winWidth);
        if (winWidth > 840) {
            $mbBtn.removeClass("active");
            $mbNav.removeClass("active");
            $mbMenuMask.removeClass("active");
            $mbMenuList.each(function (index) {
                $(this).css('height', '50px');
                $mbMainMenu.eq(index).removeClass('open');
            });
        } else {
            $(".all-menu-mask").removeClass('active');
            $(".all-menu-wrapper").removeClass("active");
        }
    });
//  헤더 높이변화
    const $header = $('.header'),
          $mainMenu = $('.menu-bar');
          $mainMenu.on('mouseover',function(){
            $header.addClass('on');
          })
          $mainMenu.on('mouseleave', function () {
            $header.removeClass('on');
        });
    
    // 페이지 로드 시 첫 번째 탭 활성화
    $(".tab").eq(0).addClass("active");
    $(".tab-content").eq(0).addClass("on");
    // 탭메뉴
    var $firstTabContent = $(".tab-content.on").find("ul li");
    $firstTabContent.each(function (index) {
        $(this).css("animation", "none");
        setTimeout(() => {
            $(this).css("animation", `slideIn 0.6s forwards`);
            $(this).css("animation-delay", `${0.3 * (index + 1)}s`);
        }, 10);
    });
    // 탭 메뉴 클릭 이벤트
    $(".tab").click(function () {
        var tabId = $(this).data("tab");
        $(".tab").removeClass("active");
        $(this).addClass("active");
        $(".tab-content").removeClass("on");
        var $tabContent = $("#tab-" + tabId);
        $tabContent.addClass("on");
        // 클릭 시 애니메이션 적용
        var $lis = $tabContent.find("ul li");
        $lis.each(function (index) {
            $(this).css("animation", "none");
            setTimeout(() => {
                $(this).css("animation", `slideIn 0.6s forwards`);
                $(this).css("animation-delay", `${0.3 * (index + 1)}s`);
            }, 10);
        });
    });

    $(".card").on("click", function() {
        let $currentImage = $(".card.on");
        $currentImage.removeClass("on");
        let $nextImage = $currentImage.next(".card");
        if ($nextImage.length === 0) {
          $nextImage = $(".card").first();
        }
        $nextImage.addClass("on");
      });
})