/// <reference types="cypress" />

import '../../src/index.js'

import '@bahmutov/cy-api'

// API Doc: https://petstore.swagger.io/
// OpenAPI: https://petstore.swagger.io/v2/swagger.json

import petstoreSchema from '../fixtures/schemas/zod-schema-petstore.js'


describe('Petstore API', () => {
    
    it('should validate the OpenAPI schema for GET findByStatus "pending"', () => {
  
        const findByStatusReq = {
            url: 'https://petstore.swagger.io/v2/pet/findByStatus?status=pending',
            headers: { 'Content-Type': 'application/json' }
        }

        cy.api(findByStatusReq)
            .validateSchemaZod(petstoreSchema)
    })

    it('should validate the OpenAPI schema for GET findByStatus "available" and customIssuesStyles', () => {
        const customStyleErrors = { iconPropertyError: '⛔', iconPropertyMissing: '❓' }

        const findByStatusReq = {
            url: 'https://petstore.swagger.io/v2/pet/findByStatus?status=available',
            headers: { 'Content-Type': 'application/json' }
        }

        cy.api(findByStatusReq)
            .validateSchemaZod(petstoreSchema, customStyleErrors)
    })
})
