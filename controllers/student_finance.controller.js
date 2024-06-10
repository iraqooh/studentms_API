const db = require("../models");

const finances = db.student_finances
const student = db.students;

exports.GetAllPayments = (req, res) => {
    finances.findAll({
        attributes: ['finance_id', 'amount', 'createdAt'],
        include: [{
            model: student,
            as: 'students',
            attributes: ['first_name', 'last_name']
        }]
    })
        .then(data => {
            res.send({
                status: "OK",
                status_code: 282,
                message: "Read success",
                data: data.map(payment => ({
                    finance_id: payment.finance_id,
                    first_name: payment.students.first_name,
                    last_name: payment.students.last_name,
                    amount: payment.amount
                }))
            })
        })
        .catch(err => {
            res.send({
                status: "Fail",
                status_code: 400,
                message: err.message || "Database read error"
            })
        })
}