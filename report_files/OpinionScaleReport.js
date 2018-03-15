var OpinionScaleReport;

OpinionScaleReport = (function() {
  OpinionScaleReport.prototype.$el = null;

  OpinionScaleReport.prototype.componentView = null;

  OpinionScaleReport.prototype.fieldModel = null;

  function OpinionScaleReport($el, fieldData, reportData) {
    this.$el = $el;
    this.componentView = new App.factories.OpinionScaleFactory('default').build(fieldData);
    this.fieldModel = this.componentView.getFieldModel();
    this.fieldModel.setResponses(this.prepareReportData(reportData));
    this.renderComponentView();
    this.renderAverage();
    this.renderNetPromoterScore(reportData);
    return;
  }

  OpinionScaleReport.prototype.renderComponentView = function() {
    this.$el.find('.component').html(this.componentView.render().$el);
  };

  OpinionScaleReport.prototype.renderAverage = function() {
    this.$el.find('.summary > .average').html(this.fieldModel.getAverageResponses());
  };

  OpinionScaleReport.prototype.renderNetPromoterScore = function(reportData) {
    var netPromoterScore, scores;
    scores = this.getReportScores(reportData.choices);
    if (scores != null) {
      netPromoterScore = new App.Service.NetPromoterScore(scores).calculate();
      this.$el.find('.summary > .nps').html("NPS: " + netPromoterScore + ", ");
    }
  };

  OpinionScaleReport.prototype.getReportScores = function(choicesData) {
    var choice, i, scores;
    if (!(this.fieldModel.get('startAtOne') === false && this.fieldModel.get('maxValue') === 11)) {
      return;
    }
    scores = [];
    i = 0;
    while (i <= 10) {
      choice = _.findWhere(choicesData, {
        label: i.toString()
      });
      scores[i] = parseInt(choice != null ? choice.value : void 0, 10) || 0;
      i++;
    }
    return scores;
  };

  OpinionScaleReport.prototype.prepareReportData = function(reportData) {
    return _.map(reportData.choices, function(choiceData) {
      return {
        label: choiceData.label,
        percentResponses: choiceData.value * 100 / reportData.total,
        responses: parseInt(choiceData.value, 10)
      };
    });
  };

  return OpinionScaleReport;

})();

namespace('App.Reports', function(exports) {
  return exports.OpinionScaleReport = OpinionScaleReport;
});
