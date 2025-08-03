import { Request, Response } from 'express'
import { resourceService } from '../services/resource.service'
import { topicService } from '../services/topic.service'

export class ResourceController {
  create(req: Request, res: Response) {
    try {
      const { topicId } = req.body
      const topic = topicService.get(topicId)
      if (!topic) {
        return res.status(404).json({ error: 'Parent topic not found' })
      }
      const resource = resourceService.create(req.body)
      res.status(201).json(resource)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }
  get(req: Request, res: Response) {
    const resource = resourceService.get(req.params.id)
    if (!resource) return res.status(404).json({ error: 'Resource not found' })
    res.json(resource)
  }
  update(req: Request, res: Response) {
    try {
      const resource = resourceService.update(req.params.id, req.body)
      res.json(resource)
    } catch (e: any) {
      res.status(404).json({ error: e.message })
    }
  }
  delete(req: Request, res: Response) {
    try {
      resourceService.delete(req.params.id)
      res.status(204).send()
    } catch (e: any) {
      res.status(404).json({ error: e.message })
    }
  }
  listByTopic(req: Request, res: Response) {
    res.json(resourceService.listByTopic(req.params.topicId))
  }
}