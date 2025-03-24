import { RefObject } from "react";

const captureFrameWithCanvas = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null,
  time: number
) => {
  return new Promise<string>((resolve, reject) => {
    const video = videoRef.current;
    if (!video) return reject(new Error("Video element not found"));
    video.currentTime = time;
    video.onseeked = () => {
      if (ctx) {
        canvas.width = 200;
        canvas.height = 100;
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg"));
        } catch (error) {
          reject(new Error("Failed to capture frame: " + error));
        }
      } else {
        reject(new Error("Canvas context not found"));
      }
    };
    video.onerror = () => {
      reject(new Error("Error seeking video"));
    };
  });
};

export const generateThumbnails = async (
  videoRef: RefObject<HTMLVideoElement | null>
) => {
  try {
    if (!videoRef.current) return null;
    const video = videoRef.current;

    // Ensure the video is loaded
    await new Promise<void>((resolve, reject) => {
      if (video.readyState >= 2) {
        resolve();
      } else {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error("Error loading video"));
      }
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const frameCount = 10;
    const interval = video.duration / frameCount;
    const newThumbnails: string[] = [];

    for (let i = 0; i < frameCount; i++) {
      const imgbase64 = await captureFrameWithCanvas(
        videoRef,
        canvas,
        ctx,
        i * interval
      );
      newThumbnails.push(imgbase64);
    }

    video.currentTime = 0;

    return newThumbnails;
  } catch (e) {
    console.error("Failed to generate thumbnails", e);
    return null;
  }
};
