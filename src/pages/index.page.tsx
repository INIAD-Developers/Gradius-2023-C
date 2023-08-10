import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, Image, Layer, Stage } from 'react-konva';
import { Loading } from 'src/components/Loading/Loading';
import styles from './index.module.css';
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
  const gradiusImg = useRef(new window.Image());
  const [isGradiusLoaded, setIsGradiusLoaded] = useState(false);
  const [backgroundX, setBackgroundX] = useState(0);
  const hoge = true;

  const backgroundImage = new window.Image();
  backgroundImage.src = '../../public/utyuu2.jpg';

  useEffect(() => {
    const animate = () => {
      setBackgroundX((prevBackgroundX) => prevBackgroundX - 1); // 速度や方向を調整

      // 次のフレームを要求
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      // コンポーネントがアンマウントされる際にアニメーションを停止
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    gradiusImg.current.src = '/images/images.jpg';
    gradiusImg.current.onload = () => {
      setIsGradiusLoaded(true);
    };
  }, []);

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
        setPlayerY((prevY) => Math.max(prevY - 0.05, 0));
      }
      if (isMovingRight) {
        setPlayerY((prevY) => Math.min(prevY + 0.05, 7));
      }
      if (isMovingUp) {
        setPlayerX((prevX) => Math.max(prevX - 0.05, 0));
      }
      if (isMovingDown) {
        setPlayerX((prevX) => Math.min(prevX + 0.05, 7));
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
  const tamaAnimation = useRef<Konva.Animation | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const newBullets = {
          x: playerY,
          y: playerX,
        };
        setbullets((prevBullets) => [...prevBullets, newBullets]);

        if (tamaAnimation.current === null) {
          tamaAnimation.current = new Konva.Animation((anim) => {
            if (anim !== undefined) {
              setbullets((prevBullets) => {
                const speed = 10; // 速度を適切な値に調整
                const dist = speed * (anim.timeDiff / 1000);
                const newBullets = prevBullets.map((bullet) => ({
                  ...bullet,
                  x: bullet.x + dist, // x座標にdistを足す
                }));
                return newBullets.filter((bullet) => bullet.x <= 30);
              });
            }
          });
          tamaAnimation.current.start();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerX, playerY]);

  if (!hoge) return <Loading visible />;
  return (
    <>
      {/* <img src={g.src} alt="images.png" /> */}
      <Stage width={1200} height={800} className={styles.background}>
        <Layer>
          <Image
            image={gradiusImg.current}
            x={playerY * 100}
            y={playerX * 100}
            width={90}
            height={90}
          />
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
