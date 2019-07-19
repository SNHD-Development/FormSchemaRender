/**
 * Utilities Functions
 * Events
 **/
"use strict";
define([
  "jquery",
  "underscore",
  "backbone",
  "vm",
  "humane",
  "models/form",
  "select2helper",
  "text!data/county.json",
  "bootstrap",
  "jquery.select2",
  "jquery.spinner",
  "jquery.birthdaypicker",
  "jquery.placeholder",
  "jquery.expose",
  "jquery.zclip",
  "jquery.stupidtable",
  "xdr",
  "jquery.timepicker"
], function($, _, Backbone, Vm, humane, FormModel, Select2Helper, countyData) {
  var DEBUG = false;

  var SYSTEM_LANG = {
    "Validation Error": {
      en: "Validation Error",
      sp: "Error de validacion",
      ar: "خطئ في التحقق",
      "zh-cn": "验证错误",
      "zh-tw": "驗證錯誤",
      fa: "خطای اعتبار سنجی",
      ja: "検証エラー",
      ko: "유효성 검사 오류",
      pt: "erro de validação",
      ru: "Ошибка проверки",
      tl: "May error sa validation.",
      th: "ข้อผิดพลาดในการตรวจสอบ",
      vi: "Lỗi xác nhận"
    },
    "Please complete the required fields": {
      en: "Please complete the required fields",
      sp: "Por favor complete los campos requeridos",
      ar: "يرجى إكمال الحقول المطلوبة",
      "zh-cn": "请填写必填字段",
      "zh-tw": "請填寫必填字段",
      fa: "لطفا فیلدهای مورد نیاز را تکمیل کنید",
      ja: "必須フィールドを入力してください",
      ko: "필수 입력란을 작성하십시오.",
      pt: "Por favor, preencha os campos obrigatórios",
      ru: "Заполните необходимые поля",
      tl: "Maaring kumpletuhin and mga kailangan na mga fields",
      th: "โปรดกรอกข้อมูลในฟิลด์ที่จำเป็น",
      vi: "Vui lòng hoàn tất các trường bắt buộc"
    },
    Previous: {
      en: "Previous",
      sp: "Anterior",
      ar: "سابق",
      "zh-cn": "以前",
      "zh-tw": "以前",
      fa: "قبلی",
      ja: "前",
      ko: "너무 이른",
      pt: "Anterior",
      ru: "предыдущий",
      tl: "Nakaraan",
      th: "ก่อน",
      vi: "Trước"
    },
    Next: {
      en: "Next",
      sp: "Siguiente",
      ar: "التالى",
      "zh-cn": "下一個",
      "zh-tw": "下一个",
      fa: "بعد",
      ja: "次",
      ko: "다음 것",
      pt: "Próximo",
      ru: "следующий",
      tl: "Susunod",
      th: "ต่อไป",
      vi: "Kế tiếp"
    },
    Submit: {
      en: "Submit",
      sp: "Enviar",
      ar: "خضع",
      "zh-cn": "提交",
      "zh-tw": "提交",
      fa: "ارسال",
      ja: "提出する",
      ko: "제출",
      pt: "Enviar",
      ru: "Отправить",
      tl: "Ipasa",
      th: "เสนอ",
      vi: "Gửi đi"
    }
  };

  return {
    config: {
      fileUrl: "/form/getFile",
      internalViewUrl: "/Form/SingleView"
    },
    renderError: function($container, err) {
      $container.html(
        '<div class="alert alert-danger"><i class="icon-wrench"></i> <strong>Error: Please refresh this page and try again.</strong> <br> ' +
          err +
          "</div>"
      );
    },
    /**
     * Check Browser Agent
     **/
    checkBrowser: function() {
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        //test for MSIE x.x;
        var ieversion = parseInt(RegExp.$1);
        if (ieversion < 7) {
          ieversion = 7;
        }
        $("body").addClass("ie" + ieversion);
      }
    },
    /**
     * Some Older Browser might not have these methods build in
     **/
    setupOldBrowser: function() {
      // Object Method
      Object.keys =
        Object.keys ||
        function(o) {
          var result = [],
            name;
          for (name in o) {
            if (o.hasOwnProperty(name)) result.push(name);
          }
          return result;
        };
      // Array Method
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
          for (var i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) {
              return i;
            }
          }
          return -1;
        };
      }
      if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(action, that) {
          for (var i = 0, n = this.length; i < n; i++)
            if (i in this) action.call(that, this[i], i, this);
        };
      }
    },
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Waldo Malqui Silva
    // +   bugfixed by: Onno Marsman
    // +   improved by: Robin
    // +      input by: James (http://www.james-bell.co.uk/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: ucwords('kevin van  zonneveld');
    // *     returns 1: 'Kevin Van  Zonneveld'
    // *     example 2: ucwords('HELLO WORLD');
    // *     returns 2: 'HELLO WORLD'
    ucwords: function(str) {
      return (str + "").replace(
        /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,
        function($1) {
          return $1.toUpperCase();
        }
      );
    },
    htmlspecialchars: function(string, quote_style, charset, double_encode) {
      //       discuss at: http://phpjs.org/functions/htmlspecialchars/
      //      original by: Mirek Slugen
      //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      //      bugfixed by: Nathan
      //      bugfixed by: Arno
      //      bugfixed by: Brett Zamir (http://brett-zamir.me)
      //      bugfixed by: Brett Zamir (http://brett-zamir.me)
      //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      //         input by: Ratheous
      //         input by: Mailfaker (http://www.weedem.fr/)
      //         input by: felix
      // reimplemented by: Brett Zamir (http://brett-zamir.me)
      //             note: charset argument not supported
      //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
      //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
      //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
      //        returns 2: 'ab"c&#039;d'
      //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false);
      //        returns 3: 'my &quot;&entity;&quot; is still here'
      var optTemp = 0,
        i = 0,
        noquotes = false;
      if (typeof quote_style === "undefined" || quote_style === null) {
        quote_style = 2;
      }
      string = string.toString();
      if (double_encode !== false) {
        // Put this first to avoid double-encoding
        string = string.replace(/&/g, "&amp;");
      }
      string = string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var OPTS = {
        ENT_NOQUOTES: 0,
        ENT_HTML_QUOTE_SINGLE: 1,
        ENT_HTML_QUOTE_DOUBLE: 2,
        ENT_COMPAT: 2,
        ENT_QUOTES: 3,
        ENT_IGNORE: 4
      };
      if (quote_style === 0) {
        noquotes = true;
      }
      if (typeof quote_style !== "number") {
        // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
          // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
          if (OPTS[quote_style[i]] === 0) {
            noquotes = true;
          } else if (OPTS[quote_style[i]]) {
            optTemp = optTemp | OPTS[quote_style[i]];
          }
        }
        quote_style = optTemp;
      }
      if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, "&#039;");
      }
      if (!noquotes) {
        string = string.replace(/"/g, "&quot;");
      }
      return string;
    },
    htmlspecialchars_decode: function(string, quote_style) {
      //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
      //      original by: Mirek Slugen
      //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      //      bugfixed by: Mateusz "loonquawl" Zalega
      //      bugfixed by: Onno Marsman
      //      bugfixed by: Brett Zamir (http://brett-zamir.me)
      //      bugfixed by: Brett Zamir (http://brett-zamir.me)
      //         input by: ReverseSyntax
      //         input by: Slawomir Kaniecki
      //         input by: Scott Cariss
      //         input by: Francois
      //         input by: Ratheous
      //         input by: Mailfaker (http://www.weedem.fr/)
      //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // reimplemented by: Brett Zamir (http://brett-zamir.me)
      //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
      //        returns 1: '<p>this -> &quot;</p>'
      //        example 2: htmlspecialchars_decode("&amp;quot;");
      //        returns 2: '&quot;'
      var optTemp = 0,
        i = 0,
        noquotes = false;
      if (typeof quote_style === "undefined") {
        quote_style = 2;
      }
      string = string
        .toString()
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      var OPTS = {
        ENT_NOQUOTES: 0,
        ENT_HTML_QUOTE_SINGLE: 1,
        ENT_HTML_QUOTE_DOUBLE: 2,
        ENT_COMPAT: 2,
        ENT_QUOTES: 3,
        ENT_IGNORE: 4
      };
      if (quote_style === 0) {
        noquotes = true;
      }
      if (typeof quote_style !== "number") {
        // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
          // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
          if (OPTS[quote_style[i]] === 0) {
            noquotes = true;
          } else if (OPTS[quote_style[i]]) {
            optTemp = optTemp | OPTS[quote_style[i]];
          }
        }
        quote_style = optTemp;
      }
      if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
        // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
      }
      if (!noquotes) {
        string = string.replace(/&quot;/g, '"');
      }
      // Put this in last place to avoid escape being double-decoded
      string = string.replace(/&amp;/g, "&");
      return string;
    },
    /**
     * Replace String with {{key}} with val
     * @param  string str
     * @param  string key
     * @param  string val
     * @return string
     */
    replaceTemplateStringCurlyBrace: function(str, key, val) {
      return str.replace("{{" + key + "}}", val);
    },
    /**
     * Looking for {{words}} will return an array if founded, otherwise return null
     * @param  string str
     * @return mixed
     */
    parseTemplateString: function(str) {
      var _reg = /\w+=\{\{(\w|\.)+\}\}/gi;
      return str.match(_reg);
    },
    parseTemplateStringGet: function(str) {
      var _reg = /\w+=(\w|\.)+/gi;
      return str.match(_reg);
    },
    /**
     * Will return only word in {{}}
     * @param  string str
     * @return mixed
     */
    parseTemplateStringCurlyBrace: function(str) {
      var _reg = /\{\{([\w|\.]+)\}\}/gi;
      var match = str.match(_reg);
      if (match) {
        if (RegExp.$1) {
          match = RegExp.$1;
        }
        if (match.indexOf("{") > -1) {
          throw "Still Found Curly Brace in the string in parseTemplateStringCurlyBrace!";
        }
      }
      return match;
    },
    /**
     * Looking for {{template}} and replace with the correct values
     * @param  string str
     * @return string
     */
    changeURLGetTemplateString: function(str) {
      var DEBUG = false;
      if (DEBUG) {
        console.log("[*] --- changeURLGetTemplateString ---");
      }
      var newStr = str;
      var _tok = this.parseTemplateString(newStr);
      if (_tok) {
        for (var i in _tok) {
          var _to = _tok[i],
            _tmpArr;
          if (DEBUG) {
            console.log("[*] Token");
            console.log(_to);
          }
          _tmpArr = this.parseTemplateStringCurlyBrace(_to);
          if (!_tmpArr) {
            continue;
          }
          // Found that {{word}}
          if (DEBUG) {
            console.log(_tmpArr);
          }
          if (!_tmpArr) {
            throw 'Unexpected changeURLGetTemplateString, found more than one template variable for "' +
              _to +
              '"';
          }
          switch (_tmpArr) {
            case "userid":
              newStr = newStr.replace(
                "{{" + _tmpArr + "}}",
                this.getUserIdFormHtml()
              );
              break;
            default:
              if (console && console.info) {
                console.info(
                  '[x] Info: Not Implement this "' +
                    _tmpArr +
                    '" Url Template Variable yet!'
                );
              }
          }
        }
      }
      return newStr;
    },
    /**
     * Need to find the required field for label
     **/
    checkRequireFields: function(field, validation) {
      var _name;
      switch (field.type.toLowerCase()) {
        case "multifiles":
          _name = field.name + "[]";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          return false;
        case "address":
          _name = field.name + "_address_street";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_address_city";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_address_state";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_address_zip";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_address_country";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_address_street_number";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_address_unit_number";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          return false;
        case "fullname":
          _name = field.name + "_fullname_middle_name";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_fullname_first_name";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          _name = field.name + "_fullname_last_name";
          if (
            typeof validation[_name] !== "undefined" &&
            validation[_name].required
          ) {
            return true;
          }
          return false;
      }
      return typeof validation[field.name] !== "undefined" &&
        validation[field.name].required
        ? true
        : false;
    },
    /**
     * Prevalidation, on blur event
     **/
    preValidate: function(e, model) {
      var $e = $(e.currentTarget),
        _name = $e.attr("name"),
        _isFile = $e.is(":file"),
        _val;
      if ($e.closest(".subform-button-wrapper").length) {
        // Should not be in .subform-button-wrapper
        return;
      }
      _val = _isFile ? $e.val() : $.trim($e.val());
      if (!_isFile) {
        // Convert to lowercase
        if ($e.hasClass("tolowercase")) {
          _val = _val.toLowerCase();
          _val = _val.replace(/^([0-9]\w+)|\s+([0-9]\w+)/g, function($1) {
            return $1.toUpperCase();
          });
          _val = _val.replace(/^(us\s)|\s+(us)\s/gi, function($1) {
            return $1.toUpperCase();
          });
        }
        // Convert to ucwords
        if ($e.hasClass("toucwords")) {
          _val = this.ucwords(_val);
        }
        // Need to check for touppercase class
        else if ($e.hasClass("touppercase") && _val.toUpperCase) {
          _val = _val.toUpperCase();
        }
        // Need to check for only allowed one space
        if ($e.hasClass("allowedonespace") && _val.replace) {
          _val = _val.replace(/ +(?= )/g, "");
        }
        $e.val(_val).trigger("change");
      }
      model.set(_name, _val);
      if (model.isValid(_name, _val)) {
        $e.removeClass("invalid");
      } else {
        $e.addClass("invalid");
      }
    },
    /**
     * Setup Placeholder in older browser
     **/
    setupPlaceHolder: function(el) {
      $("input, textarea", el).placeholder();
    },
    /**
     * Setup FileInput default value
     **/
    setupFileInput: function(el) {
      $(":file", el).trigger("change");
    },
    /**
     * Setup Email Events
     **/
    setupEmailInput: function(el) {
      $(".emailpicker", el).each(function() {
        var $server = $(".emailpicker_server", this),
          $username = $(".emailpicker_username", this),
          $hidden = $(':input[type="hidden"]', this),
          $notsending = $(".not_sending", this);
        if (
          typeof $server.attr("data-value") !== "undefined" &&
          $server.attr("data-value")
        ) {
          $server.val($server.attr("data-value")).trigger("change");
        }
        if ($hidden.val() !== "") {
          var _token = $hidden.val().split("@");
          if (_token.length === 2) {
            $username.val(_token[0]).trigger("change");
            $server.val(_token[1]).trigger("change");
          }
        }
        $(".emailpicker_server, .emailpicker_username", this)
          .on("change", this, function(e) {
            if ($username.val() !== "" && $server.val() !== "") {
              $hidden
                .val($.trim($username.val() + "@" + $server.val()))
                .trigger("change");
            } else {
              $hidden.val("").trigger("change");
            }
          })
          .on("keydown", function(e) {
            if (e.keyCode === 32) {
              e.preventDefault();
              return false;
            }
          });
      });
    },
    /**
     * Init BDate
     **/
    setupBDateInput: function(el, model, override) {
      override = override || false;
      $(".birthdaypicker", el).each(function() {
        // Set up BirthDate MarkUp here
        var _options = $(this).attr("data-options");
        if (override && _options) {
          if (_options && typeof _options === "string") {
            _options = $.parseJSON(_options);
          }
          if (_options && _options.id && model.get(_options.id)) {
            _options.defaultdate = model.get(_options.id);
          }
        }
        $(this).birthdaypicker(_options);
        var $hidden = $(':input[type="hidden"]', this);
        var _token, $month, $day, $year;
        var _value = $hidden.val();
        if (_value !== "" && model.get($hidden.attr("name")) !== "") {
          _token = _value.split("/");
          if (_token.length === 3) {
            if (_token[0][0] === "0") {
              _token[0] = _token[0].substr(1);
            }
            if (_token[1][0] === "0") {
              _token[1] = _token[1].substr(1);
            }
            $month = $(".birth-month", this).val(_token[0]);
            $day = $(".birth-day", this).val(_token[1]);
            $year = $(".birth-year", this).val(_token[2]);
            model.set($month.attr("name"), _token[0]);
            model.set($day.attr("name"), _token[1]);
            model.set($year.attr("name"), _token[2]);
            // if (model.get($hidden.attr('name')) === '') {
            // model.set($hidden.attr('name'), _value);
            // }
          }
        }
      });
    },
    /**
     * Set the value of hidden field that contain data-value
     **/
    setHiddenField: function(el) {
      $(':hidden[data-value!=""]', el).each(function() {
        var $this = $(this);
        if (
          typeof $this.attr("data-value") !== "undefined" &&
          $this.attr("data-value")
        ) {
          $this.val($this.attr("data-value")).trigger("change");
        }
      });
    },
    /**
     * Get BDate Values
     **/
    getBDateinput: function(el, model) {
      $("fieldset.birthday-picker", el).each(function() {
        var _nan = /NaN/i,
          $bdateInput = $(':input[type="hidden"]', this),
          $day = $(".not_sending.birth-day", this),
          $month = $(".not_sending.birth-month", this),
          $year = $(".not_sending.birth-year", this),
          _day = parseInt($day.val()),
          _month = parseInt($month.val()),
          _year = parseInt($year.val()),
          _error = false,
          _val;
        if (String(_day).match(_nan)) {
          $day.val("");
          _error = true;
        }
        if (String(_month).match(_nan)) {
          $month.val("");
          _error = true;
        }
        if (String(_year).match(_nan)) {
          $year.val("");
          _error = true;
        }
        if (_error) {
          $bdateInput.val("");
        } else {
          if (_month < 10) {
            _month += 0 + _month;
          }
          if (_day < 10) {
            _day += 0 + _day;
          }
          _val = _month + "/" + _day + "/" + _year;
          $bdateInput.val();
        }
        // console.log('- $bdateInput:', $bdateInput);
        model.set($bdateInput.attr("name"), $bdateInput.val());
      });
    },
    /**
     * If this is Select2 need to work on the model.
     */
    getUserId: function(el, model) {
      var $select2 = $(".select2-offscreen", el);
      $select2.each(function() {
        var $this = $(this);
        model.set($this.attr("name"), $this.val()).trigger("change");
      });
    },
    /**
     * Some select, check might have default value need to send change event
     **/
    getDefaultValues: function(el, model) {
      var DEBUG = false;
      if (DEBUG) {
        console.log("[*] Debug - getDefaultValues");
      }
      model = model || null;
      if (DEBUG && model) {
        console.log("    Before: .has-default-val");
        // console.log(model.toJSON());
        // console.log(model.get('Result'));
      }
      $(".has-default-val", el).each(function() {
        var $this = $(this);
        if (DEBUG) {
          console.log($this);
        }
        if ($this.is(":disabled")) {
          return;
        }
        if ($this.val() === "") {
          $this.trigger("change");
        } else if ($this.hasClass("data-clean")) {
          $this.trigger("change").removeClass("data-clean");
        }
      });
      if (DEBUG && model) {
        console.log("    After: .has-default-val");
        // console.log(model.toJSON());
        // console.log(model.get('Result'));
      }
      // Looking for All Hidden Input
      if (DEBUG && model) {
        console.log("    Before: :hidden");
        // console.log(model.toJSON());
        // console.log(model.get('Result'));
      }
      $(":hidden:input", el).each(function() {
        var $this = $(this),
          _val = $this.val(),
          _name = $this.attr("name");
        if (DEBUG) {
          console.log($this);
        }
        if (!_name || _name === "") {
          return;
        }
        if ($this.is(":radio") || $this.is(":checkbox")) {
          return;
        }
        if (DEBUG) {
          console.log("    Before Set: " + _name + " with " + _val);
        }
        if (_name && _val && _val !== "") {
          if (model) {
            if (DEBUG && model) {
              console.log("    Before Set: " + _name + " with " + _val);
            }
            model.set(_name, _val);
          }
        }
      });
      if (DEBUG && model) {
        console.log("    After: :hidden");
        // console.log(model.toJSON());
        // console.log(model.get('Result'));
      }
    },
    /**
     * Setup Time Input
     * Link: https://timepicker.co/
     */
    setupTimeInput: function(el, view, debug) {
      var DEBUG = debug;
      // DEBUG = true;
      if (DEBUG) {
        console.log("[*] utils.setupTimeInput");
        console.log(el);
        console.log(view);
      }
      var _model;
      if (view && view.model) {
        _model = view.model;
      }
      var $allTimepicker = $(".timepicker", el);
      if (DEBUG) {
        if (_model && _model.toJSON) {
          console.log(_model.toJSON());
        }
        console.log("    Found: " + $allTimepicker.length);
        console.log($allTimepicker);
      }
      // DEBUG = true;
      $allTimepicker.each(function() {
        var $this = $(this);
        var dataOptions = $this.attr("data-timepicker-options");
        if (DEBUG) {
          console.log("- dataOptions:", dataOptions);
        }
        if (!dataOptions || _.isEmpty(dataOptions)) {
          dataOptions = {};
        } else if (_.isString(dataOptions)) {
          var parseJsonOptions = $.parseJSON(dataOptions);
          if (
            parseJsonOptions &&
            !_.isEmpty(parseJsonOptions) &&
            _.isObject(parseJsonOptions)
          ) {
            if (DEBUG) {
              console.log("- dataOptions:", dataOptions);
            }
            dataOptions = parseJsonOptions;
          }
        }
        if (_.isObject(dataOptions)) {
          dataOptions.change = function(e) {
            // var DEBUG = true;
            var $this = $(this);
            var value = $this.val();
            if (DEBUG) {
              console.log("- change:", "- $this:", $this, "- value:", value);
            }
            $this.removeClass("invalid");
            // var DEBUG = true;
            if (DEBUG) {
              console.log("- value:", value);
            }
            $this.trigger("change");
            if (DEBUG) {
              console.log("- value:", value);
            }
          };
        }
        $this.timepicker(dataOptions);
      });
    },
    /**
     * Setup Date Input
     **/
    setupDateInput: function(el, view, debug) {
      var DEBUG = debug;
      var fViewArr,
        firstTime = false;
      // Logic for Validation
      if (view) {
        if (view.formView && view.formView._DatePickerLogicArr) {
          fViewArr = view.formView._DatePickerLogicArr;
          firstTime = true;
        } else if (view._DatePickerLogicArr) {
          fViewArr = view._DatePickerLogicArr;
        }
      }
      if (DEBUG) {
        console.log("[*] utils.setupDateInput");
        console.log(el);
        console.log(view);
        console.log(fViewArr);
        // console.log(fViewArr.length);
      }
      var _model;
      if (view && view.model) {
        _model = view.model;
      }
      var $allDatepicker = $(".datepicker", el);
      if (DEBUG) {
        if (_model && _model.toJSON) {
          console.log(_model.toJSON());
        }
        console.log("    Found: " + $allDatepicker.length);
        console.log($allDatepicker);
      }
      $allDatepicker.each(function() {
        var _options = {},
          maxDate,
          nowTemp,
          $this = $(this);
        var _id = $this.attr("name");
        var hasDatepickerOptions = $this.has("data-has-datepicker-options");
        if (_model && _model.get) {
          var _tmpVal = _model.get(_id);
          if (_tmpVal && _tmpVal.$date) {
            _tmpVal = moment(_tmpVal.$date);
            if (!_tmpVal.isValid()) {
              throw new Error(
                'Could not be able to parse this date data "' + _id + '".'
              );
            }
            $this.val(_tmpVal.format("MM/DD/YYYY"));
          }
        }
        if (DEBUG) {
          console.log("   Loop: .datepicker");
          console.log(_id);
          console.log($this);
          if (fViewArr && fViewArr[_id]) {
            console.log(fViewArr[_id]);
          }
          console.log("- hasDatepickerOptions: ", hasDatepickerOptions);
        }
        // This is special case
        if (
          fViewArr &&
          fViewArr[_id] &&
          fViewArr[_id].getvaluefrom &&
          fViewArr[_id].comparison
        ) {
          var logicOpts = fViewArr[_id];
          if (!logicOpts.getvaluefrom) {
            throw 'In order to use setupDateInput with "DatepickerOptions". Required to have "GetValueFrom" key! (' +
              _id +
              ")";
          }
          if (!logicOpts.comparison) {
            throw 'In order to use setupDateInput with "DatepickerOptions". Required to have "Comparison" key! (' +
              _id +
              ")";
          }
          // Start Creating the new Logic
          // XXX: Working need to create custom logic to be able to compare with another field
          // Need to do onchange call back
          _options.onRender = function(date) {
            var targetDate = logicOpts.getvaluefrom;
            if (!fViewArr[targetDate] || !fViewArr[targetDate].element) {
              // Need to return for VisibleOn
              return;
              // throw 'Could not be able to find Datepicker Object with "' + targetDate + '"!';
            }
            var _cmd, _today;
            if ($this.attr("data-maxdate")) {
              _today = new Date();
              _cmd =
                fViewArr[targetDate].element.date.valueOf() +
                " " +
                logicOpts.comparison +
                "  " +
                date.valueOf() +
                " || " +
                date.valueOf() +
                "  > " +
                _today.getTime() +
                " ? 'disabled' : ''";
            } else if ($this.attr("data-mindate")) {
              _today = new Date();
              _cmd =
                fViewArr[targetDate].element.date.valueOf() +
                " " +
                logicOpts.comparison +
                "  " +
                date.valueOf() +
                " || " +
                date.valueOf() +
                "  < " +
                _today.getTime() +
                " ? 'disabled' : ''";
            } else {
              _cmd =
                fViewArr[targetDate].element.date.valueOf() +
                " " +
                logicOpts.comparison +
                " " +
                date.valueOf() +
                " ? 'disabled' : ''";
            }
            return eval(_cmd);
          };
          if (!fViewArr[logicOpts.getvaluefrom]) {
            fViewArr[logicOpts.getvaluefrom] = {};
          }
          fViewArr[logicOpts.getvaluefrom].changeDate = function(ev) {
            var targetDate = _id;
            var tmpComp = logicOpts.comparison.substr(0, 1);
            var newDate = new Date(ev.date);
            var logic =
              ev.date.valueOf() +
              " " +
              tmpComp +
              " " +
              fViewArr[targetDate].element.date.valueOf();
            if (eval(logic)) {
              // newDate.setDate(newDate.getDate() + 1);
              $("#" + targetDate).datepicker("setValue", newDate);
            } else {
              if ($this.val() === "") {
                // User doesn't like to auto set the date!
                // $this.datepicker('setValue', newDate);
                // console.log($this);
                $this.attr("logic-date", newDate.getTime());
              } else {
                // Since this is special case, need to reset the values.
                newDate = new Date($this.val());
                $this.datepicker("setValue", newDate);
                $this.removeClass("invalid").trigger("change");
              }
            }
          };
        } else {
          if ($this.attr("data-maxdate")) {
            switch ($this.attr("data-maxdate").toLowerCase()) {
              case "today":
                nowTemp = new Date();
                maxDate = new Date(
                  nowTemp.getFullYear(),
                  nowTemp.getMonth(),
                  nowTemp.getDate(),
                  0,
                  0,
                  0,
                  0
                );
                _options.onRender = function(date) {
                  return date.valueOf() > maxDate.valueOf() ? "disabled" : "";
                };
                break;
            }
          }
          if ($this.attr("data-mindate")) {
            switch ($this.attr("data-mindate").toLowerCase()) {
              case "today":
                nowTemp = new Date();
                maxDate = new Date(
                  nowTemp.getFullYear(),
                  nowTemp.getMonth(),
                  nowTemp.getDate(),
                  0,
                  0,
                  0,
                  0
                );
                _options.onRender = function(date) {
                  return date.valueOf() < maxDate.valueOf() ? "disabled" : "";
                };
                break;
              default:
                // Add the ability to add number of business days for mindate.
                // Should have ability to count the weekend as well, in the future
                if ($this.attr("data-mindate").match(/^\d+$/) != null) {
                  var numDays = parseInt($this.attr("data-mindate"));
                  var numDaysPlusWeekend = numDays;
                  nowTemp = new Date();
                  var jsWeekend = [0, 6];
                  for (var i = 1; i <= numDaysPlusWeekend; i++) {
                    nowTemp.setDate(nowTemp.getDate() + 1);
                    //console.log(nowTemp.getDate() + ': ' + nowTemp.getDay());
                    if (_.indexOf(jsWeekend, nowTemp.getDay()) >= 0) {
                      numDaysPlusWeekend++;
                    }
                  }
                  // If this is a Friday need to add more days
                  if (nowTemp.getDay() === 5) {
                    nowTemp.setDate(nowTemp.getDate() + 2);
                  }

                  //nowTemp.setDate(nowTemp.getDate() + numDaysPlusWeekend);
                  //console.log(nowTemp.getDay());
                  maxDate = new Date(
                    nowTemp.getFullYear(),
                    nowTemp.getMonth(),
                    nowTemp.getDate(),
                    0,
                    0,
                    0,
                    0
                  );
                  _options.onRender = function(date) {
                    return date.valueOf() < nowTemp.valueOf() ? "disabled" : "";
                  };
                } else {
                  nowTemp = moment($this.attr("data-mindate"), "MM/DD/YYYY");
                  if (nowTemp && nowTemp.isValid()) {
                    maxDate = new Date(
                      nowTemp.year(),
                      nowTemp.month(),
                      nowTemp.date(),
                      0,
                      0,
                      0,
                      0
                    );
                    _options.onRender = function(date) {
                      return date.valueOf() < maxDate.valueOf()
                        ? "disabled"
                        : "";
                    };
                  }
                }
                break;
            }
          }
        }

        var optionsRender = $this.attr("data-options-render");

        // console.log("- optionsRender:", optionsRender);
        // console.log("- _options:", _options);
        switch (optionsRender) {
          case "datetime":
            break;
        }

        var $dpicker = $this
          .datepicker(_options)
          .on("changeDate", function(e) {
            var _dateInput = $(e.currentTarget);
            // This could have special Event
            var dateId = _dateInput.attr("id");
            if (fViewArr && fViewArr[dateId] && fViewArr[dateId].changeDate) {
              if (typeof fViewArr[dateId].changeDate === "function") {
                fViewArr[dateId].changeDate(e);
              }
            }
            _dateInput.removeClass("invalid").trigger("change");
            _dateInput.datepicker("hide");
          })
          .on("click", function(e) {
            var logicDate = $this.attr("logic-date"),
              currentVal = $this.val(),
              $currentTarget = $(e.currentTarget);
            if (
              logicDate &&
              logicDate !== "" &&
              !currentVal &&
              currentVal === ""
            ) {
              $currentTarget.datepicker("setValue", logicDate);
            }
            $("div.datepicker.dropdown-menu").css("display", "none");
            $currentTarget.datepicker("show");
          });
        $dpicker = $dpicker.data("datepicker");
        if (fViewArr) {
          if (!fViewArr[_id]) {
            fViewArr[_id] = {
              element: null
            };
          }
          fViewArr[_id].element = $dpicker;
        }
      });
      if (DEBUG) {
        console.log("    SetUp .datepicker");
        console.log(fViewArr);
      }
    },
    /**
     * Setup Spinner
     **/
    setupSpinner: function(el, mode) {
      mode = mode || null;
      $(".spinner", el).each(function() {
        // Be Default, will render as 1
        // Unless has data-default-value set up
        var $spinnerInput = $(":input.spinner-input", this),
          _dataDefaultValue =
            $spinnerInput.attr("data-default-value") !== undefined
              ? $spinnerInput.attr("data-default-value")
              : 1,
          _number =
            $spinnerInput.val() !== ""
              ? $spinnerInput.val()
              : _dataDefaultValue;
        if (mode && mode === "create" && _number === "0") {
          var _dataDefaultValueNum = parseFloat(_dataDefaultValue);
          if (isNaN(_dataDefaultValueNum)) {
            _dataDefaultValueNum = 1;
          }
          if (
            _dataDefaultValue &&
            _dataDefaultValue !== "" &&
            !isNaN(_dataDefaultValueNum)
          ) {
            _number = _dataDefaultValueNum.toString();
          } else {
            _number = "1";
          }
        }
        var _opt = {
          value: parseInt(_number, 10),
          min: _dataDefaultValue
        };
        $(this).spinner(_opt);
      });
    },
    /**
     * Prevent Space in Keypress Event
     **/
    preventSpace: function(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return false;
      }
    },
    /**
     * Allow Only valid Number in Keypress Event
     **/
    allowNumber: function(e) {
      var val = $(e.currentTarget).val();
      if (
        e.keyCode === 8 ||
        e.keyCode === 37 ||
        e.keyCode === 39 ||
        e.keyCode === 46 ||
        e.keyCode === 9
      ) {
        return true;
      } else if (
        e.shiftKey ||
        ((!(e.keyCode === 46 || e.keyCode === 190 || e.keyCode === 110) ||
          val.indexOf(".") !== -1) &&
          (e.keyCode < 48 ||
            (e.keyCode > 57 && e.keyCode < 96) ||
            e.keyCode > 105))
      ) {
        e.preventDefault();
      }
    },
    /**
     * Allow only valid +/- Floating Point
     */
    allowRational: function(e) {
      var val = $(e.currentTarget).val();
      if (
        e.keyCode === 8 ||
        e.keyCode === 37 ||
        e.keyCode === 39 ||
        e.keyCode === 46 ||
        e.keyCode === 9
      ) {
        return true;
      } else if (
        (e.keyCode === 45 || e.keyCode === 109 || e.keyCode === 189) &&
        val === ""
      ) {
        // Ignore Filter
      } else if (
        e.shiftKey ||
        ((!(e.keyCode === 46 || e.keyCode === 190 || e.keyCode === 110) ||
          val.indexOf(".") !== -1) &&
          (e.keyCode < 48 ||
            (e.keyCode > 57 && e.keyCode < 96) ||
            e.keyCode > 105))
      ) {
        e.preventDefault();
      }
    },
    /**
     * Allow Only natural Number in Keypress Event
     **/
    allowNaturalNumber: function(e) {
      if (
        e.keyCode === 8 ||
        e.keyCode === 37 ||
        e.keyCode === 39 ||
        e.keyCode === 46 ||
        e.keyCode === 9
      ) {
        return true;
      } else if (
        e.shiftKey ||
        (!(e.keyCode === 46 || e.keyCode === 110) &&
          (e.keyCode < 48 ||
            (e.keyCode > 57 && e.keyCode < 96) ||
            e.keyCode > 105)) ||
        (e.keyCode === 48 && $(e.currentTarget).val().length === 0)
      ) {
        e.preventDefault();
      }
    },
    /**
     * Allow Only whole Number in Keypress Event
     **/
    allowWholeNumber: function(e) {
      var _val = $(e.currentTarget).val();
      if (e.keyCode === 48) {
        if (!_val || _val.length === 0) {
          return true;
        }
        if (_val.length > 0 && _val === "0") {
          e.preventDefault();
          return;
        }
      }
      if (
        e.keyCode === 8 ||
        e.keyCode === 37 ||
        e.keyCode === 39 ||
        e.keyCode === 46 ||
        e.keyCode === 9
      ) {
        return true;
      } else if (
        e.shiftKey ||
        (!(e.keyCode === 46 || e.keyCode === 110) &&
          (e.keyCode < 48 ||
            (e.keyCode > 57 && e.keyCode < 96) ||
            e.keyCode > 105)) ||
        (e.keyCode === 48 && $(e.currentTarget).val().length === 0)
      ) {
        e.preventDefault();
      }
    },
    /**
     * Allow Only Integer Number in Keypress Event
     **/
    allowZipCode: function(e) {
      if (
        e.keyCode === 8 ||
        e.keyCode === 37 ||
        e.keyCode === 39 ||
        e.keyCode === 46 ||
        e.keyCode === 9
      ) {
        return true;
      } else if (
        e.shiftKey ||
        e.keyCode < 48 ||
        (e.keyCode > 57 && e.keyCode < 96) ||
        e.keyCode > 105
      ) {
        e.preventDefault();
      }
    },
    /**
     * Allow Phone Number with Area Code
     * (xxx) xxx-xxxx
     */
    allowPhoneNumber: function(e) {
      var DEBUG = false;
      var $currentTarget = $(e.currentTarget),
        _val = $currentTarget.val(),
        _tmp = "";
      if (DEBUG) {
        console.log("*** allowPhoneNumber [" + e.type + "] ***");
        console.log(e.keyCode);
      }
      if (
        (e.type === "keydown" && (e.keyCode >= 48 && e.keyCode <= 57)) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        if (DEBUG) {
          console.log("[x] keydown");
          console.log(_val.length);
          console.log(_val);
        }
        switch (_val.length) {
          case 0:
            if (e.keyCode === 48 || e.keyCode === 105) {
              e.preventDefault();
              return;
            }
            $currentTarget.val("(" + _val);
            break;
          case 4:
            $currentTarget.val(_val + ") ");
            break;
          case 9:
            $currentTarget.val(_val + "-");
        }
        if (e.update) {
          $currentTarget.val(
            $currentTarget.val() + String.fromCharCode(e.keyCode)
          );
        }
      } else {
        switch (e.type) {
          case "focusout":
            var nums = _val.replace(/[^0-9]+/gi, "");
            var strLen = nums.length;
            if (DEBUG) {
              console.log(nums);
            }
            if (strLen < 1) {
              nums = "";
            } else if (strLen < 3) {
              nums = nums.replace(/(\d{1,2})/gi, "($1");
            } else if (strLen === 3) {
              nums = nums.replace(/(\d{3})/gi, "($1)");
            } else if (strLen <= 6) {
              nums = nums.replace(/(\d{3})(\d{1,3})?/gi, "($1) $2");
            } else {
              nums = nums.replace(/(\d{3})(\d{3})?(\d{1,4})?/gi, "($1) $2-$3");
            }
            if (DEBUG) {
              console.log(strLen);
              console.log(_val.replace(/[^0-9]+/gi, ""));
              console.log(nums);
            }
            $currentTarget.val(nums);
            break;
        }
      }
    },
    /**
     * Allow Social Security Number
     * xxx-xx-xxxx
     */
    allowSocialSecurity: function(e) {
      var DEBUG = false;
      var $currentTarget = $(e.currentTarget),
        _val = $currentTarget.val(),
        _tmp = "";
      if (DEBUG) {
        console.log("*** allowSocialSecurity [" + e.type + "] ***");
        console.log(e.keyCode);
      }
      if (
        (e.type === "keydown" && (e.keyCode >= 48 && e.keyCode <= 57)) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        if (DEBUG) {
          console.log("[x] keydown");
          console.log(_val.length);
          console.log(_val);
        }
        switch (_val.length) {
          case 3:
          case 6:
            $currentTarget.val(_val + "-");
            break;
        }
        if (e.update) {
          $currentTarget.val(
            $currentTarget.val() + String.fromCharCode(e.keyCode)
          );
        }
      } else {
        switch (e.type) {
          case "focusout":
            var nums = _val.replace(/[^0-9]+/gi, "");
            var strLen = nums.length;
            if (DEBUG) {
              console.log(nums.length);
              console.log(nums);
            }
            // Perform custom regex
            if (strLen <= 3) {
              nums = nums.replace(/(\d{1,3})?/gi, "$1");
            } else if (strLen <= 5) {
              nums = nums.replace(/(\d{3})(\d{1,2})?/gi, "$1-$2");
            } else {
              nums = nums.replace(/(\d{3})(\d{2})?(\d{1,4})?/gi, "$1-$2-$3");
            }
            if (DEBUG) {
              console.log(nums.length);
              console.log(nums);
            }
            $currentTarget.val(nums);
            break;
        }
      }
    },
    /**
     * Allow Only Integer Number in Keypress Event but will render as XXXXX-XXXX
     **/
    allowZipCodePlusFour: function(e) {
      var $currentTarget = $(e.target),
        _val = $currentTarget.val(),
        _tmp = "";
      if (
        (e.type === "keydown" && (e.keyCode >= 48 && e.keyCode <= 57)) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        switch (_val.length) {
          case 0:
            if (e.keyCode === 48 || e.keyCode === 105) {
              e.preventDefault();
              return;
            }
            break;
          case 5:
            $currentTarget.val(_val + "-");
        }
        if (e.update) {
          $currentTarget.val(
            $currentTarget.val() + String.fromCharCode(e.keyCode)
          );
        }
      } else {
        for (var i = 0, j = _val.length; i < j; i++) {
          if (!isNaN(parseInt(_val[i]))) {
            _tmp += _val[i];
          }
        }
        _val = "";
        for (var i = 0, j = _tmp.length; i < j; i++) {
          switch (i) {
            case 5:
              if (j > 6) {
                _val += "-";
              }
              break;
          }
          _val += _tmp[i];
        }
        $currentTarget.val(_val);
      }
    },
    /**
     * Convert Unix TimeStamp to Human Readable
     **/
    getHumanTime: function(unixTime) {
      var time =
          typeof unixTime !== "object"
            ? new Date(unixTime * 1000)
            : new Date(unixTime.$date),
        months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        year = time.getFullYear(),
        month = months[time.getMonth()],
        date = time.getDate(),
        hour = time.getHours(),
        min = time.getMinutes(),
        sec = time.getSeconds(),
        format = "AM";
      if (hour >= 12) {
        hour = hour - 12;
        if (hour === 0) {
          hour = 12;
        }
        format = "PM";
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return (
        month +
        " " +
        date +
        ", " +
        year +
        " " +
        hour +
        ":" +
        min +
        ":" +
        sec +
        " " +
        format
      );
    },
    /**
     * Return Special Fields Name Type
     **/
    getSpecialFieldsName: function(name, type) {
      var _fields = [];
      switch (type.toLowerCase()) {
        case "fullname":
          _fields.push(name + "_fullname_first_name");
          _fields.push(name + "_fullname_middle_name");
          _fields.push(name + "_fullname_last_name");
          break;
        case "address":
          _fields.push(name + "_address_street");
          _fields.push(name + "_address_city");
          _fields.push(name + "_address_state");
          _fields.push(name + "_address_zip");
          _fields.push(name + "_address_country");
          _fields.push(name + "_address_street_number");
          _fields.push(name + "_address_unit_number");
          break;
        default:
          _fields.push(name);
      }
      return _fields;
    },
    /**
     * Set Values from Fields Name
     **/
    setFieldsValues: function(el, model, names, values) {
      values = values || false;
      _.each(names, function(element, index) {
        var _val = values && values[index] ? values[index] : "",
          $input = $(':input[name="' + element + '"]', el)
            .val(_val)
            .trigger("change");
        model.set(element, _val);
        if (model.isValid(element)) {
          $input.removeClass("invalid");
        }
      });
    },
    /**
     * Setup Class Attr for Field
     **/
    setupClassAttr: function(classAttr, appendClass) {
      classAttr = classAttr || false;
      appendClass = appendClass || "";
      appendClass.toLowerCase();
      if (classAttr) {
        classAttr = classAttr.toLowerCase();
        var reg = new RegExp(appendClass, "i");
        if (reg.test(classAttr)) {
          return classAttr;
        } else {
          return classAttr + " " + appendClass;
        }
      }
      return appendClass;
    },
    genericSetup: function(view) {
      var $dom = view.$el;
      this.setupCounty($dom);
    },
    /**
     * Final Setup before Render the form
     **/
    finalSetup: function(view) {
      var that = this,
        $select = $("select.has-default-val", view.el),
        $form = $(view.el);
      if (
        view.options.mode === "update" &&
        view._visibleOn.length > 0 &&
        view.options.formData
      ) {
        setValueDependOn(view.el, view._visibleOn, view.options.formData);
      }
      if (view.options.mode === "create" && $select.length > 0) {
        $select.each(function() {
          var $option = $(
            'option[selected=""],option[selected="selected"]',
            this
          );
          if ($option.length > 0 && $option.val() !== "") {
            $(this).val($option.val());
          } else {
            if ($(this).hasClass("us-state")) {
              $(this).val("NV");
            } else if ($(this).hasClass("us-country")) {
              $(this).val("US");
            }
          }
        });
      }
      if (view._multiFiles.length > 0) {
        _.each(view._multiFiles, function(value) {
          require(["views/file-upload/multifiles"], function(MultifilesView) {
            var multifilesView = Vm.create(
              that,
              "MultiFilesView" + value.name,
              MultifilesView,
              {
                field: value,
                name: view.el,
                model: view.model,
                validation: view.options.formSchema.validation
              }
            );
            multifilesView.render();
          });
        });
      }
      // If there is any lightbox markup, will need to check if this a valid photo or not
      $(
        "a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]"
      ).each(function() {
        var $this = $(this);
        $("<img>", {
          src: $this.attr("href"),
          error: function() {
            $this.hide();
            $this.next(".lightbox-fallback").show();
          }
        });
      });
      // Setup Ajax Call for fields
      if (view._ajaxDataCall.length > 0) {
        this.setupAjaxCall(view, $form);
      }
      // Setup UserId Field
      if (view._hasUserId) {
        this.setupUserIdAjaxCall($form);
      }
      // Setup BooleanInput Type
      if (view._hasBooleanInput) {
        this.setupBooleanInput($form, view);
      }
      // Setup Radio Button Group
      if (view._hasRadioBtnGroup) {
        this.setupRadioBtnGroup($form);
        this.setupRadioBtnGroupValue($form);
      }
      // Setup SelectAll and ClearAll for CheckBox
      if (view._hasSelectAllCheckBox || view._hasClearAllCheckBox) {
        this.setupCheckBoxSelectAndClear($form);
      }
      // Setup Other Textbox for Checkbox
      if (view._hasOtherTextBox) {
        this.setupCheckBoxOtherTextBox($form);
      }
      // If there are radio buttons.
      if (view._radioFieldName.length) {
        this.setupRadioButtonsValue(view);
      }
      // Setup ButtonCondition
      // By Default, will require all data to be valid
      // Default Success Call Back must return JSON with key = "value"
      if (view._buttonDecision.length > 0) {
        _.each(view._buttonDecision, function(element) {
          var $btn_decision = $("a#" + element.name, view.el),
            _html_tmp =
              '<input type="hidden" name="' +
              element.name +
              '" id="' +
              element.name +
              '_btn_condition"/>';
          if (!element.url || !element.data) {
            throw "ButtonDecision require Url and Data options!";
          } else if (view.options.mode === "update") {
            $btn_decision.after(_html_tmp);
            if (view.options.formData.fields[element.name]) {
              $btn_decision
                .next('input[type="hidden"]')
                .val(view.options.formData.fields[element.name])
                .trigger("change");
            }
          }
          // If this is internal, will not render the button. Will render only hidden input.
          if (view.options.internal === true) {
            var $btnContainer = $btn_decision.parents(".control-group");
            if ($btnContainer.length > 0) {
              $btnContainer.hide();
            } else {
              $btn_decision.hide();
            }
            return true;
          }
          $btn_decision.click(function(e) {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget);
            if ($currentTarget.attr("disabled")) {
              return false;
            }
            var _url = element.url + "?",
              _data = {},
              _error = false,
              _opt,
              $invalidObj = [],
              _canEmpty = element.options.datacanempty
                ? element.options.datacanempty
                : [],
              _success =
                element.options.events ||
                function(e) {
                  var $hiddenInput = $(
                    "#" + element.name + "_btn_condition",
                    $form
                  );
                  // If there is an error
                  if (e.status && e.status === "error") {
                    $currentTarget.attr("disabled", false).popover("destroy");
                    $currentTarget.next(".popover").remove();
                    _opt = {
                      html: true,
                      placement: "top",
                      trigger: "manual",
                      title: '<i class="icon-edit"></i> Error',
                      content: e.error_message
                    };
                    $currentTarget
                      .attr("disabled", true)
                      .popover(_opt)
                      .popover("show");
                    window.setTimeout(function() {
                      $currentTarget.attr("disabled", false).popover("destroy");
                      $currentTarget.next(".popover").remove();
                    }, 3000);
                    return false;
                  }
                  if (!e.value) {
                    throw 'Result JSON must have "value" key';
                  }
                  if ($hiddenInput.length === 0) {
                    $currentTarget.after(_html_tmp);
                  }
                  // If the return JSON has "data" key, it will loop through data to build the select table for user.
                  if (element.options.renderresult && e.data) {
                    view.model.set(element.name, "");
                    // Render Data for User to Select.
                    require(["views/subform-layouts/buttondecision"], function(
                      ButtonDecisionView
                    ) {
                      var buttonDecisionView = Vm.create(
                        that,
                        element.name + "View",
                        ButtonDecisionView,
                        {
                          model: view.model,
                          el: $currentTarget,
                          name: element.name
                        }
                      );
                      buttonDecisionView.render(e.data);
                    });
                  } else {
                    // If this field has options renderresult we might need to remove that markup as well.
                    $currentTarget
                      .parent()
                      .find("div.btn-decision-data-wrapper")
                      .remove();
                    view.model.set(element.name, e.value);
                  }
                  window.setTimeout(function() {
                    $currentTarget.attr("disabled", false).popover("destroy");
                    $currentTarget.next(".popover").remove();
                  }, 1000);
                };
            _.each(element.data, function(el, key) {
              if (typeof el !== "string") {
                if (typeof _error === "boolean") {
                  _error = [];
                }
                var _elementError;
                _.each(el, function(elArray, keyArray) {
                  _elementError = that.setUpButtonDecision(
                    elArray,
                    keyArray,
                    _data,
                    view.el,
                    _canEmpty,
                    $invalidObj
                  );
                });
                _error.push(_elementError);
              } else {
                _error = that.setUpButtonDecision(
                  el,
                  key,
                  _data,
                  view.el,
                  _canEmpty
                );
              }
            });
            if (typeof _error !== "boolean" && _error.indexOf(false) > -1) {
              _error = false;
            }
            if (_error) {
              _opt = {
                html: true,
                placement: "top",
                trigger: "manual",
                title: '<i class="icon-edit"></i> Error',
                content: "Please complete the required fields"
              };
              $currentTarget
                .attr("disabled", true)
                .popover(_opt)
                .popover("show");
              window.setTimeout(function() {
                $currentTarget.attr("disabled", false).popover("destroy");
                $currentTarget.next(".popover").remove();
              }, 2000);
              return false;
            }
            _.each($invalidObj, function($el) {
              $el.removeClass("invalid");
            });
            // Get the query object, will send to the url
            _url += $.param(_data);
            // Languages
            var _t_1, _t_2;
            switch (view.options.lang) {
              case "sp":
                _t_1 = "Por Favor Espere";
                _t_2 = "Bajando Informaci&oacute;n";
                break;
              default:
                _t_1 = "Please wait";
                _t_2 = "Loading data";
            }
            _opt = {
              html: true,
              placement: "top",
              trigger: "manual",
              title: '<i class="icon-time"></i> ' + _t_1 + ".",
              content:
                '<i class="icon-spinner icon-spin icon-large"></i> ' +
                _t_2 +
                " ..."
            };
            $currentTarget
              .attr("disabled", true)
              .popover(_opt)
              .popover("show");
            $.getJSON(_url, _success);
          });
        });
      }
    },
    isRenderVisibleOn: function(view, value, typeLowerCase) {
      if (value.options.visibleon && typeLowerCase !== "html") {
        var _visibleOnName = value.options.visibleon.name;
        if (_visibleOnName.match(/\[\]$/gi)) {
          _visibleOnName = _visibleOnName.substr(0, _visibleOnName.length - 2);
        }
        if (_.isArray(view.options.formData.fields[_visibleOnName])) {
          var _found = false;
          _.each(view.options.formData.fields[_visibleOnName], function(
            element
          ) {
            if (_found) {
              return;
            }
            _found = value.options.visibleon.values.indexOf(element) !== -1;
          });
          if (!_found) {
            return false;
          }
        } else {
          var _lookupValue;
          if (view._lookupValues && view._lookupValues[_visibleOnName]) {
            _lookupValue = view._lookupValues[_visibleOnName].value;
          } else {
            _lookupValue = view.options.formData.fields[_visibleOnName];
          }
          if (value.options.visibleon.values.indexOf(_lookupValue) === -1) {
            return false;
          }
        }
      }
      return true;
    },
    /**
     * Final Setup for Read Mode
     **/
    finalReadSetup: function(view) {
      var $form = $(view.el);
      if (!$form.length) {
        throw "[x] finalReadSetup: could not be able to find form.";
      }
      var formId = view.options.formData._id.$oid;
      if (typeof formId !== "string" || formId === "") {
        throw "FormID is invalid. Requires a valid string.";
      }
      var timeOut = 3000;
      var bigbox = humane.create({
        baseCls: "humane-bigbox",
        timeout: timeOut,
        clickToClose: false,
        waitForMove: false
      });
      bigbox.error = bigbox.spawn({
        addnCls: "humane-bigbox-error"
      });
      // Attched Event for Update on Read Mode
      // Set Up for Update On Read Mode
      $form.on("click", ".update-on-read-mode", function(e) {
        var $currentTarget = $(e.currentTarget);
        var DEBUG = false;
        if (DEBUG) {
          console.log("[*] finalReadSetup:click - update-on-read-mode");
          console.log(arguments);
          console.log($currentTarget);
        }
        if ($currentTarget.hasClass("ajax")) {
          // Could be Radio
          if (
            $currentTarget.hasClass("is-radio") ||
            $currentTarget.hasClass("is-clickable")
          ) {
            return;
          }
          e.preventDefault();
          return false;
        }
        e.preventDefault();
        $currentTarget.addClass("ajax");
        // Load Form Model.
        var formModel = new FormModel({
          id: formId
        });
        formModel.fetch({
          success: function() {
            var newValue = formModel.get("Fields");
            if (DEBUG) {
              console.log('[*] Success getting "' + formId + '"');
              console.log(arguments);
              console.log(formModel.toJSON());
              console.log(newValue);
            }
            var inputName = $currentTarget.attr("data-field-name");
            if (typeof inputName !== "string" || inputName === "") {
              throw "Could not be able to find Field Name.";
            }
            var $currentInput = $currentTarget.find(
              ':input[name="' + inputName + '"]'
            );
            if (!$currentInput.length) {
              throw 'Error: Could not be able to find input name "' +
                inputName +
                '".';
            }
            if (typeof newValue[inputName] === "undefined") {
              throw 'Response: Field "' + inputName + '" is invalid.';
            }
            // Hide this and change to input instead
            var $span = $currentTarget.find("#" + inputName);
            if (!$span.length) {
              throw 'Error: Could not be able to find span for "' +
                inputName +
                '".';
            }
            // Update View
            $span.html(newValue[inputName]).fadeOut("slow", function() {
              // Now show the input
              if ($currentInput.hasClass("force-hide")) {
                $currentInput.val(newValue[inputName]);
                // Normal Input, will use Enter to save, ESC to return to read
                $currentInput.hide(function() {
                  $currentInput
                    .removeClass("force-hide")
                    .fadeIn("slow", function() {
                      // Now Make the cursor point here
                      $currentInput.focus();
                      $currentInput.val("");
                      $currentInput.val(newValue[inputName]);
                    });
                });
              } else if ($currentInput.hasClass("has-field-container")) {
                var $forceHideWrapper = $currentInput.closest(".force-hide");
                if (!$forceHideWrapper.length) {
                  throw "Could not be able to find " +
                    $currentInput.attr("name") +
                    " wrapper.";
                }
                // Show the radio markup
                $forceHideWrapper
                  .removeClass("force-hide")
                  .fadeIn("slow", function() {
                    var tmpVal = newValue[inputName];
                    if (!$currentInput.hasClass("is-date-picker")) {
                      $currentInput.focus();
                    }
                    $currentInput.val("");
                    if (
                      $currentInput.hasClass("is-date-picker") &&
                      tmpVal &&
                      tmpVal.$date
                    ) {
                      var _date = new Date(tmpVal.$date);
                      $currentInput.val(
                        _date.getMonth() +
                          1 +
                          "/" +
                          _date.getDate() +
                          "/" +
                          _date.getFullYear()
                      );
                    } else {
                      $currentInput.val(tmpVal);
                    }
                    $currentTarget.addClass("is-clickable");
                    // If this is a datepicker
                    if ($currentInput.hasClass("is-date-picker")) {
                      $currentInput.datepicker();
                    }
                  });
              } else if ($currentInput.is(":radio")) {
                var $radioWrapper = $currentInput.closest(".force-hide");
                if (!$radioWrapper.length) {
                  throw "Could not be able to find " +
                    $currentInput.attr("name") +
                    " wrapper.";
                }
                // Show the radio markup
                $radioWrapper
                  .removeClass("force-hide")
                  .fadeIn("slow", function() {
                    $currentInput.attr("checked", false);
                    $currentInput
                      .filter('[value="' + newValue[inputName] + '"]')
                      .attr("checked", true);
                    $currentTarget.addClass("is-radio");
                  });
              } else {
                if (console && console.error) {
                  console.error($currentInput);
                }
                throw "Not Implement Advance Update On Read Mode Type.";
              }
            });
          },
          error: function() {
            if (console && console.error) {
              console.error('[x] Error getting "' + formId + '"');
              console.error(arguments);
            }
            bigbox.error("Error: Could not get data.");
            setTimeout(function() {
              $currentTarget.removeClass("ajax");
            }, timeOut);
          }
        });
        return false;
      });
      // Attach Click Event to Copy to the Clipboard
      if (view._buttonClipboards.length > 0) {
        _.each(view._buttonClipboards, function(element) {
          $("button#" + element.name).zclip({
            path:
              "//public.southernnevadahealthdistrict.org/assets/js/apps/formrender/libs/copy/ZeroClipboard.swf",
            copy: function() {
              var _txt = "";
              _.each(element.values, function(elementValue) {
                _txt += $("#" + elementValue).text() + "\r\n";
              });
              return _txt;
            }
          });
        });
      }
      // If there is any lightbox markup, will need to check if this a valid photo or not
      $(
        "a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]"
      ).each(function() {
        var $this = $(this);
        $("<img>", {
          src: $this.attr("href"),
          error: function() {
            $this.hide();
            $this.next(".lightbox-fallback").show();
          }
        });
      });
      // Setup Confirm Button
      var $btnConfirmed = $('[data-popover-confirm^="{"]', view.el);
      if ($btnConfirmed.length) {
        $form.on("click", ".btn-confirmed", function(e) {
          e.preventDefault();
          var $this = $(this);
          var _yes = $this.attr("data-href") || false;
          if (!_yes) {
            $btnConfirmed.each(function(_index) {
              $(this).popover("hide");
            });
            return;
          }
          $btnConfirmed.each(function(_index) {
            $(this).popover("destroy");
          });
          window.location = _yes;
        });
        $btnConfirmed.each(function(index) {
          var $this = $(this),
            _opts = $.parseJSON($this.attr("data-popover-confirm"));
          $this.popover(_opts).click(function(e) {
            e.preventDefault();
            $btnConfirmed.each(function(_index) {
              if (_index === index) {
                return;
              }
              $(this).popover("hide");
            });
          });
        });
      }
      // Look for .btn-auto-refresh
      $form.on("click", ".btn-auto-refresh", function(e) {
        var _delay = $(e.target).attr("data-refresh-delay");
        e.stopPropagation();
        setTimeout(function() {
          location.reload();
        }, _delay);
      });
      // Make the subform be able to sort by column
      var stupidtable = $("table.stupidtable").stupidtable();
      if (stupidtable.length) {
        stupidtable.on("aftertablesort", function(event, data) {
          var th = $(this).find("th");
          th.find(".dir-icon").remove();
          var arrow =
            data.direction === "asc" ? "icon-arrow-up" : "icon-arrow-down";
          th.eq(data.column).append(
            '<i class="dir-icon ' +
              arrow +
              '" style="position:relative; left: 10px; top: -3px;"></i>'
          );
        });
      }
      // Make the Tags List has the same width
      $(".select-tags").each(function() {
        var $selectTag = $(this);
        var maxWidth = 0;
        $selectTag
          .find("li")
          .each(function() {
            var $li = $(this),
              _width = $li.outerWidth(true);
            if (_width > maxWidth) {
              maxWidth = _width;
            }
          })
          .width(maxWidth);
      });
      // Setup FileRepository Events
      this.setupFileRepositoryEvent($form);
      // Set Up Popover
      // console.log($form);
      this.setupPopover($form);

      // console.log('hello');
    },
    /**
     * Setup Read Mode
     * Check for valid data to be rendered
     **/
    isRenderReadMode: function(view, value) {
      var alwaysAllow = ["buttonclipboard", "filerepository"];
      var _type = value.type.toLowerCase();
      if (
        value.options.internal &&
        value.options.internal !== view.options.internal
      ) {
        return false;
      } else if (_.indexOf(alwaysAllow, _type) > -1) {
        return true;
      } else if (view.options.formData.fields[value.name] === "") {
        return false;
      } else if (_type === "fullname") {
        var _name = this.getSpecialFieldsName(value.name, value.type),
          _result = false;
        _.each(_name, function(element) {
          if (
            !_result &&
            view.options.formData.fields[element] &&
            view.options.formData.fields[element] !== ""
          ) {
            _result = true;
          }
        });
        return _result;
      } else if (
        typeof view.options.formData.fields[value.name] === "undefined"
      ) {
        switch (_type) {
          case "fieldsetstart":
          case "fieldsetend":
          case "html":
          case "action":
          case "submit":
          case "clear":
          case "address":
            break;
          case "button":
            var _btnName = value.description.toLowerCase();
            if (
              view.options.internal &&
              view.options.mode === "read" &&
              _btnName === "delete" &&
              view.options.formSchema.deleteenabled
            ) {
              if (!view.options.formData.createddate.$date) {
                throw 'In order to used "DeleteEnabled", form data must have "CreatedDate".';
              }
              // If this has FieldExists
              if (view.options.formSchema.deleteenabled.fieldexists) {
                var _fieldToCheck =
                  view.options.formSchema.deleteenabled.fieldexists;
                // This guard will prevent internal user to delete before file get downloaded.
                if (!view.options.formData.fields[_fieldToCheck]) {
                  return false;
                }
              }
              // If this has AfterXDays
              if (view.options.formSchema.deleteenabled.afterxdays) {
                var _currentDate = new Date(),
                  _createdDate = new Date(
                    view.options.formData.createddate.$date
                  ),
                  _dateDiff = this.calculateDateDiffByDays(
                    _currentDate,
                    _createdDate
                  );
                // If current date is less than the required date, will not render.
                if (
                  _dateDiff < view.options.formSchema.deleteenabled.afterxdays
                ) {
                  return false;
                }
              }
            }
            break;
          default:
            return false;
        }
      }
      return true;
    },
    /**
     * Reset Placeholder in older browser
     **/
    resetPlaceHolderValue: function(el) {
      var _isSetting = $(":input.placeholder", el);
      _isSetting.each(function() {
        var $this = $(this);
        if ($this.attr("placeholder") === $this.val()) {
          $this.val("");
        }
      });
    },
    /**
     * Function to create hidden form
     **/
    createHiddenForm: function(data) {
      require(["views/hiddenForm"], function(HiddenFormView) {
        var hiddenFormView = Vm.create({}, "FormView", HiddenFormView);
        hiddenFormView.render(data);
      });
    },
    /**
     * Function to set up for Ajax Call
     **/
    setupAjaxCall: function(view, $form) {
      _.each(view._ajaxDataCall, function(element) {
        var _type = element.type.toLowerCase(),
          _input = [],
          _request = {};
        if (typeof element.options.data === "undefined") {
          throw "In order to use ajax call, we need Options.Data.";
        }
        _.each(element.options.data, function(dataObj) {
          _.each(dataObj, function(dataVal) {
            _request[dataVal] = "";
          });
        });
        switch (_type) {
          case "fullname":
            _input.push(element.name + "_fullname_first_name");
            _input.push(element.name + "_fullname_middle_name");
            _input.push(element.name + "_fullname_last_name");
            break;
          default:
            _input.push(element.name);
        }
        _.each(_input, function(elementName) {
          $form.on("change", ':input[name="' + elementName + '"]', function(e) {
            var $thisInput = $(this),
              _val = $thisInput.val(),
              _error = false;
            if (_val !== "") {
              _request[elementName] = _val;
            }
            _.each(_request, function(dataVal, dataKey) {
              if (dataVal === "") {
                _error = true;
              }
            });
            if (!_error) {
              var _param = {},
                _url = element.options.url + "?";
              _.each(element.options.data, function(dataObj) {
                _.each(dataObj, function(dataVal, dataKey) {
                  _param[dataKey] = _request[dataVal];
                });
              });
              $.getJSON(_url + $.param(_param), function(respond) {
                if (respond.data) {
                  _.each(respond.data, function(respVal, respKey) {
                    if (typeof _request[respKey] === "undefined") {
                      var $_input = $(':input[name="' + respKey + '"]')
                          .val(respVal)
                          .trigger("change"),
                        $_parent;
                      if ($_input.attr("type") === "hidden") {
                        $_parent = $_input.parent(".emailpicker");
                        if ($_parent.length > 0) {
                          var _email = respVal.split("@");
                          $(":input.not_sending", $_parent).each(function(
                            index,
                            ele
                          ) {
                            $(ele).val(_email[index]);
                          });
                        }
                      }
                    }
                  });
                }
              });
            }
          });
        });
      });
    },
    /**
     * Function to setup Button Decision
     **/
    setUpButtonDecision: function(el, key, data, form, canEmpty, invalidObj) {
      canEmpty = canEmpty || [];
      invalidObj = invalidObj || false;
      var $currentElement = $("#" + el),
        $bDate = $currentElement.parent(".birthday-picker"),
        $bDateSelect,
        error = false,
        $input;
      if ($bDate.length > 0) {
        $bDateSelect = $(".not_sending", $bDate).trigger("change");
      }
      var _val = $currentElement.val();
      if (
        (_val !== "" && _val.search(/NaN/) === -1) ||
        canEmpty.indexOf(key) > -1
      ) {
        data[key] = _val;
      } else {
        error = true;
        $input = $(':input[name="' + el + '"]', form).addClass("invalid");
        if (invalidObj) {
          invalidObj.push($input);
        }
        if ($bDate.length > 0) {
          var _index = _val.split("/");
          _.each(_index, function(date, index) {
            if (date === "NaN") {
              $input = $($bDateSelect[index]).addClass("invalid");
              if (invalidObj) {
                invalidObj.push($input);
              }
            }
          });
        }
      }
      return error;
    },
    /**
     * Setup Ajax Call if the form has URL in options
     * For Dynamic AJAX look up
     * @param  object $form
     * @return
     */
    setupUrlAjaxCall: function($form, $scope, model) {
      var DEBUG = false;
      if (DEBUG) {
        console.log("[*] setupUrlAjaxCall");
        console.log(arguments);
      }
      $scope = $scope || null;
      model = model || null;
      var $urlEndPoint = $scope ? $scope : $(":input[data-url]"),
        that = this;
      if ($urlEndPoint.length === 0 || !$urlEndPoint.attr("data-url")) {
        return;
      }
      $urlEndPoint.each(function() {
        var $this = $(this),
          _url = $this.attr("data-url");
        // This select could have Tags
        if ($this.hasClass("tags")) {
          return;
        }
        if (DEBUG) {
          console.log("- Element");
          console.log($this);
          console.log(_url);
        }
        // console.log(_url);
        // Detect the {{}} Template, then this will be look up dynamic
        var _tokens = that.parseTemplateString(_url);
        if (DEBUG) {
          console.log(_tokens);
        }
        // Select2 does not work on select element for Ajax Call
        if (model) {
          var _modelValue = model.get($this.attr("name"));
          if (_modelValue && _modelValue !== "") {
            $this.attr("data-select-value", _modelValue);
          }
        }
        if (_tokens) {
          var _tokensStatic = that.parseTemplateStringGet(_url);
          if (_tokensStatic) {
            // If there is some GET data that do not match with {{Template}}
            var _staticResult = {};
            _.each(_tokensStatic, function(element) {
              var _keyVal = element.split("=");
              if (_keyVal.length !== 2) {
                return;
              }
              _staticResult[_keyVal[0]] = _keyVal[1];
            });
          }
          // Then we will be using select2 (Dynamic Lookup)
          if (!$this.select2) {
            throw 'Error: select2 is not yet loaded. Please refresh this page again! (Setup "' +
              $this.attr("id") +
              '"")';
          }
          var _domStr =
              '<input type="hidden" name="' +
              $this.attr("name") +
              '" id="' +
              $this.attr("id") +
              '" class="' +
              $this.attr("class") +
              ' has-select2-dynamic" />',
            _value = $this.attr("data-select-key-value"),
            _text = $this.attr("data-select-key-text"),
            _fieldValue = $this.attr("data-select-value");
          $this.replaceWith(_domStr);
          $this = $(':input[name="' + $this.attr("name") + '"]');
          if (_fieldValue) {
            $this.val(_fieldValue);
          }
          // Default Parameters for Select2
          var _ajaxObj = {
              url: _url.match(/^(\w|\.|\/|:|-)+\(?/gi).shift(),
              data: function(term, page) {
                var _result = _staticResult || {};
                _.each(_tokens, function(element) {
                  var _keyVal = element.split("="),
                    _rep = _keyVal.pop().replace(/(\{\{|\}\})/gi, ""),
                    _val;
                  switch (_rep) {
                    case "this":
                      _val = term;
                      break;
                    default:
                      // Look up name value
                      var $obj = $(':input[name="' + _rep + '"]');
                      _val = $obj.val();
                  }
                  _result[_keyVal] = _val;
                });
                return _result;
              },
              results: function(data, page) {
                // By Default will use id and text, otherwise will need to parse the data
                if (_value || _text) {
                  var _tmp = [];
                  _.each(data, function(element) {
                    var _tmpObj = {};
                    if (_value && _text) {
                      _tmpObj.id = element[_value];
                      _tmpObj.text = element[_text];
                    } else if (_value) {
                      _tmpObj.id = element[_value];
                      _tmpObj.text = element.text;
                    } else if (_text) {
                      _tmpObj.id = element.id;
                      _tmpObj.text = element[_text];
                    }
                    if (!_.isEmpty(_tmpObj)) {
                      if (
                        $this.hasClass("tolowercase") &&
                        _tmpObj.id &&
                        _tmpObj.text &&
                        _tmpObj.id.toLowerCase &&
                        _tmpObj.text.toLowerCase
                      ) {
                        _tmpObj.id = _tmpObj.id.toLowerCase();
                      }
                      _tmp.push(_tmpObj);
                    }
                  });
                  data = _tmp;
                }
                return {
                  more: false,
                  results: data
                };
              }
            },
            _opts = {
              placeholder: "--- Please Select ---",
              minimumInputLength: 3,
              initSelection: function(element, callback) {
                if (_fieldValue) {
                  // Will statically set the fields
                  $.ajax({
                    url: _ajaxObj.url,
                    data: _ajaxObj.data(_fieldValue),
                    success: function(data, textStatus, jqXHR) {
                      if (data.length === 1) {
                        var element = data.pop(),
                          _tmpObj = {};
                        if (_value && _text) {
                          _tmpObj.id = element[_value];
                          _tmpObj.text = element[_text];
                        } else if (_value) {
                          _tmpObj.id = element[_value];
                          _tmpObj.text = element.text;
                        } else if (_text) {
                          _tmpObj.id = element.id;
                          _tmpObj.text = element[_text];
                        }
                        callback(_tmpObj);
                      } else {
                        callback({
                          id: _fieldValue,
                          text: _fieldValue
                        });
                      }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                      callback({
                        id: _fieldValue,
                        text: _fieldValue
                      });
                    }
                  });
                }
              },
              ajax: _ajaxObj
            };
          // Setup Select2 for Dynamic Lookup
          $this.select2(_opts);
        } else {
          // Static Lookup
          // $.support.cors = true;
          if (!$this.hasClass("send-ajax-request")) {
            if (DEBUG) {
              console.log("- about to send ajax.");
            }
            $this.addClass("send-ajax-request");
            var tmpOptionsHtml = $this.find("option").html();
            $this.find("option").remove();
            $this.append('<option value="">--- Loading Data ---</option>');
            // DEBUG = true;
            $.ajax({
              // crossDomain: true,
              url: _url,
              dataType: "json",
              success: function(data, textStatus) {
                if (textStatus === "success") {
                  var _opts =
                      '<option value="">' + tmpOptionsHtml + "</option>",
                    _type = $urlEndPoint.prop("type"),
                    _dataArray = [],
                    dataSelectValue = $this.attr("data-select-value");
                  if (DEBUG) {
                    console.log("- response: " + _url);
                    console.log(_type);
                  }
                  switch (_type) {
                    case "select-multiple":
                    case "select-one":
                      $this.find("option").remove();
                      break;
                  }
                  _.each(data, function(element) {
                    var _tmpSelect;
                    switch (_type) {
                      case "select-multiple":
                      case "select-one":
                        if (_.isObject(element) && element.id && element.text) {
                          _tmpSelect =
                            dataSelectValue && dataSelectValue === element.id
                              ? " selected "
                              : "";
                          _opts +=
                            '<option value="' +
                            element.id +
                            '" ' +
                            _tmpSelect +
                            ">" +
                            element.text +
                            "</option>";
                        } else {
                          _tmpSelect =
                            dataSelectValue && dataSelectValue === element
                              ? " selected "
                              : "";
                          _opts +=
                            '<option value="' +
                            element +
                            '" ' +
                            _tmpSelect +
                            ">" +
                            element +
                            "</option>";
                        }
                        break;
                      default:
                        _dataArray.push(element[$this.attr("id")]);
                    }
                  });
                  if (DEBUG) {
                    console.log(_dataArray);
                  }
                  if (_dataArray.length) {
                    $this.attr({
                      autocomplete: "off"
                    });
                    $this.typeahead({
                      minLength: 3,
                      source: _dataArray
                    });
                    // If this value has change, we need to auto populate the data
                    var _dataCallback = function(e) {
                      $this.removeClass("attached-change");
                      var _val = $this.val(),
                        _matchData = _.find(data, function(element) {
                          if (_val === element[$this.attr("id")]) {
                            return true;
                          }
                        }),
                        _attachEvent = true;
                      if (_matchData) {
                        _.each(_matchData, function(value, key) {
                          if (value === "") {
                            return;
                          } else if (typeof value === "object") {
                            // If there is the View and Data in them means we need to render the view for user to select
                            var _listName;
                            if (value.length) {
                              _.some(value[0], function(listValue, listKey) {
                                _listName = listKey.split("_").shift();
                                return true;
                              });
                              // This will trigger the List to add the data
                              $("#subform_" + _listName, $form).trigger(
                                "subform_" + _listName + ".ajaxUpdate",
                                [value]
                              );
                            } else if (
                              value.data &&
                              value.view &&
                              value.title
                            ) {
                              _.some(value.data[0], function(
                                listValue,
                                listKey
                              ) {
                                _listName = listKey.split("_").shift();
                                return true;
                              });
                              _attachEvent = false;
                              // This is special case and need to render View and Data
                              require([
                                "views/" + value.view + "AjaxView"
                              ], function(AjaxView) {
                                var _opts = {
                                    $form: $form,
                                    collection: new Backbone.Collection(
                                      value.data
                                    ),
                                    id: key + "_AjaxView",
                                    $input: $this,
                                    input_callback: _dataCallback,
                                    title: value.title,
                                    listName: _listName
                                  },
                                  ajaxView = Vm.create(
                                    that,
                                    "AjaxView",
                                    AjaxView,
                                    _opts
                                  );
                                ajaxView.render();
                              });
                            }
                          } else {
                            var $targetInput = $(
                              ':input[name="' + key + '"]',
                              $form
                            );
                            if ($targetInput) {
                              $targetInput.val(value).trigger("change");
                            }
                          }
                        });
                      }
                      if (_attachEvent && !$this.hasClass("attached-change")) {
                        // Attached Event
                        $this.addClass("attached-change");
                        $this.one("change", _dataCallback);
                      }
                    };
                    if (!$this.hasClass("attached-change")) {
                      $this.addClass("attached-change");
                      $this.one("change", _dataCallback);
                    }
                  } else {
                    if (DEBUG) {
                      console.log($this);
                      // console.log(_opts);
                    }
                    $this.append(_opts);
                    var _select2Opt = {
                      containerCssClass: "span12"
                    };
                    var _select2Data = $this.attr("data-select-value");
                    var isMultiple = $this.attr("multiple");
                    if (_select2Data && isMultiple) {
                      // console.log($this);
                      // console.log(_select2Data);
                      // console.log($this.val());
                      // console.log(_select2Data);
                      $this.val(_select2Data.split(","));
                    }
                    if (isMultiple) {
                      if (model) {
                        if (model.toJSON) {
                          // console.log(model.toJSON());
                        }
                      }
                      $this.attr("name", $this.attr("name") + "[]");
                    }
                    $this.select2(_select2Opt);
                    $(
                      "#s2id_" + $this.attr("id") + " .select2-drop",
                      $form
                    ).hide();
                  }
                  // Trigger dataloaded event
                  $this.trigger("dataloaded");
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                alert(
                  'Error: when trying to request AJAX data to "' +
                    _url +
                    '" for "' +
                    $this.attr("id") +
                    '". Please try again.'
                );
              }
            });
          }
        }
      });
    },
    /**
     * Set up select2 for select type
     * @param  object $container
     * @return
     */
    setupSelect2: function(form, id) {
      var DEBUG = false;
      if (!form) {
        return;
      }

      function setup(el, _form) {
        if (el.hasClass("tags")) {
          Select2Helper.renderTags(el, _form);
        } else {
          // This is Select 2 Render
          Select2Helper.render(el, _form);
        }
      }
      if (DEBUG) {
        console.log("[*] setupSelect2");
        console.log(arguments);
      }
      // Logic
      if (form.el) {
        var _id = id ? id : form.el;
        if (!_.isString(_id)) {
          _id = $(_id).attr("id");
          if (_id) {
            _id = "#" + _id;
          }
        }
        if (DEBUG) {
          console.log(_id);
        }
        $(_id + " .selecttwo-render").each(function() {
          var $this = $(this);
          if (DEBUG) {
            console.log($this);
          }
          setup($this, form);
        });
      } else if (form.find) {
        // console.log(form);
        var $el = form.find(".selecttwo-render");
        if ($el.length) {
          setup($el, form);
        }
      } else {
        if (console && console.warn) {
          console.warn("Not set up Select2.");
        }
      }
    },
    /**
     * Setup Select and Clear Button for Check Box
     * @param  object $form
     * @return
     */
    setupCheckBoxSelectAndClear: function($form) {
      $form.on("click", ".checkbox-container button", function(e) {
        e.preventDefault();
        var $this = $(e.target),
          $parent = $this.closest(".checkbox-container"),
          $checkboxs = $parent.find("input:checkbox");
        if ($this.hasClass("btn-primary")) {
          $checkboxs.prop("checked", true);
          $checkboxs
            .filter(".checkbox-other")
            .click()
            .prop("checked", true);
        } else {
          $checkboxs.prop("checked", false);
          $checkboxs
            .filter(".checkbox-other")
            .click()
            .prop("checked", false);
        }
      });
    },
    /**
     * Setup Checkbox Other Options
     * @param  object $form
     * @return
     */
    setupCheckBoxOtherTextBox: function($form) {
      $form.on(
        "click",
        '.checkbox-container input[type="checkbox"].checkbox-other',
        function(e) {
          var $this = $(e.target),
            $textarea = $this.parent().next(".other-textbox");
          if ($this.is(":checked")) {
            $textarea.removeClass("not_sending").show("slow");
          } else {
            $textarea.addClass("not_sending").hide("slow");
          }
        }
      );
    },
    /**
     * Function to Setup BooleanInput
     */
    setupBooleanInput: function($form, view) {
      $form.on("click", ".form-render_booleaninput button", function(e) {
        var $this = $(this),
          _val = $this.attr("data-value"),
          _id = $this.attr("data-id"),
          _txt;
        $("#" + _id, $this.parent())
          .removeClass("invalid")
          .val(_val)
          .trigger("change");
        _txt =
          '<span class="text-' +
          (_val === "true" ? "success" : "error") +
          '">' +
          $this.html() +
          "<span>";
        $this
          .parent()
          .next()
          .html(_txt)
          .show("slow");
      });
      // If there is a default value in the input
      var $booleanInput = $(
        '.form-render_booleaninput input[type="hidden"]',
        $form
      );
      $booleanInput.each(function() {
        var $this = $(this),
          _val = $this.val();
        if (_val === "") {
          return;
        }
        switch (_val) {
          case true:
          case "true":
            $this
              .parent()
              .find("button.btn-yes")
              .click();
            break;
          case false:
          case "false":
            $this
              .parent()
              .find("button.btn-no")
              .click();
            break;
        }
      });
    },
    /**
     * Function to set up Radio Button Group
     * @param  object $form
     * @return
     */
    setupRadioBtnGroup: function($form, model) {
      model = model || null;
      var DEBUG = false;
      if (DEBUG) {
        console.log("[*] utils.js: setupRadioBtnGroup");
        console.log(arguments);
        if (model && model.toJSON()) {
          console.log(model.toJSON());
        }
        console.log($form.hasClass("attached-e-radio-container"));
      }
      if (!$form.hasClass("attached-e-radio-container")) {
        if (DEBUG) {
          console.log('    Attached: "attached-e-radio-container"');
        }
        $form.on("click", ".radio-container button", function(e) {
          e.preventDefault();
          var $this = $(e.target),
            _val = $this.attr("value"),
            $container = $this.closest(".radio-container"),
            $input = $container.find('input[type="hidden"]');
          var _inputName = $input.attr("name");
          $input.val(_val).trigger("change");
          if (DEBUG) {
            console.log('[*] Click On ".radio-container button"');
            console.log($this);
            console.log(_val);
          }
          if (model && model.has && model.has(_inputName)) {
            model.set(_inputName, $input.val());
          }
          var $targetBtn = $container.find(':button[value="' + _val + '"]');
          $container
            .find(".radio-value-render")
            .html($targetBtn.html())
            .show("slow");
        });
        $form.addClass("attached-e-radio-container");
        if (DEBUG) {
          console.log($form.hasClass("attached-e-radio-container"));
          console.log($form);
        }
      }
      //If this is edit, will need to render this as well.
      var $radioContainer = $form.find(".radio-container");
      $radioContainer.each(function() {
        var $this = $(this),
          $hidden = $this.find('input[type="hidden"]'),
          _val = $.trim($hidden.val());
        if (_val === "") {
          return;
        }
        $this.find('button[value="' + _val + '"]').trigger("click");
      });
      if (model && model.toJSON) {
        var modelValue = model.toJSON();
        _.each(modelValue, function(v, k) {
          if (typeof k !== "string" || !v) {
            return;
          }
          // console.log(k);
          var $currentInput = $form.find(".radio-container #" + k);
          if ($currentInput.length) {
            if ($currentInput.val()) {
              return;
            }
            var $currentInputParent = $currentInput.closest(".btn-group");
            var $targetBtn = $currentInputParent.find(
              'button[value="' + v + '"]'
            );
            if ($targetBtn.length) {
              $targetBtn.click();
            }
          }
        });
      }
    },
    /**
     * Function to set up Radio Button Group default values
     * @param  object $form
     * @return
     */
    setupRadioBtnGroupValue: function($form) {
      var $hidden = $(".radio-container input.has-default-val", $form);
      $hidden.each(function() {
        var $this = $(this),
          $target = $this
            .closest(".radio-container")
            .find('button[value="' + $this.val() + '"]');
        if ($target) {
          $target.addClass("active");
        } else {
          $this.val("");
        }
        $this.removeClass("has-default-val");
      });
    },
    /**
     * Function to setup UserId Look Up from Ajax
     */
    setupUserIdAjaxCall: function($form) {
      var endpoint = "/user?$filter=Username eq ",
        $idInput = $(":input.userid-lookup", $form),
        that = this;
      $idInput.each(function() {
        var $input = $(this);
        // If this is render as select (will use select2)
        if ($input.is("select")) {
          if ($input.is("[data-url]")) {
            // Ajax-Call
            $.getJSON($input.attr("data-url"), function(data, textStatus) {
              if (textStatus === "success") {
                var _opts = "";
                _.each(data, function(element) {
                  _opts +=
                    '<option value="' +
                    element.Id +
                    '">' +
                    element.Username +
                    "</option>";
                });
                $input.append(_opts);
                $input
                  .select2({
                    containerCssClass: "span12"
                  })
                  .on("change", function(e) {
                    if (e.val && e.val !== "") {
                      $input.removeClass("invalid");
                    }
                  });
              } else {
                that.setUpErrorNotice(
                  $input,
                  "Please refresh this page!",
                  10000
                );
              }
            });
          } else {
            // Default Select
            $input.select2({
              containerCssClass: "span12"
            });
          }
        } else {
          $(this).change(function(e) {
            var $this = $(this),
              _val = $this.val(),
              tmp_endpoint = $this.attr("data-url") || endpoint,
              _opt = {
                dataType: "json",
                complete: function(jqXHR, textStatus) {
                  $this.removeAttr("data-send");
                  if ($this.hasClass("invalid")) {
                    return;
                  }
                  if (textStatus === "success") {
                    var result = $.parseJSON(jqXHR.responseText);
                    switch (typeof result) {
                      case "boolean":
                        if (result) {
                          $this.addClass("invalid").val("");
                          that.setUpErrorNotice(
                            $this,
                            'Username "' + $this.val() + '" is already existed!'
                          );
                        }
                        break;
                    }
                  } else {
                    that.setUpErrorNotice($this, "Could not get information!");
                  }
                }
              };
            if (_val === "") {
              return;
            }
            if (tmp_endpoint.search(/\?/) === -1) {
              tmp_endpoint += "?";
            }
            if (typeof username !== "undefined") {
              _opt.username = username;
              _opt.password = password;
            }
            if ($this.is("[data-url-data]")) {
              var _data = "",
                _lookup = $.parseJSON($this.attr("data-url-data"));
              _.each(_lookup, function(value, key) {
                _data +=
                  key + "=" + $(':input[name="' + value + '"]').val() + "&";
              });
              _data = encodeURI(_data.substr(0, _data.length - 1));
              tmp_endpoint += _data;
            }
            _opt.url = tmp_endpoint;
            if (!$this.is("[data-send]")) {
              $this.attr("data-send", true);
              $.ajax(_opt);
            }
          });
        }
      });
    },
    /**
     * Setup Address Event
     */
    setupAddressEvent: function(el, view) {
      var $form = $("form", el);
      $form.on("change", ".country", function(e) {
        e.preventDefault();
        var $this = $(this),
          $parent = $this.parentsUntil("form", "div.address-fieldset"),
          $select = $parent.find("select.us-state"),
          $input = $parent.find("input.us-state"),
          $zip = $parent.find("input.postal-code"),
          _val = $this.val();
        if (_val === $this.attr("data-value")) {
          return;
        }
        $this.attr("data-value", _val);
        switch (_val) {
          case "":
          case "US":
            if ($select.is(":hidden")) {
              $input.attr("disabled", true).hide("slow", function() {
                $select.attr("disabled", false).show("slow");
              });
            }
            // If this Zip Code doesnot have class allowzipcodeplusfour
            if (!$zip.hasClass("allowzipcodeplusfour")) {
              $zip.addClass("allowzipcode").attr("maxlength", 5);
            }
            break;
          default:
            if ($input.is(":hidden")) {
              $select.attr("disabled", true).hide("slow", function() {
                $input
                  .attr("disabled", false)
                  .val("")
                  .show("slow");
                if ($input.is("[data-default-value]")) {
                  $input
                    .val($input.attr("data-default-value"))
                    .removeAttr("data-default-value");
                }
              });
            }
            $zip.removeClass("allowzipcode").removeAttr("maxlength");
        }
      });
      if (view.options.mode === "update") {
        var $addresses = $("div.address-fieldset", $form);
        $addresses.each(function() {
          var $this = $(this);
          $(".country", this).trigger("change");
        });
      }
    },
    /**
     * Popover is error
     */
    setUpErrorNotice: function($currentTarget, text, duration, lang) {
      // Languages
      lang = lang || "en";
      duration = duration || 3000;
      text = text || "";
      var _t_1, _t_2;
      switch (lang) {
        case "sp":
          _t_1 = "Error";
          _t_2 = "Por favor, vuelve a intentarlo";
          break;
        default:
          _t_1 = "Error";
          _t_2 = "Please try again.";
      }
      var _opt = {
        html: true,
        placement: "top",
        trigger: "manual",
        title: '<i class="icon-edit"></i> ' + _t_1 + ".",
        content:
          '<i class="icon-spinner icon-spin icon-large"></i> ' +
          _t_2 +
          " ..." +
          (text !== "" ? "<br>" + text : "")
      };
      $currentTarget
        .attr("disabled", true)
        .popover(_opt)
        .popover("show");
      window.setTimeout(function() {
        $currentTarget.attr("disabled", false).popover("destroy");
        $currentTarget.next(".popover").remove();
      }, duration);
    },
    /**
     * Check Internal Fields and append _internal to field name
     * @param  object $form
     * @param  array internalFields
     * @return
     */
    parseInternalFieldsBeforeSubmit: function($form, internalFields) {
      // console.log('===== parseInternalFieldsBeforeSubmit ======');
      var _nameTxt;
      if (!internalFields.length) {
        return;
      }
      _.each(internalFields, function(element) {
        var $input = $(':input[name="' + element + '"]', $form);
        if (!$input.length) {
          return;
        }
        _nameTxt = element.match(/\[\]$/gi);
        if (_nameTxt) {
          _nameTxt = element.substr(0, element.length - 2) + "_internal[]";
        } else {
          _nameTxt = element + "_internal";
        }
        $input.attr("name", _nameTxt);
      });
    },
    setupPopover: function($context) {
      var $popover = $('[data-toggle="popover"]', $context);
      $popover.popover();
    },
    destroyPopover: function($context) {
      var $popover = $('[data-toggle="popover"]', $context);
      $popover.popover("destroy");
    },
    /**
     * Calculate Date Diff
     * http://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates-using-javascript
     * @return
     */
    calculateDateDiffByDays: function(date1, date2) {
      // The number of milliseconds in one day
      var ONE_DAY = 1000 * 60 * 60 * 24;
      // Convert both dates to milliseconds
      var date1_ms = date1.getTime(),
        date2_ms = date2.getTime();
      // Calculate the difference in milliseconds
      var difference_ms = Math.abs(date1_ms - date2_ms);
      // Convert back to days and return
      return Math.round(difference_ms / ONE_DAY);
    },
    /**
     * Convert field value to array str "[value1, value2]"
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
    convertDataToArrayString: function($form) {
      var checkClass = ["value-as-array"];
      _.each(checkClass, function(element) {
        var $inputEl = $(":input." + element, $form);
        $inputEl.each(function() {
          var $this = $(this);
          var val = $inputEl.val();
          if (val && val !== "") {
            val = val.split(",");
          } else {
            // Make it as emptied Array
            val = [];
          }
          $this.val(JSON.stringify(val));
        });
      });
    },
    convertNumberToDecimal: function($form) {
      $form.find(":input[data-decimal]").each(function() {
        var $this = $(this),
          _val = $this.val(),
          _numberDecimal = parseInt($this.attr("data-decimal"), 10);
        _val *= Math.pow(10, _numberDecimal);
        $this.val(parseInt(_val, 10));
      });
    },
    /**
     * Setup Radio Value in Update Mode
     * @param  object view
     * @return
     */
    setupRadioButtonsValue: function(view) {
      if (!view.options.formData || !view.options.formData.fields) {
        return;
      }
      _.each(view._radioFieldName, function(element) {
        if (!view.options.formData.fields[element]) {
          return;
        }
        var $targetRadio = $(':radio[name="' + element + '"]').filter(
          '[value="' + view.options.formData.fields[element] + '"]'
        );
        $targetRadio.attr("checked", true).trigger("change");
      });
    },
    setupRadioButtonsValueWithModel: function(view, radioFieldName) {
      var model = view.model;
      // console.log('- model:', JSON.stringify(model.toJSON()));
      if (!model) {
        return;
      }
      _.each(radioFieldName, function(value, key) {
        // console.log('- value:', value, ', key:', key);
        var currentValue = model.get(value);
        var $targetRadio = $(':radio[name="' + value + '"]').filter(
          '[value="' + currentValue + '"]'
        );
        // console.log('  - $targetRadio:', $targetRadio);
        $targetRadio.attr("checked", true).trigger("change");
      });
    },
    performCalculateLogic: function(el, view) {
      var DEBUG = false;
      var $calculates = el.find(":input:hidden[data-logic]");
      if (DEBUG) {
        console.log("*** performCalculateLogic ***");
        console.log($calculates);
        console.log(el);
        console.log(view);
      }
      if (!$calculates || !$calculates.length) {
        return;
      }
      $calculates.each(function() {
        var $this = $(this);
        var logic = $this.attr("data-logic");
        var type = $this.attr("data-type");
        if (type) {
          type = type.toLowerCase();
        }
        if (DEBUG) {
          console.log("- logic: ", logic);
          console.log("- type: ", type);
        }
        // Would be in
        // ID - ID
        // ID + ID
        var matches = logic.match(/(\S+)\s+(\S+)\s+(\S+)/);
        if (DEBUG) {
          console.log("- matches: ", matches);
        }
        var firstEl, secondEl, arith, _result;
        if (matches) {
          if (matches.length === 4) {
            arith = $.trim(matches[2]);
            firstEl = $("#" + matches[1]).val();
            secondEl = $("#" + matches[3]).val();
            if (DEBUG) {
              console.log("- firstEl: ", firstEl);
              console.log("- secondEl: ", secondEl);
            }
          } else {
            throw new Error("Does not know how to calulate! (" + logic + ")");
          }
          _result = calculated(firstEl, secondEl, arith, type);
          if (DEBUG) {
            console.log("- _result: ", _result);
          }
          $this.val(_result).trigger("change");
        }
      });

      function calculated(val1, val2, arith, type) {
        arith = $.trim(arith);
        if (type) {
          type = $.trim(type);
        }
        if (type) {
          switch (type) {
            case "day":
              var m1, m2;
              if (val1) {
                m1 = moment(val1, "MM/DD/YYYY");
                if (m1.isValid()) {
                  val1 = m1.valueOf();
                }
              }
              if (val2) {
                m2 = moment(val2, "MM/DD/YYYY");
                if (m2.isValid()) {
                  val2 = m2.valueOf();
                }
              }
              break;
            default:
              if (console && console.error) {
                console.error(
                  "- calculated:" + type + " is not implement yet!"
                );
              }
          }
        }
        if (DEBUG) {
          console.log("- val1: ", val1);
          console.log("- val2: ", val2);
        }
        var result;
        switch (arith) {
          case "+":
            result = val1 + val2;
            break;

          case "-":
            result = val1 - val2;
            break;

          case "*":
            result = val1 * val2;
            break;

          case "/":
            result = val1 / val2;
            break;

          default:
            throw new Error("Not implement " + arith + " yet!");
        }
        if (DEBUG) {
          console.log("- result: ", result);
        }
        if (type) {
          switch (type) {
            case "day":
              result = result / 1000 / 60 / 60 / 24;
              // Round Up
              result = Math.ceil(result);
              break;
          }
        }
        if (DEBUG) {
          console.log("- result: ", result);
        }
        return result;
      }
    },
    setModelRadioValues: function(el, view, debug) {
      var DEBUG = debug || false;
      // DEBUG = true;
      view = view || null;

      // Need to remove previous invalid class
      var $radiosInvalid = el.find(":radio.invalid");
      if ($radiosInvalid.length) {
        $radiosInvalid.removeClass("invalid");
      }

      var $radios = el.find(":radio:checked");
      if (!$radios.length) {
        return;
      }
      if (DEBUG) {
        console.log("[*] Debug - setModelRadioValues");
        console.log($radios);
        console.log(view);
        console.log(view.model);
        console.log(view.model.toJSON());
      }
      $radios.each(function() {
        try {
          var $this = $(this);
          if (DEBUG) {
            console.log($this);
            console.log("- before update model values:", view.model.toJSON());
          }
          $this.attr("checked", true).trigger("change");
          if (view && view.model) {
            var name = $this.attr("name"),
              _val = $this.val();
            if (DEBUG) {
              console.log(
                '    Model["' + name + '"] : ' + view.model.get(name)
              );
            }
            view.model.set(name, _val);
          }
        } catch (err) {
          // Error: Because of Model Binder (VisibleOn).
          // Can skip Safely.
          if (console && console.log) {
            console.log("[x] Exception in setModelRadioValues");
            console.log(err);
          }
        }
      });
    },
    setModelCheckValues: function(el, view) {
      view = view || null;
      var $checks = el.find(":checkbox:checked");
      if (!$checks.length) {
        return;
      }
      $checks.each(function() {
        try {
          var $this = $(this);
          $this.attr("checked", true).trigger("change");
          if (view && view.model) {
            var name = $this.attr("name"),
              _val = $this.val();
            view.model.set(name, _val);
          }
        } catch (err) {
          // Error: Because of Model Binder (VisibleOn).
          // Can skip Safely.
          if (console && console.log) {
            console.log("[x] Exception in setModelCheckValues");
            console.log(err);
          }
        }
      });
    },
    setDefaultMultiFile: function(el, view) {
      // console.log('setDefaultMultiFile', 'el:', el, 'view:', view);
      // console.log('setDefaultMultiFile mode', view.options.mode);
      if (!view || !view.options || view.options.mode !== "update") {
        return;
      }
      // Ready to check for model
      var model = view.model;
      // console.log('model', model.toJSON());
      if (
        !model ||
        !model.multiFilesDefaultValue ||
        _.isEmpty(model.multiFilesDefaultValue)
      ) {
        return;
      }
      var defaultValue = model.multiFilesDefaultValue;
      // console.log('defaultValue', defaultValue);
      _.each(defaultValue, function(value, key) {
        // console.log('L3060', 'value:', value, 'key:', key);
        // var $multiFile = el.find(':input[name="' + key + '"]');
        // console.log('$multiFile', $multiFile);
        if (model.has(key)) {
          var mutiFileValue = model.get(key);
          // console.log('mutiFileValue', mutiFileValue)
          if (!mutiFileValue) {
            model.set(key, value);
          }
        }
      });
    },
    /**
     * Function to format Date Object to return time
     * @param  object date
     * @return
     */
    formatAMPM: function(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
    addFormSubmittedData: function(field, view) {
      // If this is log, will auto added the create date and time
      if (field.name && field.name === "LogEntries") {
        if (view.options.formData.fields) {
          var _createItemObj = {
            LogMessage: "Form submitted",
            LogTime:
              view.options.formData.createddate &&
              view.options.formData.createddate.$date
                ? view.options.formData.createddate.$date / 1000
                : null,
            LogUser: view.options.formData.createduser
              ? view.options.formData.createduser
              : null
          };
          if (!view.options.formData.fields[field.name]) {
            view.options.formData.fields[field.name] = [];
          }
          view.options.formData.fields[field.name].unshift(_createItemObj);
        }
      }
    },
    getUserIdFormHtml: function(id) {
      id = id || null;
      if (!id) {
        return $("#snhd_user_network_login")
          .text()
          .toLowerCase();
        //return $('#snhd_user_network_login').text().replace(/\s*\w+\\/ig, '').toLowerCase();
      }
    },
    shouldRenderWithShowOnStatusOrShowOnMode: function(field, status, mode) {
      // Check ShowOnStatus
      if (
        field.options.showonstatus &&
        _.indexOf(field.options.showonstatus, status) < 0
      ) {
        return false;
      }
      // Check ShowOnMode
      if (
        field.options.showonmode &&
        _.indexOf(field.options.showonmode, mode) < 0
      ) {
        return false;
      }
      return true;
    },
    shouldRenderShowOnUser: function(field) {
      if (!(field.options && field.options.showonuser)) {
        return true;
      }

      if (!_.isArray(field.options.showonuser)) {
        throw "In order to use Options.ShowOnUser for " +
          field.type +
          ' with "' +
          field.name +
          '" required an array!';
      }
      // Perform Logic to check the User
      var _curr_user = this.getUserIdFormHtml();
      if (_curr_user && _curr_user !== "") {
        var _nameToken = _curr_user.replace("cchd\\", "");
        // Added a fix for usernames that has hypen. 11-28-2018 - Phillip Pilares

        // var _userRegEx = /(\w+)$/i,
        //   _nameToken = _curr_user.match(_userRegEx);
        if (_nameToken) {
          if (_.indexOf(field.options.showonuser, _nameToken) > -1) {
            return true;
          }
        }
      }
      return false;
    },
    validateCheckBox: function($form) {
      var valid = true;
      try {
        $form
          .find('.checkbox-container[data-check-required="true"]')
          .each(function() {
            var $this = $(this),
              $labels = $this.find("label.checkbox");
            if ($this.find(":checked").length) {
              $labels.removeClass("invalid");
            } else {
              $labels.addClass("invalid");
              valid = false;
            }
          });
      } catch (err) {
        if (console && console.log) {
          console.log("[x] Error: validateCheckBox");
          console.log(err);
        }
        valid = false;
      }
      return valid;
    },
    validateBooleanInput: function($form) {
      var valid = true;
      try {
        $form
          .find('.form-render_booleaninput input[type="hidden"].invalid')
          .each(function() {
            valid = false;
            var $this = $(this),
              _errorTxt =
                '<span class="text-error">Please answer this question.</span>';
            $this
              .closest(".form-render_booleaninput")
              .next()
              .html(_errorTxt)
              .show("slow");
          });
      } catch (err) {
        if (console && console.log) {
          console.log("[x] Error: validateBooleanInput");
          console.log(err);
        }
        valid = false;
      }
      return valid;
    },
    /**
     * Pass in options that is select, then check value and if it null or empty string.
     * Will de-select it
     * @param  object $options
     */
    resetSelectsOption: function($options) {
      var DEBUG = false;
      if (!$options || !$options.length) {
        return;
      }
      if (DEBUG) {
        console.log("[*] resetSelectsOption -");
        console.log(arguments);
      }
      $options.each(function() {
        var $opt = $(this);
        var _val = $opt.val();
        if (_.isNull(_val) || _val === "") {
          $opt.removeAttr("selected");
        }
      });
    },
    formatUriSegment: function(url, formData) {
      var DEBUG = false;
      formData = formData || null;
      if (!formData) {
        if (console && console.log) {
          console.log('[x] formData is null in "formatUriSegment".');
        }
        return;
      }
      var tokens = url.match(/{\w+}/gi);
      if (DEBUG) {
        console.log("[*] Current URL");
        console.log(tokens);
        console.log("[*] FormData");
        console.log(formData);
      }
      _.each(tokens, function(element) {
        if (DEBUG) {
          console.log("***");
          console.log(element);
        }
        switch (element) {
          case "{id}":
            if (!formData || !formData._id || !formData._id.$oid) {
              throw "formatUriSegment could not find _id.$oid.";
            }
            url = url.replace(element, formData._id.$oid);
            break;
        }
      });
      if (DEBUG) {
        console.log("[*] New URL");
        console.log(url);
      }
      return url;
    },
    /**
     * Setup FileRepo Event
     */
    setupFileRepositoryEvent: function($view) {
      var self = this;
      if (!$view.length) {
        throw "setupFileRepositoryEvent form not found.";
      }
      $view
        .on("hidden", ".filerepository-form-wrapper", function() {
          var $this = $(this);
          $this
            .find(":input")
            .removeClass("invalid")
            .each(function() {
              var $input = $(this);
              $input.val("");
            });
        })
        .on("click", ".filerepository-button", function(e) {
          e.preventDefault();
          var $btn = $(e.currentTarget);
          var $wrapper = $btn.closest(".filerepository-wrapper");
          $wrapper.find(".filerepository-form-wrapper").modal("show");
          return false;
        })
        .on(
          "click",
          ".filerepository-form-wrapper .btn-submit-filerepository",
          function(e) {
            e.preventDefault();
            // Validate Form
            var $modal = $(e.currentTarget).closest(
              ".filerepository-form-wrapper"
            );
            var $form = $modal.find(".filerepository-form");
            var $inputs = $(":input", $form);
            var formError = false;
            $inputs.each(function() {
              var $input = $(this);
              var _val = $input.val();
              var error = false;
              if (!_val || _val === "") {
                error = true;
                formError = true;
              }
              if (error) {
                $input.addClass("invalid");
              } else {
                $input.removeClass("invalid");
              }
            });
            if (formError) {
              return false;
            }
            var $footer = $modal.find(".modal-footer");
            $footer.find(".btn").fadeOut();
            $modal
              .find(".modal-body .alert")
              .html(
                '<i class="icon-spinner icon-spin icon-large"></i> Sending information, please wait.'
              );
            // Pass Validation
            // Build HTML Form and submit
            self.buildFormAppendToBody(
              $inputs.parent(),
              $modal.attr("data-url")
            );
            return false;
          }
        );
    },
    /**
     * Set Up US County
     */
    setupCounty: function($markup) {
      var $county = $markup.find(".select2-county");
      if (!$().select2) {
        throw "Select 2 is not found!";
      }
      $county.each(function() {
        var $this = $(this);
        $this.select2();
      });
      var $countyLookUp = $markup.find(".select2-county-lookup");
      if (typeof countyData === "string") {
        countyData = $.parseJSON(countyData);
      }
      $countyLookUp.each(function() {
        var $this = $(this),
          idLookUp = $this.attr("data-filterbyid");
        $this.select2();
        $markup.on("change", "#" + idLookUp, function() {
          var $target = $(this),
            val = $target.val(),
            _st = $this.attr("data-state");
          if (_st === val) {
            return;
          }
          // Set up Options
          var targetData =
            '<option value="">-- Select County in ' + val + " --</option>";
          _.each(countyData[val], function(county) {
            targetData +=
              '<option value="' + county + '">' + county + "</option>";
          });
          $this.val("");
          $this.select2("val", "");
          $this.select2("destroy");
          $this.empty().append(targetData);
          $this.select2();
          $this.val("");
          $this.select2("val", "");
          $this.select2("open");
          $this.select2("close");
          $this.attr("data-state", val);
          // This cause the form to focus at this point.
        });
        var $checkTarget = $("#" + idLookUp, $markup),
          _v = $checkTarget.val();
        if (_v && _v !== "") {
          $checkTarget.trigger("change");
        }
        // If there is a default value
        var _deVal = $this.attr("data-countyvalue");
        if (_deVal && _deVal !== "") {
          $this.select2("destroy");
          $this.select2();
          $this.select2("val", _deVal);
        }
      });
    },
    /**
     * Utilities for Buildding the Form by $inputs
     * @param  object $input
     */
    buildFormAppendToBody: function($formWrapper, url) {
      // Build Form
      if (!url || url === "" || typeof url !== "string") {
        throw "Expected url to be a valid string.";
      }
      var form = $(
        '<form action="' +
          url +
          '" method="POST" enctype="multipart/form-data"></form>'
      );
      form.append($formWrapper);
      form.appendTo("body");
      form.submit();
    },
    /**
     * Perform Final Setup for All modes, happened after renderCompleted event
     */
    finalSetupAllMode: function(view) {
      var $form = $(view.el);
      if (!$form.length) {
        throw "[x] finalSetupAllMode: could not be able to find form.";
      }
      // $form.find(':hidden:input').each(function() {
      //   var $this = $(this),
      //     _val = $this.val();
      //   if ($this.is(':radio') || $this.is(':checkbox')) {
      //     return;
      //   }
      //   if (_val && _val !== '') {
      //     $this.trigger('change');
      //   }
      // });
    },
    /**
     * Show Success Box
     * @param  {string}   txt text to show
     * @param  {Function} cb  callback function
     */
    showHumaneSuccessBox: function(txt, cb) {
      var jacked = humane.create({
        baseCls: "humane-jackedup",
        addnCls: "humane-jackedup-success",
        timeout: 3000,
        clickToClose: false,
        waitForMove: false
      });
      jacked.log(txt, cb);
    },
    showHumaneErrorBox: function(txt, cb) {
      var bigbox = humane.create({
        baseCls: "humane-bigbox",
        timeout: 3000,
        clickToClose: false,
        waitForMove: false
      });
      bigbox.error = bigbox.spawn({
        addnCls: "humane-bigbox-error"
      });
      bigbox.error(txt, cb);
    },
    /**
     * Return as Date Value
     * @param  integer date
     * @param  string format
     * @return string
     */
    formatDateAsString: function(date, format) {
      format = format || null;
      var _tmpDate = new Date(date);
      if (!format) {
        // return _tmpDate.getTime() / 1000;
        // return _tmpDate.toString();
        // return _tmpDate.toLocaleString();
        return _tmpDate.toUTCString();
      }
      var _month = _tmpDate.getMonth() + 1;
      if (_month < 10) {
        _month = "0" + _month;
      }
      var _date = _tmpDate.getDate();
      if (_date < 10) {
        _date = "0" + _date;
      }
      switch (format) {
        case "m/d/Y":
          return _month + "/" + _date + "/" + _tmpDate.getFullYear();
          break;
        default:
          throw "Not Implement " + format + ' yet in "formatDateAsString"!';
      }
    },
    /**
     * numerical sort
     */
    sortNumber: function(a, b) {
      return a - b;
    },
    /**
     * Focus on First Input
     */
    focusOnFirstInput: function(view) {
      var DEBUG = false;
      view = view || null;
      if (DEBUG) {
        console.log("[*] notFocus");
        console.log(arguments);
      }
      var q = "input:visible:enabled:first";
      var $inputFirst;
      if (view.$el) {
        $inputFirst = view.$el.find("form:first").find(q);
      }
      // console.log('- $inputFirst:', $inputFirst)
      if (
        $inputFirst &&
        $inputFirst.length &&
        !($inputFirst.is(":radio") || $inputFirst.is(":checkbox"))
      ) {
        // $inputFirst.focus().blur();
        $inputFirst.focus();
        if ($inputFirst.hasClass("datepicker")) {
          $inputFirst.datepicker("hide");
        }
      }
    },
    /**
     * Scroll to Top of the Page
     */
    scrollToTop: function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },

    getText: getText,

    Base64: getBase64(),

    humanFileSize: humanFileSize,

    getModelValueForViewModel: getModelValueForViewModel,

    convertDataURIToBlob: convertDataURIToBlob
  };

  /**
   * Setup DependOn Options
   **/
  function setValueDependOn(el, visibleOnObj, formData) {
    _.each(visibleOnObj, function(value) {
      if (formData.fields[value.name]) {
        $(el).on(
          "visibleOnRenderComplete",
          ':input[name="' + value.name + '"]',
          function() {
            var $this = $(this);
            if (!($this.is(":radio") || $this.is(":checkbox"))) {
              $this.val(formData.fields[value.name]).trigger("change");
            } else {
              if ($this.val() === formData.fields[value.name]) {
                $this.prop("checked", true);
              }
            }
          }
        );
        // Need to trigger the value
        $(':input[name="' + value.options.visibleon.name + '"]').trigger(
          "change"
        );
      }
    });
  }
  /**
   * Get System Language
   */
  function getText(text, lang) {
    // console.log('[*] getText');
    // console.log(arguments);
    if (!text) {
      return text;
    }
    if (!lang) {
      return text;
    }
    if (!(text in SYSTEM_LANG)) {
      return text;
    }
    var _currentText = SYSTEM_LANG[text];
    if (!(lang in _currentText)) {
      return text;
    }
    var currentText = _currentText[lang];
    if (!currentText) {
      return text;
    }
    // console.log('- currentText:', currentText);
    return currentText;
  }

  function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }
    var units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + " " + units[u];
  }

  /**
   * Base64 Stuff
   */
  function getBase64() {
    /**
     *
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    var Base64 = {
      // private property
      _keyStr:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      // public method for encoding
      encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output =
            output +
            this._keyStr.charAt(enc1) +
            this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) +
            this._keyStr.charAt(enc4);
        }
        return output;
      },
      // public method for decoding
      decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }
        }
        output = Base64._utf8_decode(output);
        return output;
      },
      // private method for UTF-8 encoding
      _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      },
      // private method for UTF-8 decoding
      _utf8_decode: function(utftext) {
        var string = "";
        var c1, c2, c3;
        var i = 0;
        var c = (c1 = c2 = 0);
        while (i < utftext.length) {
          c = utftext.charCodeAt(i);
          if (c < 128) {
            string += String.fromCharCode(c);
            i++;
          } else if (c > 191 && c < 224) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
          } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(
              ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            i += 3;
          }
        }
        return string;
      }
    };

    return Base64;
  }

  function getModelValueForViewModel(data, fieldToGet) {
    data = data || {};
    if (!data.fields) {
      return;
    }
    var currentFieldFormData = data.fields[fieldToGet];

    if (_.isString(currentFieldFormData)) {
      try {
        var tempCurrentFieldFormData = JSON.parse(currentFieldFormData);
        currentFieldFormData = tempCurrentFieldFormData;
      } catch (err) {
        console.error(
          "[x] baseField.js: could not parse JSON string for " +
            fieldToGet +
            " (" +
            currentFieldFormData +
            ")"
        );
        return currentFieldFormData;
      }
    }

    return currentFieldFormData;
  }

  function convertDataURIToBlob(dataURI, fileName) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString }, fileName);
    return blob;
  }
});
