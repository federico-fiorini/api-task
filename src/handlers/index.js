import winston from "winston";
import lodash from "lodash";

const getRoot = (req, res) => res.json({ status: "OK" });

// Send response according to status code
function sendResponseData(res, statusCode, responseData, responseKeys) {

  // Set response status code
  res.status(statusCode);

  // Filter object by give keys
  const filterByKeys = (obj) => lodash.pickBy(obj, function(value, key) {
    return responseKeys.indexOf(key) > -1;
  });

  // Return default response according to status code
  switch(statusCode) {
    case 200:
    case 201:
      // Return response with no data
      if (responseData === null || responseData === undefined) {
        return res.json({ status: "OK" });
      }

      // Filter data with given keys
      if (Array.isArray(responseKeys)) {
        if (Array.isArray(responseData)) {
          // Filter each object in responseData array
          responseData.forEach((entry, index, array) => {
            array[index] = filterByKeys(entry);
          });
        } else {
          // Filter responseData object
          responseData = filterByKeys(responseData);
        }
      }

      // Return response with data
      return res.json({ status: "OK", data: responseData });
    case 404:
      // Return not found response
      return res.json({ status: "Not found" });
    case 400:
      // Return error response
      return res.json({ status: "ERROR" });
    default:
      winston.error(`Logical error: status ${statusCode} not managed`);
      throw "Logical error";
  }
}

export default { getRoot, sendResponseData };
