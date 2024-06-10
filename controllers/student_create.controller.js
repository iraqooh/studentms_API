const db = require("../models");

const students = db.students;

exports.PutOne = (req, res) => {
    students.create(req.body)
        .then(data => {
            res.send({
                status: "OK",
                code: 282,
                message: "Create success",
                data: data
            })
        })
        .catch(err => {
            res.send({
                status: "Fail",
                code: 400,
                message: err.message || "Database insert error"
            })
        })
}