# OrcaWipe  배경 제거기 (Background Remover)

OrcaWipe is a simple web application that removes the background from your images, instantly and for free. No fluff, just clean cutouts.

## ✨ Features

*   **Upload Images:** Drag & drop or use the file picker to upload your JPG, PNG, or WebP images.
*   **Automatic Background Removal:** Powered by a Hugging Face Space model (`eccv2022/dis-background-removal`).
*   **Instant Preview:** See the original and the background-removed image side-by-side (once processing is complete).
*   **Download Result:** Easily download your processed image with a transparent background.
*   **Responsive Design:** Works on desktop and mobile.

## 🚀 Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn/ui
*   **Icons:** Iconify
*   **Backend Service:** Hugging Face Spaces (via `@gradio/client`)
*   **Deployment:** Vercel

## 🛠️ Getting Started (Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PURPLE-ORCA/ORCAWIPE.git
    cd orcawipe
    ```

2.  **Install dependencies:**
    (Choose your package manager)
    ```bash
    pnpm install
    # or
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    # or
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 To-Do / Future Enhancements

*   Loading progress indicators
*   Tiny watermark for free users (potential monetization)
*   Hero comparison slider (Original vs Cleaned)
*   User authentication and image history
*   Image enhancement features (super-resolution)
*   Batch processing
*   ...and more!

---

Made by EL MOUSSAOUI MOHAMMED