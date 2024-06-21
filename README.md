# Student Management System

## Introduction

This is a student management system built using Express.js, MySQL, and XAMPP. The system allows you to create, read, update, and delete (CRUD) student records, financial information, library book rentals, courses, their instructors as well as manage the student prefecture.

## Technologies Used

- Express.js (Node.js framework)
- XAMPP or WAMP (Apache and MySQL stack)
- Sequelize (ORM for database interactions)
- Joi (validation library)

## Installation

1. [Clone](https://github.com/iraqooh/studentms_API.git) the repository: `git clone https://github.com/iraqooh/studentms_API.git`.
2. Run the following command to navigate to the project directory ```cd studentms_API```.
3. Open the project folder in VS Code using ```code .``` and run ```npm install``` to install dependencies.
4. Update the database credentials in config/db.js and create a MySQL database with the specified name. Note: You may need to create the MySQL database manually if it does not exist.
5. Launch XAMPP or WAMPP and start the Apache and MySQL database servers.
6. Start the Express server: ```npm start```
7. Access the API endpoints using a tool like Postman, Insomnia, cURL or VS Code's Thunder Client extension.

## API Endpoints

The base endpoint route is /madiland_api, accessible on localhost port 28 by default. Edit server.js to change the port to your desired value.

### Students

- Create a new student record: POST /addstudent
- Retrieve a list of all students: GET /getstudents
- Retrieve a single student record by first name: GET /findstudent
- Update a single student record by ID: PUT /updatestudent/:id
- Delete a single student record by ID: DELETE /deletestudent/:id

### Finances

- Retrieve a list of finance records for a student: GET /getfinances/:student_id
- Make a payment: POST /makepayment
- Get total payments: GET /totalpayments
- Get fees balances: GET /feesbalances

### Course Instructors

- Create a new instructor: POST /addinstructor
- Retrieve a list of all instructors: GET /getinstructors

### Course Catalog

- Create a new course: POST /addcourse
- Retrieve a list of all courses: GET /getcourses
- Retrieve course details: GET /getcoursedetails
- Search for courses based on query parameters such as course_id, course_name, instructor id and department: GET /searchcourses

### Library Book Rentals

- Add a new book: POST /addbook
- Rent a book: POST /rentabook
- Retrieve a list of all books: GET /getbooks
- Find a book based on query parameters such as title, author, book_id and category: GET /findbook
- Retrieve a list of rented books: GET /getrentedbooks
- Retrieve books rented by a student: GET /getbooksrentedbystudent
- Return a book: PUT /returnbook

### School Prefecture

- Add a new prefect: POST /addprefect
- Retrieve a list of all prefects: GET /getprefects
- Find a prefect using query parameters such as prefect_id, position, student_id and description: GET /findprefect
- Update a prefect: PUT /updateprefect
- Delete a prefect: DELETE /deleteprefect

## Database Schema

The database schema is defined in models/ directory. The schema includes the following tables:

- students: student_id, first_name, last_name, gender, age, parent_phone_number, physical_address, category, class, status
- finances: finance_id, student_id, school_fees
- payments: payment_id, student_id, amount_paid
- instructors: instructor_id, instructor_name, title, department
- courses: course_id, instructor_id, department, course_name, description, credits
- books: book_id, title, author, category
- rentals: rent_id, book_id, student_id, return_date
- prefects: prefect_id, position, description, student_id, term_start, term_end

## Validation

Validation is handled using Joi. The validation rules are defined in each object creation protocol in controllers/student.controller.js.

## Author

Harry Iraku

## Contributing

Contributions are welcome! Please fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License.

---
