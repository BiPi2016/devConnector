const router = require('express').Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile.model');
const User = require('../../models/User.model');
const {
    check,
    validationResult
} = require('express-validator');


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

//@route POST api/profile/me
//@desc Create/Update a profile for current user
//@access Private
router.post('/', [
    auth,
    check('status', 'Status is required')
    .not()
    .isEmpty()
    .trim()
    .escape(),
    check('skills', 'You must fillin at least one skill')
    .not()
    .isEmpty()
    .trim()
    .escape(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            const {
                company,
                website,
                location,
                status,
                skills,
                bio,
                githubusername,
                youtube,
                linkedin,
                facebook,
                twitter,
                instagram
            } = req.body;

            //Build profile object
            const profileFields = {};
            profileFields.social = {};
            profileFields.education = [];
            profileFields.experience = [];

            profileFields.user = req.user.id;
            if (company) profileFields.company = company;
            if (website) profileFields.website = website;
            if (location) profileFields.location = location;
            if (status) profileFields.status = status;
            if (bio) profileFields.bio = bio;
            if (githubusername) profileFields.githubusername = githubusername;
            if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

            //Populate social object
            if (youtube) profileFields.social.youtube = youtube;
            if (linkedin) profileFields.social.linkedin = linkedin;
            if (twitter) profileFields.social.twitter = twitter;
            if (facebook) profileFields.facebook = facebook;
            if (instagram) profileFields.social.instagram = instagram;

            //Populate Experience array

            //Populate Education array

            //Find the profile
            let profile = await Profile.findOne({
                user: req.user.id
            });
            if (profile) {
                //Update an existing user profile and returns the updated version
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                });
                return res.json(profile);
            }
            //Creates new user profile, saves and returns it 
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        } catch (error) {
            next(error);
            /* 
                        console.log(err.message);
                        res.staus(500).json({errors: [{msg: 'Server error'}]}); */
        }
    }
]);

module.exports = router;