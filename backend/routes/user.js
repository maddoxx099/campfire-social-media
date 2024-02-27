const router = require('express').Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.get('/search', auth, userCtrl.searchUser);

router.get('/:id', auth, userCtrl.getUser);

router.patch("/:id/follow", auth, userCtrl.follow);
router.patch("/:id/unfollow", auth, userCtrl.unfollow);

// router.get("/suggestionsUser", auth, userCtrl.suggestionsUser);

module.exports = router;