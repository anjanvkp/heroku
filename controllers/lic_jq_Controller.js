const express = require('express');
const router = express.Router();
const Lic = require('../models/Lic');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/', ensureAuthenticated, (req, res) => {
    res.render("lic/lic_jq", { viewTitle: "CA / LIC. DASHBOARD", user: req.user});
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render("lic/add", {
        viewTitle: "Insert Lic", user: req.user
    })
});

router.post('/', ensureAuthenticated, (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    const details = new Lic();
    details.rid= req.body.rid;
    details.CANAME = req.body.CANAME;
    details.CANO= req.body.CANO;
    details.LOANO= req.body.LOANO;
    details.SDATE= req.body.SDATE;
    details.EDATE= req.body.EDATE;
    details.VAL= req.body.VAL;
    details.usern= req.body.usern;
    details.save((err, doc) => {
        if (!err)
            res.redirect('lic/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("lic/add", {
                    viewTitle: "Insert Lic",
                    lic: req.body, user: req.user
                });
            } else
                console.log('Error during record insertion: ' + err);
        }
    });
}

function updateRecord(req, res) {
    Lic.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('lic/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("lic/Edit", {
                    viewTitle: "Update Lic",
                    lic: req.body, user: req.user
                });
            } else
                console.log('Error during record update: ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, (req, res) => {
    Lic.find((err, docs) => {
        if (!err) {
            res.json(docs);
        } else {
            console.log('Error in retrieving LIC list: ' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'rid':
                body['ridError'] = err.errors[field].message;
                break;
            case 'EDATE':
                body['EDTAEError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', ensureAuthenticated, (req, res) => {
    Lic.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("lic/Edit", {
                viewTitle: "Update LIC",
                lic: doc, user: req.user
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    Lic.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/lic/list');
        } else {
            console.log('Error in LIC delete:' + err);
        }
    });
});

module.exports = router;