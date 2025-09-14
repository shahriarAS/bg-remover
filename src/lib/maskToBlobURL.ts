interface MaskData {
    label: string | null;
    score: number | null;
    mask: {
        data: { [key: string]: number };
        width: number;
        height: number;
        channels: number;
    };
}

export default async function maskToBlobURL(maskData: MaskData): Promise<string> {
    const { data, width, height } = maskData.mask;

    // Create canvas
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Create ImageData
    const imageData: ImageData = ctx.createImageData(width, height);

    // Fill pixel data
    for (let i = 0; i < width * height; i++) {
        const value: number = data[i] || 0;
        const pixelValue: number = value * 255; // Convert 0-1 to 0-255

        const pixelIndex: number = i * 4;
        imageData.data[pixelIndex] = pixelValue;     // Red
        imageData.data[pixelIndex + 1] = pixelValue; // Green  
        imageData.data[pixelIndex + 2] = pixelValue; // Blue
        imageData.data[pixelIndex + 3] = 255;        // Alpha
    }

    // Put image data to canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert to blob URL
    return new Promise<string>((resolve) => {
        canvas.toBlob((blob: Blob | null) => {
            if (!blob) {
                throw new Error('Could not create blob');
            }
            const blobURL: string = URL.createObjectURL(blob);
            resolve(blobURL);
        });
    });
}