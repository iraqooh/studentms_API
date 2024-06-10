module.exports = app => {
    // import student controller
    const student_controller = require("../controllers/student.controller");
    const finance_controller = require('../controllers/student_finance.controller');
    const update_student_controller = require('../controllers/student_update.controller');
    const create_student_controller = require('../controllers/student_create.controller');
    const delete_student_controller = require('../controllers/student_delete.controller');

    // import router interface from the express module
    var router = require("express").Router();

    // define a route to fetch all students
    router.get("/students", student_controller.GetAll);
    router.get("/get_student/:id", student_controller.GetOne);
    router.get("/finances", finance_controller.GetAllPayments);
    router.get("/update_student/:id", update_student_controller.GetUpdate);
    router.post("/post_update", update_student_controller.PostUpdate);
    router.post("/create_student", create_student_controller.PutOne);
    router.get("/delete_student/:id", delete_student_controller.DeleteOne);

    // base route definition (http://localhost:8081/api/studentms)
    app.use('/api/studentms', router);
} 