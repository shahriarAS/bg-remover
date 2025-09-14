import { pipeline, type PipelineType, type ProgressCallback } from '@huggingface/transformers';

class MyBGRemoverPipeline {
    static task: PipelineType = 'image-segmentation';
    static model = 'briaai/RMBG-1.4';
    static instance: any = null;

    static async getInstance(progress_callback: ProgressCallback | undefined) {
        this.instance ??= pipeline(this.task, this.model, { progress_callback });
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
    // Retrieve the translation pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    const remover = await MyBGRemoverPipeline.getInstance((x) => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    // Actually perform the translation
    const output = await remover(event.data.image);

    console.log(output);

    // Send the output back to the main thread
    self.postMessage({
        status: "complete",
        output,
    });
});