var ChoiceView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ChoiceView = (function(_super) {
  __extends(ChoiceView, _super);

  function ChoiceView() {
    _ref = ChoiceView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ChoiceView.prototype.tagName = 'li';

  ChoiceView.prototype.template = '';

  ChoiceView.prototype.model = null;

  ChoiceView.prototype.className = 'choice container';

  ChoiceView.prototype.onRender = function() {};

  ChoiceView.prototype.onCheck = function() {};

  ChoiceView.prototype.responsesLevelTemplate = '<div class="level"></div>';

  ChoiceView.prototype.initialize = function(options) {
    this.template = _.template(options.template);
    this.onRender = options.onRender;
    this.onCheck = options.onCheck;
    this.listenTo(this.model, 'change:checked', this.setCheckedClass, this);
    this.listenTo(this.model, 'change:preselected', this.setPreSelectedClass, this);
    this.listenTo(this.model, 'change:percentResponses', this.renderResponsesLevel, this);
    return this;
  };

  ChoiceView.prototype.serializeData = function() {
    var data;
    data = this.model.toJSON();
    data.checked = this.model.get('checked') ? 'checked' : '';
    return data;
  };

  ChoiceView.prototype.render = function() {
    this.setCheckedClass();
    this.$el.html(this.template(this.serializeData()));
    this.renderResponsesLevel();
    this.onRender(this.$el);
    return this;
  };

  ChoiceView.prototype.setCheckedClass = function() {
    this.setClassForAttr('checked');
    if (this.model.get('checked')) {
      this.onCheck(this.$el);
    }
    this.$el.find('input').prop('checked', this.model.get('checked'));
    return this;
  };

  ChoiceView.prototype.setPreSelectedClass = function() {
    this.setClassForAttr('preselected');
    return this;
  };

  ChoiceView.prototype.setClassForAttr = function(attribute) {
    if (this.model.get(attribute)) {
      this.$el.addClass(attribute);
    } else {
      this.$el.removeClass(attribute);
    }
    return this;
  };

  ChoiceView.prototype.renderResponsesLevel = function() {
    var $percentResponses, percentResponses;
    percentResponses = this.model.get('percentResponses');
    if (percentResponses == null) {
      return;
    }
    $percentResponses = $(this.responsesLevelTemplate);
    $percentResponses.css('height', percentResponses + '%');
    this.$el.append($percentResponses);
    return this;
  };

  return ChoiceView;

})(Backbone.View);

namespace('App.components', function(exports) {
  return exports.ChoiceView = ChoiceView;
});
