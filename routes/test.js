var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const {id} = req.params;
  if(id){
    res.send("id : " + id);
  }else{
    res.send('respond with a resource');
  }
});

module.exports = router;
