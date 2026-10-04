/**
 * Standard API response helpers.
 * Always returns: { success, data?, message?, error? }
 */

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'Something went wrong', statusCode = 500, code = null) => {
  const response = { success: false, error: { message } };
  if (code) response.error.code = code;
  return res.status(statusCode).json(response);
};

const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
