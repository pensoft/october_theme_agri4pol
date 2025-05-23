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

    // Add search button to mobile menu after CONTACT
    $('#menuToggle #menu').append('<li class="nav-item search_field"><div class="icon-container"><a href="#" class="mobile-search-btn" aria-label="Search"></a></div></li>');

    // Update the mobile menu by appending social media icons to the search field
    function updateMobileMenu() {
        var socialIcons = '';
        
        // Check if LinkedIn button exists in the header (means it's enabled)
        if ($('.search-and-social-media .btn-linkedin').length > 0) {
            socialIcons += '<a href="' + $('.search-and-social-media .btn-linkedin').attr('href') + '" class="mobile-social-btn btn-linkedin" aria-label="LinkedIn" target="_blank"></a>';
        }
        
        // Check if BlueSky button exists in the header (means it's enabled)
        if ($('.search-and-social-media .btn-bluesky').length > 0) {
            socialIcons += '<a href="' + $('.search-and-social-media .btn-bluesky').attr('href') + '" class="mobile-social-btn btn-bluesky" aria-label="BlueSky" target="_blank"></a>';
        }
        
        // Only update if we have social icons to add
        if (socialIcons !== '') {
            // Clear existing icons first to prevent duplicates
            $('#menuToggle #menu .search_field .icon-container').html('');
            // Add search button and social icons
            $('#menuToggle #menu .search_field .icon-container').html('<a href="#" class="mobile-search-btn" aria-label="Search"></a>' + socialIcons);
        }
    }

    // Call the function to update mobile menu with social icons
    updateMobileMenu();

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
                // Fix: Make all elements in menu visible immediately, including dropdown menu items
                $('#menu, #menu *, #menu .dropdown-menu, #menu .dropdown-menu *').css({
                    'visibility': 'visible'
                });
                // Make dropdown menu items visible in a proper way
                $('#menu .dropdown-menu').css('display', 'none');
                
                $('body', 'html').css({
                    'overflow': 'hidden'
                });
                
                // Make sure search field is the last item - reappend it
                if ($('#menuToggle #menu .search_field').length === 0) {
                    $('#menuToggle #menu').append('<li class="nav-item search_field"><div class="icon-container"></div></li>');
                    // Update mobile menu with social icons
                    updateMobileMenu();
                }
            }else{
                $('#menu').hide("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('body', 'html').css({
                    'overflow': 'auto'
                });
            }
        });
        
        // Handle mobile search button click
        $(document).on('click', '.mobile-search-btn', function(e) {
            e.preventDefault();
            // Close mobile menu
            $('#menuToggle input[type="checkbox"]').prop('checked', false);
            $('#menu').hide("slide", { direction: "right" }, 400);
            $('body', 'html').css({
                'overflow': 'auto'
            });
            
            // Show search modal after menu closes
            setTimeout(function() {
                showSearchForm();
            }, 400);
            
            return false;
        });

        // --- MOBILE SUBMENU TOGGLE LOGIC ---
        // Only for mobile: clicking a parent with submenu toggles its dropdown-menu
        $(document).on('click', '#menu .dropdown > a', function(e) {
            // Only act if in mobile
            if (window.innerWidth >= 992) return;
            var $parent = $(this).parent('.dropdown');
            var $submenu = $parent.children('.dropdown-menu');
            if ($submenu.length) {
                e.preventDefault();
                
                // Toggle expanded class for arrow rotation
                $(this).toggleClass('expanded');
                
                // Toggle submenu with smooth animation
                $submenu.slideToggle(250);
                
                // Toggle special class on parent for border styling
                $parent.toggleClass('submenu-open');
                
                // Close other open submenus and reset their expanded state
                $parent.siblings('.dropdown').children('.dropdown-menu:visible').slideUp(200);
                $parent.siblings('.dropdown').children('a').removeClass('expanded');
                $parent.siblings('.dropdown').removeClass('submenu-open');
            }
        });
        // Hide all submenus when menu closes
        $('#menuToggle input[type="checkbox"]').change(function(){
            if (!$(this).is(":checked")) {
                $('#menu .dropdown-menu').hide();
                // Reset expanded state
                $('#menu .dropdown > a').removeClass('expanded');
                $('#menu .dropdown').removeClass('submenu-open');
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
    if ($('.news-carousel').length > 0 && $('.news-carousel .home-news-highlights').length >= 3) {
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
    }

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

    // Initialize events page functionality
    initEventsPage();
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

// Add mobile search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Make sure mobile search button works
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Close mobile menu if open
            if (document.querySelector('#menuToggle input[type="checkbox"]').checked) {
                document.querySelector('#menuToggle input[type="checkbox"]').checked = false;
                $('#menu').hide("slide", { direction: "right" }, 400);
                $('body', 'html').css({
                    'overflow': 'auto'
                });
            }
            
            // Show search form
            setTimeout(function() {
                showSearchForm();
            }, 100);
        });
    }
    
    // Always rebuild the mobile menu social icons on page load
    if (width < 992) {
        // First ensure the search field container exists
        if ($('#menuToggle #menu .search_field').length === 0) {
            $('#menuToggle #menu').append('<li class="nav-item search_field"><div class="icon-container"></div></li>');
        }
        // Then update it with icons
        updateMobileMenu();
    }
    
    // Initialize proper mobile submenu functionality
    initMobileMenu();
});

// Handle mobile submenu visibility
function initMobileMenu() {
    // If we're in mobile view
    if (width < 992) {
        // Make sure dropdown menus are properly set up
        $('#menu .dropdown-menu').each(function() {
            $(this).css('display', 'none');
            $(this).css('visibility', 'visible');
        });
        
        // Ensure all elements in the menu are properly visible
        $('#menu li, #menu a').css('visibility', 'visible');
    }
}

// Update mobile menu on window resize
$(window).resize(function() {
    // Update width variable
    width = window.innerWidth;
    
    if (width < 992) {
        initMobileMenu();
    }
});

/**
 * Events page functionality
 * Handles tab switching and making cards clickable on mobile
 */
function initEventsPage() {
    // Only run on events page
    if (!document.querySelector('.events_tabs')) return;
    
    // Tab switching functionality
    function setupTabSwitching() {
        const listViewTab = document.querySelector('.events_tabs a[href="#listView"]');
        const calendarViewTab = document.querySelector('.events_tabs a[href="#calendarView"]');
        const listView = document.getElementById('listView');
        const calendarView = document.getElementById('calendarView');
        
        if (!listViewTab || !calendarViewTab || !listView || !calendarView) return;
        
        // List view tab click handler
        listViewTab.addEventListener('click', function(e) {
            e.preventDefault();
            listView.style.display = 'block';
            calendarView.style.display = 'none';
            listViewTab.classList.add('active');
            calendarViewTab.classList.remove('active');
        });
        
        // Calendar view tab click handler
        calendarViewTab.addEventListener('click', function(e) {
            e.preventDefault();
            listView.style.display = 'none';
            calendarView.style.display = 'block';
            calendarViewTab.classList.add('active');
            listViewTab.classList.remove('active');
            
            // Force calendar to redraw when shown
            if (window.FullCalendar && calendarView.querySelector('.fc')) {
                // Get the calendar instance
                const calendarElement = calendarView.querySelector('.fc');
                
                // Trigger a window resize event to force calendar to redraw
                window.dispatchEvent(new Event('resize'));
                
                // If the calendar has a FullCalendar API instance
                if (calendarElement && calendarElement.fullCalendar) {
                    // Refresh the calendar view
                    calendarElement.fullCalendar('render');
                } else if (calendarElement && calendarElement._calendar) {
                    // For newer versions of FullCalendar (v4+)
                    calendarElement._calendar.render();
                } else {
                    // Backup solution - wait a moment then trigger window resize
                    setTimeout(function() {
                        window.dispatchEvent(new Event('resize'));
                    }, 200);
                }
            }
        });
        
        // Check if URL has the calendar view hash
        if (window.location.hash === '#calendarView') {
            // Trigger a click on the calendar tab
            calendarViewTab.click();
        }
    }
    
    // Make event cards clickable on mobile
    function setupMobileCardClicks() {
        // Only apply on mobile devices
        if (window.innerWidth > 768) return;
        
        const eventItems = document.querySelectorAll('.entry_item');
        
        eventItems.forEach(function(item) {
            const linkElement = item.querySelector('.date_week');
            
            if (!linkElement) return;
            
            const href = linkElement.getAttribute('href');
            
            // Remove existing click listeners to prevent duplicates
            item.removeEventListener('click', cardClickHandler);
            
            // Add click listener
            item.addEventListener('click', cardClickHandler);
            
            // Click handler function
            function cardClickHandler(e) {
                // Only navigate if click wasn't on a link or image
                if (!e.target.closest('a')) {
                    window.location.href = href;
                }
            }
        });
    }
    
    // Run setup functions
    setupTabSwitching();
    setupMobileCardClicks();
    
    // Update mobile functionality on window resize
    window.addEventListener('resize', function() {
        setupMobileCardClicks();
    });
}
