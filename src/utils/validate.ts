import { Request, Response, NextFunction } from 'express'

export function validateTopic(req: Request, res: Response, next: NextFunction) {
  const { name, content } = req.body
  if (!name || !content) {
    return res.status(400).json({ error: 'Missing required fields: name and content' })
  }
  next()
}

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, role } = req.body
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields: name, email, role' })
  }
  next()
}

export function validateResource(req: Request, res: Response, next: NextFunction) {
  const { topicId, url, type } = req.body
  if (!topicId || !url || !type) {
    return res.status(400).json({ error: 'Missing required fields: topicId, url, type' })
  }
  next()
}