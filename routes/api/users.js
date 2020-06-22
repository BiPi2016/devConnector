const router = require('express').Router();


//@route GET api/user
//@desc Test route
//@access Public
router.get('/', (req, res, next) => {
    res.send('user routes');
});

module.exports = router;