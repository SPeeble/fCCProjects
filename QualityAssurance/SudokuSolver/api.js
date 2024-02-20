'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzleString = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      if (!puzzleString || !coordinate || !value) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      let coordinateRegex = /^[A-I][1-9]$/;
      let valueRegex = /^[1-9]$/;
      if (coordinateRegex.test(coordinate) === false) { 
        res.json({ error: 'Invalid coordinate' });
        return;
      }
      if (valueRegex.test(value) === false) {
        res.json({ error: 'Invalid value' });
        return;
      }
      let puzzle = puzzleString.split('')
      let result = solver.validate(puzzleString);
      if (result.length !== 81) { res.json({ error: result }); return; };
      let letterArr = ['A','B','C','D','E','F','G','H', 'I'];
      coordinate = coordinate.split('')
      let row = letterArr.indexOf(coordinate[0]);
      let column = Number(coordinate[1]) - 1;
      let index = row * 9 + column;
      let isValid = solver.callAllChecks(puzzle, index, 'error', value)
      if (isValid.length > 0 ) {
        res.json({ valid: false, conflict: isValid });
        return;
      };
      if (result[index] === value) {
        res.json({ valid: true });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle;
      if (!puzzleString) { res.json({ error: 'Required field missing' }); return; };
      let result = solver.validate(puzzleString);
      if (result.length !== 81) { res.json({ error: result }); return; };
      res.json({solution: result});
    });
};
