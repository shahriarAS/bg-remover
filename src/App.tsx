import React, { useState, useCallback, useEffect, useRef } from "react";

// Components
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import Intro from "./components/Intro";
import UploadArea from "./components/UploadArea";
import ProcessingStatus from "./components/ProcessingStatus";
import Results from "./components/Results";
import Footer from "./components/Footer";
import DevCredit from "./components/DevCredit";

export interface ProcessedImage {
  original: string;
  processed: string;
  name: string;
  size: number;
  processingTime: number;
}

const App: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const worker = useRef<Worker | null>(null);
  const [processedCount, setProcessedCount] = useState(
    Number(localStorage.getItem("processedCount")) || 0
  );

  // Start the image processing workflow
  const processImage = useCallback(async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProgressMessage("");
    setStartTime(Date.now());

    // Initialize worker if needed and set loading state
    if (!worker.current) {
      setIsModelLoading(true);
    }

    worker?.current?.postMessage({
      type: "initialize",
    });
  }, []);

  // Convert processed image data to blob URL
  const createImageFromProcessedData = useCallback(
    async (
      imageData: ImageData,
      maskData: Uint8Array | Uint8ClampedArray
    ): Promise<string> => {
      const canvas = document.createElement("canvas");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2d context");

      // Put the original image data on canvas
      ctx.putImageData(imageData, 0, 0);

      // Update alpha channel with mask data
      const pixelData = ctx.getImageData(
        0,
        0,
        imageData.width,
        imageData.height
      );
      for (let i = 0; i < maskData.length; ++i) {
        pixelData.data[4 * i + 3] = maskData[i];
      }
      ctx.putImageData(pixelData, 0, 0);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("Failed to create blob")),
          "image/png"
        )
      );

      return URL.createObjectURL(blob);
    },
    []
  );

  const processImageComplete = useCallback(
    async (outputImage: string) => {
      const processingTime = Date.now() - startTime!;

      const processedImage: ProcessedImage = {
        original: selectedImage!,
        processed: outputImage,
        name: fileName,
        size: fileSize,
        processingTime: processingTime,
      };

      setProcessedImages((prev) => [processedImage, ...prev]);
      setIsProcessing(false);
      setIsModelLoading(false);
      setProcessingProgress(0);
      setProgressMessage("");
      setProcessedCount((count) => {
        const newCount = count + 1;
        localStorage.setItem("processedCount", newCount.toString());
        return newCount;
      });
    },
    [selectedImage, fileName, fileSize, startTime]
  );

  const handleImageUpload = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setFileName(file.name);
        setFileSize(file.size);
        setSelectedImageFile(file);
        processImage();
      }
    },
    [processImage]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    },
    [handleImageUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0]);
      }
    },
    [handleImageUpload]
  );

  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadImage = useCallback((imageUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `bg-removed-${name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    worker.current ??= new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = async (e: MessageEvent) => {
      switch (e.data.status) {
        case "progress":
          if (typeof e.data.progress === "number") {
            setProcessingProgress(e.data.progress);
            if (e.data.message) {
              setProgressMessage(e.data.message);
            }
          }
          break;

        case "ready":
          setIsModelLoading(false);
          setProcessingProgress(0);
          setProgressMessage("Model ready! Starting image processing...");

          // Small delay to show the "ready" message before starting processing
          setTimeout(() => {
            worker?.current?.postMessage({
              type: "processImage",
              data: {
                image: selectedImageFile,
              },
            });
          }, 500);
          break;

        case "complete":
          try {
            const imageUrl = await createImageFromProcessedData(
              e.data.imageData,
              e.data.maskData
            );
            processImageComplete(imageUrl);
          } catch (error) {
            console.error("Failed to process image data:", error);
            setIsProcessing(false);
            setIsModelLoading(false);
            setProcessingProgress(0);
            setProgressMessage("Error processing image");
          }
          break;

        case "error":
          console.error("Worker error:", e.data.message);
          setIsProcessing(false);
          setIsModelLoading(false);
          setProcessingProgress(0);
          setProgressMessage("Error: " + e.data.message);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current?.removeEventListener("message", onMessageReceived);
  }, [selectedImageFile, createImageFromProcessedData, processImageComplete]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <Header />
      <StatusBar
        isProcessing={isProcessing}
        isModelLoading={isModelLoading}
        processedCount={processedCount}
      />
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {!selectedImage && <Intro />}
          <UploadArea
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
          />
          <ProcessingStatus
            isProcessing={isProcessing}
            fileName={fileName}
            processingProgress={processingProgress}
            progressMessage={progressMessage}
          />
          <Results
            processedImages={processedImages}
            formatFileSize={formatFileSize}
            downloadImage={downloadImage}
          />
          <DevCredit />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
