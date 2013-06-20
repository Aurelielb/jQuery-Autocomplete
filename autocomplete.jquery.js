/**
 * jQuery auto complete plugin
 *
 * @desc 
 * @version 1
 * @author Aurélie Le Bouguennec
 * @licenses Creative Commons BY-SA 2.0
 * @see https://github.com/Aurelielb/jQuery-Autocomplete
 *
 */
;
(function($) {
    var _workingVars = {
        oInput : null,
        oList : null,
        oldText : '',
        oSelected : null,
        keys: {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            UP: 38,
            DOWN: 40
        },
        tempSelectionClass: 'temp',
        typingTimer : null
    };

    var defaults = {
        minLength : null,
        source : null,
        onCreate : null,
        onCreateItem : null,
        onSelect : null,
        values : ["value","url","label","type"],
        pattern : '<a href="%url%"><span class="info">%type%</span>%label%</a>',
        name: 'autoComplete',
        disableClass: 'disabled',
        delay: 400
    };

    var autoComplete = function(obj, e, params){
        _workingVars.oInput = obj;
        if(_workingVars.oInput.hasClass(params.disableClass)) {
            close();
        } else {
            var keyword = _workingVars.oInput.val();
            if(keyword.length >= params.minLength) {
                var oParams = params;
                clearTimeout(_workingVars.typingTimer);
                _workingVars.typingTimer = setTimeout(
                    function(){ getSuggestions(keyword, oParams); },
                    oParams.delay
                );
                keyActions(e, params);
            } else if(null != _workingVars.oList){
                close();
            }
        }
    };

    var getSuggestions = function(keyword, params){
        if(_workingVars.oldText != keyword && false == _workingVars.oInput.hasClass(_workingVars.tempSelectionClass))
        {
            _workingVars.oldText = keyword;
            $.ajax({
                url: params.source + '?term=' + encodeURI(keyword),
                dataType: "json"
            }).done(function( datas ) {
                if(datas != null && datas.length > 0) {
                    var items = (_workingVars.oList == null)? createList(params):_workingVars.oList;
                    items.html("");
                    $.each(datas, function(key,val){
                        var sPattern = params.pattern;
                        for(var i = 0; i < params.values.length; i++) {
                            var regVal = new RegExp('%'+params.values[i]+'%', 'g');
                            sPattern = sPattern.replace(regVal,val[params.values[i]]);
                        }
                        var item = $('<li>' + sPattern + '</li>');
                        item.data('val', val[params.values[0]]);
                        item.data('values', val);
                        var oParams = params;
                        item.click(function(e){
                            _workingVars.oInput.val($(e.currentTarget).data('val'));
                            if ($.isFunction(oParams.onSelect)) {
                                oParams.onSelect(e,item);
                            }
                        });
                        if ($.isFunction(params.onCreateItem)) {
                            params.onCreateItem(e,item);
                        }

                        item.appendTo(items);
                    });
                    items.show();
                }
            });
        }
    };

    var createList = function(params){
        var dList = $('<ul id="' + params.name + '"/>');
        var oBody = $("body");
        oBody.append(dList);
        var obj = _workingVars.oInput;
        dList.css({
            "position": "absolute", "top": obj.offset().top + obj.height(), "left": obj.offset().left,
            "width": obj.outerWidth(), "display": "block"
        });
        _workingVars.oList = dList;

        if ($.isFunction(params.onCreate)) {
            params.onCreate(dList);
        }

        oBody.on('click', function(e){
            outerClose(e);
        });
        return dList;
    };

    var selectNext = function(){
        _workingVars.oList.show();
        if(_workingVars.oSelected == null){
            _workingVars.oSelected = _workingVars.oList.find('li').first();
        } else {
            var oNext = _workingVars.oSelected.removeClass('selected').next();
            if(_workingVars.oSelected.length > 0) {
                _workingVars.oSelected = oNext;
            } else {
                _workingVars.oSelected = _workingVars.oList.find('li').first();
            }
        }
        _workingVars.oSelected.addClass('selected');

        if(undefined != _workingVars.oSelected.data('val')) {
            _workingVars.oInput.addClass(_workingVars.tempSelectionClass).val(_workingVars.oSelected.data('val'));
        }
    };

    var selectPrev = function(){
        _workingVars.oList.show();
        if(_workingVars.oSelected == null){
            _workingVars.oSelected = _workingVars.oList.find('li').last();
        } else {
            var oNext = _workingVars.oSelected.removeClass('selected').prev();
            if(_workingVars.oSelected.length > 0) {
                _workingVars.oSelected = oNext;
            } else {
                _workingVars.oSelected = _workingVars.oList.find('li').last();
            }
        }
        _workingVars.oSelected.addClass('selected');

        if(undefined != _workingVars.oSelected.data('val')) {
            _workingVars.oInput.addClass(_workingVars.tempSelectionClass).val(_workingVars.oSelected.data('val'));
        }
    };

    var unselect = function(){
        _workingVars.oInput.removeClass(_workingVars.tempSelectionClass);
    };

    var outerClose = function(eEvent){
        if(null != _workingVars.oInput && eEvent.target != _workingVars.oInput.get(0)){
            close();
        }
    };

    var emptyField = function(){
        _workingVars.oInput.removeClass(_workingVars.tempSelectionClass).val(_workingVars.oldText);
    };

    var close = function(){
        if(_workingVars.oList != null) {
            _workingVars.oList.hide();
        }
        if(_workingVars.oSelected != null){
            _workingVars.oSelected.removeClass('selected');
            _workingVars.oSelected = null;
        }
    };

    var keyActions = function(e, params){
        var currentKey = e.which;
        switch(currentKey){
            case _workingVars.keys.ESC:
                clearTimeout(_workingVars.typingTimer);
                emptyField();
                close();
                break;
            case _workingVars.keys.DOWN:
                clearTimeout(_workingVars.typingTimer);
                selectNext();
                break;
            case _workingVars.keys.UP:
                clearTimeout(_workingVars.typingTimer);
                selectPrev();
                break;
            case _workingVars.keys.TAB:
            case _workingVars.keys.RETURN:
                clearTimeout(_workingVars.typingTimer);
                if ($.isFunction(params.onSelect) && null != _workingVars.oSelected) {
                    e.preventDefault();
                    var item = _workingVars.oSelected;
                    params.onSelect(e,item);
                }
                close();
                break;
            default:
                unselect();
                break;
        }
    };

    var escOnly = function(e,params){
        if(_workingVars.keys.ESC == e.which && null != _workingVars.oList) {
            clearTimeout(_workingVars.typingTimer);
            emptyField();
            close();
        }
    }

    $.fn.autoComplete = function(params) {
        var oParams = $.extend( defaults, params );

        $(this).on('keyup', function(e){
            autoComplete($(this), e, oParams);
        });

        $(this).on('keypress', function(e){
            escOnly(e, oParams);/* for Opera to close the list */
        });

        return this;
    };
    /*
    Example :
    $('#searchBar').find('.searchBarInput').autoComplete({
            'source': '/remote/search_suggest.php',
            'minLength': 2
        }
    );*/
})(jQuery);
