#!/usr/bin/env node

const chalk = require('chalk');
const error = chalk.bold.red;

const paramX = process.argv[2];
const paramY = process.argv[3];
const length = process.argv[4] || 30;
const items = [];

const genItem = (x, y, check) => {
    const temp = {};
    temp.x = x;
    temp.y = y;
    temp.r = ((y/x) * 100).toFixed(2);

    if ( check ) {
        if ( !items.filter(item => (item.r === temp.r)).length ) {
            items.push(temp);
        } else {
            return;
        }
    } else {
        items.push(temp);
    }
}

const genBaseItems = () => {
    for ( let i = 1; i <= length; i++ ) {
        for ( let j = 1; j <= length; j++ ) {
            genItem(i, j, true);
        }
    };
}

const sortByRatio = arr => {
    arr.sort((a, b) => {
        return a.r-b.r
    });
}

const findRes = () => {
    for ( let i = 0; i < items.length; i++ ) {
        if ( items[i].x === paramX && items[i].y === paramY ) {
            const pItem = items[i - 1];
            const cItem = items[i];
            const nItem = items[i + 1];

            return {
                curr: cItem.r,
                best: findBest(cItem.r, pItem.r, nItem.r),
                data: {
                    prev: i !== 0 ? `${pItem.r}% --> ${pItem.x}:${pItem.y}` : null,
                    next: i !== items.length - 1 ? `${nItem.r}% --> ${nItem.x}:${nItem.y}` : null
                }
            }
        }
    };
}

const findBest = (currRatio, prevRatio, nextRatio) => {
    if ( nextRatio - currRatio > currRatio - prevRatio ) {
        return 'prev';
    } else {
        return 'next';
    }
}

if ( process.argv[2] && process.argv[3] ) {
    genBaseItems();
    genItem(paramX, paramY, false);
    sortByRatio(items);
    const res = findRes();

    console.log('------------------------------');
    console.log(`# Looking for ${res.curr}%, found:`);
    console.log('------------------------------');
    console.log(res.best === 'prev' ? chalk.green(res.data.prev) : res.data.prev)
    console.log(res.best === 'next' ? chalk.green(res.data.next) : res.data.next)
    console.log('------------------------------');
} else {
    console.log(error('Add <width> and <height> eg: $ ratio 123 321'));
}
