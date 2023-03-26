import express from 'express';
const http = require('http');
const cors = require('cors');
const { initDB } = require('./db');
const {ToDo} = require('./db/models/ToDo.model');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req: any, res: any, next: any) => {
    console.log('update');
    next();
});


app.post("/todos", async (req: any, res: any) => {
    try {
        const todo = await ToDo.create({
            title: req.body.title,
            description: req.body.description,
        });
        res.status(200).json({message: "Добавлено | id: " + todo.id});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


app.get("/todos", async (req: any, res: any) => {
    try {
        const todo = await ToDo.findAll();
        res.status(200).json({todo});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


app.get("/todos/:id", async (req: any, res: any) => {
    try {
        const todo = await ToDo.findByPk(req.params.id);
        if(todo) {
            res.status(200).json({ todo });
        }
        else {
            res.status(404).json({ message: "ID не найден"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


app.patch("/todos/:id", async (req: any, res: any) => {
    try {
        const todo = await ToDo.findByPk(req.params.id);
        if(todo) {
            await todo.update({title: req.body.title, description: req.body.description});
            res.status(200).json({message: "Изменено | id: " + todo.id});        }
        else {
            res.status(404).json({ message: "ID не найден"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


app.delete("/todos", async (req: any, res: any) => {      
    try {
        await ToDo.destroy({where: {}});
        res.status(200).json({message: "Удаление базы данных выполнено"});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
});


app.delete("/todos/:id", async (req: any, res: any) => {  
    try {
        const todo = await ToDo.findByPk(req.params.id);
        if(todo) {
            await todo.destroy();
            res.status(200).json({message: "Удалено"});
        }
        else {
            res.status(404).json({ message: "ID не найден"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


http.createServer(app).listen(3100, () => {
    console.log('Server is working on port 3100');
})


initDB();

//export{};
