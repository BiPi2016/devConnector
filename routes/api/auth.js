const router = require('express').Router();
const auth = require('../../util/auth');
const User = require('../../models/User.model');


//@route GET api/auth
//@desc Test route
//@access Public
router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json('Server error');
    }
    res.send('auth routes');
});

module.exports = router;