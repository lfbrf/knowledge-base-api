import { BaseEntity } from './base.entity'

export type Role = 'Admin' | 'Editor' | 'Viewer'

export class User extends BaseEntity {
  name: string
  email: string
  role: Role

  constructor(id: string, name: string, email: string, role: Role) {
    super(id)
    this.name = name
    this.email = email
    this.role = role
  }
}
