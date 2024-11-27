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

interface NeighbourStatus {
  status: Status;
  position: [number, number];
}

function arrayContainsArray(mainArray: any[], innerArray: any[]) {
  return mainArray.some((element) => {
    return JSON.stringify(element) === JSON.stringify(innerArray);
  })
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

  get_neighbour_status(x: number, y: number): NeighbourStatus {
    return {
      status: this.get_status(x, y),
      position: [x, y],
    };
  }

  is_taken(x: number, y: number) {
    const topPositionStatus = this.get_neighbour_status(x, y - 1); //[this.get_status(x, y - 1), [x, y - 1]];
    const rightPositionStatus = this.get_neighbour_status(x + 1, y); //[this.get_status(x + 1, y), [x + 1, y]];
    const leftPositionStatus = this.get_neighbour_status(x - 1, y); //[this.get_status(x - 1, y), [x - 1, y]];
    const bottomPositionStatus = this.get_neighbour_status(x, y + 1); //[this.get_status(x, y + 1), [x, y + 1]];
    const selfStatus = this.get_status(x, y);

    const neighbourStatuses = [topPositionStatus, rightPositionStatus, leftPositionStatus, bottomPositionStatus];
    const defaultFilterList = [Status.WHITE, Status.BLACK, Status.OUT];
    const filterListNotSelf = defaultFilterList.filter(status => status !== selfStatus);

    // If the stone is surrounded by stones that are not the same colour as it OR outside the board
    if (neighbourStatuses.every(status => filterListNotSelf.includes(status.status))) {
      return true
    }

    if (neighbourStatuses.some(status => status.status === Status.EMPTY)) {
      return false;
    }

    const sameNeighbours = neighbourStatuses.filter(status => status.status === selfStatus);
    let toCheckNeighbours = sameNeighbours;
    // Keep a check of what we have already checked so we don't check it again
    // Initialised with the current position
    let checkedNeighbours = [[x,y]];
    // We don't test for sameNeighbours.length == 0 because we already checked for that in the .every test
    while(toCheckNeighbours.length > 0) {
      // We can cast to NeighbourStatus as we know it will always be a NeighbourStatus
      // due to the while .length > 0 check
      const checkingNeighbour = (toCheckNeighbours.shift() as NeighbourStatus);
      checkedNeighbours.push(checkingNeighbour.position);

      const topPositionStatus = this.get_neighbour_status(checkingNeighbour.position[0], checkingNeighbour.position[1] - 1);
      const rightPositionStatus = this.get_neighbour_status(checkingNeighbour.position[0] + 1, checkingNeighbour.position[1]);
      const leftPositionStatus = this.get_neighbour_status(checkingNeighbour.position[0] - 1, checkingNeighbour.position[1]);
      const bottomPositionStatus = this.get_neighbour_status(checkingNeighbour.position[0], checkingNeighbour.position[1] + 1);

      const neighbourStatuses = [topPositionStatus, rightPositionStatus, leftPositionStatus, bottomPositionStatus];
      if(neighbourStatuses.some(status => status.status === Status.EMPTY)) {
        return false;
      }

      neighbourStatuses.forEach(neighbour => {
        if (!filterListNotSelf.includes(neighbour.status) && !arrayContainsArray(checkedNeighbours, neighbour.position)) {
          toCheckNeighbours.push(neighbour);
        }
      })
    }

    return true;
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
