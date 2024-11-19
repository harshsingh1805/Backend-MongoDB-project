const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin , Course } = require('../db/index')
const jwt = require('jsonwebtoken');
const {JWT_SECRET}= require('../config')
const zod = require('zod')
const titleSchema = zod.string().max(35);
const desSchema = zod.string();
const imglinkSchema = zod.string();
const priceSchema = zod.number();
// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    
    await Admin.create({
        username : username,
        password : password
    })
    
    res.json({ message: 'Admin created successfully' })
  
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

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    
    try {
    
        const titleValidation = titleSchema.safeParse(title);
        const descriptionValidation = desSchema.safeParse(description);
        const imageLinkValidation = imglinkSchema.safeParse(imageLink);
        const priceValidation = priceSchema.safeParse(price);
    
    
        if (!titleValidation.success) throw new Error("Invalid title");
        if (!descriptionValidation.success) throw new Error("Invalid description");
        if (!imageLinkValidation.success) throw new Error("Invalid image link");
        if (!priceValidation.success) throw new Error("Invalid price");
    
        const newCourse = await Course.create({
            title: titleValidation.data,
            description: descriptionValidation.data,
            imageLink: imageLinkValidation.data,
            price: priceValidation.data,
        });
    
     
        res.json({
            message: 'Course created successfully',
            courseId: newCourse._id,
        });
    } catch (err) {
        
        res.status(400).json({ error: err.message || "Invalid Input !!" });
    }
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
    Course.find({})
    .then((data)=>{
        res.json({
            courses : data
        })
    })
});

module.exports = router;