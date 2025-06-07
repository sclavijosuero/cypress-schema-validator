import runTestsPlainJson  from '../support/run-tests-plainjson.js'

describe('ALL TESTS SHOULD FAIL', () => {
    runTestsPlainJson('fail')
})

describe('ALL TESTS SHOULD FAIL WITH customStyleErrors', () => {
    const issuesStylesOverride = {
        iconPropertyError: '🟦',
        colorPropertyError: '#5178eb',
        iconPropertyMissing: '🟪',
        colorPropertyMissing: '#800080'
    }
    runTestsPlainJson('fail', issuesStylesOverride)
})
