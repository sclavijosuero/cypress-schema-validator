/**
 * Class representing a StyleHandler.
 */
export default class StyleHandler {

    /**
     * A Set to store the cached styles.
     * @private
     * 
     * @type {Set}
     */
    static _cachedStyles = new Set()

    /**
     * Get the style name for the given hex color.
     * @public
     * 
     * @param {string} hexColor - The hex color code.
     * @param {string} [fontSize] - Optional font size to be applied to the style.
     * 
     * @returns {string} The style name.
     */
    static getStyleName = (hexColor = '#FFFFFF', fontSize) => {
        // const styleName = `colorLog${hexColor.replace("#", "-")}` + (fontSize ? `-${fontSize}` : '')
        const styleName = `colorLog${hexColor.replace("#", "-")}`

        if (!StyleHandler._cachedStyles.has(styleName)) {
            StyleHandler._createStyle(styleName, hexColor, fontSize) // Create style element in the document
            StyleHandler._cachedStyles.add(styleName) // Cache the style name
        }

        return styleName
    }

    /**
     * Create a style element in the web document.
     * @private
     * 
     * @param {string} styleName - The style name.
     * @param {string} hexColor - The hex color code.
     * @param {string} [fontSize] - Optional font size to be applied to the style.
     */
    static _createStyle = (styleName, hexColor, fontSize) => {
        const style = document.createElement('style')

        style.textContent = `
            .command.command-name-${styleName} span.command-method {
                color: ${hexColor} !important;
                text-transform: uppercase;
                font-weight: bold;
                background-color: none;
                border-color: none;
                ${fontSize ? `font-size: ${fontSize};` : ''}
            }
    
            .command.command-name-${styleName} span.command-message{
                color: ${hexColor} !important;
                font-weight: normal;
                background-color: none;
                border-color: none;
                ${fontSize ? `font-size: ${fontSize};` : ''}
            }
    
            .command.command-name-${styleName} span.command-message strong,
            .command.command-name-${styleName} span.command-message em { 
                color: ${hexColor} !important;
                background-color: none;
                border-color: none;
                ${fontSize ? `font-size: ${fontSize};` : ''}
            }
        `
        
        Cypress.$(window.top.document.head).append(style)
    }
}