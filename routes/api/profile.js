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
            if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);

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
            //next(error);
            console.log(error.message);
            return res.status(400).json({
                errors: [{
                    msg: 'Server error'
                }]
            })
        }
    }
]);

//@route GET api/profile/
//@desc Fetchs all profiles
//@access Public
router.get('/', async (req, res, next) => {
    try {
        let profiles = await Profile.find({})
            .populate({
                path: 'user',
                select: 'name avatar'
            });
        return res.json(profiles);
    } catch (error) {
        //next(error);
        console.log(error.message);
        return res.status(400).json({
            errors: [{
                msg: 'Server error'
            }]
        })
    }
});

//@route GET api/profile/user/:userID
//@desc Fetchs a specific profile
//@access Public
router.get('/user/:userID', async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const profile = await Profile.findOne({
                user: userID
            })
            .populate({
                path: 'user',
                select: 'name avatar'
            });
        if (!profile) {
            return res.status(400).json({
                errors: [{
                    msg: 'There is no profile for this user'
                }]
            });
        }
        return res.json(profile);
    } catch (error) {
        //next(error);
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                errors: [{
                    msg: 'There is no profile for this user'
                }]
            });
        }
        return res.status(400).json({
            errors: [{
                msg: 'Server error'
            }]
        })
    }
});

//@route DELETE api/profile/
//@desc Deletes one profile, user and posts
//@access Private
router.delete('/', auth, async (req, res, next) => {
    try {
        //Remove posts by this user

        //Remove profile
        const deltedProfile = await Profile.findOneAndRemove({
            user: req.user.id
        });
        if (!deltedProfile) {
            return res.status(400).json({
                errors: [{
                    msg: 'No matching profile found, it may already have been deleted'
                }]
            });
        }
        //Remove the user
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) {
            return res.status(400).json({
                errors: [{
                    msg: 'No matching user found/User may already have  been deleted'
                }]
            });
        }

        return res.json({
            msg: 'User deleted'
        });

    } catch (error) {
        //next(error);
        console.log(error.message);
        res.status(500).json({
            errors: [{
                msg: 'Server error'
            }]
        });
    }
});
module.exports = router;