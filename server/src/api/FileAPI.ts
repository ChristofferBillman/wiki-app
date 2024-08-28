import { Application } from 'express'
import multer from 'multer'
import mime from 'mime-types'
import crypto from 'crypto'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          if (err) return cb(err)
    
          cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype))
        })
    }
  })

const upload = multer({ storage })


export default function FileAPI(app: Application, BASEURL: string) {
    // POST
    app.post(BASEURL + '/upload', upload.single("singleFile"),  async (req, res) => {
        const filename = req.file.filename
        res.json({ filename })
    })
}