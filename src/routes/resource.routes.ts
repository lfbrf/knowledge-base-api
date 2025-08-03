import { Router } from 'express'
import { ResourceController } from '../controllers/resource.controller'
import { validateResource } from '../utils/validate'


const router = Router()
const controller = new ResourceController()

router.post('/', validateResource, controller.create)
router.get('/:id', controller.get)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.get('/topic/:topicId', controller.listByTopic)

export default router