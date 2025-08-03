import { validateTopic, validateUser, validateResource } from '../utils/validate'
import { Request, Response, NextFunction } from 'express'

describe('Validation Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock
  let json: jest.Mock
  let status: jest.Mock

  beforeEach(() => {
    json = jest.fn()
    status = jest.fn(() => ({ json }))
    next = jest.fn()
    req = { body: {} }
    res = { status, json }
  })

  it('validateTopic returns 400 if missing fields', () => {
    validateTopic(req as Request, res as Response, next)
    expect(status).toHaveBeenCalledWith(400)
  })

  it('validateUser returns 400 if missing fields', () => {
    validateUser(req as Request, res as Response, next)
    expect(status).toHaveBeenCalledWith(400)
  })

  it('validateResource returns 400 if missing fields', () => {
    validateResource(req as Request, res as Response, next)
    expect(status).toHaveBeenCalledWith(400)
  })

  it('calls next if all fields present', () => {
    req.body = { name: 'A', content: 'B' }
    validateTopic(req as Request, res as Response, next)
    expect(next).toHaveBeenCalled()
  })
})