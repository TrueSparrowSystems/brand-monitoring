/**
 * Class for response helper messages.
 *
 * @class ResponseHelperMessage
 */
class ResponseHelperMessage {
  /**
   * Get message for invalid param or message missing for an error code.
   *
   * @returns {string}
   */
  get parameterInvalidOrMissingMessage() {
    return 'At least one parameter is invalid or missing. See "err.error_data" array for more details.';
  }

  /**
   * Get message for something_went_wrong error code.
   *
   * @returns {string}
   */
  get somethingWentWrongMessage() {
    return 'Something went wrong.';
  }
}

module.exports = new ResponseHelperMessage();
