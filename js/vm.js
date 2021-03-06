"use strict";
define(["jquery", "underscore", "backbone", "events"], function(
  $,
  _,
  Backbone,
  Events
) {
  var views = {},
    countries = {
      US: "United States",
      AF: "Afghanistan",
      AX: "Aland Islands",
      AL: "Albania",
      DZ: "Algeria",
      AS: "American Samoa",
      AD: "Andorra",
      AO: "Angola",
      AI: "Anguilla",
      AQ: "Antarctica",
      AG: "Antigua and Barbuda",
      AR: "Argentina",
      AM: "Armenia",
      AW: "Aruba",
      AU: "Australia",
      AT: "Austria",
      AZ: "Azerbaijan",
      BS: "Bahamas, The",
      BH: "Bahrain",
      BD: "Bangladesh",
      BB: "Barbados",
      BY: "Belarus",
      BE: "Belgium",
      BZ: "Belize",
      BJ: "Benin",
      BM: "Bermuda",
      BT: "Bhutan",
      BO: "Bolivia",
      BA: "Bosnia and Herzegovina",
      BW: "Botswana",
      BV: "Bouvet Island",
      BR: "Brazil",
      IO: "British Indian Ocean Territory",
      BN: "Brunei Darussalam",
      BG: "Bulgaria",
      BF: "Burkina Faso",
      BI: "Burundi",
      KH: "Cambodia",
      CM: "Cameroon",
      CA: "Canada",
      CV: "Cape Verde",
      KY: "Cayman Islands",
      CF: "Central African Republic",
      TD: "Chad",
      CL: "Chile",
      CN: "China",
      CX: "Christmas Island",
      CC: "Cocos (Keeling) Islands",
      CO: "Colombia",
      KM: "Comoros",
      CG: "Congo",
      CD: "Congo, The Democratic Republic Of The",
      CK: "Cook Islands",
      CR: "Costa Rica",
      CI: "Cote D'ivoire",
      HR: "Croatia",
      CY: "Cyprus",
      CZ: "Czech Republic",
      DK: "Denmark",
      DJ: "Djibouti",
      DM: "Dominica",
      DO: "Dominican Republic",
      EC: "Ecuador",
      EG: "Egypt",
      SV: "El Salvador",
      GQ: "Equatorial Guinea",
      ER: "Eritrea",
      EE: "Estonia",
      ET: "Ethiopia",
      FK: "Falkland Islands (Malvinas)",
      FO: "Faroe Islands",
      FJ: "Fiji",
      FI: "Finland",
      FR: "France",
      GF: "French Guiana",
      PF: "French Polynesia",
      TF: "French Southern Territories",
      GA: "Gabon",
      GM: "Gambia, The",
      GE: "Georgia",
      DE: "Germany",
      GH: "Ghana",
      GI: "Gibraltar",
      GR: "Greece",
      GL: "Greenland",
      GD: "Grenada",
      GP: "Guadeloupe",
      GU: "Guam",
      GT: "Guatemala",
      GG: "Guernsey",
      GN: "Guinea",
      GW: "Guinea-Bissau",
      GY: "Guyana",
      HT: "Haiti",
      HM: "Heard Island and the McDonald Islands",
      VA: "Holy See",
      HN: "Honduras",
      HK: "Hong Kong",
      HU: "Hungary",
      IS: "Iceland",
      IN: "India",
      ID: "Indonesia",
      IQ: "Iraq",
      IE: "Ireland",
      IM: "Isle Of Man",
      IL: "Israel",
      IT: "Italy",
      JM: "Jamaica",
      JP: "Japan",
      JE: "Jersey",
      JO: "Jordan",
      KZ: "Kazakhstan",
      KE: "Kenya",
      KI: "Kiribati",
      KR: "Korea, Republic Of",
      KW: "Kuwait",
      KG: "Kyrgyzstan",
      LA: "Lao People's Democratic Republic",
      LV: "Latvia",
      LB: "Lebanon",
      LS: "Lesotho",
      LR: "Liberia",
      LY: "Libya",
      LI: "Liechtenstein",
      LT: "Lithuania",
      LU: "Luxembourg",
      MO: "Macao",
      MK: "Macedonia, The Former Yugoslav Republic Of",
      MG: "Madagascar",
      MW: "Malawi",
      MY: "Malaysia",
      MV: "Maldives",
      ML: "Mali",
      MT: "Malta",
      MH: "Marshall Islands",
      MQ: "Martinique",
      MR: "Mauritania",
      MU: "Mauritius",
      YT: "Mayotte",
      MX: "Mexico",
      FM: "Micronesia, Federated States Of",
      MD: "Moldova, Republic Of",
      MC: "Monaco",
      MN: "Mongolia",
      ME: "Montenegro",
      MS: "Montserrat",
      MA: "Morocco",
      MZ: "Mozambique",
      MM: "Myanmar",
      NA: "Namibia",
      NR: "Nauru",
      NP: "Nepal",
      NL: "Netherlands",
      AN: "Netherlands Antilles",
      NC: "New Caledonia",
      NZ: "New Zealand",
      NI: "Nicaragua",
      NE: "Niger",
      NG: "Nigeria",
      NU: "Niue",
      NF: "Norfolk Island",
      MP: "Northern Mariana Islands",
      NO: "Norway",
      OM: "Oman",
      PK: "Pakistan",
      PW: "Palau",
      PS: "Palestinian Territories",
      PA: "Panama",
      PG: "Papua New Guinea",
      PY: "Paraguay",
      PE: "Peru",
      PH: "Philippines",
      PN: "Pitcairn",
      PL: "Poland",
      PT: "Portugal",
      PR: "Puerto Rico",
      QA: "Qatar",
      RE: "Reunion",
      RO: "Romania",
      RU: "Russian Federation",
      RW: "Rwanda",
      BL: "Saint Barthelemy",
      SH: "Saint Helena",
      KN: "Saint Kitts and Nevis",
      LC: "Saint Lucia",
      MF: "Saint Martin",
      PM: "Saint Pierre and Miquelon",
      VC: "Saint Vincent and The Grenadines",
      WS: "Samoa",
      SM: "San Marino",
      ST: "Sao Tome and Principe",
      SA: "Saudi Arabia",
      SN: "Senegal",
      RS: "Serbia",
      SC: "Seychelles",
      SL: "Sierra Leone",
      SG: "Singapore",
      SK: "Slovakia",
      SI: "Slovenia",
      SB: "Solomon Islands",
      SO: "Somalia",
      ZA: "South Africa",
      GS: "South Georgia and the South Sandwich Islands",
      ES: "Spain",
      LK: "Sri Lanka",
      SR: "Suriname",
      SJ: "Svalbard and Jan Mayen",
      SZ: "Swaziland",
      SE: "Sweden",
      CH: "Switzerland",
      TW: "Taiwan",
      TJ: "Tajikistan",
      TZ: "Tanzania, United Republic Of",
      TH: "Thailand",
      TL: "Timor-leste",
      TG: "Togo",
      TK: "Tokelau",
      TO: "Tonga",
      TT: "Trinidad and Tobago",
      TN: "Tunisia",
      TR: "Turkey",
      TM: "Turkmenistan",
      TC: "Turks and Caicos Islands",
      TV: "Tuvalu",
      UG: "Uganda",
      UA: "Ukraine",
      AE: "United Arab Emirates",
      GB: "United Kingdom",
      UM: "United States Minor Outlying Islands",
      UY: "Uruguay",
      UZ: "Uzbekistan",
      VU: "Vanuatu",
      VE: "Venezuela",
      VN: "Vietnam",
      VG: "Virgin Islands, British",
      VI: "Virgin Islands, U.S.",
      WF: "Wallis and Futuna",
      EH: "Western Sahara",
      YE: "Yemen",
      ZM: "Zambia",
      ZW: "Zimbabwe"
    },
    remove = function(name, clean) {
      var _debug = false;
      if (_debug) {
        console.log('[vm.remove]', name, 'clean:', clean, '<------');
      }
      clean = clean || false;
      if (typeof views[name] !== "undefined") {
        views[name].undelegateEvents();
        if (typeof views[name].clean === "function") {
          views[name].clean();
        }
        if (clean) {
          if (typeof views[name].removeContent === "function") {
            views[name].removeContent();
          }
        }
      }
    },
    create = function(context, name, View, options) {
      // View clean up isn't actually implemented yet but will simply call .clean, .remove and .unbind
      // console.log('[vm] create *****', name);

      remove(name);
      if (!View) {
        return null;
      }
      var view = new View(options);
      views[name] = view;
      if (context) {
        if (typeof context.children === "undefined") {
          context.children = {};
          context.children[name] = view;
        } else {
          context.children[name] = view;
        }
      }
      Events.trigger("viewCreated");
      return view;
    },
    // Convert all key to lowercase
    toLower = function(obj, skipKey) {
      if (_.isNull(obj)) {
        // Is this is null, no need to convert
        return;
      }
      var keys = Object.keys(obj),
        n = keys.length;
      while (n--) {
        var key = keys[n],
          keyLower = key.toLowerCase();
        if (key !== keyLower) {
          obj[keyLower] = obj[key];
          delete obj[key];
        }
        if (typeof obj[keyLower] === "object") {
          // Validation need to match exactly with the name of the input
          if (
            keyLower === "validation" ||
            keyLower.search(/^values-*/) !== -1 ||
            keyLower === "events" ||
            keyLower === "configuration"
          ) {
            continue;
          } else if (
            typeof skipKey !== "undefined" &&
            ((!_.isArray(skipKey) && keyLower === skipKey) ||
              (_.isArray(skipKey) && _.indexOf(skipKey, keyLower) > -1))
          ) {
            continue;
          }
          if ("copyvaluesfrom" === keyLower && _.isArray(obj[keyLower])) {
            // console.log('- keyLower:', keyLower, ' obj[key]:', JSON.stringify(obj[keyLower]));
            continue;
          }
          this.toLower(obj[keyLower]);
        }
      }
    },
    // Parse HTML Code to normal text
    decodeHtml = function(obj) {
      if (obj.fields) {
        _.each(obj.fields, function(value, key) {
          if (typeof value === "object") {
            return;
          }
          var _value = _.unescape(value);
          obj.fields[key] = _value.replace(/&#39;/g, "'");
        });
      }
    },
    // Change Language
    changeLanguage = function(obj, language) {
      var self = this;
      _.each(obj, function(element) {
        if (
          element.description &&
          element.languages &&
          element.languages[language]
        ) {
          element.description = element.languages[language];
        }
        switch (element.type.toLowerCase()) {
          case "radio":
          case "select":
            if (element["values-" + language]) {
              element.values = element["values-" + language];
            }
            if (
              element.options &&
              typeof element.options.defaulttext === "object"
            ) {
              element.description = element.options.defaulttext[language];
            } else if (element.options && element.options.defaulttext) {
              element.description = element.options.defaulttext;
            }
            break;
          case "list":
            if (element.fields) {
              self.changeLanguage(element.fields, language);
            }
            break;
        }
      });
    },
    // Get Country from 2 Digit Code
    getCountry = function(code) {
      return countries[code];
    };
  return {
    create: create,
    remove: remove,
    toLower: toLower,
    decodeHtml: decodeHtml,
    changeLanguage: changeLanguage,
    getCountry: getCountry
  };
});
