const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1,name:'course1'},
    {id:2,name:'course2'},
    {id:3,name:'course3'},
    {id:4,name:'course4'}
];

//GET
app.get('/api/courses',(req,res)=>{
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course with given id not found.');
    res.send(course);
});

//POST

/**
 * @description manually handeling validations
 */
// app.post('/api/courses/', (req, res) => {
//     if(!req.body.name || req.body.name.length < 3) {
//         return res.status(400).send("name is required and length should be >=3");
//     }
//     const course = {
//         id:courses.length+1,
//         name:req.body.name
//     }
//     courses.push(course);
//     res.send(course);
// });

/**
 * @description handeling validations using 'Joi'
 */

app.post('/api/courses/', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error){
       return res.status(400).send(error.details[0].message);
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

//PUT
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course with given id not found.');
    const { error } = validateCourse(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    course.name = req.body.name;
    res.send(course);
});
//DELETE
app.delete('/api/courses/:id', (req, res) => {
    //Look up for the course in db
    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course with given id not found.');
    //Get index of that course
    const index = courses.indexOf(course);
    //Remove from db
    courses.splice(index,1);
    //respond to the request
    res.send(course);
});

//VALIDATOR
function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course);
}
//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
