import { useEffect, useState } from "react";
import { Engine, Render, World, Bodies } from "matter-js";
import { getRandomFruitShape } from "../utils/fruits";

export function useMatter(containerRef) {
  const [engine] = useState(() => Engine.create());

  useEffect(() => {
    if (!containerRef.current || !engine) {
      return;
    }
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
      },
    });

    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight,
      window.innerWidth,
      10,
      { isStatic: true }
    );

    World.add(engine.world, [ground]);

    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Engine.stop(engine);
      World.clear(engine.world);
      engine.clear();
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
    };
  }, [engine, containerRef]);

  const handleAddFruit = (event) => {
    const x = event.clientX;
    const y = event.clientY;

    const fruitShape = getRandomFruitShape();

    let fruit;
    if (fruitShape.type === "circle") {
      fruit = Bodies.circle(x, y, fruitShape.radius);
    } else if (fruitShape.type === "rectangle") {
      fruit = Bodies.rectangle(x, y, fruitShape.width, fruitShape.height);
    }
    // ... 기타 모양에 대한 처리를 추가

    // 생성된 과일 객체를 world에 추가
    World.add(engine.world, fruit);
  };

  return { handleAddFruit };
}
