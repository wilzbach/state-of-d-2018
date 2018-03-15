var Utils;

Utils = {
  getWindowHeight: function() {
    var d, e, g, w;
    w = window;
    d = document;
    e = d.documentElement;
    g = d.getElementsByTagName('body')[0];
    return w.innerHeight || e.clientHeight || g.clientHeight;
  },
  getCssValue: function(cls, attr) {
    var temp, value;
    temp = $("<div class='" + cls + "'></div>");
    $("body").append(temp);
    value = temp.css(attr);
    temp.remove();
    return value;
  },
  getControlValue: function(control) {
    if (control instanceof Control) {
      return control.field.getValue().toString();
    }
    return control.pipeValue;
  },
  isControlRequired: function(control) {
    return control.model.attributes.required;
  },
  isGroupControl: function(control) {
    return control instanceof Group;
  },
  setStepClassByLightness: function($el) {
    var backgroundColor, hexBC, lightness, step;
    backgroundColor = App.Utils.getCssValue('backgroundColor', 'background-color');
    hexBC = App.Utils.rgb2hex(backgroundColor);
    lightness = $.husl.fromHex(hexBC)[2];
    step = App.Utils.getStepByLightness(lightness);
    $el.removeClass('step0 step1 step2 step3 step4 step5').addClass('step' + step);
  },
  getStepByLightness: function(lightness) {
    switch (false) {
      case !(lightness > 80):
        return 0;
      case !(lightness > 60):
        return 1;
      case !(lightness > 40):
        return 2;
      case !(lightness > 20):
        return 3;
      case !(lightness > 9):
        return 4;
      default:
        return 5;
    }
  },
  selectEffect: function($el) {
    return $el.selectEffect(2);
  },
  setContainerColor: function(backgroundColor, secondaryColor) {
    var hexBC, hexSC, lightness, step;
    if (typeof backgroundColor !== "undefined" && typeof secondaryColor !== "undefined") {
      hexBC = App.Utils.rgb2hex(backgroundColor);
      hexSC = App.Utils.rgb2hex(secondaryColor);
      lightness = $.husl.fromHex(hexBC)[2];
      step = App.Utils.getStepByLightness(lightness);
      window.containerStep = step;
      $('.container, .style-transparent-choice').each(function() {
        var lightnessSC;
        $(this).removeClass("step0 step1 step2 step3 step4 step5");
        $(this).addClass("step" + step);
        return lightnessSC = $.husl.fromHex(hexSC)[2];
      });
      $(".tooltip").each(function() {
        var lightnessSC;
        $(this).removeClass("dark light");
        if (lightness > 80) {
          $(this).addClass("dark");
        } else {
          $(this).addClass("light");
        }
        return lightnessSC = $.husl.fromHex(hexSC)[2];
      });
      if (lightness > 80) {
        $("body").addClass("dark");
      }
      return $(".header,.footer, .lightness-step,.footer-confirm").removeClass("step0 step1 step2 step3 step4 step5").addClass("step" + step);
    }
  },
  rgb2hex: function(color) {
    var rgb;
    rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (_.isNull(rgb)) {
      return color;
    } else {
      return "#" + App.Utils.hex(rgb[1]) + App.Utils.hex(rgb[2]) + App.Utils.hex(rgb[3]);
    }
  },
  hex: function(x) {
    var hexDigits;
    hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    if (typeof x !== "undefined") {
      if (isNaN(x)) {
        return "00";
      } else {
        return hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
      }
    }
  },
  getCaret: function(el) {
    var r, rc, re;
    if (el.selectionStart) {
      return el.selectionStart;
    } else if (document.selection) {
      el.focus();
      r = document.selection.createRange();
      if (r == null) {
        return 0;
      }
      re = el.createTextRange();
      rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint("EndToStart", re);
      return rc.text.length;
    }
    return 0;
  },
  isCaretAtStart: function(el) {
    return App.Utils.getCaret(el[0]) === 0;
  },
  isCaretAtEnd: function(el) {
    return App.Utils.getCaret(el[0]) === el.val().length;
  },
  remoteLog: function(str) {
    return $.ajax({
      data: "file=test.txt&data=" + str,
      url: "/demo/log.php"
    });
  },
  letters: 'abcdefghijklmnopqrstuvwxyz',
  getLetter: function(number) {
    var last, remaining, rest;
    if (number == null) {
      number = null;
    }
    if (!_.isNumber(number)) {
      return;
    }
    last = this.letters[number % this.letters.length];
    remaining = Math.floor(number / this.letters.length) - 1;
    rest = number < this.letters.length ? '' : this.getLetter(remaining);
    return rest + last;
  }
};

/*
Export class to namespace
*/


namespace("App", function(exports) {
  return exports.Utils = Utils;
});

$.fn.enable = function(op) {
	$button = $(this)
	if (op == true){
		$button.addClass("enabled")
		$button.removeClass("disabled")
	} else {
		$button.addClass("disabled")
		$button.removeClass("enabled")
	}
	return $button;
};

$.fn.replaceText = function( search, replace ) {
	return this.each(function(){
		$(this).html($(this).html().replace(new RegExp(search,"g"),replace))
	});
}

$.fn.shuffle = function() {
	var allElems = this.get(),
	getRandom = function(max) {
		return Math.floor(Math.random() * max);
	},
	shuffled = $.map(allElems, function(){
		var random = getRandom(allElems.length),
		randEl = $(allElems[random]).clone(true)[0];
		allElems.splice(random, 1);
		return randEl;
	});

	this.each(function(i){
		$(this).replaceWith($(shuffled[i]));
	});

	return $(shuffled);
	
};

$.fn.translate3d = function(x, y, z) {
  return $(this).css(Globals.vendor + "transform", "translate3d(" + x + "px," + y + "px," + z + "px)");
};

$.fn.alterClass = function ( removals, additions ) {

	var self = this;

	if ( removals.indexOf( '*' ) === -1 ) {
		// Use native jQuery methods if there is no wildcard matching
		self.removeClass( removals );
		return !additions ? self : self.addClass( additions );
	}

	var patt = new RegExp( '\\s' + 
			removals.
				replace( /\*/g, '[A-Za-z0-9-_]+' ).
				split( ' ' ).
				join( '\\s|\\s' ) + 
			'\\s', 'g' );

	self.each( function ( i, it ) {
		var cn = ' ' + it.className + ' ';
		while ( patt.test( cn ) ) {
			cn = cn.replace( patt, ' ' );
		}
		it.className = $.trim( cn );
	});

	return !additions ? self : self.addClass( additions );
};

$.fn.selectEffect = function(loop) {
	var elem=$(this);
	if (Globals.browser=="default"){

		var loop = typeof(loop) != 'undefined' ? loop : 2;
		var vel = 130;
		var i=2;
		
		var $btn = elem.find(".button");
		$btn.removeClass("full");

		var doEffect = function(){
			
				elem.stop(true, true).animate({
					opacity: 0
					}, vel, function() {
						elem.animate({
						opacity: 1
						}, vel);
					}
				);

		};
		
		doEffect();
		var it = setInterval(function(){
			doEffect();
			i++;
			if (i>loop){
				clearInterval(it);
				$btn.addClass("full");

			}
		},vel * 2 + 1);
		
	}
	
	
	return elem;
	
};

(function(removeClass) {

	jQuery.fn.removeClass = function( value ) {
		if ( value && typeof value.test === "function" ) {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];
				if ( elem.nodeType === 1 && elem.className ) {
					var classNames = elem.className.split( /\s+/ );

					for ( var n = classNames.length; n--; ) {
						if ( value.test(classNames[n]) ) {
							classNames.splice(n, 1);
						}
					}
					elem.className = jQuery.trim( classNames.join(" ") );
				}
			}
		} else {
			removeClass.call(this, value);
		}
		return this;
	}

})(jQuery.fn.removeClass);
;
