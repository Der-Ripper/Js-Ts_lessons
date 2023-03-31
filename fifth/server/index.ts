import express from 'express';
const http = require('http');
const cors = require('cors');
const { initDB } = require('./db');
const {ToDo} = require('./db/models/ToDo.model');
const {User} = require('./db/models/User.model');
const {Token} = require('./db/models/Token.model');


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req: any, res: any, next: any) => {
    console.log('update');
    next();
});

app.use("/todos", async (req: any, res: any, next: any) => {
    try {
        const token = await Token.findByPk(req.body.token);
        const user = await User.findByPk(req.body.userId);
        if (token && user && user.id === token.userId) {
            next();
        } else {
            res.status(403).json({message: "Токен не найден"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


app.post("/todos", async (req: any, res: any) => {
    try {
        const todo = await ToDo.create({
            userId: req.body.userId,
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
        const todoList = await ToDo.findAll({where: {userId: req.body.userId}});
        res.status(200).json({todoList});
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
    console.log(req);
    try {
        const todo = await ToDo.findByPk(req.params.id);
        if(todo) {
            await todo.update({title: req.body.title, description: req.body.description});
            res.status(200).json({message: "Изменено | id: " + todo.id});        
        }
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

app.post("/registration", async (req: any, res: any) => {
    try{
        const userByEmail = await User.findOne({ where: { email: req.body.email} });
        if (!userByEmail) {
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,    
                email: req.body.email,
                password: req.body.password
            });
            res.status(200).json({message: "Зарегистрирован"});
        } else {
            res.status(400).json({message: "Такой email уже занят"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/auth", async (req: any, res: any) => {
    try{
        const userFind = await User.findOne({ where: { email: req.body.email, password: req.body.password}});
        if(userFind) {
            const token = await Token.create({
                userId: userFind.id
            });
            res.status(200).json({token: token.value});
        } else {
            res.status(400).json({message: "Неверные данные"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/logout", async(req: any, res: any) => {
    try{
        const token = await Token.findByPk(req.body.token);
        if (token) {
            await token.destroy();
            res.status(200).json({message: "Токен удален"});
        } else {
            res.status(403).json({message: "Токен не найден"});
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
