# Student Management System

## Introduction

This is a student management system built using Express.js, MySQL, and XAMPP. The system allows you to create, read, update, and delete (CRUD) student records, as well as manage their financial information.

## Technologies Used

- Express.js (Node.js framework)
- MySQL (database management system)
- XAMPP (Apache and MySQL stack)
- Sequelize (ORM for MySQL)
- Joi (validation library)

## Installation

1. Clone the repository: `git clone (link unavailable)
2. Install dependencies: npm install
3. Create a MySQL database and update the database credentials in config/db.js
4. Start the server: node server.js
5. Access the API endpoints using a tool like Postman, Insomnia, VS Code's Thunder Client or cURL

## API Endpoints

The base endpoint route is /api/studentms2 on localhost port 8081.

- POST /addstudent: Create a new student record along with a corresponding finance record
- GET /getstudents: Retrieve a list of all students
- GET /findstudent: Retrieve a single student record by their first name
- PUT /updatestudent/:id: Update a single student record by ID
- DELETE /deletestudent/:id: Delete a single student record by ID
- GET /getfinances/:student_id: Retrieve a list of finance records for a student

## Database Schema

The database schema is defined in models/student.model.js and models/finance.model.js. The schema includes the following tables:

- students: id, first_name, last_name, gender, age, parent_phone_number, physical_address, category, class, status
- finances: id, student_id, school_fees_amount

## Validation

Validation is handled using Joi. The validation rules are defined in controllers/student.controller.js and controllers/finance.controller.js.

## Contributing

Contributions are welcome! Please fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License.

---
