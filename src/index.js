/// <reference types="cypress" />

import hljs from 'highlight.js'
import { validateSchema as  validateSchemaAjv} from 'core-ajv-schema-validator'
import { validateSchemaZod} from 'core-zod-schema-validator'

import './custom-log.js'


// ------------------------------------
// MESSAGE ICONS
// ------------------------------------

const iconPassed = '✔️'
const iconFailed = '❌'
const iconMoreErrors = '➕'

const issuesStylesDefault = {
    iconPropertyError: '⚠️',
    colorPropertyError: '#d67e09',
    iconPropertyMissing: '❌',
    colorPropertyMissing: '#c10000'
}

const colorDisabledValidation = '#e0e030'

const responseValid  = `**THE RESPONSE BODY IS VALID AGAINST THE SCHEMA.**`
const responseInvalid = `**THE RESPONSE BODY IS NOT VALID AGAINST THE SCHEMA ⛔ (Number of schema errors: $NUM_ERRORS$) ⛔**`
const warningDisableSchemaValidation = `⚠️ API SCHEMA VALIDATION DISABLED ⚠️`
const msgDisableSchemaValidation = '- The Cypress environment variable "disableSchemaValidation" has been set to true.'
const errorNoValidApiResponse = 'The element chained to the cy.validateSchema() command is expected to be an API response!'
const errorResponseBodyAgainstSchema = 'The response body is not valid against the schema!'

// ------------------------------------
// PUBLIC CUSTOM COMMANDS
// ------------------------------------

/**
 * Custom command that validates the JSON data in the response body against the provided Plain JSON schema, OpenAP and Swagger document format using the AJV Schema Validator.
 * It is expected to be chained to an API response (from a `cy.request()` or `cy.api()`).
 * @public
 *
 * @param {object} schema - The schema to validate against. Supported formats are plain JSON schema, Swagger, and OpenAPI documents. See https://ajv.js.org/json-schema.html for more information.
 * @param {object} [path] - The path object to the schema definition in a Swagger or OpenAPI document. Not required if the schema is a plain JSON schema.
 * @param {string} [path.endpoint] - The endpoint path.
 * @param {string} [path.method] - The HTTP method. If not provided, it will use 'GET'.
 * @param {integer} [path.status] - The response status code. If not provided, it will use 200.
 * @param {object} [issuesStyles] - An object with the icons and HEX colors used to flag the issues.
 * @param {string} [issuesStyles.iconPropertyError] - The icon used to flag the property error. Support emojis.
 * @param {string} [issuesStyles.iconPropertyMissing] - The icon used to flag the missing property. Support emojis.
 * @param {string} [issuesStyles.colorPropertyError] - The HEX color used to flag the property error.
 * @param {string} [issuesStyles.colorPropertyMissing] - The HEX color used to flag the missing property.
 * 
 * @returns {Cypress.Chainable} - The response object wrapped in a Cypress.Chainable.
 * @throws {Error} - If any of the required parameters are missing or if the schema or schema definition is not found.
 *
 * @example
 * const schema = {
 *   "swagger": "2.0",
 *   "paths": {
 *     "/users": {
 *       "get": {
 *         "responses": {
 *           "200": {
 *             "schema": { $ref: "#/definitions/User" }
 *           }
 *         }
 *       }
 *     }
 *   },
 *   "definitions": {
 *     "User": {
 *       "type": "object",
 *       "properties": {
 *         "name": { "type": "string" },
 *         "age": { "type": "number" }
 *       }
 *     }
 *   }
 * }
 *
 * const path = { endpoint: '/users', method: 'GET', status: '200' };
 * const customIssuesStyles = { iconPropertyError: '⛔', iconPropertyMissing: '❓' }
 *
 * cy.request('GET', `https://awesome.api.com/users`).validateSchema(schema, path, customIssuesStyles).then(response => {});
 * 
 * cy.request('GET', `https://awesome.api.com/users`).validateSchemaAjv(schema, path, customIssuesStyles).then(response => {});
 */

const cy_validateSchemaAjv = (response, schema, path, issuesStyles) => {
    _validateSchema(response, 'ajv', schema, path, issuesStyles)

    return cy.wrap(response, { log: false })
}

Cypress.Commands.add("validateSchema", { prevSubject: true }, cy_validateSchemaAjv)
Cypress.Commands.add("validateSchemaAjv", { prevSubject: true }, cy_validateSchemaAjv)


/**
 * Custom command that validates the JSON data in the response body against the provided Zod schema using the ZOD Schema Validator.
 * It is expected to be chained to an API response (from a `cy.request()` or `cy.api()`).
 * @public
 *
 * @param {object} schema - The schema to validate against. Supported formats are plain JSON schema, Swagger, and OpenAPI documents. See https://ajv.js.org/json-schema.html for more information.
 * @param {object} [issuesStyles] - An object with the icons and HEX colors used to flag the issues.
 * @param {string} [issuesStyles.iconPropertyError] - The icon used to flag the property error. Support emojis.
 * @param {string} [issuesStyles.iconPropertyMissing] - The icon used to flag the missing property. Support emojis.
 * @param {string} [issuesStyles.colorPropertyError] - The HEX color used to flag the property error.
 * @param {string} [issuesStyles.colorPropertyMissing] - The HEX color used to flag the missing property.
 * 
 * @returns {Cypress.Chainable} - The response object wrapped in a Cypress.Chainable.
 * @throws {Error} - If any of the required parameters are missing or if the schema or schema definition is not found.
 *
 * @example
 * import { z } from "zod";
 * 
 * const schema = z.object({
 *   id: z.number().int(),
 *   name: z.number().optional(), // Optional as per schema
 *   address: z.string()
 *})
 *
 * const customIssuesStyles = { iconPropertyError: '⛔', iconPropertyMissing: '❓' }
 *
 * cy.request('GET', `https://awesome.api.com/users`).validateSchemaZod(schema, customIssuesStyles).then(response => {});
 */
const cy_validateSchemaZod = (response, schema, issuesStyles) => {
    _validateSchema(response, 'zod', schema, undefined, issuesStyles)
    
    return cy.wrap(response, { log: false })
}

Cypress.Commands.add("validateSchemaZod", { prevSubject: true }, cy_validateSchemaZod)


// ------------------------------------
// PRIVATE FUNCTIONS
// ------------------------------------

const _validateSchema = (response, validatorType, schema, path, issuesStyles) => {

    if (Cypress.env('disableSchemaValidation')) {
        cy.colorLog(msgDisableSchemaValidation,
            colorDisabledValidation,
            { displayName: warningDisableSchemaValidation }
        )

        console.log(`${warningDisableSchemaValidation} ${msgDisableSchemaValidation}`)
    } else {
        // Check if it is a valid API Response object
        if (response == null || (!response.hasOwnProperty('body') && !response.hasOwnProperty('status') && !response.hasOwnProperty('headers'))) {
            console.log(errorNoValidApiResponse)
            throw new Error(errorNoValidApiResponse)
        }

        const data = response.body

        issuesStyles = { ...issuesStylesDefault, ...issuesStyles }

        // Validate the response body against the schema
        const validationResult = (validatorType === 'zod') ?
            validateSchemaZod(data, schema, issuesStyles) : 
            validateSchemaAjv(data, schema, path, issuesStyles)

        // Log the validation result
        _logValidationResult(data, validationResult, issuesStyles)

        // Return the response object so it can be chained with other commands
    }
    return cy.wrap(response, { log: false })
}


/**
 * Logs the validation result and throws an error if the response body is not valid against the schema, otherwise logs a success message.
 * It shows the total number of errors and the first 'maxErrorsToShow' errors (by default 10). If there are more errors, it shows a line with the number of additional errors.
 * @private
 *
 * @param {any} data - The data to be validated.
 * @param {object} validationResults - An object containing:
 * @param {Array} validationResults.errors - An array of validation errors, or null if the data is valid against the schema.
 * @param {object} validationResults.dataMismatches - The original response data with all schema mismatches flagged directly.
 * @param {object} validationResults.issuesStyles - An object with the icons and HEX colors used to flag the issues.
 * @param {string} validationResults.issuesStyles.iconPropertyError - The icon used to flag the property error.
 * @param {string} validationResults.issuesStyles.iconPropertyMissing - The icon used to flag the missing property.
 * @param {string} validationResults.issuesStyles.colorPropertyError - The HEX color used to flag the property error.
 * @param {string} validationResults.issuesStyles.colorPropertyMissing - The HEX color used to flag the missing property.
 * @param {integer} [maxErrorsToShow=10] - The maximum number of errors to show in the log.
 * 
 * @throws {Error} - If the response body is not valid against the schema.
  */
const _logValidationResult = (data, validationResults, issuesStyles, maxErrorsToShow = 10) => {

    let { errors, dataMismatches } = validationResults
    // Log in the console the test path
    console.log ('SCHEMA VALIDATION FOR TEST: ', Cypress.currentTest.titlePath.join(' > '))

    if (!errors) {
        // PASSED

        // Log in the Console 
        console.log(`  ${iconPassed} PASSED - ${responseValid}`)

        // Log in Cypress Log
        cy.colorLog(responseValid,
            '#66d966',
            { displayName: `${iconPassed} PASSED -` },
            '14px'
        )
    } else {
        // FAILED
        let cy_api_type

        let $original, $cloned, $elem
        const enableMismatchesOnUI = mustEnableMismatchesOnUI()

        if (enableMismatchesOnUI) {
            $original = Cypress.$('[id="api-plugin-root"] [id="api-view"]')
            if ($original.length !== 0) {
                cy_api_type = "filip"
                // Create clone of the DOM tree
                $cloned = $original.clone()
                // Find the last section in the clone to add the mismatches
                $elem = $cloned.find('section:last-of-type [data-cy="responseBody"] code > details > summary')
            } else {
                $original = Cypress.$('.cy-api-response:last-of-type pre')
                if ($original.length !== 0) {
                    cy_api_type = "gleb"
                }
            }
        }

        const { iconPropertyError, colorPropertyError, iconPropertyMissing, colorPropertyMissing } = issuesStyles

        if (cy_api_type === "filip") {
            // Filip's API View needs it's own processing to show the mismatches (similar logic as for package core-ajv-schema-validator)

            errors.forEach(error => {
                let instancePathArray = error.instancePath.replace(/^\//, '').split('/') // Remove the first '/' from the instance path "/0/name" => "0/name"
                let instancePath = instancePathArray.join('.')

                let errorDescription
                let value = Cypress._.get(data, instancePath)

                const existError =  error.keyword === 'required' || error.message === "Required"

                if (existError) {
                    const missingProperty = error.params.missingProperty
                    instancePath = (instancePath === "") ? missingProperty : `${instancePath}.${missingProperty}`

                    errorDescription = `${iconPropertyMissing} Missing property '${missingProperty}'`
                } else {
                    const message = error.message
                    errorDescription = `${iconPropertyError} ${String(JSON.stringify(value)).replaceAll("\"", "'")} ${message}` // We also use String() to handle the case of undefined values
                }

                if (enableMismatchesOnUI && $elem && $elem.length) {
                    // Show in the API View the data with the mismatches
                    showDataMismatchesApiViewFilip($elem, instancePathArray, errorDescription, error, issuesStyles, 0)
                }
            })
        }

        if (enableMismatchesOnUI) {
            // Replace the original DOM tree with the cloned one with the mismatches
            if (cy_api_type === "filip") {
                $original.replaceWith($cloned)
            } else if (cy_api_type === "gleb") {
                $original.replaceWith(Cypress.$(transformDataToHtmlGleb(dataMismatches, issuesStyles)))
            }
        }

        // Show in Cypress Log an error message saying that the schema validation failed and total number of errors
        // On click, it will show in the console:
        //   - Total number of errors
        //   - Full list of errors as provided by AJV
        //   - User friendly representation of the mismatches in the data ❤️
        cy.colorLog(responseInvalid.replace('$NUM_ERRORS$', errors.length),
            '#e34040',
            { displayName: `${iconFailed} FAILED -`, info: { number_of_schema_errors: errors.length, schema_errors: errors, data_mismatches: dataMismatches } },
            '14px'
        )

        // Logic to create two group of errors: the first 'maxErrorsToShow' and the rest of errors (to avoid showing a huge amount of errors in the Cypress Log)
        // Note that if the total number of errors is 'maxErrorsToShow'+1 it will show all the errors since there will anyway one more line
        let errorsToShow, rest_of_errors

        if (errors.length > maxErrorsToShow + 1) {
            errorsToShow = errors.slice(0, maxErrorsToShow)
            rest_of_errors = errors.slice(maxErrorsToShow)
        } else {
            errorsToShow = errors
        }

        // Show in the CYPRESS LOG the first 'maxErrorsToShow' as provided by AJV or ZOD
        errorsToShow.forEach(error => {
            const existError =  error.keyword === 'required' || error.message === "Required"
            const iconError = existError ? iconPropertyMissing : iconPropertyError
            const colorError = existError ? colorPropertyMissing : colorPropertyError

            cy.colorLog(`${JSON.stringify(error, "", 1)}`,
                colorError,
                { displayName: iconError, info: { schema_error: error } }
            )
        })
        // Show in the CYPRESS LOG Log the rest of errors if there are more than 'maxErrorsToShow' as provided by AJV
        if (rest_of_errors) {
            cy.colorLog(`...and ${errors.length - maxErrorsToShow} more errors.`,
                colorPropertyMissing,
                { displayName: iconMoreErrors, info: { rest_of_errors } }
            )
        }

        // Log in the CONSOLE the full list of errors
        const msgError = `${iconFailed} FAILED - ${responseInvalid.replace('$NUM_ERRORS$', errors.length)}`
        console.log(`  ${msgError}`)
        // errors.map(e => JSON.stringify(e)).join('\n')

        // Throw an error to fail the test
        cy.then(() => {
            const exceptionMsg = Cypress.config('isInteractive') ?
                errorResponseBodyAgainstSchema :
                `${msgError}\n` + errors.map(e => JSON.stringify(e)).join('\n')

            throw new Error(exceptionMsg)
        })
    }
}



/**
 * Transforms a JSON object into an HTML string with syntax highlighting and custom styles for specific properties.
 *
 * @param {Object} jsonObject - The JSON object to be transformed into HTML.
 * @param {Object} issuesStyles - An object with the icons and HEX colors used to flag the issues. Constains: iconPropertyError, colorPropertyError, iconPropertyMissing, colorPropertyMissing.
 * 
 * @returns {string} - An HTML string with syntax-highlighted JSON and custom styles applied.
 */
const transformDataToHtmlGleb = (jsonObject, issuesStyles) => {
    const { iconPropertyError, colorPropertyError, iconPropertyMissing, colorPropertyMissing } = issuesStyles

    const fontStyles = `font-weight: bold; font-size: 1.3em;`
    let jsonString = JSON.stringify(jsonObject, null, 4)

    let json = hljs.highlight(jsonString, {
        language: 'json',
    }).value

    const regexpError = RegExp(`>&quot;${iconPropertyError}`, 'g')
    json = json.replaceAll(regexpError, (match) => {
        return ` style="${fontStyles} color: ${colorPropertyError};"${match}`
    });

    const regexpMissing = RegExp(`>&quot;${iconPropertyMissing}`, 'g')
    json = json.replaceAll(regexpMissing, (match) => {
        return ` style="${fontStyles}; color: ${colorPropertyMissing};"${match}`
    });

    return `<pre class="hljs">${json}</pre>`
};


/**
 * Recursively traverses and displays data mismatches in an API view, highlighting errors in arrays, objects, or properties.
 *
 * @param {JQuery<HTMLElement>} $content - The current DOM element being processed.
 * @param {string[]} instancePathArray - An array representing the path to the current data point in the JSON structure.
 * @param {string} errorDescription - A description of the error to display.
 * @param {Object} error - The error object containing details about the validation error.
 * @param {Object} issuesStyles - An object with the icons and HEX colors used to flag the issues.. Constains: iconPropertyError, colorPropertyError, iconPropertyMissing, colorPropertyMissing.
 * @param {number} depth - The current depth of recursion, used for indentation and styling.
 */
const showDataMismatchesApiViewFilip = ($content, instancePathArray, errorDescription, error, issuesStyles, depth) => {
    const { colorPropertyError, iconPropertyError, colorPropertyMissing } = issuesStyles

    const fontStyles = `font-weight: bold; font-size: 1.3em;`
    let path0 = instancePathArray.shift()

    if ($content.hasClass('bracket')) {
        // It's an Array
        const $elem = $content.siblings(`details`).eq(parseInt(path0))

        if ($elem.length === 0) {
            Cypress.$(`<span style="${fontStyles} padding-left: 15px; color: ${colorPropertyError};">${iconPropertyError} Array ${error.message} </span>`).insertAfter($content.parent().next())
        } else {
            showDataMismatchesApiViewFilip($elem.children('summary'), instancePathArray, errorDescription, error, issuesStyles, depth + 1)
        }
    }
    else if ($content.hasClass('brace')) {
        // It's an Object
        const $elem = $content.siblings(`.token.property:contains(\"${path0}\")`).filter((i, e) => {  // For exact match
            return Cypress.$(e).text() === `"${path0}"`
        })

        if ($elem.length === 0) {
            // Missing property
            Cypress.$(`<br><span class="line-number text-slate-700 select-none contents align-top">      </span><span style="${fontStyles} padding-left: ${25 + (depth - 1) * 14}px; color: ${colorPropertyMissing};">"${error.params.missingProperty}": ${errorDescription} </span>`).insertAfter($content)
        } else {
            let $value = $elem.next().next()
            if ($value.is('details')) {
                $value = $value.children('summary')
            }

            showDataMismatchesApiViewFilip($value, instancePathArray, errorDescription, error, issuesStyles, depth + 1)
        }
    } else {
        // Error in a property
        Cypress.$(`<span style="${fontStyles} padding-left: 15px; color: ${colorPropertyError};">${errorDescription} </span>`).insertAfter($content)
    }
}

/**
 * Determines whether mismatches should be enabled on the UI.
 * This is based on the Cypress configuration and environment variables.
 *
 * @returns {boolean} - Returns `true` if the Cypress environment is interactive
 * and the `enableMismatchesOnUI` environment variable is set; otherwise, `false`.
 */
const mustEnableMismatchesOnUI = () => {
    return Cypress.config('isInteractive') && Cypress.env('enableMismatchesOnUI')
}
