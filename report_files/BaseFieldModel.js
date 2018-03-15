(function(){
    var BaseFieldModel = Backbone.Model.extend({
        isFilled: function () {
            return this.get('isFilled') || this.get('value');
        },
        subscribeToValueChange: function(callback){
            this.on('change:value', function(model, value){
                callback(value);
            });
        },
        subscribeToErrorChange: function(callback){
            this.on('change:error', function(model, errorKey){
                callback(errorKey);
            });
        },
        subscribeOnValueIsFilled: function(callback){
            this.on('change:isFilled', function(model, isFilled){
                callback(isFilled);
            });
        },
        getValueForLogicJumps: function(){
            return this.get('value');
        },
        getValue: function(){
            var value = this.get('value');
            var pipeValue = this.get('pipeValue');

            return {
                toResult: function () {
                    return value;
                },
                toString: function () {
                    return pipeValue;
                }
            }
        }
    });


    namespace('App.models', function(exports){
        exports.BaseFieldModel = BaseFieldModel;
    });
})();
