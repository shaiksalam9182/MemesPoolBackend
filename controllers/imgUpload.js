const multer = require('multer');
const fs = require('fs');
const randomString = require('randomstring');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const configFile = require('../configs/memesdev.json');

exports.upload = (req, res) => {
    const storageObject = new Storage({
        keyFilename: path.join(__dirname, '..', 'configs', 'memesdev.json')
    });

    const bucket = storageObject.bucket('images_memespool');
    const filename = randomString.generate(20) + path.extname(req.file.originalname);
    const file = bucket.file(filename);


    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (error) => {
        return res.status(200).send({
            success: false,
            message: error
        })
    })

    stream.on('finish', () => {
        return res.status(200).send({
            success: true,
            image_url: "https://storage.googleapis.com/images_memespool/" + filename
        })
    })


    stream.end(req.file.buffer);



}