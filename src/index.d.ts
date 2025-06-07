/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {

      /**
       * Custom command that validates the JSON data in the response body against the provided Plain JSON schema, OpenAP and Swagger document format using the AJV Schema Validator.
       * It is expected to be chained to an API response (from a `cy.request()` or `cy.api()`).
       * Alias: `validateSchemaAjv`.
       *
       * @param {object} schema - The schema to validate against. Supported formats are plain JSON schema, Swagger, and OpenAPI documents. See https://ajv.js.org/json-schema.html for more information.
       * @param {object} [path] - The path object to the schema definition in a Swagger or OpenAPI document. Not required if the schema is a plain JSON schema.
       * @param {string} [path.endpoint] - The endpoint path. Required if the schema is a Swagger or OpenAPI document.
       * @param {string} [path.method] - The HTTP method. If not provided, it will use 'GET'.
       * @param {integer} [path.status] - The response status code. If not provided, it will use 200.
       * @param {object} [issuesStyles] - An object with the icons and HEX colors used to flag the issues.
       * @param {string} [issuesStyles.iconPropertyError] - The icon used to flag the property error.
       * @param {string} [issuesStyles.iconPropertyMissing] - The icon used to flag the missing property.
       * @param {string} [issuesStyles.colorPropertyError] - The HEX color used to flag the property error.
       * @param {string} [issuesStyles.colorPropertyMissing] - The HEX color used to flag the missing property.
       *  
       * @returns {Cypress.Chainable} - The response object wrapped in a Cypress.Chainable.
       * @throws {Error} - If any of the required parameters are missing or if the schema or schema definition is not found.
       *
       * @example
       * ```js
       * cy.request(...).validateSchema(
       *   schema, {
       *     endpoint: '/movies',
       *     method: 'POST'
       *   }
       * )
       * ```
       *
       * You can optionally specify `status`:
       *
       * @example
       * ```js
       * cy.request(...).validateSchema(
       *   schema, {
       *     endpoint: '/movies',
       *     method: 'POST',
       *     status: 201 // Defaults to 200 if not provided
       *   }
       * )
       * ```
       * 
       * You can optionally specify a custom issuesStyles:
       *
       * @example
       * ```js
       * cy.request(...).validateSchema(
       *   schema,
       *   {
       *     endpoint: '/movies',
       *     method: 'POST',
       *     status: 201 // Defaults to 200 if not provided
       *   },
       *   { iconPropertyError: '⛔', iconPropertyMissing: '❓' }
       * )
       * ```
       */
      validateSchema(
        schema: Record<string, any>,
        path?: {
          endpoint: string;
          method?: string;
          status?: number;
        },
        issuesStyles?: {
          iconPropertyError?: string;
          iconPropertyMissing?: string;
          colorPropertyError?: string;
          colorPropertyMissing?: string;
        }
      ): Chainable<Subject>;


      /**
      /**
       * Custom command that validates the JSON data in the response body against the provided Plain JSON schema, OpenAP and Swagger document format using the AJV Schema Validator.
       * It is expected to be chained to an API response (from a `cy.request()` or `cy.api()`).
       * Alias: `validateSchema`.
       *
       * @param {object} schema - The schema to validate against. Supported formats are plain JSON schema, Swagger, and OpenAPI documents. See https://ajv.js.org/json-schema.html for more information.
       * @param {object} [path] - The path object to the schema definition in a Swagger or OpenAPI document. Not required if the schema is a plain JSON schema.
       * @param {string} [path.endpoint] - The endpoint path. Required if the schema is a Swagger or OpenAPI document.
       * @param {string} [path.method] - The HTTP method. If not provided, it will use 'GET'.
       * @param {integer} [path.status] - The response status code. If not provided, it will use 200.
       * @param {object} [issuesStyles] - An object with the icons and HEX colors used to flag the issues.
       * @param {string} [issuesStyles.iconPropertyError] - The icon used to flag the property error.
       * @param {string} [issuesStyles.iconPropertyMissing] - The icon used to flag the missing property.
       * @param {string} [issuesStyles.colorPropertyError] - The HEX color used to flag the property error.
       * @param {string} [issuesStyles.colorPropertyMissing] - The HEX color used to flag the missing property.
       * @returns {Cypress.Chainable} - The response object wrapped in a Cypress.Chainable.
       * @throws {Error} - If any of the required parameters are missing or if the schema or schema definition is not found.
       *
       * @example
       * ```js
       * cy.request(...).validateSchemaAjv(
       *   schema, {
       *     endpoint: '/movies',
       *     method: 'POST'
       *   }
       * )
       * ```
       *
       * You can optionally specify `status`:
       *
       * @example
       * ```js
       * cy.request(...).validateSchemaAjv(
       *   schema, {
       *     endpoint: '/movies',
       *     method: 'POST',
       *     status: 201 // Defaults to 200 if not provided
       *   }
       * )
       * ```
       * 
       * You can optionally specify a custom issuesStyles:
       *
       * @example
       * ```js
       * cy.request(...).validateSchemaAjv(
       *   schema,
       *   {
       *     endpoint: '/movies',
       *     method: 'POST',
       *     status: 201 // Defaults to 200 if not provided
       *   },
       *   { iconPropertyError: '⛔', iconPropertyMissing: '❓' }
       * )
       * ```
       */
      validateSchemaAjv(
        schema: Record<string, any>,
        path?: {
          endpoint: string;
          method?: string;
          status?: number;
        },
        issuesStyles?: {
          iconPropertyError?: string;
          iconPropertyMissing?: string;
          colorPropertyError?: string;
          colorPropertyMissing?: string;
        }
      ): Chainable<Subject>;

      /**
       * Custom command that validates the JSON data in the response body against the provided Zod schema using the ZOD Schema Validator.
       * It is expected to be chained to an API response (from a `cy.request()` or `cy.api()`).
       *
       * @param {object} schema - The schema to validate against. Supported formats are plain JSON schema, Swagger, and OpenAPI documents. See https://ajv.js.org/json-schema.html for more information.
       * @param {integer} [path.status] - The response status code. If not provided, it will use 200.
       * @param {object} [issuesStyles] - An object with the icons and HEX colors used to flag the issues.
       * @param {string} [issuesStyles.iconPropertyError] - The icon used to flag the property error.
       * @param {string} [issuesStyles.iconPropertyMissing] - The icon used to flag the missing property.
       * @param {string} [issuesStyles.colorPropertyError] - The HEX color used to flag the property error.
       * @param {string} [issuesStyles.colorPropertyMissing] - The HEX color used to flag the missing property.
       *  
       * @returns {Cypress.Chainable} - The response object wrapped in a Cypress.Chainable.
       * @throws {Error} - If any of the required parameters are missing or if the schema or schema definition is not found.
       *
       * @example
       * ```js
       * cy.request(...).validateSchemaZod(schema)
       * ```
       *
       * You can optionally specify a custom issuesStyles:
       *
       * @example
       * ```js
       * cy.request(...).validateSchemaZod(
       *   schema,
       *   { iconPropertyError: '⛔', iconPropertyMissing: '❓' }
       * )
       * ```
       */
      validateSchemaZod(
        schema: Record<string, any>,
        issuesStyles?: {
          iconPropertyError?: string;
          iconPropertyMissing?: string;
          colorPropertyError?: string;
          colorPropertyMissing?: string;
        }
      ): Chainable<Subject>;      

    }
  }
}
export {};
