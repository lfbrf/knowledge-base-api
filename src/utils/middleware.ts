import { Request, Response, NextFunction } from 'express'

export function validateTopic(req: Request, res: Response, next: NextFunction) {
  const { name, content } = req.body
  if (!name || !content) {
    return res.status(400).json({ error: 'Missing required fields: name and content' })
  }
  next()
}