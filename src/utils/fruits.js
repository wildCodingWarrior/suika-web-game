// fruits.js
const fruitShapes = [
  { type: "circle", radius: 25 },
  { type: "rectangle", width: 50, height: 30 },
  // ... 기타 모양들을 추가할 수 있습니다.
];

export function getRandomFruitShape() {
  const randomIndex = Math.floor(Math.random() * fruitShapes.length);
  return fruitShapes[randomIndex];
}
