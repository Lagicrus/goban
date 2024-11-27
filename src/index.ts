/*

# = black
o = white
. = empty

*/

enum Status {
  WHITE = 1,
  BLACK = 2,
  EMPTY = 3,
  OUT = 4
}

class Goban {
  goban: string[];

  constructor(goban: string[]) {
    this.goban = goban;
  }

  /**
   * Get the status of a given position
   * @param x
   * @param y
   * @returns Status
   */
  get_status(x: number, y: number): Status {
    if (!this.goban || x < 0 || y < 0 || y >= this.goban.length || x >= this.goban[0].length) {
      return Status.OUT;
    } else if (this.goban[y][x] === ".") {
      return Status.EMPTY;
    } else if (this.goban[y][x] === "o") {
      return Status.WHITE;
    } else if (this.goban[y][x] === "#") {
      return Status.BLACK;
    }
    throw new Error(`Unknown goban value ${this.goban[y][x]}`);
  }

  is_taken(x: number, y: number) {
    const topPositionStatus = this.get_status(x, y - 1);
    const rightPositionStatus = this.get_status(x + 1, y);
    const leftPositionStatus = this.get_status(x - 1, y);
    const bottomPositionStatus = this.get_status(x, y + 1);

    const statuses = [topPositionStatus, rightPositionStatus, leftPositionStatus, bottomPositionStatus];

    // If the stone is surrounded by stones OR outside the board
    if (statuses.every(status => [Status.WHITE, Status.BLACK, Status.OUT].includes(status))) {
      return true
    }

    return false;
  }
}

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

test_white_is_taken_when_surrounded_by_black();
test_white_is_not_taken_when_it_has_a_liberty();
test_black_shape_is_taken_when_surrounded();
test_black_shape_is_not_taken_when_it_has_a_liberty();
