import express from 'express'
import { TopicController } from '../controllers/topic.controller'
import { validateTopic } from '../utils/middleware'
import { requireDeletePermission, requireEditPermission } from './middleware'

const router = express.Router()
const controller = new TopicController()

router.post('/', validateTopic, controller.createTopic)
router.get('/:id', controller.getTopic)
router.get('/:id/tree', controller.getTopicTree)
router.put('/:id', requireEditPermission, controller.updateTopic)
router.get('/:id/version/:version', controller.getTopicVersion)
router.get('/path/:fromId/:toId', controller.getShortestPath)
router.delete('/:id', requireDeletePermission, controller.deleteTopic)


export default router
