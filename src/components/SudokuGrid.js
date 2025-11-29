import React, { useState } from 'react';
import './SudokuGrid.css';

function SudokuGrid() {
  const initialPuzzle = [
    [5, 3, '', '', 7, '', '', '', ''],
    [6, '', '', 1, 9, 5, '', '', ''],
    ['', 9, 8, '', '', '', '', 6, ''],
    [8, '', '', '', 6, '', '', '', 3],
    [4, '', '', 8, '', 3, '', '', 1],
    [7, '', '', '', 2, '', '', '', 6],
    ['', 6, '', '', '', '', 2, 8, ''],
    ['', '', '', 4, 1, 9, '', '', 5],
    ['', '', '', '', 8, '', '', 7, 9]
  ];

  const [grid, setGrid] = useState(initialPuzzle);

  const handleChange = (row, col, value) => {
    if (!/^[1-9]?$/.test(value)) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-grid">
        {grid.map((row, r) => (
          <div key={r} className="sudoku-row">
            {row.map((cell, c) => {
              const isPrefilled = initialPuzzle[r][c] !== '';

              return (
                <input
                  key={`${r}-${c}`}
                  className={`sudoku-cell ${isPrefilled ? 'prefilled' : ''}`}
                  maxLength="1"
                  value={cell}
                  onChange={e => handleChange(r, c, e.target.value)}
                  disabled={isPrefilled}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SudokuGrid;
