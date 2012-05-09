if (document.querySelectorAll) {
  (function ($, $$) {
    var navigation = $('#navigation'),
        cloned = navigation.cloneNode(true),
        offset = navigation.offsetTop,
        root   = document.documentElement,
        height, timer, throttle;

    // Append the cloned navigation item.
    cloned.classList.add('float');
    document.body.appendChild(cloned);
    height = cloned.getBoundingClientRect().height;

    // Animate a scroll to the provided offset.
    function scrollTo(offset) {
      var total = Math.abs(window.scrollY - offset),
          start = Math.ceil(500 * total / root.scrollHeight),
          last;

      clearTimeout(timer);

      (function doScroll() {
        if (last && window.scrollY !== last) {
          // Manually moved by the user so stop scrolling.
          return clearTimeout(timer);
        }

        var difference = window.scrollY - offset,
            direction  = difference < 1 ? 1 : -1,
            modifier   = Math.abs(difference) / total,
            increment  = Math.ceil(start * modifier);

        if (difference !== last && (direction < 0 || window.innerHeight + window.scrollY !== root.scrollHeight)) {
          if (difference < increment && difference > increment * -1) {
            increment = Math.abs(difference);
          }
          last = window.scrollY + (increment * direction);
          window.scrollTo(0, last);
          timer = setTimeout(doScroll, 1000 / 60);
        }
      })();
    }

    // Show/Hide the navigation on scroll.
    window.addEventListener('scroll', (function onScroll() {
      if (throttle) {
        return;
      }

      throttle = setTimeout(function () {
        throttle = null;
      }, 1000 / 60);

      var isHidden = window.scrollY < offset;
      cloned[isHidden ? 'setAttribute' : 'removeAttribute']('hidden', '');
      return onScroll;
    })(), false);

    // Handle scroll between inter-document links.
    document.body.addEventListener('click', function (event) {
      var section = event.target.hash && $(event.target.hash),
          offset  = window.scrollY;

      if (section) {
        // Set the location hash and reset the browser scroll position.
        window.location.hash = event.target.hash;
        window.scrollTo(0, offset);

        // Animate to the element.
        scrollTo(section.parentNode.offsetTop - height - 20);
        event.preventDefault();
      }
    }, false);

  })(function () { return document.querySelector.apply(document, arguments); });
}
