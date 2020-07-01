const router = require('express').Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');


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
});

router.post('/signin', [
    check("email").isEmail().withMessage("Provide a valid email"),
    check("password")
    .not()
    .isEmpty()
    .withMessage("You must provide a password")
    .escape()
    .trim(),
    async (req, res, next) => {
        try {
            //Validation results
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.array(),
                });
            }

            //Fetching the user
            const {
                email,
                password
            } = req.body;
            const user = await User.findOne({
                email: email,
            });

            //User not found
            if (!user) {
                return res.status(401).json({
                    errors: [{
                        msg: "Authenication failed, wrond email or password",
                    }, ],
                });
            }

            const isAuthenticUser = await bcrypt.compare(password, user.password);

            //Password not matched
            if (!isAuthenticUser) {
                return res.status(401).json({
                    errors: [{
                        msg: "Authenication failed, wrond email or password",
                    }, ],
                });
            }

            //Match, continue
            const payload = {
                user: {
                    id: user._id
                },
            };

            console.log(payload);
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 3600,
            }, (err, token) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(token);
                return res.status(200).json({
                    token
                });
            });
        } catch (error) {
            //next(error);
            console.log(error);
            res.status(500).send('Server error');
        }
    }
]);

module.exports = router;