(function() {
  var Bar;

  Bar = (function() {
    
    function Bar() {}

    Bar.prototype.initBar = function(elem) {
      var self = this;
      $(elem).each(function(){
        var widthbar = $(this).width() - 38;
        var widthperc;
        widthperc = $('.percent', $(this)).first().width() > 0 ? $('.percent', $(this)).first().width() + 20 : 110;
        var html = $('.percent', $(this)).first().html();
        self.paintBar($(this), widthbar, widthperc);

        if($('.rowbutton').length) {
          var elemhide = $('.hide',$(this));
          self.paintBar(elemhide, widthbar, widthperc);
        }

        var $attachment;
        var type = 'bar';
        
        $attachment = $(this).find(".attachment");
        if ($attachment.length) {
          attachment = new Report.Attachment($attachment, {
            $question: $(this).find(".question"),
            $description: $(this).find(".description"),
            footerHeight: '190',
            questionType: type
          });
        }
      });
    }

    Bar.prototype.paintBar = function(elem, widthbar, widthperc) {
      elem.find('ul.choices-bar > li').each(function(){
        var perc = widthbar - (widthbar * $(this).data('value') * 0.01);
        var barsize = widthbar - widthperc;
        var $label= $(this).find('.label');
        $('.aux',$(this)).css({'right':perc});
        $('.aux .percent', $(this)).css({'left':perc});
        $('.bg', $(this)).css({width:'100%'});
        $label.addClass('ellipsis').css({width: barsize});
      });
    }

    Bar.prototype.initRating = function(elem) {
      var self = this;
      $('div.rating', elem).each(function(){
        self.paintRating($(this));
      });
    }

    Bar.prototype.paintRating = function(elem) {
      var maxSizeFont = 65;
      var iconsize = $(elem).width() / elem.data('step');
      if(elem.data('step') > 8) maxSizeFont = 55;
      iconsize = iconsize-8;
      if(iconsize < maxSizeFont) {
        $('.icons .icon',elem).css({'font-size':iconsize+'px'});
        $('.icons .icon-back',elem).css({'font-size':iconsize+'px'});
        iconsize = iconsize+6;
      }else{
        $('.icons .icon',elem).css({'font-size':maxSizeFont+'px'});
        $('.icons .icon-back',elem).css({'font-size':maxSizeFont+'px'});
        iconsize = maxSizeFont+6;
      } 
      var widthicon = $('.icon-back', elem).width();
      var size = elem.data('step') * iconsize * elem.data('value') * 0.01;
      $('.icons-back',elem).css({'width':size});
    }

    Bar.prototype.bindEvents = function() {
      
      $('.rowbutton').on('click', function() {
        var $this = $(this);
        var id = $this.data('id');
        var $elem = $('.widget','#'+id);
          
        if($elem.hasClass('opened')) {
          $('.hide','#'+id).slideUp('fast', function(){
            scroll.refresh(true);
            scroll.scrollTo(scroll.getCurrent());
            $elem.removeClass('opened');
          });
        }else{
          $elem.addClass('opened');
          $('.hide','#'+id).slideDown('fast', function(){
            scroll.refresh(true);
            $(".image img").lazyload();
          });
        } 
      });  

      $('.button-expand').on('click', function() {

        var $this = $(this);
          
        if($this.hasClass('opened')) {
          $this.html($this.data('show'));
          $this.next('ul.choices-bar').slideUp('fast', function(){
            $this.removeClass('opened');
            $elem = $("#report-questions");
            scroll.refresh(true);
            scroll.scrollTo(scroll.getCurrent());
          });
        }else{
          $this.html($this.data('hide'));
          $this.next('ul.choices-bar').slideDown('fast', function(){
            $this.addClass('opened');
            $elem = $("#report-questions");
            scroll.refresh(true);

          });
        }

        return false; 
      });

      $('.choices-bar li').on('click', function() {
        if( $('.ellipsis', $(this)).hasClass('no-ellipsis') ){
          $('.ellipsis', $(this)).removeClass('no-ellipsis');
          scroll.refresh(true);
        }else{
          $('.ellipsis', $(this)).addClass('no-ellipsis');
          scroll.refresh(true);
        }  
      });

    }

    return Bar;

  })();

  /*
  Export class to namespace
  */

  namespace("Report", function(exports) {
    return exports.Bar = Bar;
  });

}).call(this);
