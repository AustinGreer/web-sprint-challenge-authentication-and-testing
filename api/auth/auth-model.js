const db = require('../../data/dbConfig')

const findBy = (filter) => {
    return db('users')
        .select('users.id', 'users.username', 'users.password')
        .where(filter)
}

const findById = (user_id) => {
    return db('users')
        .select('users.id', 'users.username', 'users.password')
        .where('users.id', user_id)
        .first()
}

const add = async (user) => {
    const id = await db('users').insert(user)
    return findById(id)
}

module.exports = {findBy, findById, add}