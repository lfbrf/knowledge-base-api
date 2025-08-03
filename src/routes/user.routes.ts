import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { validateUser } from '../utils/validate'

const router = Router()
const controller = new UserController()

router.post('/', validateUser, controller.create)
router.get('/:id', controller.get)
router.get('/', controller.list)
router.delete('/:id', controller.delete)

export default router