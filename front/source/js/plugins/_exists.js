// Tiny Plugin to check if element exists, usage
// $('div.test').exists(function() {
//  this.append('<p>I exist!</p>');
// });

(function($){
  $.fn.exists = function(callback) {
    var args = [].slice.call(arguments, 1);

    if (this.length) {
      callback.call(this, args);
    }

    return this;
  };
}(jQuery));

