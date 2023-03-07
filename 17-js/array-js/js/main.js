'use strict';

let arr = [];
for(let i = -49; i <= 49; i++) arr.push(i);
console.log( arr.length );
console.log( arr );
arr.sort(() => Math.random() - 0.5);
console.log( arr );
let arr10 = arr.filter((el) => el % 10 === 0);
console.log( arr10 );

let el0 = arr.indexOf(0);
let el25 = arr.indexOf(25);
console.log(el0, el25)
let start, end;
if (el0 < el25) {
    start = el0;
    end = el25;
} else {
    start = el25;
    end = el0;
}
let sum = 0;
for(let i = start; i <= end; i++) {
    sum += arr[i];
}
console.log(sum);
arr10.sort( (a, b) => b - a );
console.log(arr10);