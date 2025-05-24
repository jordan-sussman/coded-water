import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  isRunning = true
) => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== null) {
        callback(time - previousTimeRef.current);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    };
  }, [animate, isRunning]);
};

export const Water: React.FC = () => {
  const [frame, setFrame] = useState(0);
  const characters = "~≈≋⋿⊰⊱◟◝";
  const rows = 40;
  const cols = 120;

  const center = 0.5;
  const charsLen = characters.length;
  const charLenDiv4 = charsLen / 4;
  const twoPi = Math.PI * 2;

  const lastUpdate = useRef(0);

  const updateAnimation = useCallback((deltaTime: number) => {
    lastUpdate.current += deltaTime;
    if (lastUpdate.current > 166) {
      setFrame((f) => f + 1);
      lastUpdate.current = 0;
    }
  }, []);

  useAnimationFrame(updateAnimation);

  const ascii = useMemo(() => {
    const rowsArray = [];
    const f4 = frame / 6.7;
    const f5 = frame / 8.3;
    const f8 = frame / 13.3;

    for (let y = 0; y < rows; y++) {
      const yNorm = y / rows;
      let rowStr = "";
      let opacitySum = 0;

      for (let x = 0; x < cols; x++) {
        const xNorm = x / cols;

        const dx = xNorm - center;
        const dy = yNorm - center;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const wave =
          Math.sin(x / 3 + y / 5 + f4 + dist * 10) +
          Math.cos(x / 4 - y / 3 - f5) +
          Math.sin(f8 + xNorm * twoPi);

        const charVal = (wave + 2) * charLenDiv4 + dist * 5;
        const charIdx = Math.floor(Math.abs(charVal)) % charsLen;

        const opacity = Math.min(
          0.8,
          Math.max(0.2, 1 - dist + Math.sin(wave) / 3)
        );
        opacitySum += opacity;

        rowStr += characters[charIdx];
      }

      rowsArray.push({ text: rowStr, opacity: opacitySum / cols });
    }

    return rowsArray;
  }, [frame, rows, cols, charsLen, charLenDiv4, twoPi, characters]);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    background: "#1a1a2e",
    margin: 0,
    overflow: "hidden",
  } as const;

  const innerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: 30,
    position: "relative",
  } as const;

  const preStyle = {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 1.25,
    color: "#a3c4f3",
    cursor: "default",
    userSelect: "none",
    margin: 0,
    maxWidth: 820,
    overflow: "hidden",
    textShadow: "0 0 4px rgba(100, 200, 255, 0.3)",
    width: `${cols}ch`,
  } as const;

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <pre style={preStyle}>
          {ascii.map((row, i) => (
            <span
              key={i}
              style={{
                display: "block",
                lineHeight: 1,
                opacity: row.opacity,
              }}
            >
              {row.text}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
};
