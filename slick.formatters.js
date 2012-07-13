/***
 * Contains basic SlickGrid formatters.
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Formatters": {
                "PercentComplete": PercentCompleteFormatter,
                "PercentCompleteBar": PercentCompleteBarFormatter,
                "YesNo": YesNoFormatter,
                "Checkmark": CheckmarkFormatter,
                "DropDown": DropDownFormatter,
                "Button": ButtonFormatter,
                "ActionButtons": ActionButtonsFormatter
            }
        }
    });

    function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
            return "-";
        } else if (value < 50) {
            return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
        } else {
            return "<span style='color:green'>" + value + "%</span>";
        }
    }

    function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
            return "";
        }

        var color;

        if (value < 30) {
            color = "red";
        } else if (value < 70) {
            color = "silver";
        } else {
            color = "green";
        }

        return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
    }

    function YesNoFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "Yes" : "No";
    }

    // Appetere modified BEGIN
    // Modified formatters

    function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "<div class='greenTick'></div>" : "<div class='redCross'></div>";
    }

    // Additional formatters

    function DropDownFormatter(row, cell, value, columnDef, dataContext) {
        return dataContext[columnDef.dropDownOptions.textField];
    }

    function ButtonFormatter(row, cell, value, columnDef, dataContext) {
        // TODO REFACTORING HARD-CODING OUT (USED FOR SPEED WHILE PREPARING FOR DEMO)
        var className;

        if (!value) {
            // Add default for new row
            value = "Save";
        }

        if (value === "Save") {
            className = "saveButton";
        } else {
            className = "addButton";
        }

        return "<button type='button' class='" + className + "'>" + value + "</button>";
    }

    function ActionButtonsFormatter(row, cell, value, columnDef, dataContext) {

        var showActions = value;
        if (!showActions) {
            return null;
        }

        var buttonsHtml = "";

        if (dataContext.add) {
            buttonsHtml += GetButtonHtml("Add", "addButton");
        }

        if (dataContext.save) {
            buttonsHtml += GetButtonHtml("Save", "saveButton");

        }

        if (dataContext.cancel) {
            buttonsHtml += GetButtonHtml("Cancel", "cancelButton");
        }

        return buttonsHtml;
    }

    function GetButtonHtml(value, className) {
        return "<button type='button' class='" + className + "'>" + value + "</button>";
    }

})(jQuery);