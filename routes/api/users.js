const express = require('express');
const router = require('express').Router();
const db = require('../../models/db');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/users', async (req, res) => {
  console.log(req.body);
  let result = await db.User.create(req.body);
  res.json(result);
});

router.get('/users', async (req, res) => {
 let users = await db.User.findAll();
  res.json({ users: users });
});


router.get('/users/:id', async (req, res) => {
  const user = await db.User.findAll({ where: { id: req.params.id } });
  res.json(user);
});

router.put('/users/:id', async (req, res) => {
  const result = await db.User.update(req.body, { where: { id: req.params.id } });
  res.json(result);
});

module.exports = router;
