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
  const [imageBack, setImageBack] = useState(new window.Image());
  const [imageTama, setImageTama] = useState(new window.Image());
  const [score, setScore] = useState(0);
  const [playerLife, setPlayerLife] = useState(3);

  const [enemies, setEnemies] = useState<{ x: number; y: number }[]>([
    { x: 15, y: 2 },
    { x: 10, y: 4 },
  ]);

  const [dx, setDx] = useState(-1); // x方向の移動量
  const dx2 = 1;
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const hoge = true;
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
    const image = new window.Image();
    const image2 = new window.Image();
    image.src = '/images/jett4.png';
    image2.src = '/images/tama.png';
    image.onload = () => {
      setImageBack(image);
      setImageTama(image2);
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

  const enemyAnimation = useRef<Konva.Animation | null>(null);
  useEffect(() => {
    const addEnemy = () => {
      if (enemies.length <= 2) {
        const newEnemies = [
          { x: 15, y: 2 },
          { x: 10, y: 4 },
          { x: 11, y: 3 },
          { x: 12, y: 2 },
          { x: 13, y: 4 },
        ];
        setEnemies((prevEnemies) => [...prevEnemies, ...newEnemies]);
      }
    };

    const speed = 1.5;
    const moving = Math.random() < 0.5 ? 0 : 1; // 初期方向
    let direction = Math.random() < 0.5 ? -1 : 1; // 初期方向

    const moveEnemy = () => {
      addEnemy();
      if (enemyAnimation.current === null) {
        enemyAnimation.current = new Konva.Animation((enemy) => {
          if (enemy !== undefined) {
            setEnemies((prevEnemies) => {
              const dist = speed * (enemy.timeDiff / 1000);
              const newEnemies = prevEnemies.map((enemy) => {
                // 敵キャラクターが画面端に達したら方向を逆にする
                if (enemy.y <= 1 || enemy.y >= 5) {
                  direction = -direction * moving;
                }
                return {
                  ...enemy,
                  x: enemy.x + dist * dx,
                  y: enemy.y + dist * direction * 0.3, // y 方向にも移動
                };
              });
              return newEnemies.filter((enemy) => enemy.x >= 0);
            });
          }
        });
        enemyAnimation.current.start();
      }
    };

    moveEnemy();

    return () => {
      if (enemyAnimation.current) {
        enemyAnimation.current.stop();
        enemyAnimation.current = null;
      }
    };
  }, [enemies.length, dx]);

  const detectCollisions = () => {
    setbullets((prevBullets) => {
      const newBullets = prevBullets.filter((bullet) => {
        const bulletHitbox = {
          x: bullet.x * 100 + 50,
          y: bullet.y * 100 + 50,
          radius: 10,
        };

        let bulletHitEnemy = false;

        const remainingEnemies = enemies.filter((enemy) => {
          const enemyHitbox = {
            x: enemy.x * 100,
            y: enemy.y * 100 + 50,
            radius: 20,
          };

          const distance = Math.sqrt(
            Math.pow(bulletHitbox.x - enemyHitbox.x, 2) +
              Math.pow(bulletHitbox.y - enemyHitbox.y, 2)
          );

          const collisionDetected = distance < bulletHitbox.radius + enemyHitbox.radius;

          if (collisionDetected) {
            bulletHitEnemy = true;
            // eslint-disable-next-line max-nested-callbacks
            setScore((prevScore) => prevScore + 0.5);
            console.log(score);
            return false; // 衝突した敵は残らない
          }

          return true;
        });

        if (bulletHitEnemy) {
          setEnemies(remainingEnemies); // 衝突した場合、敵を更新
          return null; // 弾も消滅
        }

        return bullet;
      });

      return newBullets.filter(Boolean);
    });
    const playerHitbox = {
      x: playerY * 100, // Adjust hitbox based on your player's size and position
      y: playerX * 100, // Adjust hitbox based on your player's size and position
      radius: 10, // Adjust based on your player's size
    };
    const playerCollided = enemies.some((enemy) => {
      const enemyHitbox = {
        x: enemy.x * 100,
        y: enemy.y * 100,
        radius: 20,
      };

      const distance = Math.sqrt(
        Math.pow(playerHitbox.x - enemyHitbox.x, 2) + Math.pow(playerHitbox.y - enemyHitbox.y, 2)
      );

      return distance < playerHitbox.radius + enemyHitbox.radius;
    });

    if (playerCollided) {
      setPlayerLife((prevLife) => prevLife - 1);
    }
  };

  // 上記の当たり判定関数を適切なタイミングで呼び出す
  useEffect(() => {
    detectCollisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bullet, enemies]);
  if (!hoge) return <Loading visible />;
  return (
    <>
      {/* <img src={g.src} alt="images.png" /> */}
      <div className={styles.lifeContainer}>
        <p className={styles.life}>Life: {playerLife}</p>
      </div>
      <div className={styles.scoreContainer}>
        <p className={styles.score}>Score: {score}</p>
      </div>
      <Stage width={1200} height={800} className={styles.background}>
        <Layer>
          <Image image={imageBack} x={playerY * 100} y={playerX * 100} width={90} height={130} />
          {bullet.map((bullet, index) => (
            <Image
              image={imageTama}
              key={index}
              x={bullet.x * 100 + 50}
              y={bullet.y * 100 + 50}
              radius={20}
              scaleX={0.05}
              scaleY={0.05}
            />
          ))}
          {enemies.map((enemy, index) => (
            <Circle key={index} x={enemy.x * 100} y={enemy.y * 100 + 50} radius={20} fill="green" />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default Home;
