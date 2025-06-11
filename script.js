import { quotes } from './quotes.js';
import { getRandomInt, toBoolean } from './utils/util.js';
import { getRandomVelocity, reflect } from './utils/vector.js';
const board = document.getElementById('board');
const fetchBtnElm = document.getElementById('fetch-btn');
const quoteCardElms = document.querySelectorAll('.quote-card');
const DOUBLE_CLICK_INTERVAL = 200; // ms
const MAX_QUOTE_NODE_ELEMENTS = 10;
const quoteCardElemsArr = Array.from(quoteCardElms);
const mouse = {
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
};
const quote = getRandomElement(quotes);
pushNewQuote(quoteCardElemsArr, quote.quote, quote.author);
function handleCardDrag(e) {
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
    }
    else if (newX + rect.width > window.innerWidth) {
        newX = window.innerWidth - rect.width;
    }
    if (newY < 0) {
        newY = 0;
    }
    else if (newY + rect.height > window.innerHeight) {
        newY = window.innerHeight - rect.height;
    }
    target.style.top = newY.toString() + 'px';
    target.style.left = newX.toString() + 'px';
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
function handleCardMouseDown(e) {
    const target = e.target;
    const card = target.closest('.quote-card');
    if (!card)
        return;
    if (handleCardDoubleCLick(card, e))
        return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.downed = true;
    mouse.target = card;
    card.style.zIndex = '1';
    card.setAttribute('data-mousedown', '1');
    mouse.lastClickTime = e.timeStamp;
    //   console.log('down');
}
function handleCardMouseUp(e) {
    if (mouse.target) {
        mouse.target.style.zIndex = 'auto';
        mouse.target.setAttribute('data-mousedown', '0');
    }
    mouse.downed = false;
    mouse.target = null;
    //   console.log('up');
}
function handleCardDoubleCLick(card, e) {
    if (!(e.timeStamp - mouse.lastClickTime <= DOUBLE_CLICK_INTERVAL)) {
        return false;
    }
    mouse.lastClickTime = e.timeStamp;
    removeQuoteElement(card);
    return true;
}
function removeQuoteElement(quote) {
    quote.style.animation = 'scaleout 500ms';
    setTimeout(() => quote.remove(), 600);
}
function handleFetchQuoteBtnClick(e) {
    const quote = getRandomElement(quotes);
    pushNewQuote(quoteCardElemsArr, quote.quote, quote.author);
}
function getRandomElement(array) {
    const index = getRandomInt(0, array.length - 1);
    return array[index];
}
function pushNewQuote(quotes, text, author) {
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
        const quote = quotes.pop();
        if (quote)
            removeQuoteElement(quote);
    }
    board.appendChild(cardElm);
}
requestAnimationFrame(animate);
function animate() {
    for (const card of quoteCardElemsArr) {
        const isMouseDown = toBoolean(card.getAttribute('data-mousedown'));
        if (isMouseDown)
            continue;
        let velX, velY;
        let velocityAttr = card.getAttribute('data-velocity');
        if (!velocityAttr) {
            const velocity = getRandomVelocity();
            velX = velocity.x;
            velY = velocity.y;
        }
        else {
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
        }
        else if (position.x + rect.width > window.innerWidth) {
            const v = reflect({ x: velX, y: velY }, normal.right);
            velX = v.x;
            velY = v.y;
        }
        if (position.y < 0) {
            const v = reflect({ x: velX, y: velY }, normal.top);
            velX = v.x;
            velY = v.y;
        }
        else if (position.y + rect.height > window.innerWidth) {
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
