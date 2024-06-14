const db = require('../models');

const finances = db.finances;

exports.GetAllFees = (req, res) => {
    finances.findAll().then(data => {
        if (data == 1) {
            res.send({
                status: "Success",
                status_code: 100,
                message: "Data retrieved",
                data: data
            });
        } else {
            res.send({
                status: "Success",
                status_code: 100,
                message: "Table empty",
                data: data
            });
        }
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 404,
            message: err.message || "Database read error"
        });
    })
}