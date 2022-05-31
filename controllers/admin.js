const db = require("../utils/db")
const fs = require('fs')
const mail = require("../utils/mail")
const ejs = require("ejs")
const res = require("express");
const fileupload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");

exports.addjobget = (req, res) => {
    res.render("addjob");
}

exports.addjob = (req, res) => {
    const { title, company, desc, status, link} = req.body;
    var uid = uuidv4();
    var imgurl = "";

    if (req.files) {
        var file = req.files.jobImage
        // var filename = file.name;
        // var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
        imgurl = uid + '.jpg';
        file.mv('AppData/jobImg/' + imgurl, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Image uploaded.");
            }
        })
    } else {
        console.log("No Files found.")
    }

    var sql = `INSERT INTO jobs (identifier, Title, Company, Description, Status, Link) VALUES ('${uid}', '${title}', '${company}', '${desc}', '${status}', '${link}')`;
    db.con.query(sql, function (err, result) {
        if (err) {
            try {
                // removing the uploaded image
                fs.unlinkSync('AppData/jobImg/' + uid + '.jpg')
            } catch(err) {
                console.error(err)
            }
            res.render("index", {
                alert: "yes",
                title: "Sorry",
                text: "Something went wrong.",
                icon: "error"})
            console.log(err);
        } else {
            // res.render("viewjobs", {
            //     alert: "yes",
            //     title: "Success",
            //     text: "job is added successfully.",
            //     icon: "success"})
            // console.log("Record Inserted.")
            res.redirect("/job/view")
        }
    });
};








exports.deletefromlib = (req, res) => {
    const sql = `delete from jobs where jobID = '${req.params.id}'`
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            // res.render("index", {
            //     alert: "yes",
            //     title: "Done.",
            //     text: "job deleted from library.",
            //     icon: "success"})
            res.redirect("/job/view")
        }
    });
}



