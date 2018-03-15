var OpinionScaleModel, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

OpinionScaleModel = (function(_super) {
  __extends(OpinionScaleModel, _super);

  function OpinionScaleModel() {
    this.setValue = __bind(this.setValue, this);
    _ref = OpinionScaleModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  OpinionScaleModel.prototype.defaults = {
    error: '',
    isFilled: false,
    maxValue: 0,
    negativeLabel: '',
    neutralLabel: '',
    pipeValue: '',
    positiveLabel: '',
    required: false,
    startAtOne: false,
    type: 'opinion-scale',
    value: null
  };

  OpinionScaleModel.prototype.choicesCollection = null;

  OpinionScaleModel.prototype.resetError = function() {
    this.set('error', '');
  };

  OpinionScaleModel.prototype.initialize = function() {
    OpinionScaleModel.__super__.initialize.call(this);
    this.choicesCollection = new App.components.ChoicesCollection(this.createChoicesFromSteps(), {
      startAtOne: this.attributes.startAtOne
    });
    this.on('change:maxValue change:startAtOne', this.updateChoicesCollection);
    this.on('change:value', this.update);
    this.listenTo(this.choicesCollection, 'change:checked', this.setValue, this);
    return this;
  };

  OpinionScaleModel.prototype.update = function() {
    if (this.attributes.value >= 0) {
      if (!this.get('isFilled')) {
        this.set('isFilled', true);
      }
    } else {
      this.set('isFilled', false);
    }
    this.setPipeValue();
  };

  OpinionScaleModel.prototype.getValidationError = function() {
    if (this.attributes.required && _.isNull(this.attributes.value)) {
      return 'must-select';
    }
    return '';
  };

  OpinionScaleModel.prototype.validate = function() {
    var error;
    error = this.getValidationError();
    this.set('error', error);
    return _.isEmpty(error);
  };

  OpinionScaleModel.prototype.updateChoicesCollection = function() {
    this.choicesCollection.set(this.createChoicesFromSteps());
    this.choicesCollection.setStartAtOne(this.attributes.startAtOne);
    return this;
  };

  OpinionScaleModel.prototype.setValue = function(model) {
    this.resetError();
    if (model.get('checked')) {
      this.set('value', model.get('value'));
    } else {
      this.set('value', null);
    }
    return this;
  };

  OpinionScaleModel.prototype.hasLabels = function() {
    var labels;
    labels = this.getLabelsToDisplay();
    return !(_.isEmpty(labels.negativeLabel) && _.isEmpty(labels.neutralLabel) && _.isEmpty(labels.positiveLabel));
  };

  OpinionScaleModel.prototype.getLabelsToDisplay = function() {
    return {
      negativeLabel: this.attributes.negativeLabel,
      neutralLabel: this.isOdd(this.attributes.maxValue) ? this.attributes.neutralLabel : '',
      positiveLabel: this.attributes.positiveLabel
    };
  };

  OpinionScaleModel.prototype.isOdd = function(num) {
    return (num % 2) === 1;
  };

  OpinionScaleModel.prototype.getChoicesCollection = function() {
    return this.choicesCollection;
  };

  OpinionScaleModel.prototype.createChoicesFromSteps = function() {
    var i, num, stepsCollection;
    stepsCollection = [];
    i = 0;
    while (i < this.attributes.maxValue) {
      num = this.getNumberToDisplay(i);
      stepsCollection.push({
        label: num.toString(),
        value: num
      });
      i++;
    }
    return stepsCollection;
  };

  OpinionScaleModel.prototype.getNumberToDisplay = function(index) {
    if (this.attributes.startAtOne) {
      return index + 1;
    } else {
      return index;
    }
  };

  OpinionScaleModel.prototype.setResponses = function(levels) {
    this.choicesCollection.setResponses(levels);
    return this;
  };

  OpinionScaleModel.prototype.getAverageResponses = function() {
    return this.choicesCollection.getAverageResponses();
  };

  OpinionScaleModel.prototype.setPipeValue = function() {
    var pipeValue, _ref1;
    pipeValue = (_ref1 = this.attributes.value) != null ? _ref1.toString() : void 0;
    this.set('pipeValue', pipeValue);
    return pipeValue;
  };

  return OpinionScaleModel;

})(App.models.BaseFieldModel);

namespace('App.models', function(exports) {
  return exports.OpinionScaleModel = OpinionScaleModel;
});
