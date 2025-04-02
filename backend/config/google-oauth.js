const passport  = require("passport")
const {Designer, Customer} = require("../models")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const {signJwt} = require("../middlewares/jwt")
const AppError = require("../utils/appError")
const uuid = require("uuid")

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/callback",
        passReqToCallback: true,
    },
    async(req,accessToken, refreshToken, profile,done)=>{
        try {
            const role = req.session?.role
            if (!profile) {
                return done(new AppError("profile is not defined","failed", 400),false)
            }
            if (!role || !["designer", "customer"].includes(role)) {
                    const appError = new AppError("Google auth failed, provide role", "failed", 400)
                    throw appError 
                 }
                 const username = profile?.displayName || "kerry"
            let existingUser =await (role==="customer" ? Customer.findOne({where:{email:profile.emails[0].value}}):
            Designer.findOne({where:{email:profile.emails[0].value}}))

            if (!existingUser) {
                const id = uuid.v4()
                existingUser = await(role==="customer" ? Customer.create({
                    email : profile.emails[0].value,
                    id,
                    name: username,
                    role
                }):Designer.create({
                    email : profile.emails[0].value,
                    id,
                    name: username,
                    role
                }))
                const token = signJwt({
                            email:profile.emails[0].value,
                            role:role,
                            id:id,
                            name:username
        
                        })
                        const user ={email:existingUser.email,name:existingUser.name,role:existingUser.role,id:existingUser.id}
                        return done(null,{user,token})
                    }
                    const user = {
                        email: existingUser.email,
                        name: existingUser.name,
                        role: existingUser.role,
                        id: existingUser.id
                    }
                    const token = signJwt(user)
                    return done(null,{user,token})
          
         }
         catch (error) {
            console.log(error)
            return done(error, false)
        }
    }
)
)