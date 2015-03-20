/*!
 * jQuery Birthday Picker: v1.4 - 10/16/2011
 * http://abecoffman.com/stuff/birthdaypicker
 *
 * Copyright (c) 2010 Abe Coffman
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function($) {

  // plugin variables
  var months = {
      "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      "short-sp": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      "long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    todayDate = new Date(),
    todayYear = todayDate.getFullYear(),
    todayMonth = todayDate.getMonth() + 1,
    todayDay = todayDate.getDate();

  $.fn.birthdaypicker = function(options) {

    if (options && typeof options === 'string') {
      options = $.parseJSON(options);
    }
    var settings = {
      "maxage": 120,
      "minage": 0,
      "futuredates": false,
      "maxyear": todayYear,
      "minyear": '',
      "dateformat": "middleEndian",
      "monthformat": "short",
      "placeholder": true,
      "legend": "",
      "defaultdate": false,
      "fieldname": "birthdate",
      "fieldid": "birthdate",
      "hiddendate": true,
      "onchange": null,
      "tabindex": null,
      "required": false,
      'errorname': '',
      'id': '',
      'mindate': '',
      'maxdate': '',
      'lang': '',
      'nodefaultvalue': false
    };

    return this.each(function() {

      if (options) {
        _.each(options, function(value, key) {
          delete options[key];
          options[key.toLowerCase()] = value;
        });
        $.extend(settings, options);
      }

      // Setup the minDate
      if (settings.mindate !== '') {
        var _dates = settings.mindate.split('/');
        if (_dates.length === 3) {
          settings.minyear = _dates[2];
        }
      }

      // Create the html picker skeleton
      var req_field = (settings['required']) ? ' required' : '';
      var $fieldset = $("<fieldset class='birthday-picker'></fieldset>"),
        $year = $("<select class='birth-year not_sending' name='" + settings['id'] + "_birth[year]'" + req_field + "></select>"),
        $month = $("<select class='birth-month not_sending' name='" + settings['id'] + "_birth[month]'" + req_field + "></select>"),
        $day = $("<select class='birth-day not_sending' name='" + settings['id'] + "_birth[day]'" + req_field + "></select>");

      if (settings["legend"]) {
        $("<legend>" + settings["legend"] + "</legend>").appendTo($fieldset);
      }

      if (settings['id'] !== '') {
        settings['fieldid'] = settings['id'];
        settings['fieldname'] = settings['id'];
      }
      // Check language
      if (settings['lang'] !== '') {
        settings['monthformat'] = 'short-' + settings['lang'];
      }
      var tabindex = settings["tabindex"];

      // Deal with the various Date Formats
      if (settings["dateformat"] == "bigEndian") {
        $fieldset.append($year).append($month).append($day);
        if (tabindex != null) {
          $year.attr('tabindex', tabindex);
          $month.attr('tabindex', tabindex++);
          $day.attr('tabindex', tabindex++);
        }
      } else if (settings["dateformat"] == "littleEndian") {
        $fieldset.append($day).append($month).append($year);
        if (tabindex != null) {
          $day.attr('tabindex', tabindex);
          $month.attr('tabindex', tabindex++);
          $year.attr('tabindex', tabindex++);
        }
      } else {
        $fieldset.append($month).append($day).append($year);
        if (tabindex != null) {
          $month.attr('tabindex', tabindex);
          $day.attr('tabindex', tabindex++);
          $year.attr('tabindex', tabindex++);
        }
      }

      // Add the option placeholders if specified
      if (settings["placeholder"]) {
        var _p_month, _p_year, _p_day;
        switch (settings['lang']) {
          case 'sp':
            _p_year = 'A&ntilde;o';
            _p_month = 'Mes';
            _p_day = 'D&iacute;a';
            break;
          default:
            _p_year = 'Year';
            _p_month = 'Month';
            _p_day = 'Day';
        }
        $("<option value=''>" + _p_year + ":</option>").appendTo($year);
        $("<option value=''>" + _p_month + ":</option>").appendTo($month);
        $("<option value=''>" + _p_day + ":</option>").appendTo($day);
      }

      var hiddendate, _tmp, defDate, defYear, defMonth, defDay;
      if (settings["defaultdate"]) {
        _tmp = settings['defaultdate'].split('/');
        if ($.isArray(_tmp) && _tmp.length === 3) {
          defDate = new Date(_tmp[2], _tmp[0] - 1, _tmp[1]);
          defYear = defDate.getFullYear();
          defMonth = defDate.getMonth() + 1;
        } else {
          defDate = new Date(settings["defaultdate"] + "T00:00:00");
          defYear = defDate.getFullYear();
          defMonth = defDate.getMonth();
        }
      } else {
        if (!settings['nodefaultvalue']) {
          defDate = new Date();
          defYear = defDate.getFullYear() - 1;
          defMonth = defDate.getMonth() + 1;
        }
      }
      if (defDate) {
        defDay = defDate.getDate();
      }

      //hiddendate = defYear + "-" + defMonth + "-" + defDay;
      if (defDate) {
        defMonth = (defMonth < 10) ? '0' + defMonth : defMonth;
        defDay = (defDay < 10) ? '0' + defDay : defDay;
        hiddendate = defMonth + "/" + defDay + "/" + defYear;
      }

      // Create the hidden date markup
      if (settings["hiddendate"]) {
        $("<input type='hidden' name='" + settings["fieldname"] + "'/>")
          .attr("id", settings["fieldid"])
          .val(hiddendate)
          .appendTo($fieldset);
      }

      // Build the initial option sets
      var startYear = todayYear - settings["minage"];
      var endYear = (settings['minyear'] !== '') ? settings['minyear'] : todayYear - settings["maxage"];
      if (settings["futuredates"] && settings["maxyear"] != todayYear) {
        if (settings["maxyear"] > 1000) {
          startYear = settings["maxyear"];
        } else {
          startYear = todayYear + settings["maxyear"];
        }
      }
      for (var i = startYear; i >= endYear; i--) {
        $("<option></option>").attr("value", i).text(i).appendTo($year);
      }
      for (var j = 0; j < 12; j++) {
        $("<option></option>").attr("value", j + 1).text(months[settings["monthformat"]][j]).appendTo($month);
      }
      for (var k = 1; k < 32; k++) {
        $("<option></option>").attr("value", k).text(k).appendTo($day);
      }
      $(this).append($fieldset);

      // Update the option sets according to options and user selections
      $fieldset.change(function() {
        // todays date values
        var todayDate = new Date(),
          todayYear = todayDate.getFullYear(),
          todayMonth = todayDate.getMonth() + 1,
          todayDay = todayDate.getDate(),
          // currently selected values
          selectedYear = parseInt($year.val(), 10),
          selectedMonth = parseInt($month.val(), 10),
          selectedDay = parseInt($day.val(), 10),
          // number of days in currently selected year/month
          actMaxDay = (new Date(selectedYear, selectedMonth, 0)).getDate(),
          // max values currently in the markup
          curMaxMonth = parseInt($month.children(":last").val(), 10),
          curMaxDay = parseInt($day.children(":last").val(), 10);

        // if (isNaN(selectedYear) || isNaN(selectedMonth) || isNaN(selectedDay)) {
        //     return;
        // }

        // Dealing with the number of days in a month
        // http://bugs.jquery.com/ticket/3041
        if (curMaxDay > actMaxDay) {
          while (curMaxDay > actMaxDay) {
            $day.children(":last").remove();
            curMaxDay--;
          }
        } else if (curMaxDay < actMaxDay) {
          while (curMaxDay < actMaxDay) {
            curMaxDay++;
            $day.append("<option value=" + curMaxDay + ">" + curMaxDay + "</option>");
          }
        }
        $day = $(':input[name="' + settings['id'] + '_birth[day]"]');
        var _option = $day.find('option[value="' + selectedDay + '"]');
        _option.attr('selected', true);

        // Dealing with future months/days in current year
        // or months/days that fall after the minimum age
        if (!settings["futuredates"] && selectedYear == startYear) {
          if (curMaxMonth > todayMonth) {
            while (curMaxMonth > todayMonth) {
              $month.children(":last").remove();
              curMaxMonth--;
            }
            // reset the day selection
            if (!_option.length) {
              $day.children(":first").attr("selected", "selected");
            }
          }
          if (selectedMonth === todayMonth) {
            while (curMaxDay > todayDay) {
              $day.children(":last").remove();
              curMaxDay -= 1;
            }
          }
        }

        // Adding months back that may have been removed
        // http://bugs.jquery.com/ticket/3041
        if (selectedYear != startYear && curMaxMonth != 12) {
          while (curMaxMonth < 12) {
            $month.append("<option value=" + (curMaxMonth + 1) + ">" + months[settings["monthformat"]][curMaxMonth] + "</option>");
            curMaxMonth++;
          }
        }

        // update the hidden date
        if ((selectedYear * selectedMonth * selectedDay) != 0) {
          //hiddendate = selectedYear + "-" + selectedMonth + "-" + selectedDay;
          selectedMonth = (selectedMonth < 10) ? '0' + selectedMonth : selectedMonth;
          selectedDay = (selectedDay < 10) ? '0' + selectedDay : selectedDay;
          hiddendate = selectedMonth + "/" + selectedDay + "/" + selectedYear;
          $(this).find('#' + settings["fieldid"]).val(hiddendate);
          // $day.val(selectedDay);
          if (settings["onchange"] != null) {
            settings["onchange"](hiddendate);
          }
        }
      });

      // Set the default date if given
      if (settings["defaultdate"]) {
        var date;
        if ($.isArray(_tmp) && _tmp.length === 3) {
          date = new Date(_tmp[2], _tmp[0] - 1, _tmp[1]);
        } else {
          date = new Date(settings["defaultdate"] + "T00:00:00");
        }
        $year.val(date.getFullYear());
        $month.val(date.getMonth() + 1);
        $day.val(date.getDate()).trigger('change');
      } else {
        // Will auto set the year to prevent the problem on reset the date (Current Year)
        // var date = new Date();
        // $year.val(date.getFullYear());
        // $month.val(date.getMonth() + 1);
        // $day.val(date.getDate()).trigger('change');
      }
    });
  };
})(jQuery);