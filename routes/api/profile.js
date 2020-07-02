const router = require('express').Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile.model');
const User = require('../../models/User.model');


//@route GET api/profile/me
//@desc Gets current user´s profile
//@access Private
router.get('/me', auth, async (req, res, next) => {
    try {
        const profile = await Profile.findOne({
                user: req.user.id
            })
            .populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({
                errors: [{
                    msg: 'No profile found for this user'
                }]
            })
        }
        return res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Server error'
            }]
        })
    }
});

module.exports = router;