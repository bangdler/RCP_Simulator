import { Hand, I_Hand } from '@/Hand/Hand';
import { DRAW, FIGHTING, LOSE, WIN } from '@/Hand/constants';
import { getRandomNumExcludeMax } from '@/utils/utils';

export interface I_HandTable {
  handTable: { [index: number]: I_Hand };
  numOfHands: { [index: string]: number };
  animateHands: (ctx: CanvasRenderingContext2D) => void;
  resetTable: () => void;
  velocity: number;
}
type HandTable_Constructor = {
  initNum: number;
  handTypes: Array<string>;
  width: number;
  height: number;
  size: number;
};
export class HandTable implements I_HandTable {
  handTable: { [index: number]: I_Hand };
  numOfHands: { [index: string]: number };
  readonly initNum: number;
  readonly handTypes: Array<string>;
  readonly width: number;
  readonly height: number;
  readonly size: number;
  private total: number;
  velocity: number;
  constructor({
    initNum,
    handTypes,
    width,
    height,
    size,
  }: HandTable_Constructor) {
    this.initNum = initNum;
    this.handTypes = handTypes;
    this.width = width;
    this.height = height;
    this.size = size;
    this.numOfHands = {
      [handTypes[0]]: initNum,
      [handTypes[1]]: initNum,
      [handTypes[2]]: initNum,
    };
    this.velocity = 1;
    this.total = initNum * handTypes.length;
    this.handTable = this.makeHandTable();
  }

  makeHandTable(): { [index: number]: I_Hand } {
    const obj: { [index: number]: I_Hand } = {};
    for (let i = 0; i < this.initNum * this.handTypes.length; i++) {
      obj[i] = new Hand({
        id: i,
        startX: getRandomNumExcludeMax(this.size, this.width - this.size),
        startY: getRandomNumExcludeMax(this.size, this.height - this.size),
        type: this.handTypes[i % this.handTypes.length],
        limitX: this.width - this.size,
        limitY: this.height - this.size,
        size: this.size,
        velocity: this.velocity,
      });
    }
    return obj;
  }

  getOverlapTable(): { [index: number]: Array<string> } {
    const overlapTable: { [index: number]: Array<string> } = {};
    for (let i in this.handTable) {
      const cur = this.handTable[i];
      for (let j in this.handTable) {
        const compare = this.handTable[j];
        if (cur.id === compare.id) continue;
        const [diffX, diffY] = [
          Math.abs(cur.curX - compare.curX),
          Math.abs(cur.curY - compare.curY),
        ];
        if (diffX > this.size || diffY > this.size) continue;
        // 겹치는 경우 대결을 진행하고 결과값을 배열에 넣는다.
        const fightResult = cur.fight(compare.type);
        if (!overlapTable[cur.id]) {
          overlapTable[cur.id] = [fightResult];
        } else {
          overlapTable[cur.id].push(fightResult);
        }
      }
    }
    return overlapTable;
  }

  setFightingEffect(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(FIGHTING, x, y);
  }

  setFightResultIfOverlap(ctx: CanvasRenderingContext2D) {
    const overlapTable = this.getOverlapTable();

    for (let idx in overlapTable) {
      const overlappedHand = this.handTable[idx];
      const fightResults = overlapTable[idx];

      if (fightResults.includes(LOSE) && !fightResults.includes(WIN)) {
        overlappedHand.setFightResult(LOSE);
      } else if (fightResults.includes(WIN) && !fightResults.includes(LOSE)) {
        overlappedHand.setFightResult(WIN);
      } else {
        overlappedHand.setFightResult(DRAW);
      }

      if (!overlappedHand.first) {
        this.setFightingEffect(ctx, overlappedHand.curX, overlappedHand.curY);
      } else {
        overlappedHand.setFirst(false);
      }
    }
  }

  animateHands(ctx: CanvasRenderingContext2D) {
    for (let idx in this.handTable) {
      const hand = this.handTable[idx];
      hand.animate(ctx);

      if (hand.fightResult === LOSE) {
        this.numOfHands[hand.type] -= 1;
        delete this.handTable[idx];
        this.total -= 1;
        continue;
      }

      if (this.total < 5) {
        this.velocity = 4;
      } else if (
        this.total === Math.floor((this.initNum * this.handTypes.length) / 3)
      ) {
        this.velocity = 3;
      } else if (
        this.total === Math.floor((this.initNum * this.handTypes.length) / 1.5)
      ) {
        this.velocity = 2;
      }

      hand.setVelocity(this.velocity);
      hand.randomMove();
    }

    this.setFightResultIfOverlap(ctx);
  }

  resetTable() {
    this.numOfHands = {
      [this.handTypes[0]]: this.initNum,
      [this.handTypes[1]]: this.initNum,
      [this.handTypes[2]]: this.initNum,
    };
    this.handTable = this.makeHandTable();
  }
}
