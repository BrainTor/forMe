const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const path = require('path')
const Event = require('./event');

const app = express()
const passwordChecked = 'testPas'
const Secret = 'dshasyudhosady7uqadhuiasddu89adu9q8i9d12'
    //QgGJTEx4Dy2oWQ6G
var jsonToken = ''
    //Подключить монгу 
app.listen('3000', () => {
    console.log('server started')
    mongoose.connect('mongodb+srv://BrainTor:771Moe33@cluster0.qzr5zit.mongodb.net/').then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    });

})

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'static')))

app.use('/checkPas', async(req, res) => {
    const { password } = req.body

    try {
        if (password === passwordChecked) {
            jsonToken = jwt.sign({ 'name': 'admin' },
                Secret, { expiresIn: '1h' }
            )
            return res.send({ 'status': 'ok', 'token': jsonToken })
        } else
            return res.send({ 'status': 'error' })
    } catch ({ name, message }) {
        console.log(name)
    }
})

app.use('/checkToken', async(req, res) => {
    const { token: fromClientToken } = req.body;
    jwt.verify(fromClientToken, Secret, (error, user) => {
        if (error) {
            return res.send({ 'status': 'error' });
        } else {
            return res.send({ 'status': 'ok', 'user': user });
        }
    });
});

function authenticateToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, Secret, (error, user) => {
        if (error) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// GET /events - return all events - needs jwt
app.get('/events', authenticateToken, async(req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error('Failed to get events', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// POST /events - add new event from body - needs jwt
app.post('/events', authenticateToken, async(req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Failed to create event', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// DELETE /events/:_id - remove event by object id - needs jwt
app.delete('/events/:_id', authenticateToken, async(req, res) => {
    try {
        const { _id } = req.params;
        await Event.findByIdAndDelete(_id);
        res.sendStatus(204);
    } catch (error) {
        console.error('Failed to delete event', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});