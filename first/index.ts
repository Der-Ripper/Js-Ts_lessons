import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());


app.get('/sum', (req: any, res: any) => {
    if(typeof(req.body.a) === "number" && typeof(req.body.b) === "number") {
        res.json(req.body.a + req.body.b);
    }
    else {
        res.status(403).json("ERROR");
    }
});


app.post('/reverse-case', (req: any, res: any) => {
    let originalString = String(req.body.string);
    let reverseString = "";
    for (let i = 0; i < originalString.length; i++) {
        if(originalString[i] == originalString[i].toLowerCase()){
            reverseString += originalString[i].toUpperCase();
        }
        else {
            reverseString += originalString[i].toLowerCase();
        }
    }
    res.status(200).json({reverseString});
});


app.put('/obj-to-array', (req: any, res: any) => {
    let entries = Object.entries(req.body);
    console.log(entries);
    console.log(req.body);
    let objectArray: any[] = [];
    for (let i = 0; i < entries.length; i++) {
        let object = {key: entries[i][0], value: entries[i][1]};
        objectArray.push(object);
    }
    res.status(200).json(objectArray);
});


app.patch('/reverse-array', (req: any, res: any) => {
    res.status(200).json(req.body.array.reverse());
});


app.delete('/duplicates', (req: any, res: any) => {
    res.status(200).json(Array.from(new Set(req.body.array)));
});


http.createServer(app).listen(3100, () => {
console.log('Server is working on port 3100');
})
