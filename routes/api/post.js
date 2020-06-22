const router = require('express').Router();


//@route GET api/post
//@desc Test route
//@access Public
router.get('/', (req, res, next) => {
    res.send('post routes');
});

module.exports = router;