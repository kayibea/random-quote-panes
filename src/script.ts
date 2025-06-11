import { quotes } from './quotes.js';
import type { Mouse, Point } from './types';
import { getRandomInt, toBoolean } from './utils/util.js';
import { getRandomVelocity, reflect } from './utils/vector.js';

const board = document.getElementById('board') as HTMLDivElement;
const fetchBtnElm = document.getElementById('fetch-btn') as HTMLButtonElement;
const quoteCardElms = document.querySelectorAll('.quote-card') as NodeListOf<HTMLDivElement>;

const DOUBLE_CLICK_INTERVAL = 200; // ms
const MAX_QUOTE_NODE_ELEMENTS = 10;

const quoteCardElemsArr = Array.from(quoteCardElms);

const mouse: Mouse = {
  x: 0,
  y: 0,
  downed: false,
  target: null,
  lastClickTime: 0,
};

const normal = {
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  top: { x: 0, y: 1 },
  bottom: { x: 0, y: -1 },
} as const;

const quote = getRandomElement(quotes);
pushNewQuote(quoteCardElemsArr, quote.quote, quote.author);

function handleCardDrag(e: MouseEvent): void {
  if (!mouse.downed || !mouse.target) {
    return;
  }
  const target = mouse.target;

  const rect = target.getBoundingClientRect();
  const dx = mouse.x - e.clientX;
  const dy = mouse.y - e.clientY;

  let newX = rect.left - dx;
  let newY = rect.top - dy;

  if (newX < 0) {
    newX = 0;
  } else if (newX + rect.width > window.innerWidth) {
    newX = window.innerWidth - rect.width;
  }
  if (newY < 0) {
    newY = 0;
  } else if (newY + rect.height > window.innerHeight) {
    newY = window.innerHeight - rect.height;
  }

  target.style.top = newY.toString() + 'px';
  target.style.left = newX.toString() + 'px';

  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function handleCardMouseDown(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const card = target.closest('.quote-card') as HTMLElement;
  if (!card) return;
  if (handleCardDoubleCLick(card, e)) return;

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.downed = true;
  mouse.target = card;
  card.style.zIndex = '1';
  card.setAttribute('data-mousedown', '1');
  mouse.lastClickTime = e.timeStamp;

  //   console.log('down');
}

function handleCardMouseUp(e: MouseEvent): void {
  if (mouse.target) {
    mouse.target.style.zIndex = 'auto';
    mouse.target.setAttribute('data-mousedown', '0');
  }

  mouse.downed = false;
  mouse.target = null;
  //   console.log('up');
}

function handleCardDoubleCLick(card: HTMLElement, e: MouseEvent): boolean {
  if (!(e.timeStamp - mouse.lastClickTime <= DOUBLE_CLICK_INTERVAL)) {
    return false;
  }

  mouse.lastClickTime = e.timeStamp;
  removeQuoteElement(card);

  return true;
}

function removeQuoteElement(quote: HTMLElement): void {
  quote.style.animation = 'scaleout 500ms';
  setTimeout(() => quote.remove(), 600);
}

function handleFetchQuoteBtnClick(e: MouseEvent): void {
  const quote = getRandomElement(quotes);
  pushNewQuote(quoteCardElemsArr, quote.quote, quote.author);
}

function getRandomElement<T>(array: T[]): T {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
}

function pushNewQuote(quotes: HTMLDivElement[], text: string, author: string): void {
  const cardElm = document.createElement('div');
  const textElm = document.createElement('div');
  const authorElm = document.createElement('div');

  cardElm.classList.add('quote-card');
  cardElm.style.top = getRandomInt(0, window.innerHeight).toString() + 'px';
  cardElm.style.left = getRandomInt(0, window.innerWidth).toString() + 'px';

  textElm.classList.add('quote-text');
  authorElm.classList.add('quote-author');

  textElm.innerText = text;
  authorElm.innerText = author;

  cardElm.appendChild(textElm);
  cardElm.appendChild(authorElm);

  quotes.push(cardElm);

  if (quotes.length > MAX_QUOTE_NODE_ELEMENTS) {
    const quote = quotes.shift();
    if (quote) removeQuoteElement(quote);
  }

  board.appendChild(cardElm);
}

requestAnimationFrame(animate);

function animate(): void {
  for (const card of quoteCardElemsArr) {
    const isMouseDown = toBoolean(card.getAttribute('data-mousedown'));
    if (isMouseDown) continue;

    let velX: number, velY: number;
    let velocityAttr = card.getAttribute('data-velocity');
    if (!velocityAttr) {
      const velocity = getRandomVelocity();
      velX = velocity.x;
      velY = velocity.y;
    } else {
      [velX, velY] = velocityAttr.split(',').map(val => parseInt(val, 10));
    }

    const rect = card.getBoundingClientRect();
    const position = {
      x: rect.left + velX,
      y: rect.top + velY,
    };

    if (position.x < 0) {
      const v = reflect({ x: velX, y: velY }, normal.left);
      velX = v.x;
      velY = v.y;
    } else if (position.x + rect.width > window.innerWidth) {
      const v = reflect({ x: velX, y: velY }, normal.right);
      velX = v.x;
      velY = v.y;
    }

    if (position.y < 0) {
      const v = reflect({ x: velX, y: velY }, normal.top);
      velX = v.x;
      velY = v.y;
    } else if (position.y + rect.height > window.innerHeight) {
      const v = reflect({ x: velX, y: velY }, normal.bottom);
      velX = v.x;
      velY = v.y;
    }

    card.setAttribute('data-velocity', `${velX},${velY}`);
    card.style.top = position.y.toString() + 'px';
    card.style.left = position.x.toString() + 'px';
  }

  requestAnimationFrame(animate);
}

board.addEventListener('mouseup', handleCardMouseUp);
board.addEventListener('mousedown', handleCardMouseDown);
board.addEventListener('mousemove', handleCardDrag);

fetchBtnElm.addEventListener('click', handleFetchQuoteBtnClick);
