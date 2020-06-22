const router = require('express').Router();


//@route GET api/auth
//@desc Test route
//@access Public
router.get('/', (req, res, next) => {
    res.send('auth routes');
});

module.exports = router;