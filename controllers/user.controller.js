import User from "../models/user.model.js";



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (error) {

    }
}

export const registerUserController = async (req, res) => {

    const { name, email, password, phone } = req.body;

    if ([name, email, password, phone].some((value) => value.trim() === "")) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken ");

        return res.status(201).json({
            message: "User created successfully",
            user: createdUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while creating user",
            error: error.message
        })
    }

}

export const loginUserController = async (req, res) => {

    const { email, password } = req.body;

    if (!(email || password)) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken",accessToken , options)
            .cookie("refreshToken",refreshToken, options)
            .json({
                message: "User logged in successfully",
                user: loggedInUser,
                accessToken,
                refreshToken
            })
    } catch (error) {
        return res.status(500).json({
            message: "Error while logging in user",
            error: error.message
        })
    }

}

export const logoutUserController = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: null
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                message: "User logged out successfully"

            })
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Error while logging out user",
                error: error.message
            })
    }
}


export const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password -refreshToken");
        if(!user){
            return res
            .status(404).json({
                message: "User is not Authneticated"
            })
        }
        return res
        .status(200)
        .json({
            message: "User found successfully",
            user
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            message: "Error while getting user",
            error: error.message
        })
    }
}