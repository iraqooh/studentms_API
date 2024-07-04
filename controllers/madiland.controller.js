const db = require("../models");
const joi = require("joi");
const operation = db.Sequelize.Op;

const respond = (obj=null, res_type, code, message, result, error=null) => {
    if (res_type === "success") {
        obj.send({
            status: "OK",
            code: code,
            message: message,
            data: result
        });
    } else if (res_type === "error") {
        obj.send({
            status: "Error",
            code: code,
            message: error.message || message
        });
    } else if (res_type === "information") {
        obj.send({
            status: "Information",
            code: code,
            message: message
        });
    }
}

// Retrieve all Students from the db
exports.GetAllStudents = (req, res) => {
    db.students.findAll({
        include: [db.finances]
    })
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
        const id = req.query.id;
        // const student_id = req.params.id;
        db.students.update(req.body, {
            where: { student_id: id }
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
     if(req.method == "POST"){

        // Add code which detects a wrong field entered
        const schema = joi.object().keys({
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            gender: joi.string().valid('F', 'M').required(),
            age: joi.number().integer().min(10).required(),
            parent_phone_number: joi.string().
                pattern(/\+2567[^469]\d{6}/).required(),
            physical_address: joi.string().allow('', null),
            category: joi.string().valid('DAY', 'BOARDING').required(),
            class: joi.string().allow('', null),
            status: joi.boolean().allow('', null),
            school_fees: joi.number().integer().required(),
            payment: joi.number().integer()
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

        db.students.create(student_data).then(
            async data => {
                // if(data == 1){
                    await db.finances.create({
                        student_id: data.student_id,
                        school_fees: req.body.school_fees
                    });

                    if (req.body.payment) {
                        await db.payments.create({
                            student_id: data.student_id,
                            amount_paid: req.body.payment
                        })
                    }

                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Added",
                        result: data
                    });
            }
        ).catch(err => {
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
     if(req.method == "DELETE"){

        const student_id = req.query.id;
        const student_id_db = await db.students.findByPk(student_id);

        if(student_id_db === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        await db.finances.destroy({
            where: {
                student_id: student_id
            }
        });

        await db.payments.destroy({
            where: {
                student_id: student_id
            }
        });

        db.students.destroy({
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


// Search Student
exports.SearchStudent = async (req, res) => {
    if (req.method === "GET") {
        let whereClause = []

        if (req.query.student_id) {
            const id_exists = await db.students.findByPk(req.query.student_id)
            if (id_exists === null) {
                res.send({
                    status: "Not Found",
                    code: 404,
                    message: "Student not found"
                })

                return;
            }

            whereClause.push({ student_id: req.query.student_id})
        }

        if (req.query.first_name) {
            whereClause.push({ first_name: { [operation.like]: `%${req.query.first_name}%` }})
        }

        if (req.query.last_name) {
            whereClause.push({ last_name: { [operation.like]: `%${req.query.last_name}%` }})
        }

        if (req.query.physical_address) {
            whereClause.push({ physical_address: { [operation.like]: `%${req.query.physical_address}%` }})
        }

        db.findAll({
            where: {[operation.or] : whereClause}
        }).then(data => {
            res.send({
                status: "OK",
                code: 200,
                data: data
            })
        }).catch(err => {
            res.send({
                status: "Error",
                code: 400,
                message: err.message || "Database read operation failed"
            })
        })
    } else {
        res.status(500).send({
            status: "Bad Request",
            code: 500,
            message: "Invalid Request Method"
        })
    }
}


// Get student finances
// Retrieve all Students from the db
exports.GetStudentFinances = (req, res) => {
    db.finances.findAll({
        // include: [{model: Student, attributes: []}]
        include: [db.students],
        // attributes: [
        //     'finance_id',
        //     [db.Sequelize.fn('sum', db.Sequelize.col('school_fees')), 'total_expected'],
        // ],
        // group
    }).then(
            async data => {

                const total_expected = await db.finances.findAll({
                    attributes: [
                        // function to calc the sum
                        [db.Sequelize.fn('sum', db.Sequelize.col('school_fees')), 'total'],
                    ],
                    raw: true,
                });

                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student Finances successfully retrieved",
                    number_of_students: data.length,
                    total_expected: total_expected[0]['total'],
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student Finances"
            });
        }
        );
}

// Make a payment
exports.MakePayment = async (req, res) => {
     if(req.method == "POST"){

        const student_id_dbx = await db.students.findByPk(req.body.student_id);

        if(student_id_dbx === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        if(!req.body.amount_paid){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Amount Paid is required",
            }); 

            return;
        }

        // Add code which detects a wrong field entered

        const payment_data = {
            amount_paid: req.body.amount_paid,
            student_id: req.body.student_id,
        }

        db.payments.create(payment_data).then(
            async data => {
                // if(data == 1){
                    

                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Payment Added",
                        result: data
                    });
                // }else{
                //     res.send({
                //         status: "Error",
                //         status_code: 100,
                //         message: "Student Not Updated",
                //     }); 
                // }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student payment"
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

// Retrieve all Payments
exports.TotalPayments = (req, res) => {
    db.payments.findAll({
        // include: [{model: Student, attributes: []}]
        include: [db.students],
        // attributes: [
        //     'finance_id',
        //     [db.Sequelize.fn('sum', db.Sequelize.col('school_fees')), 'total_expected'],
        // ],
        // group
    }).then(
            async data => {

                const total_payments_received = await db.payments.findAll({
                    attributes: [
                        // function to calc the sum
                        [db.Sequelize.fn('sum', db.Sequelize.col('amount_paid')), 'total'],
                    ],
                    raw: true,
                });

                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student Payments successfully retrieved",
                    number_of_students: data.length,
                    total_payments_received: total_payments_received[0]['total'],
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student Finances"
            });
        }
        );
}

// Get fees balances
exports.FeesBalance = async (req, res) => {
     if(req.method == "GET"){

        const payments = await db.payments.findAll({
            attributes: [[db.Sequelize.fn('SUM', db.Sequelize.col('amount_paid')), 'total_paid']],
            group: 'student_id'
        })

        const fees = await db.finances.findAll({
            include: [{
                model: db.payments,
                as: 'payments',
                attributes: []
            }],
            group: ['finance.finance_id', 'payments.student_id'],
            attributes: {
                include: [
                    [db.Sequelize.literal('school_fees - COALESCE(SUM(payments.amount_paid), 0)'), 'fees_balance']
                ]
            }
        })

        const result = fees.map(item => ({
            student_id: item.student_id,
            fees_balance: item.dataValues.fees_balance
        }))

        respond(res, "success", 222, "Student balances", result, null)

     } else{
        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
     }
}

// Create a new instructor
exports.CreateInstructor = (req, res) => {
    const schema = joi.object().keys({
        instructor_name: joi.string().required(),
        title: joi.string().allow('', null),
        department: joi.string().valid('SCIENCES', 'ARTS').required()
    });

    const result = schema.validate(req.body, {
        abortEarly: false
    });

    if (result.error) {
        res.send({
            status: "Error",
            status_code: 413,
            message: "Invalid request data, check the fields!",
            errors: result.error.details
        });
        
        return;
    }

    const instructor_data = {
        instructor_name: req.body.instructor_name,
        title: req.body.title,
        department: req.body.department
    }

    db.instructors.create(instructor_data).then(data => {
        res.send({
            status: "OK",
            status_code: 282,
            message: "Instructor added successfully",
            data: data
        })
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 413,
            errors: err.message || "Database create operation failure!"
        });
    })
}

// Create a new course unit
exports.CreateCourse = (req, res) => {

    const schema = joi.object().keys({
        instructor_id: joi.number().integer().required(),
        department: joi.string().valid('SCIENCES', 'ARTS').required(),
        course_name: joi.string().required(),
        description: joi.string().allow('', null),
        credits: joi.number().integer().min(3).required()
    });

    const result = schema.validate(req.body, {
        abortEarly: false
    });

    if (result.error) {
        res.send({
            status: "Error",
            status_code: 412,
            message: "Invalid request data, check the fields!",
            errors: result.error.details
        });
        
        return;
    }

    const course_data = {
        instructor_id: req.body.instructor_id,
        department: req.body.department,
        course_name: req.body.course_name,
        description: req.body.description,
        credits: req.body.credits
    }

    db.courses.create(course_data).then(data => {
        res.send({
            status: "OK",
            status_code: 282,
            message: "Course unit added successfully",
            data: data
        })
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 413,
            errors: err.message || "Database create operation failure!"
        });
    })
}

exports.GetInstructors = (req, res) => {
    db.instructors.findAll().then(data => {
        res.send({
            status: "OK",
            code: 202,
            data: data
        })
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 414,
            errors: err.message || "Database read operation failure!"
        });
    })
}

exports.SearchCourses = async (req, res) => {
    if (req.method === "GET") {
        let whereClause = [];

        if (req.query.course_id) {
            const course_exists = await db.courses.findByPk(req.query.course_id);
            if (course_exists === null) {
              respond(res, "information", 420, "Course id not found in database", null, null);
              return;
            }

            whereClause.push({ course_id: req.query.course_id })
        }
        
        if (req.query.instructor_id) {
            const instructor_exists = await db.courses.findByPk(req.query.instructor_id);
            if (instructor_exists === null) {
              respond(res, "information", 420, "Course id not found in database", null, null);
              return;
            }

            whereClause.push({ instructor_id: req.query.instructor_id })
        }

        if (req.query.credits) {
            whereClause.push({ credits: req.query.credits })
        }
        
        if (req.query.department || req.query.course_name || req.query.description) {
    
            if (req.query.department) {
                whereClause.push({ department: { [operation.like]: `%${req.query.department}%` } });
            }
    
            if (req.query.course_name) {
                whereClause.push({ course_name: { [operation.like]: `%${req.query.course_name}%` } });
            }
    
            if (req.query.description) {
                whereClause.push({ description: { [operation.like]: `%${req.query.description}%` } });
            } 
        }

        db.courses.findAll({where: {
            [operation.or]: whereClause
        }})
            .then(
                data => {
                    if (data.length >= 1) respond(res, "success", 200, "Course units found", data, null);
                    else respond(res, "information", 404, "No course units found", null, null);
                }
            ).catch(err => {
                respond(res, "error", 419, "Database read operation failure", null, err);
            });

    } else {
        respond(res, "information", 500, "Invalid HTTP method", null, null)
    }
}

exports.GetCourseDetails = async (req, res) => {

    const id = await db.courses.findByPk(req.query.id);
    console.log(id);

    if (id === null) {
        respond(res, "information", 404, "Course id not found", null, null);

        return;
    }

    await db.courses.findAll({
        where: {
            course_id: req.query.id
        }
    }).then(data => {
        respond(res, "success", 200, "Course details retrieved", data, null);
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 414,
            errors: err.message || "Database read operation failure!"
        });
    })
}

exports.GetAllCourses = (req, res) => {

    db.courses.findAll().then(data => {
        res.send({
            status: "OK",
            code: 202,
            data: data
        })
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 414,
            errors: err.message || "Database read operation failure!"
        });
    })
}

// ----------------------------------------------------------------
// Library book controllers

exports.AddBook = (req, res) => {
    const schema = joi.object().keys({
        title: joi.string().required(),
        author: joi.string().required(),
        category: joi.string().allow('', null)
    });

    const result = schema.validate(req.body, {
        abortEarly: false
    });

    if (result.error) {
        res.send({
            status: "Error",
            status_code: 412,
            message: "Invalid request data, check the fields!",
            errors: result.error.details
        });
        
        return;
    }

    const book_data = {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category
    }

    db.books.create(book_data).then(data => {
        res.send({
            status: "OK",
            status_code: 282,
            message: "Book added successfully",
            data: data
        })
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 413,
            errors: err.message || "Database create operation failure!"
        });
    })
}

exports.AddRental = async (req, res) => {
    const book_id_in_db = await db.books.findByPk(req.body.book_id)
    const student_id_in_db = await db.books.findByPk(req.body.book_id)

    if (book_id_in_db == null || student_id_in_db === null) {
        res.send({
            status: "Error",
            status_code: 413,
            errors: "Book or student id not found!"
        });

        return;
    }

    db.rentals.findAll({
        where: {
            book_id: req.body.book_id,
            return_date: null
        }
    }).then(data => {
        console.log(data);
        if (data.length == 0) {
            const schema = joi.object().keys({
                book_id: joi.number().integer().required(),
                student_id: joi.number().integer().required(),
                return_id: joi.date().allow('', null)
            })
        
            const result = schema.validate(req.bpdy, {abortEarly: false})
        
            if (result.error) {
                res.send({
                    status: "Error",
                    status_code: 412,
                    message: "Invalid request data, check the fields!",
                    errors: result.error.details
                });
                
                return;
            }
        
            const rental_data = {
                book_id: req.body.book_id,
                student_id: req.body.student_id
            }
        
            db.rentals.create(rental_data).then(data => {
                res.send({
                    status: "OK",
                    status_code: 282,
                    message: "Book rented out successfully",
                    data: data
                })
            }).catch(err => {
                res.send({
                    status: "Error",
                    status_code: 415,
                    errors: err.message || "Database create operation failure!"
                });
            })
        } else {
            res.send({
                status: "Invalid",
                status_code: 500,
                errors: "Book is not available for rent!"
            });
        }
    }).catch(err => {
        res.send({
            status: "Error",
            status_code: 418,
            errors: err.message || "Database read operation failure!"
        });
    })
}

exports.GetBooks = (req, res) => {
    db.books.findAll().then(data => {
        respond(res, "success", 200, "All books retrieved successfully", data);
    }).catch(err => {
        respond(null, "error", 419, "Database read operation failure", null, err);
    })
}

exports.FindBook = (req, res) => {
    if (req.query.id) {
        const book_id_in_db = db.books.findByPk(req.query.id);

        if (book_id_in_db === null) {
            respond(null, "error", 420, "Book id not found in database", null, null);

            return;
        }

        db.books.findAll({
            where: {
                book_id: req.query.id
            }
        }).then(data => {
            respond(res, "success", 200, "Book found", data);
        }).catch(err => {
            respond(res, "error", 419, "Database read operation failure", null, err);
        })
    } else if (req.query.title || req.query.author || req.query.category) {

         let whereClause = [];

        if (req.query.title) {
            whereClause.push({ title: { [operation.like]: `%${req.query.title}%` } });
        }

        if (req.query.author) {
            whereClause.push({ author: { [operation.like]: `%${req.query.author}%` } });
        }

        if (req.query.category) {
            whereClause.push({ category: { [operation.like]: `%${req.query.category}%` } });
        }

        db.books.findAll({where: {
            [operation.or]: whereClause
        }})
            .then(
                data => {
                    if (data.length === 1) respond(res, "success", 1000, "Books retrieved", data, null)
                    else respond(res, "information", 1000, "No books found", null, null)
                }
            ).catch(err => {
                res.send({
                    status: "Error",
                    status_code: 1001,
                    message: err.message || "Error occurred while searching Students"
                });
            });
    }
}

exports.GetRentedBooks = (req, res) => {
    db.rentals.findAll({
        where: {
            return_date: null
        },
        attributes: ['rent_id'],
        include: [
            {
                model: db.books,
                as: 'book',
                attributes: ['title']
            },
            {
                model: db.students,
                as: 'student',
                attributes: ['first_name', 'last_name']
            },
        ]
    }).then(data => {
        respond(res, "success", 200, "Books found", data);
    }).catch(err => {
        respond(res, "error", 419, "Database read operation failure", null, err);
    })
}

exports.GetRentedBooksByStudent = async (req, res) => {
    const id = await db.students.findByPk(req.query.id)

    if (id === null) {
        respond(res, "information", 404, "Student id not found!", null, null);

        return;
    }

    await db.rentals.findAll({
        where: {
            student_id: req.query.id,
            return_date: null
        },
        include: [
            {
                model: db.books,
                as: 'book',
                attributes: ['title']
            }
        ],
        attributes: ['rent_id']
    }).then(data => {
        respond(res, "success", 200, "Books found", data);
    }).catch(err => {
        respond(res, "error", 419, "Database read operation failure", null, err);
    })
}

exports.ReturnBook = (req, res) => {
    if (req.method === "PUT") {
        db.rentals.findAll({
            where: {
                book_id: req.query.id
            }
        }).then(data => {
            db.rentals.update(
                { return_date: db.Sequelize.fn('NOW') },
                { where: { book_id: req.query.id } }
              ).then(data => {
                respond(res, "success", 200, "Rental status updated", data);
            }).catch(err => {
                respond(res, "error", 421, "Database update operation failure", null, err);
            })
        }).catch(err => {
            respond(res, "error", 422, "Database read operation failure", null, err);
        })
    } else {
        respond(res, "information", 600, "Invalid request method", null, null)
    }
}

exports.AddPrefect = (req, res) => {
    if (req.method === "POST") {
        const schema = joi.object().keys({
            position: joi.string().required(),
            description: joi.string().allow('', null),
            student_id: joi.number().integer().required(),
            term_start: joi.date().allow('', null),
            term_end: joi.date().allow('', null)
        })

        const result = schema.validate(req.body, { abortEarly: false })

        if (result.error) {
            respond(res, "Error", 407, "Missing or invalid fields provided", null, null);

            return
        }

        const prefect_data = {
            position: req.body.position,
            description: req.body.description,
            student_id: req.body.student_id,
            term_start: db.Sequelize.fn('NOW')
        }

        db.prefects.create(prefect_data).then(data => {
            respond(res, "success", 200, "New prefect added successfully", data, null)
        }).catch(err => {
            respond(res, "error", 499, "Database create operation failed", null, err)
        })

    } else {
        respond(res, "information", 600, "Invalid request method", null, null);
    }
}

exports.GetPrefects = (req, res) => {
    if (req.method === "GET") {
        db.prefects.findAll({
            include: [
                {
                    model: db.students,
                    as: 'student',
                    attributes: ['first_name', 'last_name']
                }
            ]
        }).then(data => {
            respond(res, "success", 200, "All prefects retrieved", data, null)
        }).catch(err => {
            respond(res, "error", 499, "Database read operation failed", null, err)
        })
    } else {
        respond(res, "information", 600, "Invalid request method", null, null);
    }
}

exports.FindPrefect = async (req, res) => {
    if (req.method === "GET") {
        let whereClause = [];

        if (req.query.prefect_id || req.student_id) {
            
            const prefect_id_in_db = await db.prefects.findByPk(req.query.prefect_id);
            const student_id_in_db = await db.prefects.findByPk(req.query.student_id);
    
            if (req.query.prefect_id) {
                const prefect_id_in_db = await db.prefects.findByPk(req.query.prefect_id);
                if (prefect_id_in_db === null) {
                  respond(res, "information", 420, "Prefect not found in database", null, null);
                  return;
                }

                whereClause.push({ prefect_id: req.query.prefect_id })
            }

            if (req.query.student_id) {
                const student_id_in_db = await db.students.findByPk(req.query.student_id);
                if (student_id_in_db === null) {
                  respond(res, "information", 420, "Student not found in database", null, null);
                  return;
                }
                whereClause.push({ student_id: req.query.student_id });
            }
    
            db.prefects.findAll({
                where: {
                    [operation.or]: whereClause
                }
            }).then(data => {
                if (data.length === 1) respond(res, "success", 200, "Prefect found", data, null);
                else respond(res, "success", 200, "Not found", null, null);
            }).catch(err => {
                respond(res, "error", 419, "Database read operation failure", null, err);
            })
        } else if (req.query.position || req.query.description) {
    
            if (req.query.position) {
                whereClause.push({ position: { [operation.like]: `%${req.query.position}%` } });
            }
    
            if (req.query.description) {
                whereClause.push({ description: { [operation.like]: `%${req.query.description}%` } });
            }
    
            db.prefects.findAll({where: {
                [operation.or]: whereClause
            }})
                .then(
                    data => {
                        if (data.length === 1) respond(res, "success", 200, "Prefects found", data, null);
                        else respond(res, "information", 404, "No prefects found", null, null);
                    }
                ).catch(err => {
                    respond(res, "error", 419, "Database read operation failure", null, err);
                });
        }
    } else {
        respond(res, "information", 600, "Invalid request method", null, null);
    }
}

exports.UpdatePrefect = (req, res) => {
    if (req.method === "PUT") {

        const prefect_exists = db.prefects.findByPk(req.body.prefect_id)

        if (prefect_exists === null) {
            respond(null, "error", 420, "Prefect not found in database", null, null);

            return
        }

        db.prefects.update(req.body, {
            where: { prefect_id: req.body.prefect_id}
        }).then(data => {
            respond(res, "success", 200, "Prefect status updated", data);
        }).catch(err => {
            respond(res, "error", 421, "Database update operation failure", null, err);
        })
    } else {
        respond(res, "information", 600, "Invalid request method", null, null);
    }
}

exports.DeletePrefect = (req, res) => {
    if (req.method === "DELETE") {
        const prefect_exists = db.prefects.findByPk(req.query.prefect_id);

        if (prefect_exists === null) {
            respond(res, "information", 404, "Prefect not found", null, null)

            return
        }

        db.prefects.destroy({
            where: { prefect_id: req.query.prefect_id}
        }).then(data => {
            if (data.length === 1) respond(res, "success", 200, "Prefect deleted", data);
            else respond(res, "success", 200, "Prefect already deleted or not found", data);
        }).catch(err => {
            respond(res, "error", 421, "Database delete operation failure", null, err);
        })
    } else {
        respond(res, "information", 600, "Invalid request method", null, null);
    }
}