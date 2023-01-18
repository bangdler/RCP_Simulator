import { getRandomNumIncludeMax } from '@/utils/utils';

export interface IRCP {
  curX: number;
  curY: number;
  type: string;
  animate: (ctx: CanvasRenderingContext2D) => void;
  randomMove: () => void;
  updateLimit: (x: number, y: number) => void;
}

type RCP_Constructor = {
  id: number;
  startX: number;
  startY: number;
  type: string;
  limitX: number;
  limitY: number;
  size: number;
};

export class RCP {
  id: number;
  curX: number;
  curY: number;
  type: string;
  limitX: number;
  limitY: number;
  size: number;
  private curDir: string;
  readonly directions: { [index: string]: Array<number> };
  constructor({
    id,
    startX,
    startY,
    type,
    limitX,
    limitY,
    size,
  }: RCP_Constructor) {
    this.id = id;
    this.size = size;
    this.curX = startX;
    this.curY = startY;
    this.type = type;
    this.directions = {
      up: [0, 1],
      down: [0, -1],
      left: [-1, 0],
      right: [1, 0],
      upRight: [1, 1],
      downRight: [1, -1],
      upLeft: [-1, 1],
      downLeft: [-1, -1],
    };
    this.curDir = Object.keys(this.directions)[getRandomNumIncludeMax(0, 6)];
    this.limitX = limitX;
    this.limitY = limitY;
  }

  getId() {
    return this.id;
  }

  animate(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.type, this.curX, this.curY);
  }

  randomMove() {
    const newX = this.curX + this.directions[this.curDir][0];
    const newY = this.curY + this.directions[this.curDir][1];
    if (
      newX < this.size ||
      newY < this.size ||
      newX >= this.limitX ||
      newY >= this.limitY
    ) {
      const randomIdx = getRandomNumIncludeMax(0, 6);
      const newDir = Object.keys(this.directions)[randomIdx];
      this.curDir = newDir;
      return;
    }
    this.curX += this.directions[this.curDir][0];
    this.curY += this.directions[this.curDir][1];
  }

  updateLimit(limitX: number, limitY: number) {
    this.limitX = limitX;
    this.limitY = limitY;
  }
}
