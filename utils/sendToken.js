import jwt from "jsonwebtoken"

export const sendToken = (user,statusCode,res,message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    const option = {
        expiresIn: new Date(Date.now() + 60 * 1000),
        httpOnly: true,
        secure:true
        
    }
    res.status(statusCode).cookie("token",token,option).json({
        success: true,
        message,
        user
     })
}