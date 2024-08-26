import { Alert, Button, ButtonGroup, Link } from "@trussworks/react-uswds";
import React from "react";
import './index.scss'
export const CookieConsent = () => {
    return (
        <div className="modal">
            <Alert
                type="info"
                heading='Cookie Consent'
                headingLevel='h1'
                noIcon={true}
            >We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our <Link href='https://www.nasa.gov/privacy/#cookies' >Privacy Policy</Link>
                <ButtonGroup><Button outline={true} type={"button"} >Decline Cookies</Button> <Button type={"button"} >Accept Cookies</Button></ButtonGroup>
            </Alert>
        </div>)
}