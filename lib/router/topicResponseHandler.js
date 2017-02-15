/**
 * Function which handles the response according to the promise returned by the topic
 *
 * @param {function} fn Function which returns a promise returned by a topic request
 */
module.exports = function handlePromiseResponse(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res))
      .then(function(result) {
        res.json(result);
      }).catch(next);
  };
};