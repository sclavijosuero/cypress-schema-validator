## USAGE EXAMPLES FOR ZOD SCHEMAS

### Example: Using `cy.validateSchemaZod` Command

#### `cy.validateSchemaZod()` command with a **Zod Schema**

```js
import { z } from "zod";

const schema = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    age: z.number().int(), // Zod uses `number()` for integers, and `int()` ensures it's an integer.
    email: z.string().email(),
    created_at: z.string().datetime(), // Zod provides `.datetime()` for ISO datetime strings.
    is_active: z.boolean(),
    tags: z.array(z.string()),
    address: z.object({
      street: z.string(),
      city: z.string(),
      postal_code: z.string(),
    }),
    preferences: z
      .object({
        notifications: z.boolean(),
        theme: z.string().optional(), // Optional as it is not marked as required in JSON Schema.
        items_per_page: z.number().int().optional(), // Optional as it is not marked as required.
      })
      .strict(),
  }).strict()
);

it('Test Zod Schema - Schema Simple', () => {
  cy.request('GET', 'https://awesome.api.com/users')
    .validateSchemaZod(schema)
    .then(response => {
      // Further assertions if needed
    });
});
```

#### `cy.validateSchemaZod()` command with a **Zod Schema** and overriding `issuesStyles`

```js
import { z } from "zod";

const schema = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    age: z.number().int(), // Zod uses `number()` for integers, and `int()` ensures it's an integer.
    email: z.string().email(),
    created_at: z.string().datetime(), // Zod provides `.datetime()` for ISO datetime strings.
    is_active: z.boolean(),
    tags: z.array(z.string()),
    address: z.object({
      street: z.string(),
      city: z.string(),
      postal_code: z.string(),
    }),
    preferences: z
      .object({
        notifications: z.boolean(),
        theme: z.string().optional(), // Optional as it is not marked as required in JSON Schema.
        items_per_page: z.number().int().optional(), // Optional as it is not marked as required.
      })
      .strict(),
  }).strict()
);

it('Test Zod Schema - Schema Simple with customStyleErrors', () => {
  const customStyleErrors = { iconPropertyError: '⛔', iconPropertyMissing: '❓' }

  cy.request('GET', 'https://awesome.api.com/users')
    .validateSchemaZod(schema, customStyleErrors)
    .then(response => {
      // Further assertions if needed
    });
});
```

### `cy.validateSchemaAZod()` command with `cy.api()` from Plugin `@bahmutov/cy-api` or `cypress-plugin-api` plugins

```js
import { z } from "zod";

import '@bahmutov/cy-api'
// or
// import 'cypress-plugin-api';

const petstoreSchema = z.array(
  z.object({
    id: z.string().optional(),
    age: z.number(),
    category: z.object({
      id: z.number(),
      name: z.number().optional(),
      color: z.string()
    }).optional(),
    name: z.number(),
    photoUrls: z.array(z.string()).min(2),
    tags: z.array(z.object({
      id: z.number(),
      name: z.string(),
      type: z.string()
    })).optional(),
    status: z.enum(["available", "sold"]).optional()
  })
)

it('should validate the Zod schema for GET findByStatus "pending"', () => {
  
  const findByStatusReq = {
    url: 'https://petstore.swagger.io/v2/pet/findByStatus?status=pending',
    headers: { 'Content-Type': 'application/json' }
  }

  cy.api(findByStatusReq)
    .validateSchemaZod(petstoreSchema)
    .then(response => {
      // Further assertions if needed
    });
});
```
