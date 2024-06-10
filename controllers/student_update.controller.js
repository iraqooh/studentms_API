const db = require("../models");

const student = db.students;

// retrieve all students from the database
exports.GetUpdate = (req, res) => {
    const id = req.params.id;

    student.update(req.body, {
        where: {
            student_id: id
        }
    })
        .then(data => {
            res.send({
                status: "OK",
                status_code: 282,
                message: "Update success!",
                result: "Query OK",
                data: data
            });
        }).catch(err => {
            res.send({
                status: "error",
                status_code: 400,
                message: err.message || "Database update error!"
            });
        })
}

exports.PostUpdate = (req, res) => {
    student.update(req.body, {
        where: {
            student_id: req.body.student_id
        }
    }).then(data => {
        res.send({
            status: "OK",
            code: 282,
            message: "Update success",
            data: data
        })
    }).catch(err => {
        res.send({
            status: "error",
            code: 400,
            message: err.message || "Update error"
        })
    })
}