var width = window.innerWidth;

var documentHasScroll = function() {
    return window.innerHeight <= document.body.offsetHeight;
};

window.addEventListener('scroll', function (e) {
    var headernavbar = document.getElementById("headernavbar");
    if (window.scrollY > headernavbar.offsetHeight){
        var headerNavbarNav = document.querySelector('#headerNavbarNav')
        headernavbar.classList.add('scrolled');
    }else{
        headernavbar.classList.remove('scrolled');
    }
});

$(document).ready(function() {
    // $("nav").removeClass("no-transition");
	/* MENU */
	$('.navbar-nav').attr('id', 'menu'); // please don't remove this line
	$( '<div class="calendar-top"></div>' ).insertBefore( "#calendar" );
	$( '<div class="card-profile-top"></div>' ).insertBefore( ".card.profile.card-profile" );
	var divs = $(".card-profiles > div");
	for(var i = 0; i < divs.length; i+=2) {
		divs.slice(i, i+2).wrapAll( '<div class="col-xs" />');
	}

	var headerNavbar = $('#headerNavbar');
	var width100 = $('.width100');
	var innerWidth = $('body').innerWidth();
	headerNavbar.width(innerWidth);
	width100.width(innerWidth);

    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    $("nav").removeClass("no-transition");

    // Initialize animations
    setupAnimations();

    // About page menu - simplified approach
    if ($('.about-menu').length > 0) {
        // Simple direct click handler for menu items
        $('.about-menu-item').click(function(e) {
            e.preventDefault();

            // Remove active class from all items
            $('.about-menu-item').removeClass('active');

            // Add active class to clicked item
            $(this).addClass('active');

            // Get target section ID from href
            var targetId = $(this).attr('href');

            // Scroll to section
            $('html, body').animate({
                scrollTop: $(targetId).offset().top - 100
            }, 500);

            // Update URL hash
            history.pushState(null, null, targetId);
        });

        // Set initial active state based on URL hash
        var currentHash = window.location.hash;
        if (currentHash) {
            $('.about-menu-item[href="' + currentHash + '"]').addClass('active');
        } else {
            $('.about-menu-item:first').addClass('active');
        }
    }

    if (width < 992) { // mobile
        $('#menuToggle input[type="checkbox"]').change(function(){
            var checked = $(this).is(":checked");
            if(checked){
                $('#menu').show("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('#menu, #menu *').css({
                    'visibility': 'visible'
                });
                $('body', 'html').css({
                    'overflow': 'hidden'
                });
            }else{
                $('#menu').hide("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('body', 'html').css({
                    'overflow': 'auto'
                });
            }
        });
    }


    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    $("nav").removeClass("no-transition");


    $('.events_tabs, .media_tabs').each(function(){
        // For each set of tabs, we want to keep track of
        // which tab is active and its associated content
        var $active, $content, $links = $(this).find('a');
        var speed = "fast";
        var activeTab = $(location.hash);
        // If the location.hash matches one of the links, use that as the active tab.
        // If no match is found, use the first link as the initial active tab.
        $active = $($links.filter("[href=\'"+location.hash+"\']")[0] || $links[0]);


        if($(this).parent().parent().hasClass('events')){
            $active.addClass('active');
        }

        $content = $($active[0].hash);

        // Hide the remaining content
        $links.not($active).each(function () {
            $(this.hash).hide();
        });

        if(activeTab.length){
            $content.slideDown(speed);
            //scroll to element
            $('html, body').animate({
                scrollTop:  activeTab.offset().top - $('header').height()
            }, speed);
        }

        // Bind the click event handler
        $(this).find("a").click(function (e) {
            if($(this).hasClass('active')) {
                $content.slideDown({
                    scrollTop: $content.offset().top - $('header').height()
                }, speed);
                var screenSize = getScreenSize();
                if (screenSize.width < 800) {
                    // scroll to element
                    $('html, body').animate({
                        scrollTop: $content.offset().top - $('header').height() + 300  // mobile
                    }, speed);
                }else{
                    //scroll to element icons top
                    $('html, body').animate({
                        scrollTop:  $content.offset().top - $('header').height() + 300
                    }, speed);
                }
                e.preventDefault();
                return false;
            }
            // Make the old tab inactive.
            $active.removeClass('active');
            $content.hide();

            // Update the variables with the new link and content
            $active = $(this);
            $content = $(this.hash);

            location.hash = $active[0].hash;

            // Make the tab active.
            $active.addClass('active');
            $content.slideDown({
                scrollTop: $content.offset().top - $('header').height()
            }, speed);

            // Prevent the anchor\'s default click action
            e.preventDefault();
        });
    });



    /* News highlights carousel **/
    $('.news-carousel').slick({
        autoplay: false,
        draggable: true,
        centerMode: true,
        variableWidth: false,
        infinite: true,
        slidesToShow: 3,
        speed: 1000,
        centerPadding: '5%',
        slidesToScroll: 1,
        prevArrow: $('.prev-arrow'),
        nextArrow: $('.next-arrow'),
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true,
                    centerMode: true,
                    centerPadding: '10%',
                    slidesToShow: 1
                }
            }
        ]
    });

    // Initialize work packages toggle
    initWorkPackagesToggle();

    // Add click event to close modal when clicking outside
    $('#searchModalOverlay').on('click', function(e) {
        if (e.target === this) {
            hideSearchForm();
        }
    });
    
    // Submit search on enter
    $('.search_input').on('keydown', function(e) {
        if (e.key === 'Enter') {
            $(this).closest('form').submit();
        }
    });
});

function goToPage(url){
    window.location.href = url;
}

function redirectAndRefresh(url){
	$(".tabs a").each(function() {
		this.href = window.location.hash;
	});
	window.open(url, '_blank');
	location.reload();
}

function isBreakpointLarge() {
    return window.innerWidth <= 991;
}


function onCustomSinglePartner(pId) {
    $.request('onSinglePartner', {
        update: { 'components/partners_list': '#mycomponentpartners',
        },
        data: {
            partner_id: pId
        },
    }).then(response => {
        $('html, body').animate({
            scrollTop: $("#mycomponentpartners").offset().top - 200
        }, 1000);
        var tooltip = document.getElementById("tooltip");
        tooltip.classList.remove("active");
    });
}


function init() {
    window.addEventListener('resize', function () {
        if (isBreakpointLarge()) {
            $('#card-carousel').slick('unslick');
        } else {
            if (typeof cardCarousel === 'function') {
                cardCarousel({
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: true,
                    autoplaySpeed: 6000,
                    prevArrow: '<i class="slick-prev"/>',
                    nextArrow: '<i class="slick-next"/>',
                });
             }
        }

    });
    document.addEventListener('DOMContentLoaded', function () {
        if (!isBreakpointLarge()) {
            if (typeof cardCarousel === 'function') {
                cardCarousel({
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: true,
                    autoplaySpeed: 6000,
                    prevArrow: '<i class="slick-prev"/>',
                    nextArrow: '<i class="slick-next"/>',
                });
            }
        }

        // Initialize work packages toggle
        initWorkPackagesToggle();
    });
}

function scrollToTheTop(){
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
}

function scrollToField(errors){
    $(".get_involved_form input, .get_involved_form select, .get_involved_form .row").removeClass('red_err_field');
    $.each(errors.scroll_to_field, function(key,valueObj){
        $("#"+key).addClass('red_err_field');
        $('html, body').animate({
            scrollTop: $("#"+key).offset().top - 200
        }, 1000);
        return false;
    });
}


function showSearchForm(){
    const searchModal = document.getElementById('searchModalOverlay');
    const modal = document.querySelector('.search-modal');
    
    // First show the overlay
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Then add animation class to the modal for enhanced illustration effect
    setTimeout(() => {
        if (modal) modal.classList.add('active');
        
        // Focus on the search input
        const searchInput = document.querySelector('.search_input');
        if (searchInput) searchInput.focus();
    }, 150);
    
    // Add ESC key listener
    document.addEventListener('keydown', handleEscKey);
}

function hideSearchForm(){
    const searchModal = document.getElementById('searchModalOverlay');
    const modal = document.querySelector('.search-modal');
    
    // First remove the active class from the modal
    if (modal) modal.classList.remove('active');
    
    // Then after a small delay, hide the overlay
    setTimeout(() => {
        searchModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }, 150);
    
    // Remove ESC key listener
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        hideSearchForm();
    }
}

/**
 * Initialize work packages toggle functionality
 * This ensures the read more/less buttons work properly in the work packages section
 */
function initWorkPackagesToggle() {
    $('.arrow-toggle').off('click').on('click', function(e) {
        e.preventDefault();

        var $this = $(this);
        var $workPackageBox = $this.closest('.work-package-box');
        var $content = $workPackageBox.find('.wp-content');

        // Toggle active state immediately for smoother arrow rotation
        $this.toggleClass('active');

        if ($content.is(':visible')) {
            $content.stop(true, false).slideUp(500, 'easeOutCubic', function() {
                // Animation complete callback
                $workPackageBox.removeClass('expanded');
            });
        } else {
            // Add expanded class for potential additional styling
            $workPackageBox.addClass('expanded');

            // Use slideDown with easing for smoother animation
            $content.stop(true, false).slideDown(500, 'easeOutCubic');
        }
    });

    // Add jQuery UI easing if not already available
    if (typeof jQuery.easing.easeOutCubic !== 'function') {
        jQuery.extend(jQuery.easing, {
            easeOutCubic: function(x, t, b, c, d) {
                return c * ((t = t/d - 1) * t * t + 1) + b;
            }
        });
    }
}

init()
