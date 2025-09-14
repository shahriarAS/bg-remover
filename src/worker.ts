import {
    env,
    AutoModel,
    AutoProcessor,
    RawImage,
    PreTrainedModel,
    Processor
} from "@huggingface/transformers";

const MODEL_ID = "briaai/RMBG-1.4";

interface ModelState {
    model: PreTrainedModel | null;
    processor: Processor | null;
}

const state: ModelState = {
    model: null,
    processor: null
};

export async function initializeModel(): Promise<void> {
    try {
        env.allowLocalModels = false;
        if (env.backends?.onnx?.wasm) {
            env.backends.onnx.wasm.proxy = true;
        }

        // Track model loading progress (0-70%)
        self.postMessage({
            status: 'progress',
            progress: 0,
            message: 'Starting model download...'
        });

        state.model = await AutoModel.from_pretrained(MODEL_ID, {
            progress_callback: (progress) => {
                if ('progress' in progress && typeof progress.progress === 'number') {
                    // Model loading takes up 70% of initialization
                    const modelProgress = Math.round(progress.progress * 0.7);
                    self.postMessage({
                        status: 'progress',
                        progress: modelProgress,
                        message: `Loading model: ${modelProgress}%`
                    });
                }
            }
        });

        // Processor loading (70-100%)
        self.postMessage({
            status: 'progress',
            progress: 70,
            message: 'Loading processor...'
        });

        state.processor = await AutoProcessor.from_pretrained(MODEL_ID, {
            revision: "main",
            config: {
                do_normalize: true,
                do_pad: true,
                do_rescale: true,
                do_resize: true,
                image_mean: [0.5, 0.5, 0.5],
                feature_extractor_type: "ImageFeatureExtractor",
                image_std: [0.5, 0.5, 0.5],
                resample: 2,
                rescale_factor: 0.00392156862745098,
                size: { width: 1024, height: 1024 }
            }
        });

        self.postMessage({
            status: 'progress',
            progress: 100,
            message: 'Model ready!'
        });

        if (!state.model || !state.processor) {
            throw new Error("Failed to initialize model or processor");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to initialize background removal model");
    }
}

export async function processImage(image: File): Promise<{ imageData: ImageData; maskData: Uint8Array | Uint8ClampedArray }> {
    if (!state.model || !state.processor) {
        throw new Error("Model not initialized. Call initializeModel() first.");
    }

    // Step 1: Load image (0-20%)
    self.postMessage({
        status: 'progress',
        progress: 0,
        message: 'Loading image...'
    });

    const img = await RawImage.fromURL(URL.createObjectURL(image));
    
    // Add validation for image
    console.log(`Processing image: ${img.width}x${img.height}, channels: ${img.channels}, data length: ${img.data.length}`);

    self.postMessage({
        status: 'progress',
        progress: 20,
        message: 'Preprocessing image...'
    });

    try {
        // Step 2: Pre-process image (20-40%)
        const { pixel_values } = await state.processor(img);

        self.postMessage({
            status: 'progress',
            progress: 40,
            message: 'Running AI model...'
        });

        // Step 3: Predict alpha matte (40-70%)
        const { output } = await state.model({ input: pixel_values });

        self.postMessage({
            status: 'progress',
            progress: 70,
            message: 'Resizing mask...'
        });

        // Step 4: Resize mask back to original size (70-85%)
        const resizedMask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
            img.width,
            img.height,
        );
        const maskData = resizedMask.data;
        
        console.log(`Mask data length: ${maskData.length}, expected: ${img.width * img.height}`);

        self.postMessage({
            status: 'progress',
            progress: 85,
            message: 'Creating final image...'
        });

        // Step 5: Convert RawImage to ImageData for transfer (85-100%)
        const canvas = new OffscreenCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get 2d context");

        // Validate dimensions
        if (img.width <= 0 || img.height <= 0) {
            throw new Error(`Invalid image dimensions: ${img.width}x${img.height}`);
        }

        // Create ImageData from the RawImage
        // RawImage.data might be RGB format, need to convert to RGBA for ImageData
        const expectedSize = img.width * img.height * 4; // RGBA format
        let imageDataArray: Uint8ClampedArray;

        if (img.data.length === img.width * img.height * 3) {
            // RGB format - convert to RGBA
            imageDataArray = new Uint8ClampedArray(expectedSize);
            for (let i = 0; i < img.width * img.height; i++) {
                const rgbIndex = i * 3;
                const rgbaIndex = i * 4;
                imageDataArray[rgbaIndex] = img.data[rgbIndex];     // R
                imageDataArray[rgbaIndex + 1] = img.data[rgbIndex + 1]; // G
                imageDataArray[rgbaIndex + 2] = img.data[rgbIndex + 2]; // B
                imageDataArray[rgbaIndex + 3] = 255; // A (fully opaque)
            }
        } else if (img.data.length === expectedSize) {
            // Already RGBA format
            imageDataArray = new Uint8ClampedArray(img.data);
        } else {
            throw new Error(`Unexpected image data size: ${img.data.length}, expected: ${expectedSize} or ${img.width * img.height * 3}`);
        }

        // Create ImageData using canvas context
        const imageData = ctx.createImageData(img.width, img.height);
        imageData.data.set(imageDataArray);

        self.postMessage({
            status: 'progress',
            progress: 100,
            message: 'Processing complete!'
        });

        return { imageData, maskData };
    } catch (error) {
        console.log(error)
        throw new Error("Failed to process image");
    }
}

self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    if (type === 'initialize') {
        try {
            await initializeModel();
            self.postMessage({
                status: 'ready',
                message: 'Model loaded successfully'
            });
        } catch (error) {
            self.postMessage({ 
                status: 'error', 
                message: error instanceof Error ? error.message : 'Failed to initialize model'
            });
        }
    } else if (type === 'processImage') {
        try {
            const result = await processImage(data.image);
            self.postMessage({
                status: 'complete',
                imageData: result.imageData,
                maskData: result.maskData
            });
        } catch (error) {
            self.postMessage({
                status: 'error',
                message: error instanceof Error ? error.message : 'Failed to process image'
            });
            console.log(error);
        }
    }
});