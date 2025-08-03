import { User, Role } from '../models/user.model'
import { v4 as uuid } from 'uuid'

const userDb = new Map<string, User>()

export class UserService {
  create(data: { name: string; email: string; role: Role }) {
    if (!data.name || !data.email || !data.role) throw new Error('Missing required fields')
    const user = new User(uuid(), data.name, data.email, data.role)
    userDb.set(user.id, user)
    return user
  }
  get(id: string) {
    return userDb.get(id) || null
  }
  list() {
    return Array.from(userDb.values())
  }
  delete(id: string) {
    if (!userDb.has(id)) throw new Error('User not found')
    userDb.delete(id)
    return true
  }
}