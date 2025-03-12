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
        callbackURL: "",
    },
    async(req,accessToken, refreshToken, profile,done)=>{
        try {
            const role = req.query.state
            if (!role || !["designer", "customer"].includes(role)) {
                const appError = new AppError("Google auth failed, provide role", "failed", 400)
                throw appError 
             }
            const existingCustomer = await Customer.findOne({where:{email:profile.emails[0].value}})
            const existingDesigner = await Designer.findOne({where:{email:profile.emails[0].value}})
          
            if (role==="customer" && !existingCustomer) {
                const id = uuid().v4
                const newCustomer =  await Customer.create({
                    email: profile.emails[0].value,
                    id,
                    name: profile.displayName,
                    role
                })
                const token = signJwt({
                    email:profile.emails[0].value,
                    role:role,
                    id:id,
                    name:profile.displayName

                })
                const user ={email:newCustomer.email,id:newCustomer.id,role:newCustomer.role,name:newCustomer.name}
                return done(null,{user,token})

            } else if (role==="designer" && !existingDesigner){

                const id = uuid().v4
                const newDesigner =  await Designer.create({
                    email: profile.emails[0].value,
                    id,
                    name: profile.displayName,
                    role
                })
                const token = signJwt({
                    email:profile.emails[0].value,
                    role:role,
                    id:id,
                    name:profile.displayName

                })
                const user ={email:newDesigner.email,id:newDesigner.id,role:newDesigner.role,name:newDesigner.name}
                return done(null,{user,token})

            } else {
                const id = existingCustomer.id || existingDesigner.id
                const role = existingCustomer.role || existingDesigner.role

                const user ={
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    id,
                    role
                }
                const token = signJwt(user)
                return done(null,{user,token})
            }
          
         }
         catch (error) {
            console.log(error)
            return done(error, false)
        }
    }
)
)