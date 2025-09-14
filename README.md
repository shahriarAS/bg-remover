# bg-remover

AI-powered background removal in your browser. No uploads, no servers, no tracking.

## Links

- **[Live Demo](https://bg.shahriarahmed.me)** - Try the app now
- **[Case Study](https://www.shahriarahmed.me/case-study/bg-remover)** - Deep dive into the technical implementation

## Features

- **Privacy-first** - All processing happens in your browser, images never uploaded
- **AI-powered** - Uses RMBG-1.4, a cutting-edge model for precise background removal
- **Smooth performance** - Web Workers keep the interface responsive during processing
- **Terminal-inspired UI** - Clean, minimal dark interface for focused work


## Quick Start

### Prerequisites

Node.js 18+, pnpm recommended

### Install & Run

```bash
git clone https://github.com/shahriarAS/bg-remover.git
cd bg-remover
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
```

## Stack

## Stack

- React 19 + TypeScript
- Vite build system
- Tailwind CSS
- Hugging Face Transformers.js
- RMBG-1.4 model

## Architecture

1. Model loads and caches in browser on first use
2. Web Workers handle AI inference without blocking UI
3. RMBG-1.4 generates precise subject masks
4. Canvas API applies masks for transparent PNGs

```
src/
├── components/     # React UI components
├── lib/           # Utilities and helpers
├── worker.ts      # Web Worker for AI processing
└── App.tsx        # Main application
```

## Contributing

PRs welcome. For major changes, open an issue first.

```bash
pnpm install && pnpm dev
```

## License

MIT

## Credits

- [RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4) by BRIA AI
- [Transformers.js](https://github.com/xenova/transformers.js) for browser AI

---

[shahriarahmed.me](https://www.shahriarahmed.me)
