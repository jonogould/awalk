/*
*	awalk.js
*	=======================================================
*
*	Author: 	jono gould
*	Company: 	TravelGround.com
*	Date: 		30 April 2013
*
*	Description:
*	Asynchronously lists all files (filename and full path)
*	from within every folder of the specified dir.
*
*	=======================================================
*
*	Returns = array of objects (filename, full path)
*
*	dir 	= root folder
*	done 	= callback that is triggered on completion
*/


//	Dependancies
var fs = require('fs');
var _ = require('underscore');


//	awalk function
var awalk = function(dir, done) {
	//	The results array
	var results = [];

	//	Start off by reading dir, return list
	fs.readdir(dir, function(err, list) {
		//	Stop and report an error, if there is one
		if (err)
			return done(err);

		var pending = list.length;
		
		if (!pending)
			return done(err, results);

		//	Run through the list of files
		_.each(list, function(file) {
			//	We want the full path
			var path = dir + '/' + file;

			//	Get the details of the file
			fs.stat(path, function(err, stat) {
				//	If the file is legit and can spit out some stats
				if (stat) {
					if (stat.isDirectory()) {
						//	If file is a directory, inception!
						awalk(path, function(err, res) {
							results = results.concat(res);
							
							if (!--pending)
								done(err, results);
						});
					}
					else {
						//	If file is a file
						results.push({filename: file, path: path, size: stat.size});
						
						if (!--pending)
							done(err, results);
					}
				}
			});
		});
	});
};

exports.awalk = awalk;