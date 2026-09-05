// modules/ExampleModule/server/index.js
exports.handler = async (req, res) => {
  res.json({ ok: true, module: 'ExampleModule' });
};
