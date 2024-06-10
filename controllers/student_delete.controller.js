const db = require('../models');

const students = db.students;

exports.DeleteOne = (req, res) => {
    students.destroy({
        where: {
            student_id: req.params.id
        }
    })
    .then(data => {
        res.send({
            status: "OK",
            code: 282,
            message: "Deletion success",
            data: data
        })
    })
    .catch(err => {
        res.send({
            status: "Fail",
            code: 400,
            message: err.message || "Database drop error"
        })
    })
}