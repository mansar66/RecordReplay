class PuppeteerTranslator {

    //pass in an options object which can take new languages
    constructor(options) {
        
        // set default values for the keycodes class 
        const defaults = {

            //internal defaults
            recordingTestUrl: "",
            recordingTestID: 0,
            //messaging for code
            standardOpeningComment: "/*\n" 
            + "\t Your options for launching Puppeteer will depend upon your system setup and preferences. \n"
            + "\t The following code depends upon you having successfully launched Puppeteer with the reference 'browser'.\n"
            + "\t Don't forget to call 'browser.close()' at the end of your tests.\n"
            + "*/\n\n",
            standardRecordingComment: "/*\n" 
            + "\t This is Puppeteer code generated by Record/Replay from a RECORDING. \n"
            + "\t As such it only contains ACTIONS, not ASSERTIONS.\n"
            + "\t If you want to have code with assertions included, you need to generate a replay of this recording and download the replay code.\n"
            + "*/\n\n",
            //puppeteer defaults
            defaultMouseButton: "left",
            defaultClicks: 1,
            defaultNetworkOffline: false,
            defaultNetworkDownload: -1,
            defaultNetworkUpload: -1,
            defaultLatency: 0

        }
        // create a new object with the defaults over-ridden by the options passed in
        let opts = Object.assign({}, defaults, options);
  
        // assign options to instance data (using only property names contained in defaults object to avoid copying properties we don't want)
        Object.keys(defaults).forEach(prop => { this[prop] = opts[prop]; });
    }

    //ACTIONS

    openPage = () => ` const page = await browser.newPage(); `

    navigateToUrl = url => ` await page.goto('${url}'); `

    click = (selector, button = this.defaultMouseButton, clicks = this.defaultClicks) => ` await page.click('${selector}', { button: '${button}', clickCount: ${clicks} } ); `

    //Note you should always focus before you type
    typeText = text => ` await page.keyboard.type('${text}'); `

    //Note you should always focus before you send key as tab, enter etc may only have meaning in the context of focus
    sendSpecialKey = keyDescriptor => ` await page.keyboard.press('${keyDescriptor}'); ` 

    scrollTo = (xPosition, yPosition) => ` await page.evaluate( () => { window.scrollTo({ left: ${xPosition}, top: ${yPosition}, behavior: 'smooth' }); }); `

    focus = selector => ` await page.focus('${selector}'); `

    hover = selector => ` await page.hover('${selector}'); ` 

    returnScreenshot = () => ` await page.screenshot({path: 'screenshot.png'}); ` 

    closePage = () => ` const page = await page.close(); `

    //SETTINGS special devtools queries - mobile view, bandwidth, latency

    connectToChromeDevtools = () => ` const client  = await page.target().createCDPSession(); ` 

    emulateNetworkConditions = (offline = this.defaultNetworkOffline, download = this.defaultNetworkDownload, upload = this.defaultNetworkUpload, latency = this.defaultLatency) => {

        return ` await client.send('Network.emulateNetworkConditions', { offline': ${offline}, 'downloadThroughput': ${download}, 'uploadThroughput': ${upload}, 'latency': ${latency} }); `;

    }

    //ASSERTIONS HELPERS, we need to have the index of each item in the Rx.js flow so we can have unique assertions

    getPageTitle = () => ` await page.title(); `

    querySelector = (selector, index) => ` const selected${index} = await page.$('${selector}'); ` 

    querySelectorAll = (selector, index) => ` const selectedAll${index} = await page.$$('${selector}'); ` 

    countElements = (selector, index) => ` const count${index} = await page.$$eval('${selector}', elements => elements.length); `

    getElementProperty = (selector, property, index) => ` const ${property}Property${index} = await page.$eval('${selector}', element => element.${property}); `

    getElementAttributeValue = (selector, attribute, index) => ` const ${attribute}Attribute${index} = await page.$eval('${selector}', element => element.getAttribute('${attribute}'); `

    getElementAttributesAsArray = (selector, index) => ` const attributesArray${index} = await page.$eval('${selector}', element => Array.prototype.slice.call(element.attributes); `

  
}