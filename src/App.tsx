import React, { useState, useCallback, useEffect, useRef } from "react";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import Intro from "./components/Intro";
import UploadArea from "./components/UploadArea";
import ProcessingStatus from "./components/ProcessingStatus";
import Results from "./components/Results";
import ApiInfo from "./components/ApiInfo";
import Footer from "./components/Footer";

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
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const worker = useRef<Worker | null>(null);

  // Simulate AI background removal with progress
  const processImage = useCallback(
    async (imageUrl: string, name: string, size: number) => {
      setIsProcessing(true);
      setProcessingProgress(0);

      const startTime = Date.now();

      // Simulate processing with progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // // Simulate processing delay
      // await new Promise((resolve) => setTimeout(resolve, 2500));
      worker?.current?.postMessage({
        image: imageUrl,
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      const processingTime = Date.now() - startTime;

      const processedImage: ProcessedImage = {
        original: imageUrl,
        processed: imageUrl,
        name: name,
        size: size,
        processingTime: processingTime,
      };

      setProcessedImages((prev) => [processedImage, ...prev]);
      setIsProcessing(false);
      setProcessingProgress(0);
    },
    []
  );

  const handleImageUpload = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setFileName(file.name);
        processImage(imageUrl, file.name, file.size);
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

  const downloadImage = useCallback((imageUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `bg-removed-${name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    worker.current ??= new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: MessageEvent) => {
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          console.log("Worker initiated: Loading Models");
          // setReady(false);
          // setProgressItems((prev) => [...prev, e.data]);
          break;

        case "progress":
          // Model file progress: update one of the progress items.
          console.log(`Model loading progress: ${e.data.progress}`);
          // setProgressItems((prev) =>
          //   prev.map((item) => {
          //     if (item.file === e.data.file) {
          //       return { ...item, progress: e.data.progress };
          //     }
          //     return item;
          //   })
          // );
          break;

        case "done":
          // Model file loaded: remove the progress item from the list.
          console.log(`Model loaded: ${e.data.file}`);
          // setProgressItems((prev) =>
          //   prev.filter((item) => item.file !== e.data.file)
          // );
          break;

        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          // setReady(true);
          break;

        case "update":
          // Generation update: update the output text.
          // setOutput((o) => o + e.data.output);
          break;

        case "complete":
          // Generation complete: re-enable the "Translate" button
          // setDisabled(false);
          console.log("Processing complete", e.data.output);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () =>
      worker.current?.removeEventListener("message", onMessageReceived);
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <Header />
      <StatusBar
        isProcessing={isProcessing}
        processedImages={processedImages}
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
          />
          <Results
            processedImages={processedImages}
            formatFileSize={formatFileSize}
            downloadImage={downloadImage}
          />
          {!selectedImage && <ApiInfo />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
