import React, { useRef, useEffect } from "react";
import Matter from "matter-js";

const radii = [20, 25, 32, 40, 50, 62, 78, 98, 123, 154, 194];
const colorPatterns = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FFFFFF",
  "#FF5733", // 추가 컬러 패턴
  "#964B00", // 추가 컬러 패턴
  "#8A2BE2", // 추가 컬러 패턴
  "#00FF7F", // 추가 컬러 패턴
];

const GameBoard = () => {
  const canvasRef = useRef(null);

  const colors = radii.reduce((acc, rad, idx) => {
    acc[rad] = colorPatterns[idx % colorPatterns.length];
    return acc;
  }, {});

  function getColorByRadius(radius) {
    return colors[radius] || "#000000"; // Default to black if the radius doesn't match any predefined size
  }

  function getNextRadius(radius) {
    const index = radii.indexOf(radius);
    if (index === -1 || index === radii.length - 1) {
      return radii[0];
    } else {
      return radii[index + 1];
    }
  }

  useEffect(() => {
    const { Engine, Render, World, Bodies, Events } = Matter;

    const engine = Engine.create();
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 700,
        wireframes: false,
        hasBounds: true, // 텍스트 렌더링을 위해 hasBounds 속성을 true로 설정
        textured: true, // 텍스트 렌더링을 위해 textured 속성을 true로 설정
      },
    });

    const leftWall = Bodies.rectangle(0, 350, 1, 700, { isStatic: true });
    const rightWall = Bodies.rectangle(400, 350, 1, 700, { isStatic: true });
    const ground = Bodies.rectangle(200, 670, 400, 60, { isStatic: true });
    const ceiling = Bodies.rectangle(200, 0, 400, 1, { isStatic: true });
    World.add(engine.world, ceiling);

    World.add(engine.world, [leftWall, rightWall]);
    World.add(engine.world, ground);

    Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // 공과 천장이 충돌한 경우
        if (
          (bodyA === ceiling && bodyB.circleRadius) ||
          (bodyB === ceiling && bodyA.circleRadius)
        ) {
          alert("끝!");

          // 모든 공 제거
          World.clear(engine.world, false);
          World.add(engine.world, [leftWall, rightWall, ground, ceiling]);
        }

        if (
          bodyA.circleRadius &&
          bodyB.circleRadius &&
          bodyA.circleRadius === bodyB.circleRadius
        ) {
          const newRadius = getNextRadius(bodyA.circleRadius);
          const newX = (bodyA.position.x + bodyB.position.x) / 2;
          const newY = (bodyA.position.y + bodyB.position.y) / 2;
          const newCircle = Bodies.circle(newX, newY, newRadius, {
            render: {
              fillStyle: getColorByRadius(newRadius),
              strokeStyle: "transparent",

              text: {
                content: `반지름: ${newRadius}`,
                color: "#000000",
                size: 12,
              },
            },
          });

          World.add(engine.world, newCircle);
          World.remove(engine.world, bodyA);
          World.remove(engine.world, bodyB);

          if (newRadius === 154) {
            alert("수박을 만들었다! 승리!");
            // 모든 공 제거
            World.clear(engine.world, false);
            World.add(engine.world, [leftWall, rightWall, ground, ceiling]);
          }
        }
      });
    });

    Engine.run(engine);
    Render.run(render);

    const addBallOnClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.top;

      // Select Random Radius from
      const targetRadius = [20, 25, 32];
      const randomRadius =
        radii[Math.floor(Math.random() * targetRadius.length)];

      const ball = Bodies.circle(x, y, randomRadius, {
        render: {
          fillStyle: getColorByRadius(randomRadius),
        },
      });
      World.add(engine.world, ball);
    };

    canvasRef.current.addEventListener("click", addBallOnClick);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);

      canvasRef.current.removeEventListener("click", addBallOnClick);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default GameBoard;
