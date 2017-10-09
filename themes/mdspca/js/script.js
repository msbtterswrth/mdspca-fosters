(function($, Drupal, drupalSettings, enquire, ko){
  'use strict';

  /**
   * Set up muhc namespace to store configuration and functionality that needs
   * to be available globally.
   */
  var muhc = window.muhc = {
    /**
     * Set up breakpoints for enquire.js here so they're available globally. You
     * can subscribe to the muhc.enquire.<breakpoint>.matched observable in
     * order to respond to breakpoint matches.
     */
    enquire: {
      lt768: {
        query: 'screen and (max-width: 767px)',
        matched: ko.observable(false)
      },
      gt768: {
        query: 'screen and (min-width: 768px)',
        matched: ko.observable(false)
      },
      lt992: {
        query: 'screen and (max-width: 991px)',
        matched: ko.observable(false)
      },
      gt992: {
        query: 'screen and (min-width: 992px)',
        matched: ko.observable(false)
      }
    },
    GlobalViewModel: function(){
      var self = this;
    }
  };

  function initEnquire() {
    enquire
      .register(muhc.enquire.lt768.query, {
        match: function() {},
        unmatch: function() {}
      })
      .register(muhc.enquire.gt768.query, {
        match: function() {},
        unmatch: function() {}
      })
      .register(muhc.enquire.lt992.query, {
        match: function() {},
        unmatch: function(){}
      })
      .register(muhc.enquire.gt992.query, {
        match: function() {},
        unmatch: function(){}
      });

    for (var i in muhc.enquire) {
      if (muhc.enquire.hasOwnProperty(i)) {
        var breakpoint = muhc.enquire[i];
        var matchCallback = function(i){
          return function(){
            muhc.enquire[i].matched(true);
          }
        }(i);
        var unmatchCallback = function(i){
          return function(){
            muhc.enquire[i].matched(false);
          }
        }(i);
        enquire.register(breakpoint.query, {
          match: matchCallback,
          unmatch: unmatchCallback
        });
      }
    }
  }

  function initExternalLinks(context) {
    $('a[href*="//"]:not([href*="' + document.location.hostname + '"])', context)
      .attr('target', '_blank')
      .addClass('external');
  }

  function initBootstrapSelect(context) {
    $('.selectpicker', context)
      .selectpicker({

      });
  }
  
  function initCustomScroll(context) {
    $(".treatments-list ul").mCustomScrollbar({
      theme:"minimal"
    });
  }

  function initSlick(context) {
    $('.slick', context).each(function(){
      var $slider = $(this);
      if ($slider.hasClass('has-pager')) {
        var $pager = $('<div class="pager"></div>');
        $slider.before($pager);
        $slider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
          $pager.text((currentSlide ? currentSlide : 0) + 1 + ' of ' + slick.slideCount);
        });
      }
      $slider.slick({
      });
    });
  }

  function initSmoothScroll(context) {
    $('a[href*="#"]:not([href="#"])', context).click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  }

  ko.bindingHandlers.submitForm = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
      var $element = $(element);
      $element.change(function(){
        $element.parents('form').submit();
      });
    }
  };

  Drupal.behaviors.muhc = {
    _isInvokedByDocumentReady: true,
    attach: function(context) {
      if (this._isInvokedByDocumentReady) {
        /**
         * Should only ever happen once, on document ready.
         */
        initEnquire();
        
        /*ADD SHIT ONCE HERE*/
        
        ko.applyBindings(
          new muhc.GlobalViewModel(),
          document.getElementsByName('body')[0]
        );
        this._isInvokedByDocumentReady = false;
      }
      /**
       * Should fire whenever attach is called (Drupal-initiated ajax, etc)
       */
      initExternalLinks(context);
      initBootstrapSelect(context);
      initCustomScroll(context);
      initSmoothScroll(context);
      initSlick(context);
      /*ADD SHIT HERE*/

      $('.search-toggle').click(function() {
        $('body').toggleClass('search-open');
        $('body').removeClass('nav-open');
      });
      $('.more-toggle').click(function() {
        $('body').toggleClass('more-open');
      });
      $('.nav-toggle').click(function() {
        $('body').toggleClass('nav-open');
        $('body').removeClass('search-open');
      });
      $('.slick-toggle').click(function() {
        $('body').toggleClass('slick-close');
      });
      $('.footer .nav h4').click(function() {
        $(this).toggleClass('open');
        $(this).next('ul').toggleClass('open');
      });
      $('#block-getstarted-label').click(function() {
        $(this).toggleClass('open');
        $(this).next('ul').toggleClass('open');
      });
      $('.serviceline-toggle').click(function() {
        $('body').toggleClass('serviceline-close');
        $('.serviceline-toggle > span').toggleClass('hidden');
      });
    }
  };
})(jQuery, Drupal, drupalSettings, enquire, ko);