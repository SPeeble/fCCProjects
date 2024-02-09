function ConvertHandler() {

  this.validateUnit = function(input) {
    let validRegex = /^([0-9]*\.0*[1-9][0-9]*\/[0-9]*\.0*[1-9][0-9]*|0*[1-9][0-9]*\.[0-9]*\/0*[1-9][0-9]*\.[0-9]*|0*[1-9][0-9]*\.[0-9]*\/[0-9]*\.0*[1-9][0-9]*|[0-9]*\.0*[1-9][0-9]*\/0*[1-9][0-9]*\.[0-9]*|[0-9]*|[0-9]*\.0*[1-9][0-9]*|0*[1-9][0-9]*\.[0-9]*|0*[1-9][0-9]*\/0*[1-9][0-9]*|[0-9]*\.0*[1-9][0-9]*\/0*[1-9][0-9]*|0*[1-9][0-9]*\.[0-9]+\/0*[1-9][0-9]*|0*[1-9][0-9]*\/0*[1-9][0-9]*\.[0-9]+|0*[1-9][0-9]*\/[0-9]+\.0*[1-9][0-9]*)([a-zA-Z]*)$/;
    let unitRegex = /[a-zA-Z]+$/;
    if (!validRegex.test(input)) { 
      if (input.match(unitRegex)) {
        let unit = input.match(unitRegex)[0]
        unit = this.formatUnit(unit)
        if (this.unitsDB[unit] === undefined) { return "invalid number and unit" }
        return "invalid number"
      } else {
        return "invalid number and unit"
      }
    };
    let unit = input.match(validRegex)[2];
    unit = this.formatUnit(unit)
    if (this.unitsDB[unit] === undefined) { return "invalid unit" };
    return true
  }

  this.formatUnit = function(input) {
    let result;
    result = input.toLowerCase();
    if (result == 'l') {result = 'L'}
    return result
  }
  
  this.getNum = function(input) {
    let result;
    // 1.(1)!/1.(1)! - (1)!.1/(1)!.1 - (1)!.1/1.(1)! - 1.(1)!/(1)!.1 - 1+ - (1)?.1 - 1.(1)? - 1/1 - 1.(1)!/1 - (1)!.1/1 - 1/(1)!.1 - 1/1.(1)!
    // ()! = must be greater than 0
    let strictRegex = /^([0-9]*\.0*[1-9][0-9]*\/[0-9]*\.0*[1-9][0-9]*|0*[1-9][0-9]*\.[0-9]*\/0*[1-9][0-9]*\.[0-9]*|0*[1-9][0-9]*\.[0-9]*\/[0-9]*\.0*[1-9][0-9]*|[0-9]*\.0*[1-9][0-9]*\/0*[1-9][0-9]*\.[0-9]*|0*[1-9][0-9]*|[0-9]*\.0*[1-9][0-9]*|0*[1-9][0-9]*\.[0-9]*|0*[1-9][0-9]*\/0*[1-9][0-9]*|[0-9]*\.0*[1-9][0-9]*\/0*[1-9][0-9]*|0*[1-9][0-9]*\.[0-9]+\/0*[1-9][0-9]*|0*[1-9][0-9]*\/0*[1-9][0-9]*\.[0-9]+|0*[1-9][0-9]*\/[0-9]+\.0*[1-9][0-9]*)([a-zA-Z]+)$/;
    if (input.match(strictRegex)) {
      result = eval(input.match(strictRegex)[1]);
    } else {
      result = 1
    }
    return result;
  };

  this.unitsDB = {
    'gal': { reciprocate: 'L', spellout: 'gallons', convertMult: () => 3.78541 },
    'L': { reciprocate: 'gal', spellout: 'liters', convertMult: () => 1/3.78541 },
    'mi': { reciprocate: 'km', spellout: 'miles', convertMult: () => 1.60934 },
    'km': { reciprocate: 'mi', spellout: 'kilometers', convertMult: () => 1/1.60934 },
    'lbs': { reciprocate: 'kg', spellout: 'pounds', convertMult: () => 0.453592 },
    'kg': { reciprocate: 'lbs', spellout: 'kilograms', convertMult: () => 1/0.453592 }
  }
  
  this.getUnit = function(input) {
    let result;
    let unitRegex = /[a-zA-Z]+$/;
    result = input.match(unitRegex)
    result = (result[result.length-1]);
    result = this.formatUnit(result)
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    let result;
    result = this.unitsDB[initUnit].reciprocate;
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result;
    result = this.unitsDB[unit].spellout;
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    result = initNum * this.unitsDB[initUnit].convertMult();
    result = (Math.round(result * 100000))/100000
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    result = "" + initNum + " " + this.spellOutUnit(initUnit) + " converts to " + returnNum + " " + this.spellOutUnit(returnUnit);
    return result;
  };
  
}

module.exports = ConvertHandler;
