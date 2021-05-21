const User = require('../auth/auth-model')

const checkPayload = (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        next({
            status: 401, 
            message: 'username and password required'
        })
    } else {
        next()
    }
}

const checkUniqueName = async (req, res, next) => {
    const { username } = req.body
    const existingName = await User.findBy({username})

    if (existingName.length) {
        next({
            status: 422,
            message: 'username taken'
        })
    } else {
        next()
    }
}



module.exports = {checkPayload, checkUniqueName}