const router = require('express').Router();


//@route GET api/profile
//@desc Test route
//@access Public
router.get('/', (req, res, next) => {
    res.send('profile routes');
});

module.exports = router;