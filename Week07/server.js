const fastify = require('fastify')()

// MySQL
fastify.register(require('fastify-mysql'), {
  promise: true,
  host: 'mysql',
  user: 'root',
  database: 'mysql',
  password : '654321'
})

fastify.get('/mysql/user/:id', async (req, reply) => {
  const connection = await fastify.mysql.getConnection()
  const [rows, fields] = await connection.query(
    'SELECT id, username, hash, salt FROM users WHERE id=?', [req.params.id],
  )
  connection.release()
  return rows[0]
})

// MongoDB
fastify.register(require('fastify-mongodb'), {
  forceClose: true,
  auth: {
    username: "root",
    password: "root",
  },
  url: 'mongodb://mongo/admin'
})

fastify.get('/mongo/user/:id', function (req, reply) {
  // Or this.mongo.client.db('mydb').collection('users')
  const users = this.mongo.db.collection('users')

  users.findOne({ id: req.params.id }, (err, user) => {
    if (err) {
      reply.send(err + 'mongo not found')
      return
    }
    reply.send(user + 'no object')
  })
})

// Redis
fastify.register(require('fastify-redis'), { url: 'redis://redis',  password: '123456'})

fastify.get('/redis', (req, reply) => {
  const { redis } = fastify
  redis.get(req.query.key, (err, val) => {
    reply.send(err || val)
  })
})

fastify.get('/redis/post', (req, reply) => {
  const { redis } = fastify
  redis.set(req.query.key, req.query.value, (err) => {
    reply.send(err || { status: 'ok' })
  })
})

// ElasticSearch
// fastify.register(require('fastify-elasticsearch'), { node: 'http://elasticsearch:9200' })

// fastify.get('/elasticsearch/user', async function (req, reply) {
//   const { body } = await this.elastic.search({
//     index: 'tweets',
//     body: {
//       query: { match: { text: req.query.q }}
//     }
//   })

//   return body.hits.hits + ' found by elasticsearch'
// })


fastify.listen(3000, "0.0.0.0", err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})