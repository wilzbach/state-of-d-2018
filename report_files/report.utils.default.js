(function() {
  var Utils;

  $elem = $("#report-questions");
  scroll = new Report.Scroll($elem);

  Utils = (function() {
    
    function Utils() {}

    //  ===================
    //  = Container color =
    //  ===================
    Utils.prototype.setContainerColor = function(backgroundColor,secondaryColor){
    // Containers

      var self = this;

      if (typeof(backgroundColor)!="undefined" && typeof(secondaryColor)!="undefined"){

        lightness = $.husl.fromHex(self.rgb2hex(backgroundColor))[2];

        var step = 0;
        
        if (lightness>80)
          step=0;
        else if (lightness>60)
          step=1;
        else if (lightness>40)
          step=2;
        else if (lightness>20)
          step=3;
        else if (lightness>9)
          step=4;
        else
          step=5;

        window.containerStep = step;

        $(".widget").each(function(){

          
          $(this).removeClass("step0 step1 step2 step3 step4 step5");
          
          $(this).addClass("step"+step);

          lightnessSC = $.husl.fromHex(self.rgb2hex(secondaryColor))[2];

        });

        if (lightness>80)
          $("body").addClass("dark");

        $(".header,.footer,.footer,.footer-confirm").removeClass("step0 step1 step2 step3 step4 step5").addClass("step"+step);
      }
    }

    var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

    Utils.prototype.rgb2hex = function(rgb) {
      //Function to convert hex format to a rgb color

      var self = this;

      if (typeof rgb !="undefined"){
        if (rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)){
          rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          return "#" + self.hex(rgb[1]) + self.hex(rgb[2]) + self.hex(rgb[3]);
        }
        else
        {
          return rgb;
        }
      }
    }
    
    Utils.prototype.hex = function(x) {
      if (typeof x !="undefined"){
        return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
      }
    }

    Utils.prototype.getCssValue = function(cls,attr){
      var temp=$("<div class='"+cls+"'></div>");
      $("body").append(temp);
      var value=temp.css(attr);
      temp.remove();
      //  append lento -> undefined
      return value;
    }

    var delay = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();

    Utils.prototype.resize = function(){
      $('#loader').show();
      delay(function(){

        bar = new Report.Bar();
        bar.initBar(".InfographicBar");
        bar.initRating(".InfographicBarRating");

        windowHeight = $(window).height();
        $elem.css({
          marginTop: windowHeight / 2,
          marginBottom: windowHeight / 2 + 60
        });

        scroll.refresh(true);

        $('#loader').hide();

        if ($(".attachment img").length > 0){ $(".attachment img").lazyload(); } 
          
      }, 500);
    }

    Utils.prototype.bindEvents = function() {

      $('.button-wrapper.up').on('click', function() {
        if(!scroll.isAtFirst())
          scroll.scrollToPrev();
      });

      $('.button-wrapper.down').on('click', function() {
        if(!scroll.isAtLast()) 
          scroll.scrollToNext();
      });

      $(document).keydown(function(e){
        if (e.which==38){
          if(!scroll.isAtFirst())
            scroll.scrollToPrev();
          else 
            return false;
        } else if(e.which==40){
          if(!scroll.isAtLast()) 
            scroll.scrollToNext();
          else 
            return false;
        }
      }); 
    }

    return Utils;

  })();

  /*
  Export class to namespace
  */

  namespace("Report", function(exports) {
    return exports.Utils = Utils;
  });

}).call(this);
