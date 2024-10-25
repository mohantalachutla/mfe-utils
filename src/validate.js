import _ from 'lodash'
/**
 * Validate that the given mfeName is a valid Module Federation name.
 * which tests against the following regex: \[^a-zA-Z0-9_]/g\
 * @function validateMfeName
 * @param {string} mfeName - The name of the module federation.
 * @throws {Error} If the mfeName is invalid.
 * @returns {void}
 */
export const validateMfeName = (mfeName) => {
  if (_.isEmpty(mfeName)) {
    throw new Error(`InvalidMfeName: mfe name should not be empty`)
  }
  const reg = new RegExp('[^a-zA-Z0-9_]', 'g')
  if (reg.test(mfeName)) {
    throw new Error(
      `InvalidMfeName: mfe name ${mfeName} should not contain special characters`
    )
  }
}
