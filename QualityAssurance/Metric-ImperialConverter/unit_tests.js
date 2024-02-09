const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  //convertHandler should correctly read a whole number input
  test('Read whole number input (10L)', function(done) {
    assert.equal(convertHandler.getNum('10L'), 10);
    done();
  });
  //convertHandler should correctly read a decimal number input
  test('Read decimal number input (7.32mi)', function(done) {
    assert.equal(convertHandler.getNum('7.32mi'), 7.32);
    done();
  });
  //convertHandler should correctly read a fractional input
  test('Read fractional input (7/8gal)', function(done) {
    assert.equal(convertHandler.getNum('7/8gal'), 0.875);
    done();
  });
  //convertHandler should correctly read a fractional input with a decimal
  test('Read fractional input with decimal (3.2/0.8gal)', function(done) {
    assert.equal(convertHandler.getNum('3.2/0.8gal'), 4);
    done();
  });
  //convertHandler should correctly return an error on a double-fraction
  test('Return error on double-fraction (6/8/2gal)', function(done) {
    assert.equal(convertHandler.validateUnit('6/8/2gal'), "invalid number");
    done();
  });
  //convertHandler should correctly default to a numerical input of 1 when no numerical input is provided
  test('Return 1 when no numerical input is provided (gal)', function(done) {
    assert.equal(convertHandler.getNum('gal'), 1);
    done();
  });
  //convertHandler should correctly read each valid input unit
  test('Read each valid input unit (gal, L, mi, km, lbs, kg)', function(done) {
    assert.isTrue(convertHandler.validateUnit('gal'));
    assert.isTrue(convertHandler.validateUnit('L'));
    assert.isTrue(convertHandler.validateUnit('mi'));
    assert.isTrue(convertHandler.validateUnit('km'));
    assert.isTrue(convertHandler.validateUnit('lbs'));
    assert.isTrue(convertHandler.validateUnit('kg'));
    done();
  });
  //convertHandler should correctly return an error for an invalid input unit
  test('Return error on invalid unit (MW)', function(done) {
    assert.equal(convertHandler.validateUnit('MW'), "invalid unit");
    done();
  })
  //convertHandler should return the correct unit for each valid input unit
  test('Return correct unit for each valid input unit', function(done) {
    assert.equal(convertHandler.getReturnUnit('gal'), 'L');
    assert.equal(convertHandler.getReturnUnit('L'), 'gal');
    assert.equal(convertHandler.getReturnUnit('km'), 'mi');
    assert.equal(convertHandler.getReturnUnit('mi'), 'km');
    assert.equal(convertHandler.getReturnUnit('lbs'), 'kg');
    assert.equal(convertHandler.getReturnUnit('kg'), 'lbs');
    done();
  });
  //convertHandler should correctly return the spelled-out string unit for each valid input unit
  test('Return spelled-out string unit for each valid input unit', function(done) {
    assert.equal(convertHandler.spellOutUnit('gal'), 'gallons');
    assert.equal(convertHandler.spellOutUnit('L'), 'liters');
    assert.equal(convertHandler.spellOutUnit('mi'), 'miles');
    assert.equal(convertHandler.spellOutUnit('km'), 'kilometers');
    assert.equal(convertHandler.spellOutUnit('kg'), 'kilograms');
    assert.equal(convertHandler.spellOutUnit('lbs'), 'pounds');
    done();
  });
  //convertHandler should correctly convert gal to L
  test('Convert gal to 3.78541 L', function(done) {
    assert.equal(convertHandler.convert(1, 'gal'), 3.78541);
    done();
  });
  //convertHandler should correctly convert L to gal
  test('Convert L to 0.26417 gal', function(done) {
    assert.equal(convertHandler.convert(1, 'L'), 0.26417);
    done();
  })
  //convertHandler should correctly convert mi to km
  test('Convert mi to 1.60934 km', function(done) {
    assert.equal(convertHandler.convert(1, 'mi'), 1.60934);
    done();
  })
  //convertHandler should correctly convert km to mi
  test('Convert km to 0.62137 mi', function(done) {
    assert.equal(convertHandler.convert(1, 'km'), 0.62137);
    done();
  })
  //convertHandler should correctly convert lbs to kg
  test('Convert lbs to 0.45359 kg', function(done) {
    assert.equal(convertHandler.convert(1, 'lbs'), 0.45359);
    done();
  })
  //convertHandler should correctly convert kg to lbs
  test('Convert kg to 2.20462 gal', function(done) {
    assert.equal(convertHandler.convert(1, 'kg'), 2.20462);
    done();
  })
});
