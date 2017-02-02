/**
 * Function which handles the response according to the promise returned by the topic
 *
 * @param {Object} res
 * @param {Promise} topicPromise Promise returned by the topic the request was sent to
 */
module.exports = function handlePromiseResponse(fn) {
  return function(req, res) {
    Promise.resolve(fn(req, res))
      .then(function(result) {
        res.json(result);
      }).catch(function(err) {
        res.status(500).json({error: err.message});
      });
  };
};