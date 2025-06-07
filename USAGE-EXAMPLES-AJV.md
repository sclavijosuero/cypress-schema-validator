## USAGE EXAMPLES FOR AJV SCHEMA VALIDATOR

### Example: Using `.validateSchema` Command (or alias **`.validateSchemaAjv()`**)

#### `.validateSchema()` command with a **Plain JSON schema**

```js
describe('API Schema Validation with Plain JSON', () => {
  it('should validate the user data using plain JSON schema', () => {
    const schema = {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "age": { "type": "number" }
      },
      "required": ["name", "age"]
    };

    cy.request('GET', 'https://awesome.api.com/users/1')
      .validateSchema(schema)
      .then(response => {
        // Further assertions if needed
      });
  });
});
```

#### `.validateSchema()` command with a **Plain JSON schema** and overriding `issuesStyles`

```js
describe('API Schema Validation with Plain JSON', () => {
  it('should validate the user data using plain JSON schema', () => {
    const schema = {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "age": { "type": "number" }
      },
      "required": ["name", "age"]
    };

    const customStyleErrors = { iconPropertyError: '⛔', iconPropertyMissing: '❓' }

    cy.request('GET', 'https://awesome.api.com/users/1')
      .validateSchema(schema, undefined, customStyleErrors)  // Note that second argument for AJV schema validation is expected to be 'path',
                                                             // but Plain JSON Schema do not use this argument, so we need to pass undefined
                                                             // as second argument when providing a customStyleErrors
      .then(response => {
        // Further assertions if needed
      });
  });
});
```

#### `.validateSchema()` command with an **OpenAPI 3.0.1 schema** document

```js
describe('API Schema Validation with OpenAPI 3.0.1', () => {
  it('should validate the user data using OpenAPI 3.0.1 schema', () => {
    const schema = {
      "openapi": "3.0.1",
      "paths": {
        "/users/{id}": {
          "get": {
            "responses": {
              "200": {
                "content": {
                  "application/json": {
                    "schema": { "$ref": "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "User": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "age": { "type": "number" }
            },
            "required": ["name", "age"]
          }
        }
      }
    };

    const path = { endpoint: '/users/{id}', method: 'GET', status: 200 };

    cy.request('GET', 'https://awesome.api.com/users/1')
      .validateSchema(schema, path)
      .then(response => {
        // Further assertions if needed
      });
  });
});
```

#### `.validateSchemaAjv()` command with a **Swagger 2.0 schema** document

```js
describe('API Schema Validation with Swagger 2.0', () => {
  it('should validate the user data using Swagger 2.0 schema', () => {
    const schema = {
      "swagger": "2.0",
      "paths": {
        "/users/{id}": {
          "get": {
            "responses": {
              "200": {
                "schema": { "$ref": "#/definitions/User" }
              }
            }
          }
        }
      },
      "definitions": {
        "User": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "age": { "type": "number" }
          },
          "required": ["name", "age"]
        }
      }
    };

    const path = { endpoint: '/users/{id}', method: 'GET', status: 200 };

    cy.request('GET', 'https://awesome.api.com/users/1')
      .validateSchemaAjv(schema, path)
      .then(response => {
        // Further assertions if needed
      });
  });
});
```

#### `.validateSchema()` command with a **Swagger 2.0 schema** document and overriding `issuesStyles`

```js
describe('API Schema Validation with Swagger 2.0', () => {
  it('should validate the user data using Swagger 2.0 schema', () => {
    const schema = {
      "swagger": "2.0",
      "paths": {
        "/users/{id}": {
          "get": {
            "responses": {
              "200": {
                "schema": { "$ref": "#/definitions/User" }
              }
            }
          }
        }
      },
      "definitions": {
        "User": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "age": { "type": "number" }
          },
          "required": ["name", "age"]
        }
      }
    };

    const path = { endpoint: '/users/{id}', method: 'GET', status: 200 };
    const issuesStyles = {
      iconPropertyError: '🔸',
      iconPropertyMissing: '🔴'
  }

    cy.request('GET', 'https://awesome.api.com/users/1')
      .validateSchema(schema, path, issuesStyles)
      .then(response => {
        // Further assertions if needed
      });
  });
});
```

### `.validateSchemaAjv()` command with `cy.api()` from Plugin `@bahmutov/cy-api` or `cypress-plugin-api` plugins

```js
import '@bahmutov/cy-api'
// or
// import 'cypress-plugin-api';

describe('API Schema Validation using cy.api()', () => {
  it('should validate the user data using OpenAPI 3.0.1 schema', () => {
    const schema = {
      "openapi": "3.0.1",
      "paths": {
        "/users/{id}": {
          "get": {
            "responses": {
              "200": {
                "content": {
                  "application/json": {
                    "schema": { "$ref": "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "User": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "age": { "type": "number" }
            },
            "required": ["name", "age"]
          }
        }
      }
    };

    const path = { endpoint: '/users/{id}', method: 'GET', status: 200 };

    cy.api('/users/1')
      .validateSchemaAjv(schema, path)
      .then(response => {
        // Further assertions if needed
      });
  });
});
```
