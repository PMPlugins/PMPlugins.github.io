jQuery(function($) {

	// Check your elements
  $.fn.checkNavPositioning = function($el, $nav, scrollClass) {
    var navHeight = $nav.outerHeight();

    if(((this.outerHeight() - $(window).scrollTop()) <= $nav.outerHeight()) && !$el.hasClass(scrollClass)) {
      $el.addClass(scrollClass);
      $el.css('padding-top', navHeight);
    } else if((this.outerHeight() >= $(window).scrollTop()) && $el.hasClass(scrollClass)) {
      $el.removeClass(scrollClass);
      $el.css('padding-top', 0);
    }
  }

  // Mobile sidebars
  $.fn.expandableSidebar = function(expandedClass) {
    var $me = this;

    $me.on('click', function() {
      if(!$me.hasClass(expandedClass)) {
        $me.addClass(expandedClass);
      } else {
        $me.removeClass(expandedClass);
      }
    });
  }
  
  // Interval loop
  $.fn.intervalLoop = function(condition, action, duration, limit) {
    var counter = 0;
    var looper = setInterval(function(){
      if (counter >= limit || $.fn.checkIfElementExists(condition)) {
        clearInterval(looper);
      } else {
        action();
        counter++;
      }
    }, duration);
  }

  // Check if element exists
  $.fn.checkIfElementExists = function(selector) {
    return $(selector).length;
  }
  

	var centoController = {
		init: function(opts) {
      var base = this;

      // Check content positioning
      if($(window).width() > 767) {
        $('.cento-header').checkNavPositioning($('body'), $('.nav-wrap'), 'affix');
      }

      // Add classes to elements
      base._addClasses();

      setTimeout(function(){
        base._checkCartItems();
        base._attachEvents();
      }, 1000);
    },

    _addClasses: function() {
      var base = this;

      // Add class to nav items with subnav
      $('.wsite-menu-default').find('li.wsite-menu-item-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-item'));
        }
      });

      // Add class to subnav items with subnav
      $('.wsite-menu').find('li.wsite-menu-subitem-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-subitem'));
        }
      });

      // Keep subnav open if submenu item is active
      $('.wsite-menu-wrap').find('li.wsite-menu-subitem-wrap').each(function(){
        var $me = $(this);

        if($me.hasClass('wsite-nav-current')) {
          $me.parents().addClass('open');
        }
      });

      // Add placeholder text to inputs
      $('.wsite-form-sublabel').each(function(){
        var sublabel = $(this).text();
        $(this).prev('.wsite-form-input').attr('placeholder', sublabel);
      });

      // Add fullwidth class to gallery thumbs if less than 6
      $('.imageGallery').each(function(){
        if ($(this).children('div').length <= 6) {
          $(this).children('div').addClass('fullwidth-mobile');
        }
      });
    },

    _checkCartItems: function() {
      var base = this;
      
      if($('#wsite-mini-cart').find('li.wsite-product-item').length > 0) {
        $('body').addClass('cart-full');
      } else {
        $('body').removeClass('cart-full');
      }
    },

    _moveLogin: function() {
      var loginDetach = $('#member-login').detach();
      $('.mobile-nav .wsite-menu-default li:last-child').after(loginDetach);
    },

    _attachEvents: function() {
    	var base = this;

      // Move cart + login
      if ($(window).width() <= 992) {
        $.fn.intervalLoop('.mobile-nav #member-login', base._moveLogin, 800, 5);
      }

    	// Window scroll
    	$(window).on('scroll', function(){
    		// Affix nav
        if($(window).width() > 768) {
          $('.cento-header').checkNavPositioning($('body'), $('.nav-wrap'), 'affix');
        }
    	});

      // Subnav toggle
      $('li.has-submenu').each(function(){
        var $me = $(this);
        var caret = $me.children('span.icon-caret');

        caret.on('click', function(){          
          if($me.children('.wsite-menu-wrap.open').length > 0) {
            caret.siblings('.wsite-menu-wrap').removeClass('open');
            console.log('close');
          } else {
            caret.siblings('.wsite-menu-wrap').addClass('open');
            console.log('open');
          }
        });
      });

      // Store category dropdown
      $('.wsite-com-sidebar').expandableSidebar('sidebar-expanded');

      // Search filters dropdown
      $('#wsite-search-sidebar').expandableSidebar('sidebar-expanded');

    	// Init fancybox swipe on mobile
      if ('ontouchstart' in window) {
        $('body').on('click', 'a.w-fancybox', function() {
          base._initSwipeGallery();
        });
      }
    },

    _initSwipeGallery: function() {
      var base = this;

      setTimeout(function(){
        var touchGallery = document.getElementsByClassName('fancybox-wrap')[0];
        var mc = new Hammer(touchGallery);
        mc.on("panleft panright", function(ev) {
          if (ev.type == "panleft") {
            $("a.fancybox-next").trigger("click");
          } else if (ev.type == "panright") {
            $("a.fancybox-prev").trigger("click");
          }
          base._initSwipeGallery();
        });
      }, 500);
    }
	}

	$(document).ready(function(){
		centoController.init();
	});

});
