import { ResourceController } from '../controllers/resource.controller'
import { Request, Response } from 'express'
import * as resourceServiceModule from '../services/resource.service'

jest.mock('../services/resource.service', () => ({
  resourceService: {
    create: jest.fn((body) => ({ ...body, id: 'r1' })),
    get: jest.fn((id) => id === 'r1' ? { id, url: 'http://get.com', type: 'article' } : null),
		update: jest.fn((id, body) => id === 'r1' ? { id: 'r1', ...body } : null),
    delete: jest.fn((id) => id === 'r1'),
  }
}))

jest.mock('../services/topic.service', () => ({
  topicService: {
    get: jest.fn((id) =>
      id ? { id, name: 'Mocked topic', content: '', createdAt: '', updatedAt: '', version: 1 } : null
    ),
    update: jest.fn((id, data) => ({ id, ...data, version: 2 })),
  }
}))

describe('Resource Controller', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let json: jest.Mock
  let status: jest.Mock
  let controller: ResourceController
	let updateSpy: jest.SpyInstance
	let createSpy: jest.SpyInstance

	beforeEach(() => {
		json = jest.fn()
		status = jest.fn(() => ({ json }))
		req = {}
		res = { status, json }

		updateSpy = jest.spyOn(resourceServiceModule.resourceService, 'update').mockImplementation((id: string, body: any) => {
			return id === 'r1' ? { id: 'r1', ...body } : null
		})
    createSpy = jest.spyOn(resourceServiceModule.resourceService, 'create').mockImplementation((body: any) => {
      return { ...body, id: 'r1' }
    })
		
		controller = new ResourceController()

	})
  afterEach(() => {
    updateSpy.mockRestore()
    createSpy.mockRestore()
  })

  it('should return 400 if missing fields on create', async () => {
    createSpy.mockImplementationOnce(() => {
      throw new Error('Missing required fields')
    })

    req.body = { topicId: '1', url: 'http://test.com', description: 'desc', type: 'pdf' }
    await controller.create(req as Request, res as Response)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ error: 'Missing required fields' })
  })

  it('should create a resource successfully', async () => {
    req.body = { topicId: '1', url: 'http://test.com', description: 'desc', type: 'pdf' }
    await controller.create(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ url: 'http://test.com', type: 'pdf' }))
  })

  it('should return 404 if resource not found', async () => {
    req.params = { id: 'notfound' }
    await controller.get(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: 'Resource not found' })
  })

  it('should get a resource after creation', async () => {
    req.body = { topicId: '2', url: 'http://get.com', description: 'desc', type: 'article' }
    await controller.create(req as Request, res as Response)
    const resource = json.mock.calls[0][0]
    req.params = { id: resource.id }
    await controller.get(req as Request, res as Response)
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ url: 'http://get.com', type: 'article' }))
  })

  it('should update a resource', async () => {
    req.body = { topicId: '3', url: 'http://update.com', description: 'desc', type: 'video' }
    await controller.create(req as Request, res as Response)
    const resource = json.mock.calls[0][0]
    req.params = { id: resource.id }
    req.body = { description: 'updated desc' }
    await controller.update(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ description: 'updated desc' }))
  })

  it('should return 404 when updating non-existent resource', async () => {  
    updateSpy.mockImplementationOnce(() => {
      throw new Error('Resource not found')
    })
    req.params = { id: 'notfound' }
    req.body = { description: 'desc' }
    await controller.update(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: expect.any(String) })
  })

  it('should delete a resource', async () => {
    req.body = { topicId: '4', url: 'http://del.com', description: 'desc', type: 'pdf' }
    await controller.create(req as Request, res as Response)
    const resource = json.mock.calls[0][0]
    req.params = { id: resource.id }
    await controller.delete(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(204)
  })

  it('should return 404 when deleting non-existent resource', async () => {
    req.params = { id: 'notfound' }
    await controller.delete(req as Request, res as Response)
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ error: expect.any(String) })
  })
})