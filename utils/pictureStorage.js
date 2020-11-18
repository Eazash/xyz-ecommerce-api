const { diskStorage } = require('multer');
const mkdirp = require('mkdirp');
const _ = require('lodash');
module.exports = diskStorage({
  destination: (req, file, cb) => {
    const dir = `${process.cwd()}/public/${req.params.id}/`;
    console.log(dir);
    mkdirp(dir, err => cb(err, dir));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const splitFileName = file.originalname.split('.');
    const originalFileName = _.join(_.initial(splitFileName), '');
    const fileExtension = _.last(splitFileName);
    cb(null, `${originalFileName}-${uniqueSuffix}.${fileExtension}`);
  }
})