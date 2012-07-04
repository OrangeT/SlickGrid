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
        "Button": ButtonFormatter
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

      // TODO WORK OUT BEST PATH TO IMAGE - STARTS WITH PATH OF PAGE SCRIPT IS BEING USED IN
      // PATH STARTING WITH / NOT IDEAL AS WILL FAIL WITH VIRTUAL DIRECTORY
      /*return value ? "<img src='../images/tick.png'>" : "";*/
      return value ? "<img src='/SlickGrid/images/tick.png'>" : "";
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
})(jQuery);