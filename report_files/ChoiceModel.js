var ChoiceModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ChoiceModel = (function(_super) {
  __extends(ChoiceModel, _super);

  function ChoiceModel() {
    _ref = ChoiceModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ChoiceModel.prototype.defaults = {
    label: '',
    value: null,
    checked: false,
    preselected: false,
    percentResponses: null,
    responses: 0
  };

  ChoiceModel.prototype.initialize = function() {
    this.on('change:checked', this.onChangeChecked);
    return this;
  };

  ChoiceModel.prototype.onChangeChecked = function() {
    if (this.attributes.checked) {
      this.set('preselected', true);
    }
    return this;
  };

  ChoiceModel.prototype.toogle = function() {
    this.set('checked', !this.attributes.checked);
    return this;
  };

  return ChoiceModel;

})(Backbone.Model);

namespace('App.components', function(exports) {
  return exports.ChoiceModel = ChoiceModel;
});
