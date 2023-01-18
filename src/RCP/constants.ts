export const INIT_NUM = 10;
export const RCP_TYPES = ['✊', '🖐️', '️✌️'];
export const RCP_SIZE = 20;
export const FIGHTING = '💥';
export const DRAW = 'DRAW';
export const WIN = 'WIN';
export const LOSE = 'LOSE';
export const WIN_TABLE = {
  [RCP_TYPES[0]]: {
    [RCP_TYPES[0]]: DRAW,
    [RCP_TYPES[1]]: LOSE,
    [RCP_TYPES[2]]: WIN,
  },
  [RCP_TYPES[1]]: {
    [RCP_TYPES[0]]: WIN,
    [RCP_TYPES[1]]: DRAW,
    [RCP_TYPES[2]]: LOSE,
  },
  [RCP_TYPES[2]]: {
    [RCP_TYPES[0]]: LOSE,
    [RCP_TYPES[1]]: WIN,
    [RCP_TYPES[2]]: DRAW,
  },
};
