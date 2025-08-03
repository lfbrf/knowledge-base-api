# Dynamic Knowledge Base API

## Setup

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
# For coverage
npm run test:coverage
```

## API Endpoints

POST   /topics
PUT    /topics/:id
GET    /topics/:id
GET    /topics/:id/version/:version
GET    /topics/:id/tree
GET    /topics/path/:from/:to

## Authentication & Authorization

- Pass a header `x-user-id` with your user ID.
- User roles: Admin, Editor, Viewer.
- Permissions are enforced using a Strategy pattern.
- Only Admins can edit and delete topics. Editors can edit, but not delete. Viewers can only read.

## Persistence

- By default, data is stored in `src/db/db.json` (file-based).
- To use in-memory storage, change the DB implementation in `src/app.ts`.

## Validation

- All create/update endpoints validate required fields.

## Error Handling

- All endpoints return standardized error responses.

## Test Coverage

- Run `npm run test:coverage` to see the coverage report.

## Integration tests

- Run `npx newman run src/tests/integration/Topic.postman_collection.json` to run one collection
- Check on tests/integration to see all avaliable collections

- Run `npm run integration-test` to run all tests