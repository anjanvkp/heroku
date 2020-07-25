const express = require('express');
const router = express.Router();
const EXP = require('../models/EXP');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/', ensureAuthenticated, (req, res) => {
    EXP.find({'usern': req.user.email}, (err, docs) => {
        if (!err) {
            res.render("exp/list", {
                list: docs,  viewTitle: "ANJAN - LIST EXPENSES", user: req.user, csrfToken: req.csrfToken()
            });
        } else {
            console.log('Error in retrieving EXP list: ' + err);
        }
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    EXP.find((err, docs) => {
        if (!err) {
            res.render("exp/add", {
                list: docs,  viewTitle: "ANJAN - ADD EXPENSES", user: req.user, tm: Date.now(), csrfToken: req.csrfToken()
            });
        } else {
            console.log('Error in retrieving EXP list: ' + err);
        }
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

router.post('/trf', ensureAuthenticated, (req, res) => {
    const details = new EXP();
    details.rid= req.body.rid;
    details.dt = req.body.dt;
    details.mode= req.body.mode;
    details.pto= req.body.pto;
    details.head= req.body.head;
    details.grp= req.body.grp;
    details.amt= req.body.amt;
    details.purp = req.body.purp;
    details.usern= req.user.email;
    details.type= req.body.type;
    details.save();

    const details1 = new EXP();
    details1.rid= req.body.rid;
    details1.dt = req.body.dt;
    details1.mode= req.body.pto;
    details1.pto= req.body.mode;
    details1.head= req.body.head;
    details1.grp= req.body.grp;
    details1.amt= "-" + req.body.amt;
    details1.purp = req.body.purp;
    details1.usern= req.user.email;
    details1.type= req.body.type;
    details1.save();
    res.redirect("/exp/list");
});

function insertRecord(req, res) {
    const details = new EXP();
    details.rid= req.body.rid;
    details.dt = req.body.dt;
    details.mode= req.body.mode;
    details.pto= req.body.pto;
    details.head= req.body.head;
    details.grp= req.body.grp;
    details.amt= req.body.amt;
    details.purp = req.body.purp;
    details.usern= req.user.email;
    details.type= req.body.type;
    details.save((err, doc) => {
        if (!err)
            res.redirect('exp/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("exp/add", {
                    viewTitle: "ANJAN - ADD EXPENSES",
                    exp: req.body, user: req.user, tm: Date.now(), csrfToken: req.csrfToken()
                });
            } else
                console.log('Error during record insertion: ' + err);
        }
    });
}

function updateRecord(req, res) {
    EXP.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('exp/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("exp/Edit", {
                    viewTitle: "ANJAN - UPDATE EXPENSES",
                    exp: req.body, user: req.user
                });
            } else
                console.log('Error during record update: ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, (req, res) => {
    EXP.find({'usern': req.user.email}, (err, docs) => {
        if (!err) {
            res.render("exp/list", {
                list: docs,  viewTitle: "ANJAN - LIST EXPENSES", user: req.user, csrfToken: req.csrfToken()
            });
        } else {
            console.log('Error in retrieving EXP list: ' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'pto':
                body['ptoError'] = err.errors[field].message;
                break;
            case 'amt':
                body['amtError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', ensureAuthenticated, (req, res) => {
    EXP.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("exp/Edit", {
                viewTitle: "ANJAN - UPDATE EXPENSES",
                exp: doc, user: req.user, csrfToken: req.csrfToken()
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    EXP.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/exp/list');
        } else {
            console.log('Error in EXP delete:' + err);
        }
    });
});

module.exports = router;