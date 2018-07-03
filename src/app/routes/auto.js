const express = require('express');
const router = express.Router();

// Strip .html and .htm if provided
router.get(/\.html?$/i, function (req, res) {
  var path = req.path;
  var parts = path.split('.');
  parts.pop();
  path = parts.join('.');
  res.redirect(path);
});

// Auto render any view that exists
// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// or /app/views/text/index.html
// App folder routes get priority
router.get(/^\/([^.]+)$/, function (req, res) {
  var path = (req.params[0]);
  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/index', function (err2, html) {
        if (err2) {
          res.status(404).send(err + '<br>' + err2);
        } else {
          res.end(html);
        }
      })
    } else {
      res.end(html);
    }
  });
});

// Redirect all POSTs to GETs - this allows users to use POST for autoStoreData
// router.post(/^\/([^.]+)$/, function (req, res) {
//   res.redirect('/' + req.params[0]);
// });

module.exports = router;