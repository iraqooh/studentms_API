const db = require("../models");

const student = db.students;

// retrieve all students from the database
exports.GetAll = (req, res) => {
    student.findAll()
        .then(data => {
            res.send({
                status: "OK",
                status_code: 282,
                message: "Read success!",
                result: data
            });
        }).catch(err => {
            res.send({
                status: "error",
                status_code: 400,
                message: err.message || "Database read error!"
            });
        })
}

exports.GetOne = (req, res) => {
    student.findAll({
        where: {
            student_id: req.params.id
        }
    })
        .then(data => {
            res.send({
                status: "OK",
                status_code: 282,
                message: "Read success!",
                result: data
            });
        }).catch(err => {
            res.send({
                status: "error",
                status_code: 400,
                message: err.message || "Database read error!"
            });
        })
}