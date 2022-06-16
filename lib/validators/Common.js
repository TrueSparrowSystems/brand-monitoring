const BigNumber = require('bignumber.js');

const { decode } = require('html-entities');

const rootPrefix = '../..';

/**
 * Class for common validators.
 *
 * @class CommonValidator
 */
class CommonValidator {
  /**
   * Is valid Boolean?
   *
   * @param {string} str
   *
   * @returns {boolean}
   */
  static validateBoolean(str) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(str)) {
      return false;
    }

    return str === 'true' || str === 'false' || str === true || str === false;
  }

  /**
   * Is var null or undefined?
   *
   * @param {object/string/integer/boolean} variable
   *
   * @returns {boolean}
   */
  static isVarNullOrUndefined(variable) {
    return typeof variable === 'undefined' || variable == null;
  }

  /**
   * Is var null?
   *
   * @param  variable
   *
   * @returns {boolean}
   */
  static isVarNull(variable) {
    return variable == null;
  }

  /**
   * Is var undefined?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static isVarUndefined(variable) {
    return typeof variable === 'undefined';
  }

  /**
   * Is var not blank or null?
   *
   * @param {array<string>} variable
   *
   * @returns {boolean}
   */
  static validateNonBlankString(variable) {
    return CommonValidator.validateNonBlankStringArray([variable]);
  }

  /**
   * Is var not blank or null
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateNonBlankStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        const variable = array[index];
        if (
          CommonValidator.isVarNullOrUndefined(variable) ||
          !CommonValidator.validateString(variable) ||
          variable == ''
        ) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Is var true?
   *
   * @param {boolean|string} variable
   *
   * @returns {boolean}
   */
  static isVarTrue(variable) {
    return variable === true || variable === 'true';
  }

  /**
   * Is var false?
   *
   * @param {boolean|string} variable
   *
   * @returns {boolean}
   */
  static isVarFalse(variable) {
    return variable === false || variable === 'false';
  }

  /**
   * Is var integer?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateInteger(variable) {
    try {
      const variableInBn = new BigNumber(String(variable));
      // Variable is integer and its length is less than 37 digits
      if (variableInBn.isInteger() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (e) {}

    return false;
  }

  /**
   * Is var float?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateFloat(variable) {
    try {
      const variableInBn = new BigNumber(String(variable));
      // Variable is float and its length is less than 37 digits
      if (!variableInBn.isNaN() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (e) {}

    return false;
  }

  /**
   * Is integer non zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateNonZeroInteger(variable) {
    const oThis = this;

    if (oThis.validateInteger(variable)) {
      return Number(variable) > 0;
    }

    return false;
  }

  /**
   * Is float non zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateNonZeroFloat(variable) {
    const oThis = this;

    if (oThis.validateFloat(variable)) {
      return Number(variable) > 0;
    }

    return false;
  }

  /**
   * Is string valid ?
   *
   * @param variable
   *
   * @returns {boolean}
   */
  static validateString(variable) {
    return typeof variable === 'string';
  }

  /**
   * Checks if the given string starts with 0x.
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateHexString(variable) {
    return /^0x[a-z0-9]{1,}$/i.test(variable);
  }

  /**
   * Is var a string containing only alphabets?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateAlphaString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }

    return /^[a-z]+$/i.test(variable);
  }

  /**
   * Is var a string containing only alphabets?
   *
   * @param {string} string
   * @param {number} requiredLength
   *
   * @returns {boolean}
   */
  static validateStringLength(string, requiredLength) {
    const trimmedString = string.trim();
    const decodedString = decode(trimmedString);

    return decodedString.length <= requiredLength;
  }

  /**
   * Validate allowed characters in string.
   *
   * @param {string} string
   *
   * @returns {boolean}
   */
  static validateNameAllowedCharacters(string) {
    if (CommonValidator.validateNonEmptyString(string)) {
      const trimmedString = string.trim();
      const decodedString = decode(trimmedString);

      return /^[^{}%]+$/i.test(decodedString);
    }

    return false;
  }

  /**
   * Validate string input length
   *
   * @param {string} string
   * @param {number} maxLength
   *
   * @returns {boolean}
   */
  static validateTextInputLength(string, maxLength) {
    let decodedString = decode(string) || '';
    decodedString = decodedString.replace(/\r?\n|\r/g, ' ');

    return decodedString.length <= maxLength;
  }

  /**
   * Is valid Boolean number?
   *
   * @param {boolean} bool
   *
   * @returns {boolean}
   */
  static validateBooleanFlag(bool) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(bool)) {
      return false;
    }

    return bool === 1 || bool === 0 || bool === '1' || bool === '0';
  }

  /**
   * Validate location latitude value.
   *
   * @param {number|string} latitude
   *
   * @returns {boolean}
   */
  static validateLocationLatitude(latitude) {
    const latitudeInBn = new BigNumber(String(latitude));

    return isFinite(latitudeInBn) && Math.abs(latitudeInBn) <= 90;
  }

  /**
   * Validate location longitude value.
   *
   * @param {number|string} longitude
   *
   * @returns {boolean}
   */
  static validateLocationLongitude(longitude) {
    const longitudeInBn = new BigNumber(String(longitude));

    return isFinite(longitudeInBn) && Math.abs(longitudeInBn) <= 180;
  }

  /**
   * Is valid one value?
   *
   * @param {boolean} bool
   *
   * @returns {boolean}
   */
  static validateTruthyBoolean(bool) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(bool)) {
      return false;
    }

    return bool === 1 || bool === '1';
  }

  /**
   * Validate if string has stop words.
   *
   * @param {string} string
   *
   * @return {boolean}
   */
  static validateCussWords(string) {
    if (typeof string !== 'string') {
      return false;
    }

    const commonListOfCussWords =
      'anal|anus|arse|ballsack|bitch|biatch|blowjob|blow job|bollock|bollok|boner|boob|bugger|bum|buttplug|clitoris|cock|coon|crap|cunt|dick|dildo|dyke|fag|feck|fellate|fellatio|felching|fuck|f u c k|fudgepacker|fudge packer|flange|Goddamn|God damn|homo|jerk|jizz|Kike|knobend|knob end|labia|muff|nigger|nigga|penis|piss|poop|prick|pube|pussy|scrotum|shit|s hit|sh1t|slut|smegma|tit|tosser|turd|twat|vagina|wank|whore|porn|butt';

    const reg_ex = new RegExp(`\\b(?:${commonListOfCussWords}\\b)`, 'i');

    return !reg_ex.test(string);
  }

  /**
   * Validate if string has stop words.
   *
   * @param {string} string
   *
   * @return {boolean}
   */
  static validateReservedWords(string) {
    if (typeof string !== 'string') {
      return false;
    }

    const reg_ex = /^(?:clients|admin|messaging|terms|privacy|__proto__|data-processing-agreement|faq|api|connect|signin|sign-in|login|facebook|instagram|signup|sign-up|link-account|forgot-password|reset-password|verify-email|edit-profile|classes|class|book|cart|order|carts|orders|meeting|meetings|studio|studios|cancel|home|connect-as-instructor|browse-studios|browse|instructors|about|purchases|disconnect|logout|plan|music|invite|me)$/i;

    return !reg_ex.test(string);
  }

  /**
   * Is var a string containing alpha numeric chars?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateAlphaNumericString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }

    return /^[a-z0-9]+$/i.test(variable);
  }

  /**
   * Is var a string containing alpha numeric chars ?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateAlphaNumericCommonSpecialCharString(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable)) {
      return false;
    }

    return /^[a-z0-9\_]+$/i.test(variable);
  }

  /**
   * Is string ordering?
   *
   * @param {string} str
   *
   * @returns {boolean}
   */
  static validateOrderingString(str) {
    return ['asc', 'desc'].includes(str.toLowerCase());
  }

  /**
   * Is valid integer array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateInteger(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Is valid non zero integer array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateNonZeroIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateNonZeroInteger(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate and sanitize non zero integer array
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateAndSanitizeNonZeroIntegerArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        const arrayElement = array[index];

        if (!CommonValidator.validateNonZeroInteger(arrayElement)) {
          return false;
        }

        array[index] = Number(arrayElement);
      }

      return true;
    }

    return false;
  }

  /**
   * Is valid UUIDv4 array?
   *
   * @param {array} array
   *
   * @returns {boolean}
   */
  static validateUuidV4Array(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateUuidV4(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   *  Is valid array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
  static validateArray(array) {
    return Array.isArray(array);
  }

  /**
   *  Is valid non-empty array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
  static validateNonEmptyArray(array) {
    return Array.isArray(array) && array.length > 0;
  }

  /**
   *  Is valid non-empty string array?
   *
   *  @param {array} array
   *
   *  @returns {boolean}
   */
  static validateNonEmptyStringArray(array) {
    const oThis = this;

    if (oThis.validateNonEmptyArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (typeof array[index] !== 'string') {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check uuid v4 validation.
   *
   * @param {string} uuid
   *
   * @returns {boolean}
   */
  static validateUuidV4(uuid) {
    const oThis = this;

    if (!oThis.isVarNullOrUndefined(uuid) && typeof uuid === 'string') {
      return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid);
    }

    return false;
  }

  /**
   * Check if timestamp is valid or not.
   *
   * @param {string} variable: variable
   *
   * @returns {boolean}
   */
  static validateTimestamp(variable) {
    if (!CommonValidator.validateInteger(variable)) {
      return false;
    }

    return /^[0-9]{10}$/.test(variable);
  }

  /**
   * Check if variable is object and non-empty.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
  static validateNonEmptyObject(variable) {
    if (CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object') {
      return false;
    }

    for (const prop in variable) {
      try {
        if (Object.prototype.hasOwnProperty.call(variable, prop)) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  /**
   * Validate hash array.
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateNonEmptyObjectArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateNonEmptyObject(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate object.
   *
   * @param {object} variable
   *
   * @returns {boolean}
   */
  static validateObject(variable) {
    return !(CommonValidator.isVarNullOrUndefined(variable) || typeof variable !== 'object');
  }

  /**
   * Validate API validateTransactionStatusArray
   *
   * @param {array<string>} array
   *
   * @returns {boolean}
   */
  static validateStringArray(array) {
    if (Array.isArray(array)) {
      for (let index = 0; index < array.length; index++) {
        if (!CommonValidator.validateString(array[index])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Validate non-empty string.
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static validateNonEmptyString(variable) {
    return !!(CommonValidator.validateString(variable) && variable && variable.trim().length !== 0);
  }

  /**
   * Validate next page payload or previous page payload.
   *
   * @param {object} variable
   * @param {object} [variable.limit]
   * @param {string} [variable.page]
   * @param {string} [variable.pagination_timestamp]
   * @param {number} [variable.filter_by_tag_id]
   * @param {string} [variable.page_state]
   * @param {number} [variable.pagination_id]
   *
   * @returns {boolean}
   */
  static validateNextOrPreviousPagePayload(variable) {
    let notValid = false;

    if (!CommonValidator.validateNonEmptyObject(variable)) {
      return false;
    }

    if (variable.page) {
      notValid = notValid || !CommonValidator.validateNonZeroInteger(variable.page);
    }

    if (variable.pagination_timestamp) {
      notValid = notValid || !CommonValidator.validateNonZeroInteger(variable.pagination_timestamp);
    }

    // Cassandra page state value
    if (variable.page_state) {
      notValid = notValid || !CommonValidator.validateString(variable.page_state);
    }

    if (variable.pagination_id) {
      notValid = notValid || !CommonValidator.validateNonZeroInteger(variable.pagination_id);
    }

    return !notValid;
  }

  /**
   * Validate page no.
   *
   * @param {string/number} pageNo
   *
   * @returns {array<boolean, number>}
   */
  static validateAndSanitizePageNo(pageNo) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(pageNo)) {
      return [true, 1];
    }

    if (!pageNo) {
      return [false, 0];
    }

    if (isNaN(parseInt(pageNo))) {
      return [false, 0];
    }

    if (pageNo < 1 || pageNo > 1000) {
      return [false, 0];
    }

    if (parseInt(pageNo) != pageNo) {
      return [false, 0];
    }

    return [true, parseInt(pageNo)];
  }

  /**
   * Validate limit
   *
   * @param {number} limit: limit passed in params
   * @param {number} defaultLimit: default limit
   * @param {number} minAllowedLimit: min allowed
   * @param {number} maxAllowedLimit: max allowed
   *
   * @returns {array<boolean, number>}
   */
  static validateAndSanitizeLimit(limit, defaultLimit, minAllowedLimit, maxAllowedLimit) {
    const oThis = this;

    if (oThis.isVarNullOrUndefined(limit)) {
      return [true, defaultLimit];
    }

    if (!limit) {
      return [false, 0];
    }

    if (isNaN(parseInt(limit))) {
      return [false, 0];
    }

    if (limit < minAllowedLimit || limit > maxAllowedLimit) {
      return [false, 0];
    }

    if (parseInt(limit) != limit) {
      return [false, 0];
    }

    return [true, parseInt(limit)];
  }

  /**
   * Validates a website url is correctly formed
   *
   * @param {string} url
   *
   * @returns {boolean}
   */
  static validateGenericUrl(url) {
    if (url == '') {
      return true;
    }

    if (!CommonValidator.validateString(url)) {
      return false;
    }

    return /^(http(s)?:\/\/)?([a-z0-9-_]{1,256}\.)+[a-z]{2,15}\b([a-z0-9@:%_+.\[\]\-{}!' ",~#?&;/=*]*)$/i.test(url);
  }

  /**
   * Validates a website url is correctly formed
   *
   * @param {string} url
   *
   * @returns {boolean}
   */
  static validateNonEmptyUrl(url) {
    if (url == '') {
      return false;
    }

    return CommonValidator.validateGenericUrl(url);
  }

  /**
   * Validates null or string.
   *
   * @param {string} string
   *
   * @returns {boolean}
   */
  static validateNullString(string) {
    if (CommonValidator.isVarNull(string)) {
      return true;
    }

    return CommonValidator.validateString(string);
  }

  /**
   * Validates a website url is correctly formed
   * NOTE: - mandates 'http' checks.
   *
   * @param {string} details
   *
   * @returns {boolean}
   */
  static validateHttpBasedUrl(details) {
    if (details == '') {
      return true;
    }

    return CommonValidator.validateNonEmptyHttpBasedUrl(details);
  }

  /**
   * Validates a website url is correctly formed.
   * NOTE: - mandates 'http' checks.
   *
   * @param {string} details
   *
   * @returns {boolean}
   */
  static validateNonEmptyHttpBasedUrl(details) {
    if (!CommonValidator.validateString(details)) {
      return false;
    }

    return /^http(s)?:\/\/([a-zA-Z0-9-_@:%+~#=]{1,256}\.)+[a-z]{2,15}\b([a-zA-Z0-9@:%_+.\[\]\-{}!'",~#?&;/=*]*)$/i.test(
      details
    );
  }

  /**
   * Is variable number?
   *
   * @param {number} variable
   *
   * @returns {boolean}
   */
  static validateNumber(variable) {
    try {
      if (typeof variable !== 'string' && typeof variable !== 'number') {
        return false;
      }

      const variableInBn = new BigNumber(String(variable));
      // Variable is number and its length is less than 37 digits
      if (!variableInBn.isNaN() && variableInBn.toString(10).length <= 37) {
        return true;
      }
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  /**
   * Is var a valid email?
   *
   * @param {string} variable
   *
   * @returns {boolean}
   */
  static isValidEmail(variable) {
    return (
      CommonValidator.validateString(variable) &&
      /^[A-Z0-9]+[A-Z0-9_%+-]*(\.[A-Z0-9_%+-]{1,})*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,24}$/i.test(variable)
    );
  }

  /**
   * Is integer zero?
   *
   * @param {string/number} variable
   *
   * @returns {boolean}
   */
  static validateZeroInteger(variable) {
    const oThis = this;

    if (oThis.validateInteger(variable)) {
      return Number(variable) === 0;
    }

    return false;
  }
}

module.exports = CommonValidator;
