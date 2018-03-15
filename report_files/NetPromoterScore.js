var NetPromoterScore;

NetPromoterScore = (function() {
  NetPromoterScore.prototype.scores = [];

  NetPromoterScore.prototype.numberOfChoicesRequired = 11;

  NetPromoterScore.prototype.index = {
    promoter: {
      start: 9,
      end: 10
    },
    detractor: {
      start: 0,
      end: 6
    }
  };

  function NetPromoterScore(scores) {
    this.scores = scores;
  }

  NetPromoterScore.prototype.getPercentageOfPromoters = function() {
    return this.getPromoters() / this.getTotal() * 100;
  };

  NetPromoterScore.prototype.getPercentageOfDetractors = function() {
    return this.getDetractors() / this.getTotal() * 100;
  };

  NetPromoterScore.prototype.getPromoters = function() {
    return this.getScore(this.index.promoter.start, this.index.promoter.end);
  };

  NetPromoterScore.prototype.getDetractors = function() {
    return this.getScore(this.index.detractor.start, this.index.detractor.end);
  };

  NetPromoterScore.prototype.getTotal = function() {
    return _.reduce(this.scores, function(memo, score) {
      return memo + score;
    });
  };

  NetPromoterScore.prototype.getScore = function(from, to) {
    var i, score;
    score = 0;
    i = from;
    while (i <= to) {
      score += this.scores[i];
      i++;
    }
    return score;
  };

  NetPromoterScore.prototype.calculate = function() {
    if (this.scores.length !== this.numberOfChoicesRequired) {
      return void 0;
    }
    if (this.getTotal() === 0) {
      return 0;
    }
    return Math.round(this.getPercentageOfPromoters() - this.getPercentageOfDetractors());
  };

  return NetPromoterScore;

})();

namespace('App.Service', function(exports) {
  return exports.NetPromoterScore = NetPromoterScore;
});
