import Konva from 'konva';
import { useEffect, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';
import { Loading } from 'src/components/Loading/Loading';

const Home = () => {
  //黒い枠の中をクリックし、矢印ボタンを押すと、赤い点が動くよー
  const [playerX, setPlayerX] = useState(4);
  const [playerY, setPlayerY] = useState(0);
  const [dy, setDy] = useState(0);
  const [bullet, setbullets] = useState<{ x: number; y: number }[]>([]);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [isMovingUp, setIsMovingUp] = useState(false);
  const [isMovingDown, setIsMovingDown] = useState(false);
  const hoge = true;

  useEffect(() => {
    // eslint-disable-next-line complexity
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        setIsMovingUp(true);
      } else if (e.code === 'ArrowDown') {
        setIsMovingDown(true);
      } else if (e.code === 'ArrowLeft') {
        setIsMovingLeft(true);
      } else if (e.code === 'ArrowRight') {
        setIsMovingRight(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        setIsMovingUp(false);
      } else if (e.code === 'ArrowDown') {
        setIsMovingDown(false);
      } else if (e.code === 'ArrowLeft') {
        setIsMovingLeft(false);
      } else if (e.code === 'ArrowRight') {
        setIsMovingRight(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const animate = () => {
      if (isMovingLeft) {
        setPlayerY((prevY) => Math.max(prevY - 0.1, 0));
      }
      if (isMovingRight) {
        setPlayerY((prevY) => Math.min(prevY + 0.1, 7));
      }
      if (isMovingUp) {
        setPlayerX((prevX) => Math.max(prevX - 0.1, 0));
      }
      if (isMovingDown) {
        setPlayerX((prevX) => Math.min(prevX + 0.1, 7));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMovingLeft, isMovingRight, isMovingUp, isMovingDown]);
  //スペースで弾出すよ(打て打つほど早くなっちゃう)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const newBullets = {
          x: playerY,
          y: playerX,
        };
        setbullets((prevbullets) => [...prevbullets, newBullets]);
        console.log(bullet);
        const tamaAnimation = new Konva.Animation((tama) => {
          setbullets((prevBullets) => {
            if (tama === undefined) {
              console.log('error');
              return prevBullets;
            } else {
              const speed = 2;
              const dist = speed * (tama.timeDiff / 1000);
              const newbullet = prevBullets.map((bullet) => ({
                ...bullet,
                x: bullet.x * dist,
                y: bullet.y,
              }));
              return newbullet.filter((bullet) => bullet.x <= 18);
            }
          });
        });
        tamaAnimation.start();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dy]);

  if (!hoge) return <Loading visible />;
  return (
    <>
      <Stage width={800} height={600}>
        <Layer>
          {/* 戦闘機の描画 */}
          <Circle x={playerY * 100 + 50} y={playerX * 100 + 50} radius={20} fill="blue" />
          {bullet.map((bullet, index) => (
            <Circle
              key={index}
              x={bullet.x * 100 + 50}
              y={bullet.y * 100 + 50}
              radius={20}
              fill="red"
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default Home;
