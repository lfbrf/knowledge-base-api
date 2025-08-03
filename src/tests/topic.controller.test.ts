import request from 'supertest'
import app from '../app'

describe('Topic API', () => {
  it('creates and retrieves a topic', async () => {
    const res = await request(app).post('/topics').send({ name: 'A', content: 'Intro' })
    expect(res.status).toBe(201)
    const id = res.body.id
    const getRes = await request(app).get(`/topics/${id}`)
    expect(getRes.body.name).toBe('A')
  })

  it('fails to create topic with missing fields', async () => {
    const res = await request(app).post('/topics').send({})
    expect(res.status).toBe(400)
  })

  it('returns 404 for non-existent topic', async () => {
    const res = await request(app).get('/topics/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'Topic not found' })
  })

  it('deletes a topic', async () => {
    const res = await request(app)
      .post('/topics')
      .send({ name: 'ToDelete', content: 'delete me' })
    const id = res.body.id
    const delRes = await request(app)
      .delete(`/topics/${id}`)
      .set('x-user-role', 'Admin')
    expect(delRes.status).toBe(204)
    const getRes = await request(app).get(`/topics/${id}`)
    expect(getRes.status).toBe(404)
    expect(getRes.body).toEqual({ error: 'Topic not found' })
  })

  it('should return 404 for non-existent topic', async () => {
    const res = await request(app).get('/topics/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Topic not found')
  })

  it('should create a topic', async () => {
    const res = await request(app)
      .post('/topics')
      .send({ name: 'Test', content: 'Test content' })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Test')
  })  

  it('forbids delete as Editor', async () => {
    const res = await request(app)
      .post('/topics')
      .send({ name: 'NoDelete', content: 'no delete' })
    const id = res.body.id
    const delRes = await request(app)
      .delete(`/topics/${id}`)
      .set('x-user-role', 'Editor')
    expect(delRes.status).toBe(403)
    expect(delRes.body.error).toBe('Forbidden: insufficient permissions')
  })

  it('forbids delete as Viewer', async () => {
    const res = await request(app)
      .post('/topics')
      .send({ name: 'NoDelete', content: 'no delete' })
    const id = res.body.id
    const delRes = await request(app)
      .delete(`/topics/${id}`)
      .set('x-user-role', 'Viewer')
    expect(delRes.status).toBe(403)
    expect(delRes.body.error).toBe('Forbidden: insufficient permissions')
  })

  it('returns 404 when deleting non-existent topic', async () => {
    const delRes = await request(app)
      .delete('/topics/non-existent-id')
      .set('x-user-role', 'Admin')
    expect(delRes.status).toBe(404)
    expect(delRes.body.error).toBe('Topic not found')
  })

  it('updates a topic and increments version', async () => {
    const res = await request(app)
      .post('/topics')
      .send({ name: 'UpdateMe', content: 'v1' })
    const id = res.body.id
    const updateRes = await request(app)
      .put(`/topics/${id}`)
      .send({ content: 'v2' })
      .set('x-user-role', 'Admin')
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.version).toBe(2)
    expect(updateRes.body.content).toBe('v2')
  })

  it('retrieves a specific version', async () => {
    const res = await request(app)
      .post('/topics')
      .send({ name: 'Versioned', content: 'v1' })
    const id = res.body.id
    await request(app)
      .put(`/topics/${id}`)
      .send({ content: 'v2' })
      .set('x-user-role', 'Admin')
    const v1Res = await request(app).get(`/topics/${id}/version/1`)
    expect(v1Res.status).toBe(200)
    expect(v1Res.body.content).toBe('v1')
    const v2Res = await request(app).get(`/topics/${id}/version/2`)
    expect(v2Res.status).toBe(200)
    expect(v2Res.body.content).toBe('v2')
  })

  it('creates a topic with parentTopicId', async () => {
    const parentRes = await request(app)
      .post('/topics')
      .send({ name: 'Parent', content: 'parent' })
    const parentId = parentRes.body.id
    const childRes = await request(app)
      .post('/topics')
      .send({ name: 'Child', content: 'child', parentTopicId: parentId })
    expect(childRes.status).toBe(201)
    expect(childRes.body.parentTopicId).toBe(parentId)
  })

  it('retrieves topic tree', async () => {
    const rootRes = await request(app)
      .post('/topics')
      .send({ name: 'Root', content: 'root' })
    const rootId = rootRes.body.id
    await request(app)
      .post('/topics')
      .send({ name: 'Child', content: 'child', parentTopicId: rootId })
    const treeRes = await request(app).get(`/topics/${rootId}/tree`)
    expect(treeRes.status).toBe(200)
    expect(treeRes.body.children.length).toBe(1)
    expect(treeRes.body.children[0].parentTopicId).toBe(rootId)
  })

  it('finds shortest path between topics', async () => {
    const aRes = await request(app)
      .post('/topics')
      .send({ name: 'A', content: 'A' })
    const aId = aRes.body.id
    const bRes = await request(app)
      .post('/topics')
      .send({ name: 'B', content: 'B', parentTopicId: aId })
    const bId = bRes.body.id
    const cRes = await request(app)
      .post('/topics')
      .send({ name: 'C', content: 'C', parentTopicId: bId })
    const cId = cRes.body.id
    const pathRes = await request(app).get(`/topics/path/${aId}/${cId}`)
    expect(pathRes.status).toBe(200)
    expect(pathRes.body).toEqual([aId, bId, cId])
  })
})
