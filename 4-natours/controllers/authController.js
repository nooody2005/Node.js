const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');


exports.signup = catchAsync(async (req,res,next) => {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
                //jwt.sign({payload},secret);
    const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});

    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser,
        }
    });
});