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

export class Goban {
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

  /**
   * Get the status of a given position and its position
   * @param x
   * @param y
   * @returns NeighbourStatus
   */
  get_neighbour_status(x: number, y: number): NeighbourStatus {
    return {
      status: this.get_status(x, y),
      position: [x, y],
    };
  }

  /**
   * Get the statuses of all the neighbours of a given position
   * @param x
   * @param y
   * @returns NeighbourStatus[]
   */
  get_neighbour_statuses(x: number, y: number): NeighbourStatus[] {
    return [
      this.get_neighbour_status(x, y - 1),
      this.get_neighbour_status(x + 1, y),
      this.get_neighbour_status(x - 1, y),
      this.get_neighbour_status(x, y + 1),
    ];
  }

  is_taken(x: number, y: number) {
    const neighbourStatuses = this.get_neighbour_statuses(x, y)
    const selfStatus = this.get_status(x, y);

    const defaultFilterList = [Status.WHITE, Status.BLACK, Status.OUT];
    // Filter out the current stone's status as that doesn't block it
    const filterListNotSelf = defaultFilterList.filter(status => status !== selfStatus);

    // If the stone is surrounded by stones that are not the same colour as it OR outside the board
    if (neighbourStatuses.every(neighbour => filterListNotSelf.includes(neighbour.status))) {
      return true
    }

    // If the stone starts with an empty neighbour, bail early
    if (neighbourStatuses.some(neighbour => neighbour.status === Status.EMPTY)) {
      return false;
    }

    // Get an array of all the neighbours that are the same colour as the current stone to check
    let toCheckNeighbours = neighbourStatuses.filter(neighbour => neighbour.status === selfStatus);
    // Keep a check of what we have already checked so we don't check it again
    // Initialised with the current position
    let checkedNeighbours = new Set<string>();
    while(toCheckNeighbours.length > 0) {
      // We can cast to NeighbourStatus as we know it will always be a NeighbourStatus
      // due to the while .length > 0 check
      const checkingNeighbour = (toCheckNeighbours.shift() as NeighbourStatus);
      checkedNeighbours.add(`${checkingNeighbour.position[0]},${checkingNeighbour.position[1]}`);

      const neighbourStatuses = this.get_neighbour_statuses(checkingNeighbour.position[0], checkingNeighbour.position[1])
      // If the current stone has an empty neighbour, it is not taken, bail early
      if(neighbourStatuses.some(status => status.status === Status.EMPTY)) {
        return false;
      }

      neighbourStatuses.forEach(neighbour => {
        if (neighbour.status === selfStatus && !checkedNeighbours.has(`${neighbour.position[0]},${neighbour.position[1]}`)) {
          toCheckNeighbours.push(neighbour);
        }
      })
    }

    return true;
  }
}
