// = require plugins/_all
// get all plugins required for document, done!




(function($) {
  $.fn.scrollhide = function(options) {

    // Establish our default settings for threshold and class name
    var settings = $.extend({
        t : 50, // threshold before reach end of document
        c : "invisible", // default class into element when triggered
        v : "visible", // default class when visible
        ob : "on-bottom", // default class when scrolled on bottom of page
        om : "on-middle", // default class when scrolled on middle of page
        ot : "on-top" // default class when scrolled on top of page
    }, options);

    return this.each( function() {

      var  q = 0,
           w = $(window),
           d = $(document),
           e = $(this), // targeting element
           g = e.height(), // calculating height of element
           s = settings; // initial for settings above

      function r() { e.removeClass(s.c).addClass(s.v); }
      function a() { e.addClass(s.c).removeClass(s.v); }

      function aot() { e.addClass(s.ot); }
      function aob() { e.addClass(s.ob); }
      function aom() { e.addClass(s.om); }
      function rot() { e.removeClass(s.ot); }
      function rob() { e.removeClass(s.ob); }
      function rom() { e.removeClass(s.om); }


      w.on({
        scroll: function () {
          d.next().outerHeight();

          var y = d.height(),
              l = w.height(),
              b = w.scrollTop();

          if (b < g) {
            r();
            aot();
            rom();
          } else if (b + l >= y - s.t) {
            r();
            aob();
            rom();
          } else if (b > q) {
            a();
            aom();
            rot();
            rob();
          } else {
            r();
            rob();
            aom();
          }

          q = b;
        }
      });

    });

  };

}(jQuery)); // end of this plugin



// write down your code below this line
// ++++++++++++++++++++++++++++++++++++++++++

;(function ($) {

  $(function () {


    var $window = $(window);
    var $body   = $(document.body);

    // get and cache navbar clicked menu id
    var menuId;

    // set virtual height for fullscreen
    var vheight = function(el, val) {
      el.css({ 'height': ( ($window.height()) - val ) });
    };

    // parse url and break it into object
    var parseURL = function(url) {
      var a = document.createElement('a'), obj, i, j;
      a.href = url;

      obj = {
        'domain': '',
        'hash': a.hash.slice(1),
        'host': a.host,
        'hostname': a.hostname,
        'href': a.href, // copy back from <a>
        'origin': a.origin,
        'pathname': a.pathname,
        'port': a.port,
        'protocol': a.protocol.slice(0, -1),
        'search': a.search.slice(1),
        'subdomain': ''
      };

      i = obj.hostname.lastIndexOf('.');

      if (obj.hostname.length - i === 3) { // if .yz
        j = obj.hostname.lastIndexOf('.', i-1);
        if (j === i - 3 || j === i - 4) { // test .vwx.yz or .wx.yz
          i = j;
        }
      }

      j = obj.hostname.lastIndexOf('.', i-1);

      if (j !== -1) { // move back one more .
        i = j;
      }

      obj.domain = obj.hostname.slice(i+1);
      obj.subdomain = obj.hostname.slice(0, i);

      return obj;
    };

    /*
    // how to use function above, please use it wisely
    var myURL = parseURL('http://www.example.co.uk:8080/hello/world.html?foo=bar#anchor');

    // get the object completely
    console.log(myURL);

    {
      "domain": "example.co.uk",
      "hash": "anchor",
      "host": "www.example.co.uk:8080",
      "hostname": "www.example.co.uk",
      "href": "http://www.example.co.uk:8080/hello/world.html?foo=bar#anchor",
      "origin": "http://www.example.co.uk:8080",
      "pathname": "/hello/world.html",
      "port": "8080",
      "protocol": "http",
      "search": "foo=bar",
      "subdomain": "www"
    }

    // or just get the object directly
    console.log(myURL.domain);
    console.log(myURL.pathname);
    */



    $window
      .load(function(){
        $(this).trigger('site:onload');

        // show modal for customize eksis
        // if ($.cookie('_cst_eksis_modal') == null) {
        //   $.cookie('_cst_eksis_modal', 'yes', { expires: 7, path: '/' });
        //   if($('body').hasClass("customize")) {
        //     $('#cstModal').modal('show');
        //   }
        // }

        if($('body').hasClass("customize")) {
          $('#cstModal').modal('show');
        }

      })
      .resize(function(){
        var $this = $(this);
        setTimeout(function(){
          $this.trigger('site:onresize');
        }, 200);
      });



    vheight( $('.fsbg.index'), 0 );
    $window.on('site:onload site:onresize pjax:end', function () {
      vheight( $('.fsbg.index'), 0 );
    });



    // delay all images on screen
    $('#content').unbind('.dl');
    $window.on('load pjax:end', function() {
      var timeout = setTimeout(function() {
        $('.dl').lazyload({
          event : 'freeze',
          // effect : 'fadeIn',
          // effectspeed: 500,
          load : function() {
            var $this = $(this);
            $this.addClass('ld').removeClass('dl');
          }
        });
      }, 2000);
    }); // end of delaying function

    // trigger for wait all images to be loaded
    $window.bind('load', function() {
      var timeout = setTimeout(function() {
        $('.dl').trigger('freeze');
      }, 5000);
    }); // end of trigger function

  });


  // $(document).on('click', '.btn-login-hp', function(e){
  //   $(this).parent().toggleClass("form-login-active");
  //   e.preventDefault();
  // });


  // $(document).on('click', '.btn-menu-profile', function(e){
  //   $(this).parent().toggleClass('menu-profile-active');
  //   e.preventDefault();
  // });

  $(document).on('click', '.btn-menu-profile, .btn-login-hp', function(e){
    if($(this).hasClass('btn-menu-profile')) {
      $(this).parent().toggleClass('menu-profile-active');
    } else if ($(this).hasClass('btn-login-hp')) {
      $(this).parent().toggleClass("form-login-active");
    }

    e.preventDefault();
  });


  // modal feedback
  // nampilin modal prebeta dan feedback form
  $(document).on('click', '.modal-feedback-db', function(e){
    $('#welcomeModal').modal('hide');
    $('#welcomeModal').on('hidden.bs.modal', function (e) {
      $('#feedbackModal').modal('show');
    });
    e.preventDefault();
  });

  // lanjutan untuk nampilin modal thank you setelah feedback form
  // modal feedback thankyou
  // $(document).on('click', '#btnFeedbackModal', function(e){
  //   var t = $(this);

  //   $.ajax({
  //     type: "POST",
  //     url: "/profile_settings",
  //     dataType: "json",
  //     contentType: "application/json",
  //     data: json,
  //     beforeSend: function() {
  //       t.button('loading').addClass('btn-loading');
  //     },
  //     complete: function() {
  //       t.button('reset').removeClass('btn-loading');
  //     },
  //     success: function (data) {
  //         $('#feedbackModal').modal('hide');
  //         $('#feedbackModal').on('hidden.bs.modal', function (e) {
  //           $('#feedbackTYModal').modal('show');
  //         });

  //         // GA event tracking
             // klo mau isi event tracking via GA
  //         ga('send', 'event', 'section', 'feedback', 'Thank you!', {
  //           'page': url.pathname
  //         });
  //     },
  //     error: function (data) {}
  //   });

  //   e.preventDefault();
  // });


  // $(".navbar").scrollhide(); // triggerring function for site navigation above


  $('#builder-dropdown .dropdown-menu').on('click', '.nav-tabs a', function(){
    $(this).closest('.dropdown').addClass('dontClose');
  });

  $('#builder-dropdown').on('hide.bs.dropdown', function(e) {
    if ( $(this).hasClass('dontClose') ){
      e.preventDefault();
    }
    $(this).removeClass('dontClose');
  });

  $('.tooltips').tooltip({placement: 'bottom'});

  // init for like item's tooltip
  // $('body').tooltip({
  //   selector: "[data-toggle=tooltip]"
  // });

  $('#editor-builder, #editor-builder .builder-column-body').sortable({
    connectWith: '.builder-column-body',
    placeholder: 'builder-placeholder',
    sort: function() {
      $( this ).find('.placeholder').remove();
    }
  });

  $('.menu-builder-grid').draggable({
    helper: 'clone',
    connectToSortable: '#editor-builder',
    stop: function() {
      $('#editor-builder .builder-column-body').sortable({
        connectWith: '.builder-column-body',
      });

      var root = {
        'root': build_json('#editor-builder')
      };
      var json = JSON.stringify(root);

      // save to cookie for loading purpose
      $.cookie('ctzeksis', json);
      // read cookie value
      // console.log($.cookie('ctzeksis'));

      // ini potongan buat nge-save ke-server, didisable supaya ga error
      // jd utk saat ini output di console aja
      console.log(json);
      // $.ajax({
      //   type: "POST",
      //   url: "/profile_settings",
      //   dataType: "json",
      //   contentType: "application/json",
      //   data: json
      // });
    }
  });

  $('.menu-builder-element').draggable({
    helper: 'clone',
    connectToSortable: '#editor-builder .builder-column-body',
    stop: function() {
      $('#editor-builder .builder-column-body').sortable({
        connectWith: '.builder-column-body',
      });

      var root = {
        'root': build_json('#editor-builder')
      };
      var json = JSON.stringify(root);

      // save to cookie for loading purpose
      $.cookie('ctzeksis', json);
      // read cookie value
      // console.log($.cookie('ctzeksis'));

      console.log(json);
      // $.ajax({
      //   type: "POST",
      //   url: "/profile_settings",
      //   dataType: "json",
      //   contentType: "application/json",
      //   data: json
      // });
    }
  });


  // get cookie value
  $(document).on('click', '#getcookie', function() {
    console.log($.cookie('ctzeksis'));
  });


  // load cookie value
  $(document).on('click', '#loadcookie', function() {
    var obj = $.cookie('ctzeksis');
    var jsn = $.parseJSON(obj);

    // do
  });

}(window.jQuery));

build_json = function(root) {
  var arr;
  arr = [];
  $(root).children('.element').each(function() {
    var elem;
    elem = {
      type: $(this).data('type')
    };
    $.extend(true, elem, parse_options(this));
    return arr.push(elem);
  });
  return arr;
};


parse_options = function(elem) {
  var contents, options, type;
  type = $(elem).data('type');
  options = {};
  switch (type) {
    case "Layout 1/1":
    case "Layout 1/2":
    case "Layout 1/3":
    case "Layout 1/4":
    case "Layout 2/3":
    case "Layout 3/4":
    case "Image":
    case "Video":
    case "Masonry":
    case "Youtube":
    case "Soundcloud":
    case "Audio":
    case "Text":
    case "Line":
    case "Icon":
    case "List":
    case "Button":
    case "Tabs":
    case "Accordion":
      contents = [];
      $(elem)
        .find('> .menu-builder-content > .builder-columns-grid > .builder-columns > .content')
        .each(function() {
        return contents.push(build_json($(this)));
      });
      options.content = Array.prototype.concat.apply([], contents);
  }
  return options;
};