import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

const service = new UserService()

export class UserController {
  create(req: Request, res: Response) {
    try {
      const user = service.create(req.body)
      res.status(201).json(user)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }
  get(req: Request, res: Response) {
    const user = service.get(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  }
  list(req: Request, res: Response) {
    res.json(service.list())
  }
  delete(req: Request, res: Response) {
    try {
      service.delete(req.params.id)
      res.status(204).send()
    } catch (e: any) {
      res.status(404).json({ error: e.message })
    }
  }
}