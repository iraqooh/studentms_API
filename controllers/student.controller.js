const Joi = require('joi');
const db = require("../models");
const Student = db.students;
const StudentFinance = db.finances;
const Operation = db.Sequelize.Op;

// Retrieve all Students from the db
exports.GetAllStudents = (req, res) => {
    Student.findAll()
        .then(
            data => {
                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Students successfully retrieved",
                    number_of_students: data.length,
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Students"
            });
        }
        );
}

// Update
// using get and post
exports.UpdateStudent = (req, res) => {
    
     if(req.method == "PUT"){

        // const student_id = req.body.t_id;
        // const student_id = req.params.id;
        // const student_id = req.query.t_id;
        const student_id = req.params.id;
        Student.update(req.body, {
            where: { student_id: student_id }
        }).then(
            data => {
                if(data == 1){
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Updated",
                    });
                }else{
                    res.send({
                        status: "Error",
                        status_code: 100,
                        message: "Student Not Updated",
                    }); 
                }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Create
exports.CreateStudent = (req, res) => {
     if(req.method == "POST") {

        // Add code which detects a wrong field entered
        const schema = Joi.object().keys({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            gender: Joi.string().valid('F', 'M').required(),
            age: Joi.number().integer().min(10).required(),
            parent_phone_number: Joi.string().
                pattern(/\+2567[^469]\d{6}/).required(),
            physical_address: Joi.string().allow('', null),
            category: Joi.string().valid('DAY', 'BOARDING').required(),
            class: Joi.string().allow('', null),
            status: Joi.boolean().allow('', null),
            school_fees_amount: Joi.number().integer()
        });

        const result = schema.validate(req.body, { abortEarly: false });

        if (result.error) {
            res.send({
                status: "Error",
                status_code: 413,
                message: "Invalid request data, check the fields!",
                errors: result.error.details
              });
              return;        
        }

        const student_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            age: req.body.age,
            parent_phone_number: req.body.parent_phone_number,
            physical_address: req.body.physical_address,
            category: req.body.category,
            class: req.body.class,
            status: req.body.status
        };

        Student.create(student_data).then(data => {
            const finance_data = {
                student_id: data.student_id,
                school_fees_amount: req.body.school_fees_amount
            };
            
            return StudentFinance.create(finance_data)
                .then(finance => {
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Added",
                        result: finance
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Error",
                        status_code: 101,
                        message: err.message || "Error Occurred While adding a student"
                    });
                })
        }).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student"
            });
        });

    } else{
        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }

}

// Delete
exports.DeleteStudent = async (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "DELETE"){

        const student_id = req.params.id;
        const student_id_db = await Student.findByPk(student_id);

        if(student_id_db === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        Student.destroy({
            where: { student_id: student_id }
        }).then(
            data => {
                if(data == 1){
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Deleted",
                    });
                }else{
                    res.send({
                        status: "Error",
                        status_code: 100,
                        message: "Student Not Deleted",
                    }); 
                }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });
    
    
     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Search student 
exports.SearchStudent = async (req, res) => {
    const search_query = req.query.first_name;

    var condition = search_query ? { first_name: { [Operation.like] : `%${search_query}%`}} : null;

    Student.findAll({
        where: condition
    })
        .then(
            data => {
                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student successfully retrieved",
                    number_of_students: data.length,
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student"
            });
        }
        );
}