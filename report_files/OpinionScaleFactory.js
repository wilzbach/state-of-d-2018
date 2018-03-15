var OpinionScaleFactory,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

OpinionScaleFactory = (function() {
  OpinionScaleFactory.prototype.browser = null;

  function OpinionScaleFactory(browser) {
    this.browser = browser;
    this.createChoiceView = __bind(this.createChoiceView, this);
  }

  OpinionScaleFactory.prototype.useKeyboard = function() {
    return this.browser === 'default';
  };

  OpinionScaleFactory.prototype.build = function(fieldData) {
    var choicesView, fieldModel, fieldView, template, _base;
    fieldModel = new App.models.OpinionScaleModel(fieldData);
    choicesView = new App.components.ChoicesView({
      className: 'layout-columns',
      collection: fieldModel.getChoicesCollection(),
      createChoiceView: this.createChoiceView,
      keyboard: this.useKeyboard() ? typeof (_base = App.Service).Keyboard === "function" ? new _base.Keyboard() : void 0 : null,
      browser: this.browser
    });
    template = $.trim($("#component-opinion-scale").html());
    fieldView = new App.components.OpinionScaleView(choicesView, fieldModel, template);
    return fieldView;
  };

  OpinionScaleFactory.prototype.createChoiceView = function(choiceModel, positionClass) {
    var choiceView;
    if (positionClass == null) {
      positionClass = '';
    }
    choiceView = new App.components.ChoiceView(_.extend({
      model: choiceModel
    }, this.getChoicePropertiesByBrowser(positionClass)));
    return choiceView;
  };

  OpinionScaleFactory.prototype.getChoicePropertiesByBrowser = function(positionClass) {
    if (this.browser === 'fallback') {
      return {
        className: 'choice color-secondary text-align-center text-size-s',
        template: $('#component-choice-simple').html(),
        onRender: function() {},
        onCheck: function() {}
      };
    } else {
      return {
        className: 'choice choice-square style-transparent-choice without-padding text-size-xl text-antialiased ' + positionClass,
        template: $('#component-choice-square').html(),
        onRender: App.Utils.setStepClassByLightness,
        onCheck: App.Utils.selectEffect
      };
    }
  };

  return OpinionScaleFactory;

})();

namespace('App.factories', function(exports) {
  return exports.OpinionScaleFactory = OpinionScaleFactory;
});
