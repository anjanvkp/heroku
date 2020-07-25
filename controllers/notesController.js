const express = require('express');
const router = express.Router();
const Notes = require('../models/notes');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/', ensureAuthenticated, (req, res) => {
    Notes.find((err, docs) => {
        if (!err) {
            res.render("notes/list", {
                list: docs,  viewTitle: "ANJAN - NOTES LIST", user: req.user, csrfToken: req.csrfToken()
            });
        } else {
            console.log('Error in retrieving note list: ' + err);
        }
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render("notes/add", {
        viewTitle: "ANJAN - INSERT NOTES", user: req.user, csrfToken: req.csrfToken()
    })
});

router.post('/', ensureAuthenticated, (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    const details = new Notes();
    details.DT = req.body.DT;
    details.NOTE = req.body.NOTE;
    details.usern = req.user.email;
    details.save((err, doc) => {
        if (!err)
            res.redirect('notes/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("notes/add", {
                    viewTitle: "Insert Notes",
                    notes: req.body, user: req.user
                });
            } else
                console.log('Error during record insertion: ' + err);
        }
    });
}

function updateRecord(req, res) {
    Notes.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('notes/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("notes/Edit", {
                    viewTitle: "Update Notes",
                    notes: req.body, user: req.user
                });
            } else
                console.log('Error during record update: ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, (req, res) => {
    Notes.find((err, docs) => {
        if (!err) {
            res.render("notes/list", {
                list: docs,  viewTitle: "ANJAN - NOTES LIST", user: req.user, csrfToken: req.csrfToken()
            });
        } else {
            console.log('Error in retrieving note list: ' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'DT':
                body['DTError'] = err.errors[field].message;
                break;
            case 'NOTE':
                body['NOTEError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', ensureAuthenticated, (req, res) => {
    Notes.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("notes/Edit", {
                viewTitle: "ANJAN - UPDATE NOTES",
                notes: doc, user: req.user, csrfToken: req.csrfToken()
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    Notes.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/notes/list');
        } else {
            console.log('Error in note delete:' + err);
        }
    });
});

module.exports = router;