import { Request, Response, NextFunction } from 'express'
import { getRoleStrategy } from './role.strategy'
import { User } from '../models/user.model'

export function requireEditPermission(req: Request, res: Response, next: NextFunction) {
  const user = req.header('x-user-role') as string
  const strategy = getRoleStrategy(user || 'Guest')
  if (!strategy.canEdit()) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' })
  }
  next()
}

export function requireDeletePermission(req: Request, res: Response, next: NextFunction) {
  const user = req.header('x-user-role') as string
  const strategy = getRoleStrategy(user || 'Guest')
  if (!strategy.canDelete()) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' })
  }
  next()
}