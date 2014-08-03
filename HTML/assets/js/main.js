(function($){

"use strict";

var eksis = eksis || {};

/* Tab Module
------------------------------------------------------------------- */
eksis.tabModule = {
  el: {},

  setupElements: function() {
    this.el.$tabNav = $('.tab-nav');
  },

  eventBinding: function() {
    this.el.$tabNav.on('click', 'a', $.proxy( this.changeTab, this ));
  },

  changeTab: function(e) {
    e.preventDefault();

    var $tabLink = $(e.currentTarget),
        target = $tabLink.attr('href');

    if( $(target).length > 0 ) {
      $(target).fadeIn().siblings('.tab-panel').hide();
      $tabLink.parent().addClass('active').siblings().removeClass('active');
    }
  },

  init: function() {
    this.setupElements();
    this.eventBinding();

    // First click on tab module
    this.el.$tabNav.each(function(){
      $(this).find('li:first-child a').trigger('click');
    });
  }
};


/* Custom Dropdown
------------------------------------------------------------------- */
eksis.dropDown = {
  el: {},

  setupElements: function() {
    this.el.$trigger = $('.dropdown-trigger');
  },

  eventBinding: function() {
    this.el.$trigger.on('click', $.proxy(this.toggleDropdown, this));
  },

  toggleDropdown: function(e) {
    e.preventDefault();

    var $button = $(e.currentTarget);
    $button.parent('li').toggleClass('open');
  },

  init: function() {
    this.setupElements();
    this.eventBinding();
  }
};

/* ===================================================================
  DOCUMENT READY
=================================================================== */
$(document).ready(function(){

  eksis.tabModule.init();
  eksis.dropDown.init();
  $('[data-toggle="tooltip"]').tooltip();

});

})(jQuery);