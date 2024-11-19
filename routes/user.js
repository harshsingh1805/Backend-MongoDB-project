const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User , Course } = require('../db/index')
const jwt = require('jsonwebtoken');
const {JWT_SECRET}= require('../config')
// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username : username,
        password : password
    })
    .then(()=>{
        res.json({ message: 'User created successfully' })
    })
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const validate = await Admin.findOne({
        username : username,
        password: password
    })

    if(user){
        const token = jwt.sign({
            username
        },JWT_SECRET);
        res.json({
            token
        })
    }

    else{
        res.status(411).json({
            msg : "incorrect user or password !"
        })
    }
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({})
    res.json({
        courses : response
    })

});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;  //directly passed the date from usermiddlware an dwe accessed through req object
    User.updateOne({
        username : username
    },
    {
        "$push" : {
            purchasedCourses : courseId
        }
    })
    res.json({
        msg : "Purchase complete"
    })
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username : req.headers.username
    })
    const courses = await Course.findOne({
        _id : {
            "in" : user.purchasedCourses
        }
    })

});

module.exports = router