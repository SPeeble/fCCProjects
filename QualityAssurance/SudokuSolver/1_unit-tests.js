const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

import {puzzlesAndSolutions as puzzlestrings} from '../controllers/puzzle-strings.js';


suite('Unit Tests', () => {

    test('Logic handles a valid puzzle string of 81 characters', function() {
      assert.equal(solver.validate(
        '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        ), 
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      );
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
      assert.equal(solver.validate(
        'gjfhsufitjgnfhsjfitughfjansjfkdlikejfjdhtifoslajkfngifjatresdififigihutiskdnhandg'
        ),
      'Invalid characters in puzzle'
      );
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function() {
      assert.equal(solver.validate('2184.34634.22.'), 'Expected puzzle to be 81 characters long');
    });

    test('Logic handles a valid row placement', function() {
      let puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      puzzle = puzzle.split('');
      assert.isTrue(solver.checkRowPlacement(puzzle, 0, '1'));
    });

    test('Logic handles an invalid row placement', function() {
       let puzzle = '135762914946381257728459613694517832812936745357824196473298561581673429269145378'
      puzzle = puzzle.split('');
      assert.isFalse(solver.checkRowPlacement(puzzle ,0, '1'));
    });

    test('Logic handles a valid column placement', function() {
      let puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      puzzle = puzzle.split('');
      assert.isTrue(solver.checkColPlacement(puzzle, 0, '1'));
    });

    test('Logic handles an invalid column placement', function() {
      let puzzle = '135762984946381257128459613694517832812936745357824196473298561581673429269145378'
      puzzle = puzzle.split('');
      assert.isFalse(solver.checkColPlacement(puzzle, 0, '1'));
    });

    test('Logic handles a valid region (3x3 grid) placement', function() {
      let puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      puzzle = puzzle.split('');
      assert.isTrue(solver.checkRegionPlacement(puzzle, 0, '1'));
    });

    test('Logic handles an invalid region (3x3 grid) placement', function() {
      let puzzle = '135762984941381257728459613694517832812936745357824196473298561581673429269145378'
      puzzle = puzzle.split('');
      assert.isFalse(solver.checkRegionPlacement(puzzle, 0, '1'));
    });

    test('Valid puzzle strings pass the solver', function() {

      assert.equal(solver.validate(puzzlestrings[0][0]), puzzlestrings[0][1]);

      assert.equal(solver.validate(puzzlestrings[1][0]), puzzlestrings[1][1]);

      assert.equal(solver.validate(puzzlestrings[2][0]), puzzlestrings[2][1]);
    });

    test('Invalid puzzle strings fail the solver', function() {
      let puzzle = '..839.7.575.....964.11.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
      assert.equal(solver.validate(puzzle), 'Puzzle cannot be solved');
    });

    test('Solver returns the expected solution for an incomplete puzzle', function() {
      let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      assert.equal(solver.validate(puzzle), 
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      );
    });
  
});
