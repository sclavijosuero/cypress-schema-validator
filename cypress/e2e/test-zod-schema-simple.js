import '../../src/index.js'
import schema from '../fixtures/schemas/zod-schema-simple.js'


it('Test Zod Schema - Schema Simple - Pass', () => {
    cy.fixture(`mock-data-zod/sample-pass.json`).then((data) => {
        cy.wrap({ status: 200, body: data }, { log: false }).validateSchemaZod(schema)
    })
});


it('Test Zod Schema - Schema Simple - Fail default Style', () => {

    cy.fixture(`mock-data-zod/sample-fail.json`).then((data) => {
        cy.wrap({ status: 200, body: data }, { log: false }).validateSchemaZod(schema)
    })
});


it('Test Zod Schema - Schema Simple - Fail custom Style', () => {
    const customStyleErrors = { iconPropertyError: '⛔', iconPropertyMissing: '❓' }
    
    cy.fixture(`mock-data-zod/sample-fail.json`).then((data) => {
        cy.wrap({ status: 200, body: data }, { log: false }).validateSchemaZod(schema, customStyleErrors)
    })
});