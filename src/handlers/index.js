import winston from "winston";
import lodash from "lodash";

const getRoot = (req, res) => res.json({
  status: "OK",
  data: {
    communities: "/api/v1/communities",
  },
});

// Send response according to status code
function sendResponseData(res, statusCode, responseData, responseKeys) {
  // Set response status code
  res.status(statusCode);

  // Filter object by give keys
  const filterFunc = (value, key) => responseKeys.indexOf(key) > -1;
  const filterByKeys = obj => lodash.pickBy(obj, filterFunc);

  // Return default response according to status code
  switch (statusCode) {
    case 200:
    case 201: {
      // Return response with no data
      if (responseData === null || responseData === undefined) {
        return res.json({ status: "OK" });
      }

      // Filter data with given keys
      let filteredResponse = responseData;
      if (Array.isArray(responseKeys)) {
        if (Array.isArray(responseData)) {
          // Filter each object in responseData array
          responseData.forEach((entry, index) => {
            filteredResponse[index] = filterByKeys(entry);
          });
        } else {
          // Filter responseData object
          filteredResponse = filterByKeys(filteredResponse);
        }
      }

      // Return response with data
      return res.json({ status: "OK", data: filteredResponse });
    }
    case 404:
      // Return not found response
      return res.json({ status: "Not found" });
    case 400:
      // Return error response
      return res.json({ status: "ERROR" });
    default:
      winston.error(`Logical error: status ${statusCode} not managed`);
      throw new Error("Logical error");
  }
}

export default { getRoot, sendResponseData };
