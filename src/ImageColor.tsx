import React, { useRef, useEffect, useState } from "react";
import imageSrc from "./3.png";

const ImageColorChanger: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>("#ffffff");

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const applyColorFilter = (hexColor: string) => {
      const [r, g, b] = hexToRgb(hexColor);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const image = new Image();
          image.src = imageSrc;
          image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
              // Convert to grayscale by calculating the luminance
              const luminance =
                0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              data[i] = data[i + 1] = data[i + 2] = luminance;

              if (data[i + 3] > 0) {
                // Check if pixel is not transparent
                // Apply the color filter
                data[i] = (data[i] / 255) * r; // Scale red
                data[i + 1] = (data[i + 1] / 255) * g; // Scale green
                data[i + 2] = (data[i + 2] / 255) * b; // Scale blue
              }
            }
            ctx.putImageData(imageData, 0, 0);
          };
        }
      }
    };

    applyColorFilter(color);
  }, [color]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Change Image Color</h1>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="mb-4"
        />
        <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
      </div>
    </div>
  );
};

export default ImageColorChanger;
