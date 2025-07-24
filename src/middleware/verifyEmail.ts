import catchAsync from "../helper/catchAsync";
import userService from "../services/userService";

const verifyEmail = catchAsync(async (req, res, next) => {
    try {
        const user = await userService.getUserByKey({ email: req.body.email });
        if (!user) return res.status(200).json({ error: "user not found" })
        if (user.isActivated) {
            next()
        } else {
            return res.status(400).json({ error: "please check your email to verify account" })
        }
    } catch (error) {
        console.log(error)
    }
})

export default verifyEmail;
