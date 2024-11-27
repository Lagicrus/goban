import { Goban } from './index';

function test_white_is_taken_when_surrounded_by_black() {
  const goban = new Goban([
    ".#.",
    "#o#",
    ".#."
  ])

  console.log(`Test 1, should be true: ${goban.is_taken(1, 1)}`);
}

function test_white_is_not_taken_when_it_has_a_liberty() {
  const goban = new Goban([
    '...',
    '#o#',
    '.#.',
  ])

  console.log(`Test 2, should be false: ${goban.is_taken(1, 1)}`);
}

function test_black_shape_is_taken_when_surrounded() {
  const goban = new Goban([
    'oo.',
    '##o',
    'o#o',
    '.o.',
  ])

  console.log(`Test 3, should be true: ${goban.is_taken(0, 1)}`);
  console.log(`Test 4, should be true: ${goban.is_taken(1, 1)}`);
  console.log(`Test 5, should be true: ${goban.is_taken(1, 2)}`);
}

function test_black_shape_is_not_taken_when_it_has_a_liberty() {
  const goban = new Goban([
    'oo.',
    '##.',
    'o#o',
    '.o.',
  ])

  console.log(`Test 6, should be false: ${goban.is_taken(0, 1)}`);
  console.log(`Test 7, should be false: ${goban.is_taken(1, 1)}`);
  console.log(`Test 8, should be false: ${goban.is_taken(1, 2)}`);
}

function test_square_shape_is_taken() {
  const goban = new Goban([
    'oo.',
    '##o',
    '##o',
    'oo.',
  ])

  console.log(`Test 9, should be true: ${goban.is_taken(0, 1)}`);
  console.log(`Test 10, should be true: ${goban.is_taken(0, 2)}`);
  console.log(`Test 11, should be true: ${goban.is_taken(1, 1)}`);
  console.log(`Test 12, should be true: ${goban.is_taken(1, 2)}`);
}

test_white_is_taken_when_surrounded_by_black();
test_white_is_not_taken_when_it_has_a_liberty();
test_black_shape_is_taken_when_surrounded();
test_black_shape_is_not_taken_when_it_has_a_liberty();
test_square_shape_is_taken();
