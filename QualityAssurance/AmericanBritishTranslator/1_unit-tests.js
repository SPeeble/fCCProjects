const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');


suite('Unit Tests', () => {

    const translator = new Translator();

    test('Translate "Mangoes are my favorite fruit." to British English', function() {
      let testString = "Mangoes are my favorite fruit.";
      let expected = "Mangoes are my favourite fruit.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "I ate yogurt for breakfast." to British English', function() {
      let testString = "I ate yogurt for breakfast.";
      let expected = "I ate yoghurt for breakfast.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "We had a party at my friend\'s condo." to British English', function() {
      let testString = "We had a party at my friend's condo.";
      let expected = "We had a party at my friend's flat.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Can you toss this in the trashcan for me?" to British English', function(){
      let testString = "Can you toss this in the trashcan for me?";
      let expected = "Can you toss this in the bin for me?";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "The parking lot was full." to British English', function() {
      let testString = "The parking lot was full.";
      let expected = "The car park was full.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Like a high tech Rube Goldberg machine." to British English', function() {
      let testString = "Like a high tech Rube Goldberg machine.";
      let expected = "Like a high tech Heath Robinson device.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "To play hooky means to skip class or work." to British English', function() {
      let testString = "To play hooky means to skip class or work.";
      let expected = "To bunk off means to skip class or work.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "No Mr. Bond, I expect you to die." to British English', function() {
      let testString = "No Mr. Bond, I expect you to die.";
      let expected = "No Mr Bond, I expect you to die.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Dr. Grosh will see you now." to British English', function() {
      let testString = "Dr. Grosh will see you now.";
      let expected = "Dr Grosh will see you now.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Lunch is at 12:15 today." to British English', function() {
      let testString = "Lunch is at 12:15 today.";
      let expected = "Lunch is at 12.15 today.";
      let result = translator.translateToBritish(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "We watched the footie match for a while." to American English', function() {
      let testString = "We watched the footie match for a while.";
      let expected = "We watched the soccer match for a while.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Paracetamol takes up to an hour to work." to American English', function() {
      let testString = "Paracetamol takes up to an hour to work.";
      let expected = "Tylenol takes up to an hour to work.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "First, caramelise the onions." to American English', function() {
      let testString = "First, caramelise the onions.";
      let expected = "First, caramelize the onions.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "I spent the bank holiday at the funfair." to American English', function() {
      let testString = "I spent the bank holiday at the funfair.";
      let expected = "I spent the public holiday at the carnival.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "I had a bicky then went to the chippy." to American English', function() {
      let testString = "I had a bicky then went to the chippy.";
      let expected = "I had a cookie then went to the fish-and-chip shop.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "I\'ve just got bits and bobs in my bum bag." to American English', function(){
      let testString = "I've just got bits and bobs in my bum bag.";
      let expected = "I've just got odds and ends in my fanny pack.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "The car boot sale at Boxted Airfield was called off." to American English', function() {
      let testString = "The car boot sale at Boxted Airfield was called off.";
      let expected = "The swap meet at Boxted Airfield was called off.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Have you met Mrs Kalyani?" to American English', function() {
      let testString = "Have you met Mrs Kalyani?";
      let expected = "Have you met Mrs. Kalyani?";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Prof Joyner of King\'s College, London." to American English', function() {
      let testString = "Prof Joyner of King's College, London.";
      let expected = "Prof. Joyner of King's College, London.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Translate "Tea time is usually around 4 or 4.30." to American English', function() {
      let testString = "Tea time is usually around 4 or 4.30.";
      let expected = "Tea time is usually around 4 or 4:30.";
      let result = translator.translateToAmerican(testString, false);
      assert.equal(result, expected);
    });

    test('Highlight translation in "Mangoes are my favorite fruit."', function() {
      let testString = "Mangoes are my favorite fruit.";
      let expected = 'Mangoes are my <span class="highlight">favourite</span> fruit.';
      let result = translator.translateToBritish(testString, true);
      assert.equal(result, expected);
    });

    test('Highlight translation in "I ate yogurt for breakfast."', function() {
      let testString = "I ate yogurt for breakfast.";
      let expected = 'I ate <span class="highlight">yoghurt</span> for breakfast.';
      let result = translator.translateToBritish(testString, true);
      assert.equal(result, expected);
    });

    test('Highlight translation in "We watched the footie match for a while."', function() {
      let testString = "We watched the footie match for a while.";
      let expected = 'We watched the <span class="highlight">soccer</span> match for a while.';
      let result = translator.translateToAmerican(testString, true);
      assert.equal(result, expected);
    });

    test('Highlight translation in "Paracetamol takes up to an hour to work."', function() {
      let testString = "Paracetamol takes up to an hour to work.";
      let expected = '<span class="highlight">Tylenol</span> takes up to an hour to work.';
      let result = translator.translateToAmerican(testString, true);
      assert.equal(result, expected);
    });
});
