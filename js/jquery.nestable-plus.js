/*!
 * Nestable Plus jQuery Plugin - Copyright (c) 2012 Potatoxf
 * Dual-licensed under the BSD or MIT licenses
 */
(function($, window, document, undefined) {

    if (!$.fn.nestable) {
        throw Error();
    }
    var defaults = {
        idFieldName: 'id',
        nameFieldName: 'name',
        childrenFieldName: 'children',
        allowAddFieldName: 'allowAdd',
        allowDelFieldName: 'allowDel',
        allowModFieldName: 'allowMod',
        allowAddDefaultValue: true,
        allowDelDefaultValue: true,
        allowModDefaultValue: true,
        addFunction: null,
        delFunction: null,
        modFunction: null,
        iconFieldName: 'icon',
        defaultIcon: '',
    };

    function Plugin(id, options) {
        this.id = id;
        this.setting = $.extend({}, defaults, options);
    }

    Plugin.prototype = {
        drawTree: function(data) {
            var sg = this.setting;
            if (data && !(data instanceof Array)) {
                throw Error('The setting field data must be array');
            }

            var str = '';
            var recursionDrawTree = (arr) => {
                str += '<ol class="dd-list">';
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    str += '<li class="dd-item dd-item-part" data-id="' + item[sg.idFieldName] + '">';
                    str += '<div class="dd-handle dd-handle-part"></div>'
                    str += '<div class="dd-content">';
                    str += '<div class="dd-content-item">';
                    str += '<div class="dd-content-item-left">';
                    str += '<span class="dd-content-item-icon">';
                    str += this.getIcon(item);
                    str += '</span>';
                    str += '<span class="dd-content-item-text">';
                    str += '<a href="javascript:void(0);">' + item[sg.nameFieldName] + '</a>';
                    str += '</span>';
                    str += '</div>';
                    str += '<div class="dd-content-item-right">';
                    if (this.getBoolean(item, sg.allowAddFieldName, sg.allowModDefaultValue)) {
                        str += '<span class="add"><i class="fa fa-plus" aria-hidden="true"></i></span>';
                    }
                    if (this.getBoolean(item, sg.allowDelFieldName, sg.allowModDefaultValue)) {
                        str += '<span class="del"><i class="fa fa-trash" aria-hidden="true"></i></span>';
                    }
                    if (this.getBoolean(item, sg.allowModFieldName, sg.allowModDefaultValue)) {
                        str += '<span class="mod"><i class="fa fa-pencil" aria-hidden="true"></i></span>';
                    }
                    str += '</div>';
                    str += '</div>';
                    str += '</div>';
                    let children = item[sg.childrenFieldName];
                    if (children) {
                        if (children instanceof Array) {
                            recursionDrawTree(children);
                        } else if (typeof children === 'object') {
                            recursionDrawTree([children]);
                        } else {}
                    }
                    str += '</li>';
                }
                str += '</ol>';
            };
            str += '<div class="dd" id="' + this.id + '">';
            recursionDrawTree(data);
            str += '</div>';
            return str;
        },
        getIcon: function(data) {
            var sg = this.setting;
            var value = data[sg.iconFieldName];
            if (value && typeof value === 'string') {
                return value;
            }
            if (sg.defaultIcon && typeof sg.defaultIcon === 'string') {
                return sg.defaultIcon;
            }
            return '';
        },
        getBoolean: function(data, fieldName, defaultValue) {
            var value = data[fieldName];
            if (value !== undefined) {
                if (typeof value === 'boolean') {
                    return value === true;
                } else
                if (typeof value === 'number') {
                    return value !== 0;
                } else
                if (typeof value === 'string') {
                    return value.toLocaleLowerCase() === 'true';
                } else if (typeof value === 'function') {
                    return value(data) === true;
                }
            }
            return defaultValue;
        }
    };

    var plugin;

    $.fn.nestablePlus = function(id, dataParams, nestableParams) {
        plugin = new Plugin(id, dataParams);
        $(this).html(plugin.drawTree(dataParams.data));
        $('#' + id).nestable(nestableParams);
        return this;
    };
})(window.jQuery || window.Zepto, window, document);