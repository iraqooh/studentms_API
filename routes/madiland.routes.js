module.exports = app => {
    // importing a student controller
    const madiland_controller = require("../controllers/madiland.controller");

    // import Router interface from express module
    var router = require("express").Router();

    // http://localhost:8080/api/studentms2/getstudents
    // route to fetch all students
    router.get("/getstudents", madiland_controller.GetAllStudents);

    // route to update a specific Student
    router.all("/updatestudent", madiland_controller.UpdateStudent);

    // route to update a specific Student
    router.all("/deletestudent", madiland_controller.DeleteStudent);

    // route to update a specific Student
    router.all("/addstudent", madiland_controller.CreateStudent);

    // route to search a specific student by first name
    router.get("/findstudent", madiland_controller.SearchStudent);
    // ********************************
    // route to get finances of all students
    router.get("/getstudentfinances", madiland_controller.GetStudentFinances);

    // route to make payment
    router.post("/makepayment", madiland_controller.MakePayment);

    // route to get total payments
    router.get("/totalpayments", madiland_controller.TotalPayments);

    // route to get fees balances
    router.get("/feesbalances", madiland_controller.FeesBalance);

    // ----------------------------------------------------------------

    // create a new department
    router.post("/addinstructor", madiland_controller.CreateInstructor);

    router.post("/addcourse", madiland_controller.CreateCourse);

    router.get("/getinstructors", madiland_controller.GetInstructors);

    router.get("/getcourses", madiland_controller.GetAllCourses);

    router.get("/getcoursedetails", madiland_controller.GetCourseDetails);

    router.get("/searchcourses", madiland_controller.SearchCourses);

    // ----------------------------------------------------------------

    // routes for library book rentals to students

    router.post("/addbook", madiland_controller.AddBook);

    router.post("/rentabook", madiland_controller.AddRental);

    router.get("/getbooks", madiland_controller.GetBooks);

    router.get("/findbook", madiland_controller.FindBook);

    router.get("/getrentedbooks", madiland_controller.GetRentedBooks);

    router.get("/getbooksrentedbystudent", madiland_controller.GetRentedBooksByStudent);

    router.put("/returnbook", madiland_controller.ReturnBook);

    // ----------------------------------------------------------------
    // routes for the school prefecture

    router.post("/addprefect", madiland_controller.AddPrefect);

    router.get("/getprefects", madiland_controller.GetPrefects);

    router.get("/findprefect", madiland_controller.FindPrefect);

    router.put("/updateprefect", madiland_controller.UpdatePrefect);

    router.delete("/deleteprefect", madiland_controller.DeletePrefect);

    // define the base route
    app.use('/madiland_api', router);
}