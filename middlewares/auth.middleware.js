import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';



export const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");


        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        console.log(user)
        if (!user) {
            return res.status(401).json({
                message: "invalid access token"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "invalid access token",
            error: error.message
        })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);
        if (user.role !== 1) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        } else {
            next();
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}
export const isUser= async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);
        if (user.role !== 0) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        } else {
            next();
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

