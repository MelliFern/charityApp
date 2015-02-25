'use strict';
var Volunteer = require('../models/volunteer.js');
var bodyparser = require('body-parser');
var eat_auth = require('../lib/eat_auth');

module.exports = function(vol_router, appSecret) {

	vol_router.use(bodyparser.json()); 

	// POST
	vol_router.post('/volunteer',eat_auth(appSecret), function(req,res){
	  	var newVolunteer = new Volunteer(req.body); 
	  	newVolunteer.save(function(err,volunteer){
		    if (err) //throw err;
		    	return res.status(500).send({'msg': 'could not save volunteer'});
		    res.json(volunteer);
		  });

		});


	// PUT - replace existing object
	vol_router.put('/volunteer/:id',eat_auth(appSecret), function(req,res){
	  var updateVolunteer = req.body; 
	  var query={'email':req.params.id};
	  Volunteer.update(query,updateVolunteer,function(err){
	    if(err) 
	    	return res.status(500).send({'msg': 'could not save volunteer'});
	    res.json(req.body);  
	  });
	});

	// GET
	vol_router.get('/volunteer/:id', eat_auth(appSecret),function(req,res){
		var query={'email':req.params.id};

	  	Volunteer.find(query,{},function(err,data){
	    if (err) 
	    	return res.status(500).send({'msg': 'could not retrieve volunteer'});
	    res.json(data); 
	  });
	});

	// DELETE
	vol_router.delete('/volunteer/:id',eat_auth(appSecret), function(req,res){
  	var query = {'email': req.params.id};
  	Volunteer.remove(query,function(err){
            if(err) return res.status(500).send({'msg': 'could not delete volunteer'});
            else { 
             	Volunteer.find(query,{'email':req.params.id, _id:0 },function(err,data){
                if (err) return res.status(500).send({'msg': 'could not retrieve volunteer'});
                res.json(data); 
          });
      }
    });
  });


};