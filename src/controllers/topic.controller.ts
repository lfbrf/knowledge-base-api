import { Request, Response } from 'express'
import { topicService } from '../services/topic.service'


export class TopicController {
  createTopic(req: Request, res: Response) {
    const topic = topicService.create(req.body)
    res.status(201).json(topic)
  }

  getTopic(req: Request, res: Response) {
  const topic = topicService.get(req.params.id)
  if (!topic) return res.status(404).json({ error: 'Topic not found' })
  res.json(topic)
  }

  getTopicTree(req: Request, res: Response) {
    const tree = topicService.getTree(req.params.id)
    if (!tree) return res.status(404).json({ error: 'Topic tree not found' })
    res.json(tree)
  }

  updateTopic(req: Request, res: Response) {
    const updated = topicService.update(req.params.id, req.body)
    res.json(updated)
  }

  getTopicVersion(req: Request, res: Response) {
    const version = topicService.getVersion(req.params.id, parseInt(req.params.version))
    if (!version) return res.status(404).json({ error: 'Version not found' })
    res.json(version)
  }

  deleteTopic(req: Request, res: Response) {
    try {
      topicService.delete(req.params.id)
      res.status(204).send()
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }  

  getShortestPath(req: Request, res: Response) {
    const path = topicService.shortestPath(req.params.fromId, req.params.toId)
    res.json(path)
  }
}
