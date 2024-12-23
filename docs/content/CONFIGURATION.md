# Configuration

- [Configuration](#configuration)
  - [veda.config.js](#vedaconfigjs)
    - [Page overrides](#page-overrides)
    - [Strings](#strings)
  - [Meta files](#meta-files)

The base properties used by Veda are set through the `.env` file.  
This includes values like the application title, and contact email. These values are then used throughout the app.

The `.env` file contains a list of all available variables and comments explaining what they are used for.

## veda.config.js

The `veda.config.js` file is an additional configuration file for veda.  
It is through this file that you specify how the Veda content can be found.

This is done by providing a glob path for each one of the [content types](./CONTENT.md). (Datasets, Stories).  
The default configuration is:
```js
datasets: './datasets/*.data.mdx'
stories: './stories/*.stories.mdx'
```

### Page overrides
To adapt the Veda dashboard to the individual needs of your instance, some content/component overrides are provided. These overrides allow you to alter certain parts of the application, or inject code without having to fork the UI part of veda.

See [PAGE_OVERRIDES](./PAGE_OVERRIDES.md) for a full list of elements to customize.

### Strings

The `strings` object allows you to customize the nomenclature used in some parts of the application so that it better reflects your use case. Since these values will need to be used in different contexts, a one (singular) and other (plural) form of each term is required.

The default values are:
```js
strings: {
  stories: {
    one: 'Story',
    other: 'Stories'
  }
}
```

However if the value you want to use is the same for both forms, you can simply provide a string instead of an object:
```js
strings: {
  sheep: 'Sheep'
}
```

### Banner

`Banner` object allows you to display a site-wide banner that sits atop your application. To create a banner, you need to provide four attributes (one optional) as outlined below. 

```
expires: Date,
url: string,
text: string,
type?: BannerType
``` 

| Option | Type | Description| Example|
|---|---|---|---|
| expires | Date | The date and time when the banner expires. (ISO 8601 format) | '2024-08-03T12:00:00-04:00'|
| url | string | The URL that will be triggered when the user clicks on the banner. | 'stories/emit-and-aviris-3' |
| text | string | The text content to display in the banner. This can be an HTML string. | 'Read the new data insight on using EMIT and AVIRIS-3 for monitoring large methane emission events.' |
| type | enum('info', 'warning') |The type of information delivered by the banner, which determines its background color. | 'info'|

### Cookie Consent Form

`cookieConsentForm` object allows you to display a site-wide Cookie Consent form that sits atop your application. To create a Cookie Consent form, you need to provide two attributes as outlined below. 

```
title: string,
copy: string,
theme: {
      card: {
        backgroundColor: string,
        sideBarColor: string,
        textColor: string,
        linkColor: string
      },
      acceptButton: {
        default: { backgroundColor: string, textColor: 'string },
        hover: { backgroundColor: string, textColor:string }
      },
      declineButton: {
        default: { borderColor: string, textColor: string },
        hover: { borderColor: string, textColor: string }
      },
      iconColor: { default: string, hover: string }
    }
``` 

| Option | Type | Description| Example|
|---|---|---|---|
| title | string | 	The text content to display in the title of the cookie consent form. This can be an HTML string. | 'Cookie Consent'|
| copy | string | The content of the Cookie Consent form, typically is a string that follows MDX documentation format. Allowing flexibility to link to different data management policy.  | 'To learn more about it, see our [Privacy Policy ]\(https://www.nasa.gov/privacy/#cookies)\'  |
| theme | object | 	Object of Cookie Consent styling options ||
| theme.card.backgroundColor | String | Pass a hex or accepted color name as a string to style background of card  | backgroundColor: '#2276ac'|
| theme.card.sideBarColor | String | Pass a hex or accepted color name as a string to style sidebar or accent bar of card  | SideBarColor: '#2276ac'|
| theme.card.textColor | String | Pass a hex or accepted color name as a string to style the text color of the card content | textColor: '#2276ac'|
| theme.card.linkColor | String | Pass a hex or accepted color name as a string to style the Privacy Policy link color  | linkColor: '#2276ac'|
| theme.acceptButton.default | String | Pass a hex or accepted color name as a string to accept button |  default: { backgroundColor: '#175074', textColor: 'white' }|
| theme.acceptButton.hover | String | Pass a hex or accepted color name as a string to style accept button  |  hover: { backgroundColor: '#175074', textColor: 'white' }|
| theme.declineButton.default | String | Pass a hex or accepted color name as a string to decline button |  default: { backgroundColor: '#175074', textColor: 'white' }|
| theme.declineButton.hover | String | Pass a hex or accepted color name as a string to style decline button  |  hover: { backgroundColor: '#175074', textColor: 'white' }|
| theme.iconColor | String | Pass a hex or accepted color name as a string to style the X close button| { default: '#175074', hover: 'white' }|


### Footer

The footer component dynamically pulls its content from the `mainNavItems` and `subNavItems` that are also leveraged by the header component from [veda.config.js](#vedaconfigjs). The footer component does not currently render any child navigation elements passed down from the `mainNavItems` or `subNavItems`. The footer also requires `footerSettings` object to be passed to set `secondary section` and `return to top` button functionality.

```
secondarySection: {
        division: string,
        version: string,
        title: string,
        name: string,
        to: string,
        type: string,
    },
returnToTop: boolean
``` 

| Option | Type | Description| Example|
|---|---|---|---|
| returnToTop | boolean | Set to display a return to top button above the primary and secondary secionts of the footer ||
| secondarySection.division | String | Pass a string for the content you would like to display in the division section  | NASA EarthData 2024 |
| secondarySection.version | String | Set what version to display next to Nasa logo and title | BETA VERSION |
| secondarySection.title | String |  | NASA Official |
| secondarySection.name | String | Name of individual you would like users to contact | NASA EarthData 2024 |
| secondarySection.to | String | Individuals email contact information to link to  | NASA EarthData 2024 |
| secondarySection.type | String | Currently hard coded to accept only email type | NASA EarthData 2024 |

## Meta files

_There is currently not a lot of customization that can be done to meta images._

The following meta files must exist and be placed in the `static/meta` folder:
```
apple-touch-icon.png
favicon.ico
icon.svg
meta-image.png
site.webmanifest
```
