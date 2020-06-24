const router = require("express").Router();
const User = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');
const gravatar = require("gravatar");
const {
    check,
    validationResult
} = require("express-validator");

//@route GET api/user
//@desc Test route
//@access Public
router.get("/", (req, res, next) => {
    return res.send("user routes");
});

//@route POST api/user
//@desc Register a new user
//@access Public
router.post(
    "/",
    [
        check("name")
        .not()
        .isEmpty()
        .withMessage("Name is required")
        .trim()
        .escape(),
        check("email")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),
        check("password")
        .isLength({
            min: 6,
        })
        .withMessage("Password must be 6 or more characters long")
        .trim()
        .escape(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const {
            name,
            email,
            password
        } = req.body;

        try {
            //See if the user exists
            let user = await User.findOne({
                email: email,
            });
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: "User already exists",
                    }, ],
                });
            }

            //Get the user Gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            user = new User({
                name,
                email,
                password,
                avatar,
            });

            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            const payload = {
                user: {
                    id: user.id
                }
            }

            //Return jsonwebtoken
            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                    expiresIn: 36000
                },
                (err, token) => {
                    if (err) throw err;
                    return res.json({
                        token
                    });
                })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server error");
        }
    }
);

module.exports = router;