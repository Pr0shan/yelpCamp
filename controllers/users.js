const User = require('../models/user')

module.exports.registerForm = (req,res)=>{
    res.render('users/register')
}
module.exports.registerUser = async(req,res,next)=>{
    try {
        const {email , username , password} = req.body;
        const user = new User({email , username})
        const registeredUser = await User.register(user , password);
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash('success','welcome')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}
module.exports.loginForm = (req,res)=>{
    res.render('users/login')
}
module.exports.loginUser = async(req,res)=>{
    req.flash('success', 'welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect('/campgrounds')
}
module.exports.logout = (req, res, next)=> {
    req.logout(err=> {
        if (err) return next(err)
        req.flash('success','Logged Out Successfully')
        res.redirect('/campgrounds');
    });
}