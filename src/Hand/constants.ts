export const INIT_NUM = 10;
export const HAND_TYPES = ['✊', '🖐️', '️✌️'];
export const HAND_SIZE = 20;
export const FIGHTING = '💥';
export const DRAW = 'DRAW';
export const WIN = 'WIN';
export const LOSE = 'LOSE';
export const DELETE = 'DELETE';
export const WIN_TABLE = {
  [HAND_TYPES[0]]: {
    [HAND_TYPES[0]]: DRAW,
    [HAND_TYPES[1]]: LOSE,
    [HAND_TYPES[2]]: WIN,
  },
  [HAND_TYPES[1]]: {
    [HAND_TYPES[0]]: WIN,
    [HAND_TYPES[1]]: DRAW,
    [HAND_TYPES[2]]: LOSE,
  },
  [HAND_TYPES[2]]: {
    [HAND_TYPES[0]]: LOSE,
    [HAND_TYPES[1]]: WIN,
    [HAND_TYPES[2]]: DRAW,
  },
};
