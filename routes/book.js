/* vim: set ts=4 sw=4 : */

var express = require('express');
var router = express.Router();

var auth = require('../lib/auth');
var Book = require('../data/book');

router.get('/create', auth.isAuthenticated, function(req, res) {
	res.render('book_create', { title: 'Add Book – BookBrainz' });
});

router.post('/add', auth.isAuthenticated, function(req, res, next) {
	var data = {
		editor_id: 2,
		pre_phrase: '',
		credits: [{
			position: 0,
			id: req.param('creator_id'),
			name: req.param('creator_name'),
			join_phrase: ''
		}],
		entity_data: {
			name: req.param('title'),
			book_type_id: req.param('book_primary_type_id'),
			comment: req.param('comment')
		}
	};

	var book = new Book();

	book.insert(data)
		.then(function(result) {
			res.redirect('/book/' + result[0]);
		})
		.catch(function(err) {
			res.status(500);
			next(err);
		});
});

router.get('/:bbid', function(req, res, next) {
	var book = new Book();

	book.get_by_id(req.params.bbid)
		.then(function(results) {
			res.locals.book = results[0];

			if (!res.locals.book) {
				res.status(404);
				return next('Not Found');
			}

			res.render('book', { title: '“' + res.locals.book.name + '” – BookBrainz' });
		})
		.catch(function(err) {
			res.status(500);
			return next(err);
		});
});

module.exports = router;
