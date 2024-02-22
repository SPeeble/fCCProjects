const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {


    translate(text, locale, span) {
      let translated
      if (locale == 'american-to-british') {
        translated = this.translateToBritish(text, span);
      } else if (locale == 'british-to-american') {
        translated = this.translateToAmerican(text, span);
      }
      return translated
    };

    translateToBritish(text, span) {
      let translated = "" + text
      let timeRegex = /[0-9]*[0-9]:[0-9][0-9]*/g;
      let dotRegex = /\./;
      let timeMatches = translated.match(timeRegex);
      if (timeMatches) {
        for (let i = 0; i < timeMatches.length; i++) {
          let match = timeMatches[i];
          if (span === true) {
            translated = translated.replace(match, '<span class="highlight">' + match.replace(":", ".") + '</span>');
          } else {
            translated = translated.replace(match, match.replace(":", "."));
          };
        };
      }
      let titlesArray = Object.entries(americanToBritishTitles)
      for (let i = 0; i < titlesArray.length; i++ ) {
        let pair = titlesArray[i]
        let pattern = pair[0].replace(dotRegex, "\\.")
        pattern = "(^" + pattern + ")|(?<= )" + pattern + "(?=[ \.])";
        let regexp = new RegExp(pattern, 'gi')
        let test = regexp.test(translated)
        if (test === false) { continue; }
        let replacement = pair[1];
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1)
        if (span === true) {
          translated = translated.replace(regexp, '<span class="highlight">' + replacement + '</span>');
        } else {
          translated = translated.replace(regexp, replacement);
        }
      }
      let americanOnlyArray = Object.entries(americanOnly)
      for (let i = 0; i < americanOnlyArray.length; i++) {
        let pair = americanOnlyArray[i]
        let pattern = pair[0]
        pattern = "(^" + pattern + ")|(?<= )" + pattern + "(?=[ \.])";
        let regexp = new RegExp(pattern, 'gi')
        let test = regexp.test(translated)
        if (test === false) { continue; }
        regexp = new RegExp(pair[0], 'gi')
        let replacement = pair[1];
        if (span === true) {
          translated = translated.replace(regexp, '<span class="highlight">' + replacement + '</span>');
        } else {
          translated = translated.replace(regexp, replacement);
        };
      }
      let americanToBritishSpellingArray = Object.entries(americanToBritishSpelling)
      for (let i = 0; i < americanToBritishSpellingArray.length; i++) {
        let pair = americanToBritishSpellingArray[i]
        let pattern = pair[0]
        pattern = "(^" + pattern + ")|(?<= )" + pattern + "(?=[ \.])";
        let regexp = new RegExp(pattern, 'gi')
        let test = regexp.test(translated)
        if (test === false) { continue; }
        regexp = new RegExp(pair[0], 'gi')
        let replacement = pair[1];
        if (span === true) {
          translated = translated.replace(regexp, '<span class="highlight">' + replacement + '</span>');
        } else {
          translated = translated.replace(regexp, replacement);
        };
      }
      translated = translated.charAt(0).toUpperCase() + translated.slice(1)
      return translated
    };

    translateToAmerican(text, span) {
      let translated = "" + text
      let timeRegex = /[0-9]*[0-9]\.[0-9][0-9]*/g;
      let timeMatches = translated.match(timeRegex);
      if (timeMatches) {
        for (let i = 0; i < timeMatches.length; i++) {
          let match = timeMatches[i];
          if (span === true) {
            translated = translated.replace(match, '<span class="highlight">' + match.replace(".", ":") + '</span>');
          } else {
            translated = translated.replace(match, match.replace(".", ":"));
          };
        };
      }
      let titlesArray = Object.entries(americanToBritishTitles)
      for (let i = 0; i < titlesArray.length; i++ ) {
        let pair = titlesArray[i]
        let pattern = pair[1]
        pattern = "(^" + pattern + ")|(?<= )" + pattern + "(?=[ \.])";
        let regexp = new RegExp(pattern, 'gi')
        let test = regexp.test(translated)
        if (test === false) { continue; }
        regexp = new RegExp(pair[1], 'gi')
        let replacement = pair[0];
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1)
        if (span === true) {
          translated = translated.replace(regexp, '<span class="highlight">' + replacement + '</span>');
        } else {
          translated = translated.replace(regexp, replacement);
        }
      }
      let britishOnlyArray = Object.entries(britishOnly)
      for (let i = 0; i < britishOnlyArray.length; i++) {
        let pair = britishOnlyArray[i]
        let pattern = pair[0]
        pattern = "(^" + pattern + ")|(?<= )" + pattern + "(?=[ \.])";
        let regexp = new RegExp(pattern, 'gi')
        let test = regexp.test(translated)
        if (test === false) { continue; }
        regexp = new RegExp(pair[0], 'gi')
        let replacement = pair[1];
        if (span === true) {
          translated = translated.replace(regexp, '<span class="highlight">' + replacement + '</span>');
        } else {
          translated = translated.replace(regexp, replacement);
        };
      }
      let americanToBritishSpellingArray = Object.entries(americanToBritishSpelling)
      for (let i = 0; i < americanToBritishSpellingArray.length; i++) {
        let pair = americanToBritishSpellingArray[i]
        let pattern = pair[1]
        pattern = "(^" + pattern + ")|(?<= )" + pattern + "(?=[ \.])";
        let regexp = new RegExp(pattern, 'gi')
        let test = regexp.test(translated)
        if (test === false) { continue; }
        regexp = new RegExp(pair[1], 'gi')
        let replacement = pair[0];
        if (span === true) {
          translated = translated.replace(regexp, '<span class="highlight">' + replacement + '</span>');
        } else {
          translated = translated.replace(regexp, replacement);
        };
      }
      translated = translated.charAt(0).toUpperCase() + translated.slice(1)
      return translated
    };

}

module.exports = Translator;
