export interface RoleStrategy {
  canEdit(): boolean
  canDelete(): boolean
}

export class AdminStrategy implements RoleStrategy {
  canEdit() { return true }
  canDelete() { return true }
}

export class EditorStrategy implements RoleStrategy {
  canEdit() { return true }
  canDelete() { return false }
}

export class ViewerStrategy implements RoleStrategy {
  canEdit() { return false }
  canDelete() { return false }
}

export function getRoleStrategy(role: string): RoleStrategy {
  switch (role) {
    case 'Admin': return new AdminStrategy()
    case 'Editor': return new EditorStrategy()
    case 'Viewer': return new ViewerStrategy()
    default: return new ViewerStrategy()
  }
}