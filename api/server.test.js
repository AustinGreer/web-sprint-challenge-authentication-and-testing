const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const bcrypt = require('bcryptjs');

beforeAll(async()=>{
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async()=>{
  await db("users").truncate();
});
afterAll(async()=>{
  await db.destroy();
})


// test('sanity', () => {
//   expect(true).toBe(false)
// })

// testing register endpoint
describe('[POST] /api/auth/register', () => {
  it('sends error when there is no username', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({password: 'foobar'})
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch('username and password required')
  })

  it('successfully adds user to database when username and password are correctly filled out', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({username: 'Thor', password: 'ThunderBird8798'})

    let currentUsers = await db('users')
    expect(res.status).toBe(201)
    expect(currentUsers).toHaveLength(1)
  })
})

// testing login endpoint
describe('[POST] /api/auth/login', () => {
  beforeAll(async () => {
    request(server)
      .post('/api/auth/register')
      .send({username: 'Thor', password: 'ThunderBird8798'})
  })

  test('sends error when missing a username', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({password: 'ThunderBird8798'})

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch('username and password required')
  })

  test('sends error when using incorrect password', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({username: 'Thor', password: 'Jane1234'})

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch('invalid credentials')
  })
})