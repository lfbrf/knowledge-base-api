import { UserController } from '../controllers/user.controller'
import { Request, Response } from 'express'

describe('User Controller', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let json: jest.Mock
  let status: jest.Mock
  let controller: UserController

  beforeEach(() => {
    json = jest.fn()
    status = jest.fn(() => ({ json }))
    req = {}
    res = { status, json }
    controller = new UserController()
  })

  it('should return 400 if missing fields on create', async () => {
    req.body = {}
    await controller.create(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(400)
  })

  it('should create a user successfully', async () => {
    req.body = { name: 'Test', email: 'test@example.com', role: 'Admin' }
    await controller.create(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test', email: 'test@example.com', role: 'Admin' }))
  })

  it('should return 404 if user not found', async () => {
    req.params = { id: 'notfound' }
    await controller.get(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: 'User not found' })
  })

  it('should get a user after creation', async () => {
    req.body = { name: 'Test2', email: 'test2@example.com', role: 'Viewer' }
    await controller.create(req as Request, res as Response)
    const user = json.mock.calls[0][0]
    req.params = { id: user.id }
    await controller.get(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test2', email: 'test2@example.com', role: 'Viewer' }))
  })

  it('should list users', async () => {
    await controller.list(req as Request, res as Response)
    expect(json).toHaveBeenCalledWith(expect.any(Array))
  })

  it('should delete a user successfully', async () => {
    req.body = { name: 'ToDelete', email: 'del@example.com', role: 'Editor' }
    await controller.create(req as Request, res as Response)
    const user = json.mock.calls[0][0]
    req.params = { id: user.id }
    await controller.delete(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(204)
  })

  it('should return 404 when deleting a non-existent user', async () => {
    req.params = { id: 'notfound' }
    await controller.delete(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: expect.any(String) })
  })
})