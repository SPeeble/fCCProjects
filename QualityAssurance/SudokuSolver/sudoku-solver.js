class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) { return 'Required field missing'; };
    if (puzzleString.length !== 81) { return 'Expected puzzle to be 81 characters long'; };
    let verifier = /^[1-9\.]{81}$/
    if (verifier.test(puzzleString) === false) { return 'Invalid characters in puzzle'; };
    let answer = this.solve(puzzleString);
    if (typeof(answer) === 'string') { return answer; };
    answer = answer.join("");
    return answer;
  }

  solve(puzzleString) {
    let puzzle = this.initialPopulationCycle(puzzleString);
    let solvable = this.bruteForceSolve(0, puzzle)
    if (!solvable) { return 'Puzzle cannot be solved' };
    return puzzle;
  }

  initialPopulationCycle(puzzleString) {
    let puzzle = puzzleString.split('');
    let puzzlelength = puzzle.length
    for (let i = 0; i < puzzlelength; i++) {
      if (puzzle[i] !== ".") { continue; }
      let [rowArray, colArray, regionArray] = this.getPlacementInfo(puzzle, i)
      let possibleNumbers = this.getPossibleNumbers(rowArray, colArray, regionArray);
      if (possibleNumbers.length === 1) {
        puzzle[i] = possibleNumbers[0];
        [rowArray, colArray, regionArray] = this.getPlacementInfo(puzzle, i)
        puzzle = this.reevaluateAssociatedArrays(puzzle, rowArray, colArray, regionArray, i)
      } else {
        puzzle[i] = possibleNumbers
      }
    }
    return puzzle
  }

  reevaluateAssociatedArrays(puzzle, rowArray, colArray, regionArray, sourceIndex) {
    let answer = puzzle[sourceIndex];
    for (let i = 0; i < rowArray.length; i++) {
      if (typeof(rowArray[i]) != 'object') { continue; }
      if (rowArray[i].includes(answer)) {
        let row = Math.floor(sourceIndex/9) * 9;
        let col = i;
        let index = row + col;
        puzzle[index].splice(rowArray[i].indexOf(answer), 1);
        if (puzzle[index].length === 1) {
          puzzle[index] = rowArray[i][0];
          let [scnRowArray, scnColArray, scnRegionArray] = this.getPlacementInfo(puzzle, index);
          puzzle = this.reevaluateAssociatedArrays(puzzle, scnRowArray, scnColArray, scnRegionArray, index);
        }
      }
    };
    for (let i = 0; i < colArray.length; i++) {
      if (typeof(colArray[i]) != 'object') { continue; }
      if (colArray[i].includes(answer)) {
        let row = i * 9;
        let col = sourceIndex % 9
        let index = row + col;
        puzzle[index].splice(colArray[i].indexOf(answer), 1);
        if (puzzle[index].length === 1) {
          puzzle[index] = colArray[i][0];
          let [scnRowArray, scnColArray, scnRegionArray] = this.getPlacementInfo(puzzle, index);
          puzzle = this.reevaluateAssociatedArrays(puzzle, scnRowArray, scnColArray, scnRegionArray, index);
        }
      }
    }
    for (let i = 0; i < regionArray.length; i++) {
      if (typeof(regionArray[i]) != 'object') { continue };
      if (regionArray[i].includes(answer)) {
        let regionCol = i % 3;
        let regionRow = Math.floor(i / 3);
        let answerCol = rowArray.indexOf(answer);
        let answerRow = colArray.indexOf(answer);
        let regionStartIndex = Math.floor(answerRow / 3) * 27 + Math.floor(answerCol / 3) * 3;
        let index = regionStartIndex + (regionRow * 9) + regionCol;
        puzzle[index].splice(regionArray[i].indexOf(answer), 1);
        if (puzzle[index].length === 1) {
          puzzle[index] = regionArray[i][0];
          let [scnRowArray, scnColArray, scnRegionArray] = this.getPlacementInfo(puzzle, index);
          puzzle = this.reevaluateAssociatedArrays(puzzle, scnRowArray, scnColArray, scnRegionArray, index);
        }
      }
    }
    return puzzle
  }

  bruteForceSolve(index, puzzle) {
    if (index === puzzle.length) { return puzzle; };
    if (!Array.isArray(puzzle[index])) { return this.bruteForceSolve(index + 1, puzzle); };
    let arrayCopy = [...puzzle[index]]
    for (let i = 0; i < puzzle[index].length; i++) {
      puzzle[index] = puzzle[index][i]
      if (this.callAllChecks(puzzle, index, 'boolean') === false) {
        puzzle[index] = arrayCopy;
        continue; 
      };
      let result = this.bruteForceSolve(index + 1, puzzle)
      if (result !== false) { return result; };
      puzzle[index] = arrayCopy;
    }
    return false;
  }

  getPossibleNumbers(rowArray, colArray, regionArray) {
    let possibleNumbers = ['1','2','3','4','5','6','7','8','9'];
    possibleNumbers = possibleNumbers.filter(function(number) {
      if (rowArray.includes(number) || colArray.includes(number) || regionArray.includes(number)) {
        return false
      } else {
        return true;
      };
    })
    return possibleNumbers
  }

  callAllChecks(puzzle, index, outputKey, value) {
    let isValid = [];
    if (outputKey === 'boolean') {
      value = puzzle[index]
    }
    if (this.checkRowPlacement(puzzle, index, value) === false) { isValid.push('row') };
    if (this.checkColPlacement(puzzle, index, value) === false) { isValid.push('column') };
    if (this.checkRegionPlacement(puzzle, index, value) === false) { isValid.push('region') };
    if (outputKey == 'error') { 
      return isValid
    } else if (outputKey == 'boolean' && isValid.length > 0) {
      return false
    }
    return true;
  }

  getPlacementInfo(puzzle, numIndex) {
    let row = Math.floor(numIndex / 9);
    let col = numIndex % 9;
    let rowArray = puzzle.slice(row * 9, row * 9 + 9);
    let colArray = [];
    for (let i = 0; i < 9; i++) {
      colArray.push(puzzle[i * 9 + col]);
    };
    let regionArray = [];
    let regionRowStart = Math.floor(row / 3) * 3;
    let regionColStart = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      let startPos = (regionRowStart + i) * 9 + regionColStart
      let endPos = startPos + 3;
      regionArray = regionArray.concat(puzzle.slice(startPos, endPos));
    };
    return [rowArray, colArray, regionArray];
  }

  checkRowPlacement(puzzle, index, value) {
    let row = Math.floor(index / 9);
    puzzle[index] = '.';
    let rowArray = puzzle.slice(row * 9, row * 9 + 9);
    puzzle[index] = value
    if (rowArray.includes(value)) { return false };
    return true;
  }

  checkColPlacement(puzzle, index, value) {
    let column = index % 9;
    puzzle[index] = '.';
    let colArray = [];
    for (let i = 0; i < 9; i++) {
      colArray.push(puzzle[i * 9 + column])
    };
    puzzle[index] = value
    if (colArray.includes(value)) { return false };
    return true;
  }

  checkRegionPlacement(puzzle, index, value) {
    let row = Math.floor(index / 9);
    let column = index % 9;
    puzzle[index] = '.';
    let regionArray = [];
    let regionRowStart = Math.floor(row / 3) * 3;
    let regionColStart = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      let startPos = (regionRowStart + i) * 9 + regionColStart
      for (let j = 0; j < 3; j++) {
        regionArray.push(puzzle[startPos + j])
      }
    }
    puzzle[index] = value
    if (regionArray.includes(value)) { return false };
    return true;
  }
  
}

module.exports = SudokuSolver;

