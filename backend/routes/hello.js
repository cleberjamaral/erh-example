const router = require('express').Router();

router.route('/').get((req, res, next) => {
  try {
    res.json({ text: 'Hello from the api!' })
  } catch (err) {
    next(err)
  }
});

module.exports = router;
