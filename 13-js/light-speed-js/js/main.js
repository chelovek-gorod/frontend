'use strict';

const lightSpeed = BigInt(299792458);      // m / s
const Parsec = BigInt(3.0856776 * 10**16); // m
const GalaxySize = 16000n * Parsec;        // m

const MercuryMidDistance = BigInt(Math.ceil( ((  46001009 +   69817445) / 2 ) * 1000)); // m
const VenusMidDistance   = BigInt(Math.ceil( (( 107476259 +  108942109) / 2 ) * 1000)); // m
const EarthMidDistance   = BigInt(Math.ceil( (( 147098290 +  152098232) / 2 ) * 1000)); // m
const MarsMidDistance    = BigInt(Math.ceil( (( 206655000 +  249232000) / 2 ) * 1000)); // m
const JupiterMidDistance = BigInt(Math.ceil( (( 740573600 +  816520800) / 2 ) * 1000)); // m
const SaturnMidDistance  = BigInt(Math.ceil( ((1353572956 + 1513325783) / 2 ) * 1000)); // m
const UranusMidDistance  = BigInt(Math.ceil( ((2748938461 + 3004419704) / 2 ) * 1000)); // m
const NeptuneMidDistance = BigInt(Math.ceil( ((4452940833 + 4553946490) / 2 ) * 1000)); // m

console.log('Свет от Солнца до Меркурия идет', MercuryMidDistance / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Венеры идет', VenusMidDistance     / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Земли идет', EarthMidDistance      / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Марса идет', MarsMidDistance       / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Юпитера идет', JupiterMidDistance  / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Сатурна идет', SaturnMidDistance   / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Урана идет', UranusMidDistance     / lightSpeed, 'секунд.');
console.log('Свет от Солнца до Нептуна идет', NeptuneMidDistance  / lightSpeed, 'секунд.');
console.log('Свет от одного края галактики до другого идет', GalaxySize  / lightSpeed, 'секунд.');
console.log('Свет от одного края галактики "Млечный путь" до другого идет', (GalaxySize  / lightSpeed) / BigInt( Math.ceil(3600 * 24 * 365.2468) ), 'лет.');
