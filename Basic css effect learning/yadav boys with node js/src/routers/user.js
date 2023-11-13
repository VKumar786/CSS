const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp');
const {welcomeEmail ,sendCancelationEmail} = require('../emails/account')
const router = new express.Router()

// router.post('/users',(req,res)=>{
//     res.send(req.body)
// })
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        welcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // console.log(req.user);
        res.send(req.user)
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})
const uploads  = multer({
    limits :{
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.jpg'))
            return cb(new Error('Please Upload image'))

        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth ,uploads.single('avatar'),async (req,res)=>{
    const Buffer = await sharp(req.file.buffer).png().resize({
        width: 250,
        height: 250,
    }).toBuffer()
    // const Buffer = await sharp(req.file.buffer).toBuffer() till here there is no change 
    // in the above and below statement
    // req.user.avatar = req.file.buffer
    req.user.avatar = Buffer
    await req.user.save()
    res.send().status(200)
},(error,req,res,next)=>{
    res.send({error : error.message}).status(400)
})

router.delete('/users/me/avatar', auth ,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send().status(200)
})

router.get('/users/:id/avatar', async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('Unable to get image')
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.send('unable to set it').status(404)
    }
})

router.get('/users',(req,res)=>{
    res.render('users')
})

module.exports = router