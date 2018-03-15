var OpinionScaleView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

OpinionScaleView = (function(_super) {
  __extends(OpinionScaleView, _super);

  OpinionScaleView.prototype.choicesView = null;

  OpinionScaleView.prototype.fieldModel = null;

  OpinionScaleView.prototype.template = '';

  OpinionScaleView.prototype.$choices = null;

  OpinionScaleView.prototype.$labels = null;

  function OpinionScaleView(choicesView, fieldModel, template) {
    this.choicesView = choicesView;
    this.fieldModel = fieldModel;
    this.template = template;
    this.listenTo(this.fieldModel, 'change:positiveLabel change:neutralLabel change:negativeLabel change:maxValue', this.renderLabels, this);
    Backbone.View.apply(this, []);
  }

  OpinionScaleView.prototype.getFieldModel = function() {
    return this.fieldModel;
  };

  OpinionScaleView.prototype.initialize = function() {
    this.$el.html(this.template);
    if (this.$choices == null) {
      this.$choices = this.$el.find('.component-choices');
    }
    if (this.$labels == null) {
      this.$labels = this.$el.find('.labels');
    }
    return this;
  };

  OpinionScaleView.prototype.bindEvents = function() {
    this.choicesView.bindEvents();
    return this;
  };

  OpinionScaleView.prototype.unbindEvents = function() {
    this.choicesView.unbindEvents();
    return this;
  };

  OpinionScaleView.prototype.onArrowKeyPress = function(direction) {
    return this.choicesView.onArrowKeyPress(direction);
  };

  OpinionScaleView.prototype.onEnterKeyPress = function() {
    return this.choicesView.onEnterKeyPress();
  };

  OpinionScaleView.prototype.render = function() {
    this.renderChoices();
    this.renderLabels();
    return this;
  };

  OpinionScaleView.prototype.renderChoices = function() {
    this.$choices.html(this.choicesView.render().$el);
    return this;
  };

  OpinionScaleView.prototype.renderLabels = function() {
    this.showLabels();
    this.renderLabelsToDisplay();
    return this;
  };

  OpinionScaleView.prototype.showLabels = function() {
    if (this.fieldModel.hasLabels()) {
      this.$labels.show();
    } else {
      this.$labels.hide();
    }
    return this;
  };

  OpinionScaleView.prototype.renderLabelsToDisplay = function() {
    var data, label, _i, _len, _ref;
    data = this.fieldModel.getLabelsToDisplay();
    _ref = ['negativeLabel', 'neutralLabel', 'positiveLabel'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      label = _ref[_i];
      this.renderLabel(label, data);
    }
    return this;
  };

  OpinionScaleView.prototype.renderLabel = function(label, data) {
    var _name;
    if (this[_name = "$" + label] == null) {
      this[_name] = this.$el.find("." + label);
    }
    this["$" + label].html(data[label]);
    return this;
  };

  return OpinionScaleView;

})(Backbone.View);

namespace('App.components', function(exports) {
  return exports.OpinionScaleView = OpinionScaleView;
});
