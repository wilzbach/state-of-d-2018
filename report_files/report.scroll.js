(function() {
  var Scroll;

  Scroll = (function() {
    var defaults, _scroll;

    defaults = {
      scrollSpeed: 225,
      animateEase: "easeOutCubic",
      delayAutoScroll: 700,
      onFocus: function() {},
      onBlur: function() {},
      onReachPrev: function() {},
      onReachNext: function() {},
      onScrollStart: function() {},
      onScrollStop: function() {}
    };

    function Scroll($element, settings) {
      this.settings = $.extend({}, defaults, settings);
      this.footer = false;
      this.$element = $element;
      this.$items = $element.children(".list");
      this.numQuestions = this.$items.length;
      this.current = -1;
      this.positions = [];
    }

    Scroll.prototype.refresh = function(hasDomChanges) {
      var offsetFooter, self, windowHeight;
      if (hasDomChanges == null) {
        hasDomChanges = false;
      }
      self = this;
      if (hasDomChanges) {
        this.$items = this.$element.children(".list");
        this.numQuestions = this.$items.length;
      }
      offsetFooter = 0;
      if (this.footer) {
        offsetFooter = this.footer.get("blurHeight") / 2;
      }
      windowHeight = $(window).height();
      this.$items.each(function(index, item) {
        var itemHeight, position, positionTop, scrollPointA, scrollPointItem;
        positionTop = $(item).position().top;
        itemHeight = $(item).outerHeight();
        scrollPointItem = positionTop + itemHeight / 2 + offsetFooter;
        if (itemHeight > windowHeight - 40) {
          scrollPointA = scrollPointItem - (itemHeight - windowHeight) / 2 - 20;
        } else {
          scrollPointA = scrollPointItem;
        }
        position = {
          prev: positionTop + offsetFooter,
          item: scrollPointItem,
          next: positionTop + itemHeight + offsetFooter,
          a: scrollPointA
        };
        return self.positions[index] = position;
      });
      if (this.footer) {
        return self.positions[this.numQuestions] = {
          prev: self.positions[this.numQuestions - 1].next,
          item: self.positions[this.numQuestions - 1].next + 120,
          next: $("body").height()
        };
      }
    };

    Scroll.prototype.start = function(animate) {
      this.focus(0);
      if (animate) {
        return this.scrollTo(0);
      } else {
        return $(window).scrollTop(this.positions[0].a);
      }
    };

    Scroll.prototype.getCurrent = function() {
      return this.current;
    };

    Scroll.prototype.isAtFirst = function() {
      return this.current === 0;
    };

    Scroll.prototype.isAtLast = function() {
      var endScroll = this.numQuestions - 1;
      return this.current === endScroll;
    };

    Scroll.prototype.isAtFooter = function() {
      return this.current === this.numQuestions;
    };

    Scroll.prototype.scrollToPos = function(top, callback) {
      return $("html,body").stop(true, true).animate({
        scrollTop: top
      }, this.settings.scrollSpeed, this.settings.animateEase, function() {
        if (callback) {
          return callback();
        }
      });
    };

    Scroll.prototype.scrollTo = function(index, delay) {
      var self, time;
      if (delay == null) {
        delay = false;
      }
      self = this;
      time = 0;
      if (delay) {
        time = this.settings.delayAutoScroll;
      }
      clearTimeout(this.timeoutScroll);
      return this.timeoutScroll = setTimeout(function() {
        /*
        			if (toBottom){
        				top=positions[index] + $quickys.eq(index).height()/2;
        				if ($quickys.eq(index).height()+100>maxHeight){
        					$lastObj=$quickys.eq(index).find("li:last");
        					
        					if ($lastObj.length)
        						top=positions[index] + $lastObj.position().top + $lastObj.height();
        				}
        					
        			}
        */
        if (index === self.numQuestions) {
          return self.scrollToFooter();
        } else {
          return self.scrollToPos(self.positions[index].a, function() {
            return self.focus(index);
          });
        }
      }, time);
    };

    Scroll.prototype.scrollToPrev = function() {
      return this.scrollTo(this.current - 1);
    };

    Scroll.prototype.scrollToNext = function(delay) {
      var self, time;
      if (delay == null) {
        delay = false;
      }
      self = this;
      time = 0;
      if (delay) {
        time = this.settings.delayAutoScroll;
      }
      clearTimeout(this.timeoutScroll);
      return this.timeoutScroll = setTimeout(function() {
        if (self.current === self.numQuestions - 1) {
          if (self.footer) {
            return self.scrollToFooter();
          }
        } else {
          return self.scrollTo(self.current + 1);
        }
      }, time);
    };

    Scroll.prototype.scrollToFooter = function() {
      return this.scrollToPos(this.positions[this.numQuestions].item);
    };

    Scroll.prototype.buttonEnable = function(op,elem) {
      $button = $('.'+elem+' .nav' ,'.nav-buttons');
      if (op == true){
        $button.addClass("enabled")
        $button.removeClass("disabled")
      } else {
        $button.addClass("disabled")
        $button.removeClass("enabled")
      }
    };

    Scroll.prototype.focus = function(index) {
      if (index !== this.current && index >= 0 && index < this.numQuestions) {
        if (this.current < this.numQuestions) {
          if (!(index === this.numQuestions && this.current === this.numQuestions - 1)) {
            this.$items.eq(this.current).removeClass("focus");
          }
          this.settings.onBlur(this.$items.eq(this.current));
        }
        this.current = index;
        this.settings.onFocus(this.$items.eq(this.current));
        if(this.numQuestions==1) {
            this.buttonEnable(false,'up');
            this.buttonEnable(false,'down');
            this.$items.eq(this.current).addClass("focus");
        } else if (this.current < this.numQuestions) {
          lastQuestion = this.numQuestions - 1;
          if(this.current==0) {
            this.buttonEnable(false,'up');
            this.buttonEnable(true,'down');
          } else if(this.current==lastQuestion) {
            this.buttonEnable(false,'down');
            this.buttonEnable(true,'up');
          } else {
            this.buttonEnable(true,'up');
            this.buttonEnable(true,'down');
          }
          this.$items.eq(this.current).addClass("focus");
          if (this.footer) {
            return this.footer.unbindEvents();
          }
        } else {
          if (this.footer) {
            return this.footer.bindEvents();
          }
        }
      }
    };

    Scroll.prototype.bindEvents = function() {
      $(window).on("scroll.form scrollstop.form", this, _scroll).on("scrollstart.form", this, function(e) {
        var self;
        self = e.data;
        return self.settings.onScrollStart(self.current);
      }).on("scrollstop.form", this, function(e) {
        var self;
        self = e.data;
        return self.settings.onScrollStop(self.current);
      });
      $("body").on("click.form", ".scroll-overlay", this, function(e) {
        var self;
        self = e.data;
        return self.scrollToPrev();
      });
      return this.$element.on("click.form", "> li", this, function(e) {
        var dest, self;
        self = e.data;
        dest = $(this).index();
        if (self.$items.eq(dest).index() !== self.$items.eq(self.current).index()) {
          return self.scrollTo(dest);
        }
      });
    };

    Scroll.prototype.unbindEvents = function() {
      $(window).off(".form");
      return this.$element.off(".form");
    };

    _scroll = function(e) {
      var isDown, offset, self;
      self = e.data;
      if (self.positions[self.current].next <= window.pageYOffset) {
        self.focus(self.current + 1);
      } else if (self.positions[self.current].prev > window.pageYOffset) {
        if (self.current > 0) {
          self.focus(self.current - 1);
        }
      }
      if (self.footer) {
        offset = window.pageYOffset - self.positions[self.numQuestions - 1].next;
        if (offset > 0) {
          self.footer.slide(offset);
          self.$element.css({
            top: offset / 1.5
          });
          isDown = offset > self.offset;
          return self.offset = offset;
          /*
          				clearTimeout(@timeoutSlide)
          				if isDown
          					@timeoutSlide = setTimeout ->
          						self.scrollToFooter()
          					, 500
          */

        } else {
          self.footer.hide();
          return self.$element.css({
            top: 0
          });
        }
      }
    };

    return Scroll;

  })();

  /*
  Export class to namespace
  */


  namespace("Report", function(exports) {
    return exports.Scroll = Scroll;
  });

}).call(this);
