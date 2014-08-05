// = require plugins/_all
// get all plugins required for document, done!


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

  $('#builder-dropdown .dropdown-menu').on('click', '.nav-tabs a', function(){
    $(this).closest('.dropdown').addClass('dontClose');
  })

  $('#builder-dropdown').on('hide.bs.dropdown', function(e) {
    if ( $(this).hasClass('dontClose') ){
      e.preventDefault();
    }
    $(this).removeClass('dontClose');
  });

  $('.tooltips').tooltip({placement: 'bottom'});

  $('#editor-builder, #editor-builder .builder-column-body').sortable({
    connectWith: '.builder-column-body',
    placeholder: 'builder-placeholder',
    sort: function() {
      $( this ).find('.placeholder').remove()
    }
  });

  $('.menu-builder-grid').draggable({
    helper: 'clone',
    connectToSortable: '#editor-builder',
    stop: function() {
      $('#editor-builder .builder-column-body').sortable({
        connectWith: '.builder-column-body'
      });

      var root = {
        'root': build_json('#editor-builder')
      };
      var json = JSON.stringify(root);

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
    connectToSortable: '#editor-builder .builder-column-body'
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
      contents = [];
      $(elem).find('> .menu-builder-content > .builder-columns-grid > .builder-columns > .content').each(function() {
        return contents.push(build_json($(this)));
      });
      options.content = Array.prototype.concat.apply([], contents);
  }
  return options;
};
