const express = require('express');
const router = express.Router();
const multer = require( 'multer' );

const upload = multer( {
  dest: './tmp-uploads',
  limits: { fileSize: 2000000 },
  fileFilter: function( req, file, cb ){
    let ok = false;

    if(!req.rejectedFiles) {
      req.rejectedFiles = [];
    }

    if( file.mimetype !== 'image/png') {
      cb(null, false);
      req.rejectedFiles.push({
        file: file,
        error: {
          code: 'FILE_TYPE'
        }
      });
    } else {
      cb(null, true);
    }
  }
} ).array('documents', 10);

// degraded
router.post('/examples/upload', function( req, res ){
  upload(req, res, function(err) {
    console.log(req.rejectedFiles);

    if(err) {
      console.log(err)
    }
    res.render( 'examples/dropzone.html', { files: req.files } );
  });
} );


const uploadAjax = multer( {
  dest: './tmp-uploads',
  limits: { fileSize: 2000000 },
  fileFilter: function( req, file, cb ){
    let ok = false;
    if( file.mimetype !== 'image/png' ){
      return cb({
        code: 'FILE_TYPE',
        field: 'documents',
        file: file
      }, false);
    } else {
      return cb(null, true);
    }
  }
} ).single('documents');

// ajax
router.post('/ajax-upload', function( req, res ){
  uploadAjax(req, res, function(error) {
    if(error) {
      if(error.code == 'FILE_TYPE') {
        error.text = error.file.originalname + ' is in the wrong format. Upload PNG files only.';
      } else if(error.code == 'LIMIT_FILE_SIZE') {
        error.text = error.file.originalname + ' is too big. It must be less than 2MB.';
      }
      res.json({ error });
    } else {
      res.json({ file: req.file });
    }
  } )
} );

module.exports = router;