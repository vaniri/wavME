var router = require('express').Router();
var db = require('../../models/db');

router.get('/', async (req, res) => {
  const users = await db.User.findAll();
  res.json({ users: users });
});

router.post('/', async (req, res) => {
  const result = await db.User.create(req.body);
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const user = await db.User.findAll({ where: { id: req.params.id } });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const result = await db.User.update(req.body, { where: { id: req.params.id } });
  res.json(result);
});

module.exports = router;
