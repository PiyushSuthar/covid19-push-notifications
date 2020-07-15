require('dotenv').config()
const OneSignal = require('onesignal-node')
const request = require('request-promise')

// Setting up API for OneSignal,
const client = new OneSignal.Client(process.env.APP_ID, process.env.API_KEY);

/**
 * Main working functionn that pushes the notification!
 */
(async () => {

    const notification = {
        headings: {
            "en": process.env.NOTIFICATION_TITLE
        },
        contents: {
            "en": await getNotificationContent()
        },
        web_buttons: [{ "id": "view-more-button", "text": process.env.BUTTON_TEXT,  "url": process.env.WEBSITE_URL }],
        chrome_web_image: process.env.IMAGE_URL,
        chrome_web_icon: process.env.CHROME_WEB_ICON,
        chrome_web_badge: process.env.CHROME_WEB_ICON,
        url: process.env.SITE_URL,
        included_segments: ['Subscribed Users']
    }

    try {
        const response = await client.createNotification(notification);
        console.log(response.body.id)
    } catch (error) {
        console.log(error);
    }

})()

/**
 * Getting Notification Content from NovelCOVID Api!
 */
async function getNotificationContent() {
    const options = {
        uri: process.env.DATA_API_URL,
        json: true
    }
    const { cases, deaths, recovered, active } = await request(options)

    const text = `Cases: ${cases.toLocaleString()}, Deaths: ${deaths.toLocaleString()}, Active: ${active.toLocaleString()} and Recovered: ${recovered.toLocaleString()}!`
    return text;
}