(function() {
  'use strict';

  $(document).ready(init);

  function init(){
    $('.copyblock').click(getDiff);
  }

  function getDiff(){
    var current = $(this).data('id');
    var previous = current + 1;

    $(this).prettyTextDiff({
      originalContainer: '#copy' + previous,
      changedContainer: '#copy' + current,
      diffContainer: '#diff' + current,
      cleanup: true,
      debug: true
    });
  }

})();
