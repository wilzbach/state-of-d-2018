(function() {
  var Attachment;

  Attachment = (function() {
    var IMAGE, VIDEO, defaults;

    defaults = {
      useLazyLoad: true,
      embedVideo: false,
      lazyLoadImage: "https://s3-eu-west-1.amazonaws.com/typeform-media-static/lazy.png",
      $question: [],
      $description: [],
      attachLimit: 0,
      footerHeight: 0,
      minAttachmentHeight: 0,
      questionType: ""
    };

    IMAGE = 0;

    VIDEO = 1;

    function Attachment($attachment, settings) {
      var obj;
      this.$attachment = $attachment;
      this.settings = $.extend({}, defaults, settings);
      this.settings.minAttachmentHeight = 200;
      if (Globals.browser === "touch") {
        this.settings.minAttachmentHeight = $(window).width() >= Globals.responsiveThreshold ? 260 : 150;
      }
      obj = this.$attachment.data("attachment");
      if (obj.image !== "") {
        this.attach = this.attachImage;
        this.type = IMAGE;
      } else if (obj.video !== "") {
        this.attach = this.attachVideo;
        this.type = VIDEO;
      } else {
        this.$attachment.html("");
        return;
      }
      this.attach(obj);
    }

    Attachment.prototype.attachImage = function(obj) {
      var $wrapper, imageHeight, imageWidth, original, src;
       
      if (this.settings.useLazyLoad) {
        src = this.settings.lazyLoadImage;
        original = obj.image;
      } else {
        src = obj.image;
        original = "";
      }
      $wrapper = $("<div class='image'>");
      imageWidth = obj.width;
      imageHeight = obj.height;
      this.$img = $("<img src='" + src + "' data-original='" + original + "' width='" + imageWidth + "' height='" + imageHeight + "'/>");
      if (this.settings.useLazyLoad) {
        this.$img.lazyload({
          effect: "fadeIn",
          event: "lazyload"
        });
      }
      this.$attachment.data({
        width: imageWidth,
        height: imageHeight
      });
      
      this.resize();
      
      return this.$attachment.html(this.$img);
    };

    Attachment.prototype.attachVideo = function(obj) {
      var $iframe, h, scale, w;
      this.$video = $("<div class='video'>");
      this.$attachment.html(this.$video);
      scale = Globals.browser === "touch" ? 1 : obj.scale;
      if (!obj.ratio || typeof obj.ratio === "undefinded") {
        obj.ratio = 1.777;
      }
      w = this.$attachment.width() * scale;
      h = w / obj.ratio;
      this.$video.data({
        width: w,
        height: h,
        video_id: obj.video_id
      });
      this.$video.css({
        width: w,
        height: h
      });
      $iframe = $("<iframe width='100%' height='100%' src='//www.youtube.com/embed/" + obj.video_id + "' frameborder='0' allowfullscreen></iframe>");
      this.$video.data("loaded", true);
      return this.$video.html($iframe);
    };

    Attachment.prototype.load = function() {
      if (this.type === IMAGE) {
        return this.$img.trigger("lazyload");
      } else {
        return this.loadVideo();
      }
    };

    Attachment.prototype.loadVideo = function() {
      var h, self, w;
      self = this;
      if (this.$video.data("loaded") !== true) {
        this.$video.data("loaded", true);
        w = this.$video.width();
        h = this.$video.height();
        return this.$video.tubeplayer({
          width: w + "px",
          height: h + "px",
          wmode: "opaque",
          iframed: true,
          initialVideo: this.$video.data("video_id"),
          preferredQuality: "hd720",
          protocol: 'https',
          onPlayerPlaying: function() {
            return self.$video.trigger("play");
          }
        });
      }
    };

    Attachment.prototype.pause = function() {
      if (this.type === VIDEO) {
        if (typeof this.$video.tubeplayer !== "undefined") {
          return this.$video.tubeplayer("pause");
        }
      }
    };

    Attachment.prototype.resize = function() {
      /*
      			
      			Formula:
      			1- Reducimos el width hasta el limite de la ventana
      			2- Reducimos height para que se vea parte del control
      				2.1 - el height es windowHeight - footer - question - description - control.getAttachmentLimit)
      				2.2 - comprobamos si nos hemos pasado (con minAttachmentHeight
      */

      var aHeight, aWidth, descriptionHeight, h, limit, onlyWidth, questionHeight, w, wWidth, windowHeight, wHeight;
      onlyWidth = Globals.browser === "simple";
      aWidth = this.$attachment.data("width");
      aHeight = this.$attachment.data("height");
      w = aWidth;
      h = aHeight;
      wWidth = this.$attachment.parent().width();
      windowHeight = $(window).height();
      if (w > wWidth) {
        w = wWidth;
        h = aHeight * wWidth / aWidth;
      }
      if (!onlyWidth) {
        questionHeight = this.settings.$question.outerHeight(true);
        descriptionHeight = 0;
        if (this.settings.$description.length) {
          descriptionHeight = this.settings.$description.outerHeight(true);
        }
      }
      
      limit = windowHeight - this.settings.attachLimit - this.settings.footerHeight - questionHeight - descriptionHeight;
      limit = Math.max(limit, this.settings.minAttachmentHeight);
      
      if (h > limit) {
        w = w * limit / h;
        h = limit;
      }
      this.$attachment.css({
        width: w,
        height: h
      });
      if (this.type === IMAGE) {
        return this.$img.css({
          width: w,
          height: h
        });
      } else {
        if (typeof tubeplayer !== "undefined") {
          return this.$attachment.tubeplayer("size", {
            width: w,
            height: h
          });
        }
      }
    };

    return Attachment;

  })();

  /*
  Export class to namespace
  */


  namespace("Report", function(exports) {
    return exports.Attachment = Attachment;
  });

}).call(this);
