'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      if (req.body.locale === undefined || req.body.text === undefined) { res.json({ error: 'Required field(s) missing' }); return; };
      if (req.body.text.length === 0) { res.json({ error: 'No text to translate' }); return; };
      let validLocales = ['american-to-british', 'british-to-american'];
      if (!validLocales.includes(req.body.locale)) { res.json({ error: 'Invalid value for locale field'}); return; };
      let translated = translator.translate(req.body.text, req.body.locale, true);
      if (translated == req.body.text) { res.json({ text: req.body.text, translation: 'Everything looks good to me!' }); return; };
      res.json({ text: req.body.text, translation: translated });
    });
};
