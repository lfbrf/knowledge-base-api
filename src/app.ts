import express from 'express'
import topicRoutes from './routes/topic.routes'
import resourceRoutes from './routes/resource.routes'
import userRoutes from './routes/user.routes'

const app = express()
app.use(express.json())
app.use('/topics', topicRoutes)
app.use('/resources', resourceRoutes)
app.use('/users', userRoutes)

export default app