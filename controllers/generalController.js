const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("general/home", {
        title: "Home Page"
    });
});

router.get("/contact-us", (req, res) => {
    res.render("general/contact-us", {
        title: "Contact Us",
        validationMessages: {},
        values: {
            firstName: "",
            lastName: "",
            email: "",
            message: ""
        }
    });
});

router.post("/contact-us", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, message } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string") {
        passedValidation = false;
        validationMessages.firstName = "You must specify a first name.";
    }
    else if (firstName.trim().length == 0) {
        passedValidation = false;
        validationMessages.firstName = "The first name is required.";
    }
    else if (firstName.trim().length < 2) {
        passedValidation = false;
        validationMessages.firstName = "The first name must be at least two characters long.";
    }

    if (passedValidation) {
        const FormData = require("form-data");
        const Mailgun = require("mailgun.js");
        
        const mailgun = new Mailgun(FormData);
        
        const mg = mailgun.client({
            username: "api",
            key: process.env.API_KEY
        });
        
        mg.messages.create("sandbox7a22f2b7bfa7450b901c2131f943afca.mailgun.org", {
            from: "Nick Romanidis <postmaster@sandbox7a22f2b7bfa7450b901c2131f943afca.mailgun.org>",
            to: ["Nick Romanidis <nickroma.seneca@gmail.com>"],
            subject: `Contact Us - ${firstName} ${lastName}`,
            html: `Visitor's Full Name: ${firstName} ${lastName}<br>
                Visitor's Email Address: ${email}<br>
                Visitor's message: ${message}<br>
                `
        }).then(data => {
            console.log(data); // logs response data
            res.redirect("/");
        }).catch(error => {
            console.log(error); //logs any error
            res.render("general/contact-us", {
                title: "Contact Us",
                values: req.body,
                validationMessages
            });
        });
        
    }
    else {
        res.render("general/contact-us", {
            title: "Contact Us",
            values: req.body,
            validationMessages
        });
    }
});

module.exports = router;