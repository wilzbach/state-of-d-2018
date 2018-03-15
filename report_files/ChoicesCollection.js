var ChoicesCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ChoicesCollection = (function(_super) {
  __extends(ChoicesCollection, _super);

  function ChoicesCollection() {
    _ref = ChoicesCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ChoicesCollection.prototype.model = App.components.ChoiceModel;

  ChoicesCollection.prototype.options = null;

  ChoicesCollection.prototype.defaults = {
    startAtOne: true
  };

  ChoicesCollection.prototype.initialize = function(data, options) {
    this.options = _.extend({}, this.defaults, options);
    this.on('change:checked', this.onCheck, this);
    return this;
  };

  ChoicesCollection.prototype.setStartAtOne = function(startAtOne) {
    this.options.startAtOne = startAtOne;
    return this;
  };

  ChoicesCollection.prototype.onCheck = function(checkedModel) {
    this.uncheckOtherModels(checkedModel);
    return this;
  };

  ChoicesCollection.prototype.uncheckOtherModels = function(checkedModel) {
    if (!checkedModel.get('checked')) {
      return;
    }
    this.each(function(model) {
      if (model !== checkedModel) {
        return model.set({
          'checked': false,
          'preselected': false
        });
      }
    });
    return this;
  };

  ChoicesCollection.prototype.selectByNumber = function(number) {
    var index;
    if (this.options.startAtOne) {
      index = number - 1;
    } else {
      index = number;
    }
    this.selectByIndex(index);
    return this;
  };

  ChoicesCollection.prototype.selectByIndex = function(index) {
    var _ref1;
    if ((_ref1 = this.at(index)) != null) {
      _ref1.toogle();
    }
    return this;
  };

  ChoicesCollection.prototype.getPreselectedChoice = function() {
    return this.findWhere({
      preselected: true
    });
  };

  ChoicesCollection.prototype.getPreselectedChoiceIndex = function() {
    return this.indexOf(this.getPreselectedChoice());
  };

  ChoicesCollection.prototype.preselect = function(index) {
    var _ref1, _ref2;
    if ((_ref1 = this.getPreselectedChoice()) != null) {
      _ref1.set('preselected', false);
    }
    if ((_ref2 = this.at(index)) != null) {
      _ref2.set('preselected', true);
    }
    return this;
  };

  ChoicesCollection.prototype.removePreselect = function(index) {
    var _ref1;
    if ((_ref1 = this.at(index)) != null) {
      _ref1.set('preselected', false);
    }
    return true;
  };

  ChoicesCollection.prototype.preselectPrevious = function() {
    var index;
    index = this.getPreselectedChoiceIndex();
    if (index === 0) {
      return false;
    }
    this.preselect(index - 1);
    return this;
  };

  ChoicesCollection.prototype.preselectNext = function() {
    var index;
    index = this.getPreselectedChoiceIndex();
    if (index === this.length - 1) {
      return false;
    }
    this.preselect(index + 1);
    return this;
  };

  ChoicesCollection.prototype.tooglePreselected = function() {
    var _ref1;
    if ((_ref1 = this.getPreselectedChoice()) != null) {
      _ref1.toogle();
    }
    return this;
  };

  ChoicesCollection.prototype.containsTwoDigitsChoice = function() {
    if (this.options.startAtOne) {
      return this.length >= 10;
    } else {
      return this.length > 10;
    }
  };

  ChoicesCollection.prototype.getChoiceWithLabel = function(label) {
    return this.find(function(choiceModel) {
      return choiceModel.get('label') === label;
    });
  };

  ChoicesCollection.prototype.setResponses = function(choice) {
    var _this = this;
    _.each(choice, function(choice) {
      var _ref1;
      return (_ref1 = _this.getChoiceWithLabel(choice.label)) != null ? _ref1.set(choice) : void 0;
    });
    return this;
  };

  ChoicesCollection.prototype.getSumResponses = function() {
    return this.reduce(function(memo, model) {
      return memo + model.get('responses') * model.get('value');
    }, 0);
  };

  ChoicesCollection.prototype.getTotalResponses = function() {
    return this.reduce(function(memo, model) {
      return memo + model.get('responses');
    }, 0);
  };

  ChoicesCollection.prototype.getAverageResponses = function() {
    var average, totalResponses;
    totalResponses = this.getTotalResponses();
    if (totalResponses > 0) {
      average = this.getSumResponses() / totalResponses;
    } else {
      average = 0;
    }
    return average.toFixed(2);
  };

  return ChoicesCollection;

})(Backbone.Collection);

namespace('App.components', function(exports) {
  return exports.ChoicesCollection = ChoicesCollection;
});
