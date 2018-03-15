var ChoicesView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ChoicesView = (function(_super) {
  __extends(ChoicesView, _super);

  function ChoicesView() {
    this.renderChoice = __bind(this.renderChoice, this);
    this.onKeyup = __bind(this.onKeyup, this);
    this.onClickChoice = __bind(this.onClickChoice, this);
    this.onMouseleave = __bind(this.onMouseleave, this);
    this.onMouseover = __bind(this.onMouseover, this);
    _ref = ChoicesView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ChoicesView.prototype.tagName = 'ul';

  ChoicesView.prototype.collection = null;

  ChoicesView.prototype.className = 'choices';

  ChoicesView.prototype.$document = null;

  ChoicesView.prototype.createChoiceView = null;

  ChoicesView.prototype.keyboard = null;

  ChoicesView.prototype.options = null;

  ChoicesView.prototype.defaults = {
    browser: null
  };

  ChoicesView.prototype.initialize = function(options) {
    this.options = _.extend({}, this.defaults, options);
    this.$document = $(document);
    this.createChoiceView = options.createChoiceView;
    this.keyboard = options.keyboard;
    this.listenTo(this.collection, 'add remove', this.render, this);
    if (this.options.browser === 'fallback') {
      this.bindFallbackEvents();
    }
    return this;
  };

  ChoicesView.prototype.bindEvents = function() {
    if (this.options.browser === 'default') {
      this.bindDefaultEvents();
    } else if (this.options.browser === 'touch') {
      this.bindTouchEvents();
    }
    return this;
  };

  ChoicesView.prototype.bindDefaultEvents = function() {
    if (this.keyboard != null) {
      this.$document.on('keyup.choices', this.onKeyup);
    }
    this.$el.on('click.choices', '.choice', this.onClickChoice);
    this.$el.on('mouseover.choices', '.choice', this.onMouseover);
    this.$el.on('mouseout.choices', '.choice', this.onMouseleave);
    return this;
  };

  ChoicesView.prototype.bindTouchEvents = function() {
    this.$el.on('touchend.choices', '.choice', this.onClickChoice);
    return this;
  };

  ChoicesView.prototype.bindFallbackEvents = function() {
    this.$el.on('change.choices', '.choice', this.onClickChoice);
    return this;
  };

  ChoicesView.prototype.unbindEvents = function() {
    this.$el.off('.choices');
    this.$document.off('.choices');
    return this;
  };

  ChoicesView.prototype.onMouseover = function(evt) {
    var index;
    index = $(evt.currentTarget).index();
    this.collection.preselect(index);
    return this;
  };

  ChoicesView.prototype.onMouseleave = function(evt) {
    var index;
    index = $(evt.currentTarget).index();
    this.collection.removePreselect(index);
    return this;
  };

  ChoicesView.prototype.onArrowKeyPress = function(direction) {
    if (this.keyboard.isLeftDirection(direction)) {
      this.collection.preselectPrevious();
      return false;
    } else if (this.keyboard.isRightDirection(direction)) {
      this.collection.preselectNext();
      return false;
    }
    return true;
  };

  ChoicesView.prototype.onEnterKeyPress = function() {
    return this.onConfirmPreselect();
  };

  ChoicesView.prototype.onConfirmPreselect = function() {
    if (this.collection.getPreselectedChoice() != null) {
      this.collection.tooglePreselected();
      return false;
    }
    return true;
  };

  ChoicesView.prototype.onClickChoice = function(evt) {
    var index;
    index = $(evt.currentTarget).index();
    this.collection.selectByIndex(index);
    return this;
  };

  ChoicesView.prototype.onKeyup = function(evt) {
    if (this.keyboard.isSpace(evt)) {
      return this.onConfirmPreselect();
    } else {
      this.checkNumberKeyup(evt);
    }
    return this;
  };

  ChoicesView.prototype.checkNumberKeyup = function(evt) {
    var number;
    if (this.collection.containsTwoDigitsChoice()) {
      number = this.keyboard.getNumberUsingMultipleDigits(evt);
    } else {
      number = this.keyboard.getNumber(evt);
    }
    if (number != null) {
      this.collection.selectByNumber(number);
    }
    return this;
  };

  ChoicesView.prototype.render = function() {
    this.$el.empty();
    this.collection.forEach(this.renderChoice);
    return this;
  };

  ChoicesView.prototype.renderChoice = function(model, index) {
    var choiceView, positionClass;
    positionClass = this.getPositionClass(index);
    choiceView = this.createChoiceView(model, positionClass);
    this.appendChoiceView(choiceView.render());
    return this;
  };

  ChoicesView.prototype.getPositionClass = function(index) {
    if (index === 0) {
      return 'first';
    }
    if (index === this.collection.length - 1) {
      return 'last';
    }
    return '';
  };

  ChoicesView.prototype.appendChoiceView = function(choiceView) {
    this.$el.append(choiceView.$el);
    return this;
  };

  return ChoicesView;

})(Backbone.View);

namespace('App.components', function(exports) {
  return exports.ChoicesView = ChoicesView;
});
