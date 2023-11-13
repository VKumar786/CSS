const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?limit=1&skip=1
// GET /tasks?sortBy=createdAt(any special character)desc
// GET /tasks?sortBy=createdAt:asc
// createdAt : -1 (true)
// createdAt : 1 (false)
router.get('/tasks',auth, async (req, res) => {
    let match ={}
    let sort = {}
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
        match.owner = req.user._id
    }else{
        match.owner = req.user._id
    }
    if(req.query.sort){
        const parts = req.query.sort.split(':')
        // console.log(parts)
        sort[parts[0]] = parts[1]
    }
    try {
        const tasks = await Task.find(match)
                        .limit(parseInt(req.query.limit))
                        .skip(parseInt(req.query.skip))
                        .sort(sort)
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth , async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            owner :req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth , async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner :req.user._id})
        
        
        if (!task) {
            return res.status(404).send()
        }
        // after we have to check we don't update if the user do'nt exist
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth , async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.deleteOne({ _id: req.params.id ,owner : req.user._id })

        // const task =  await Task.findOneAndDelete({ _id: req.params._id, owner: req.user._id})
        console.log(task);
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
        
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router