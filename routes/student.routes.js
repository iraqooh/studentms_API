module.exports = app => {
    // importing a student controller
    const student_controller = require("../controllers/student.controller");
    const finance_controller = require("../controllers/finance.controller");

    // import Router interface from express module
    var router = require("express").Router();

    // http://localhost:8080/api/studentms2/getstudents
    // route to fetch all students
    router.get("/getstudents", student_controller.GetAllStudents);

    // route to update a specific Student
    router.all("/updatestudent/:id", student_controller.UpdateStudent);

    // route to update a specific Student
    router.all("/deletestudent/:id", student_controller.DeleteStudent);

    // route to update a specific Student
    router.all("/addstudent", student_controller.CreateStudent);

    // ROUTE TO SEARCH A specific stuident by firstname
    router.get("/findstudent", student_controller.SearchStudent);

    // fetch all finances 
    router.get('/getfinances', finance_controller.GetAllFees);

    // define the base route
    app.use('/api/studentms2', router);
}