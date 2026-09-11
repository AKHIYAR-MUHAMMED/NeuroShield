# 🛡️ NeuroShield

> **Next-Generation Deepfake & AI Manipulation Detection Platform with Explainable AI (XAI), Cryptographic Blockchain Ledger, and Court-Admissible Forensic Verification.**

---

![NeuroShield Architecture](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![ISO/IEC 27037](https://img.shields.io/badge/Compliance-ISO%2FIEC_27037-green?style=for-the-badge)
![Blockchain](https://img.shields.io/badge/Ledger-SHA--256_Anchored-orange?style=for-the-badge&logo=blockchain)

---

## 📋 Executive Overview

**NeuroShield** is an enterprise-grade cyber-forensic platform engineered to combat synthetic media, AI voice cloning, deepfake videos, and LLM document forging. Designed for law enforcement agencies, digital forensics units, media organizations, and legal professionals, NeuroShield integrates multi-modal AI detection algorithms with **Explainable AI (XAI)** diagnostics, **immutable SHA-256 cryptographic blockchain anchoring**, and **ISO/IEC 27037-compliant court-admissible certificate generation**.

---

## 🔥 Key Features

### 🛡️ Multi-Modal AI Scanner Hub
Analyzes digital evidence across four primary media domains:
- 🖼️ **Image Forensics**: Detects GAN frequency anomalies, eye specular asymmetry, localized JPEG compression mismatches, and EXIF header tampering.
- 🎥 **Video Deepfake Detection**: Identifies temporal boundary jitter, unnatural blink rates (rPPG pulse estimation), optical flow discontinuities, and audio-visual lip-sync offsets.
- 🎙️ **Audio Voice Clone Scanner**: Detects neural vocoder phase artifacts (ElevenLabs/Bark TTS), phoneme pitch flatness ($F_0$ frequency analysis), and synthetic respiratory gaps.
- 📄 **Document & Text Tamper Analysis**: Identifies PDF vector layer manipulation, font subsetting anomalies, PKCS#7 digital signature corruption, and localized Error Level Analysis (ELA).

### 🔍 Explainable AI (XAI) Diagnostic Engine
- **Grad-CAM Visual Heatmaps**: Pinpoints precise pixel regions manipulated by AI models.
- **Spectral Anomaly FFT Curves**: Fast Fourier Transform graphs highlighting high-frequency synthetic artifacts.
- **rPPG Biological Pulse Tracking**: Monitors subcutaneous capillary blood flow signals to verify live human presence vs. synthetic deepfakes.
- **Detailed Forensic Evidence Breakdown**: Categorized evidence points marked as `Pass`, `Warning`, or `Fail`.

### ⛓️ Immutable Blockchain Ledger
- **SHA-256 Cryptographic Anchoring**: Hashes raw evidence and metadata to create a tamper-evident digital fingerprint.
- **Block Verification & Audit Trail**: Registers proof-of-authenticity on simulated decentralized ledger nodes with block numbers, transaction hashes, and UTC timestamps.
- **Chain of Custody Tracking**: Records evidence custodian details, hardware sensor serials, and analysis timestamps.

### 📜 Court-Admissible Forensic Certificate Generator
- **Legal Compliance**: Formatted according to ISO/IEC 27037 guidelines for digital evidence preservation and presentation.
- **Interactive PDF / Printable Certificate**: Includes legal evidence summary, cryptographic hash, block confirmation, and authorized signatory blocks.
- **Embedded QR Authenticator**: Generates dynamic QR codes allowing judges, opposing counsel, or auditors to instantly verify certificate validity on-chain.

### 📊 Benchmark Dataset Explorer
- Integrated reference datasets including **FaceForensics++**, **Celeb-DF**, **DFDC Challenge**, **ASVspoof 2024**, and **DocTamper Benchmark**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Utilities**: `canvas-confetti` (Celebration triggers), `qrcode` (Dynamic QR generation), `clsx`, `tailwind-merge`

---

## 📂 Project Structure

```
NeuroShield/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css          # Global styling & Tailwind v4 directive
│   │   ├── layout.tsx           # Root layout metadata & structure
│   │   └── page.tsx             # Main dashboard & tab routing hub
│   ├── components/
│   │   ├── Navbar.tsx           # Top navigation header & tab switcher
│   │   ├── Footer.tsx           # Platform footer & compliance status
│   │   ├── Dashboard.tsx        # System overview, stats, recent scans
│   │   ├── scanner/             # Multi-modal media scanner modules
│   │   │   ├── ScannerHub.tsx   # Scanner controller interface
│   │   │   ├── ImageScanner.tsx # GAN & image artifact scanner
│   │   │   ├── VideoScanner.tsx # Frame jitter & lip-sync scanner
│   │   │   ├── AudioScanner.tsx # Vocoder phase & pitch scanner
│   │   │   └── DocumentScanner.tsx # PDF layer & ELA scanner
│   │   ├── blockchain/
│   │   │   ├── BlockchainLedger.tsx # On-chain transaction ledger viewer
│   │   │   └── QrVerifierModal.tsx  # Dynamic QR code scanner & verifier
│   │   ├── certificate/
│   │   │   └── CourtCertificate.tsx # ISO/IEC 27037 court-admissible certificate
│   │   ├── datasets/
│   │   │   └── DatasetExplorer.tsx  # Forensic benchmark dataset browser
│   │   └── xai/
│   │       └── XaiModal.tsx     # Explainable AI diagnostic heatmap modal
│   ├── data/
│   │   └── samples.ts           # Pre-loaded benchmark samples & evidence types
│   └── utils/                   # Shared helpers & formatting functions
├── public/                      # Static assets
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Platform documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-org/neuroshield.git
   cd NeuroShield
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` – Starts the development server with Hot Module Reloading (HMR).
- `npm run build` – Compiles and builds the production app bundle.
- `npm run start` – Starts the production server using the built bundle.
- `npm run lint` – Runs ESLint code style and syntax checks.

---

## ⚖️ Legal & Compliance Standards

NeuroShield operates under strict adherence to digital evidence handling protocols:
- **ISO/IEC 27037:2012**: Guidelines for identification, collection, acquisition, and preservation of digital evidence.
- **Federal Rules of Evidence (FRE) Rule 902(14)**: Self-authenticating records generated by an electronic process or system certified by a qualified person.
- **Cryptographic Auditability**: SHA-256 hashing guarantees zero data alteration during analysis.

---

## 🔒 Security & Privacy

- **Client-Side Hashing Option**: Sensitive files can be processed locally to generate cryptographic hashes before transmission.
- **Zero Raw Data Storage Option**: Hashes and metadata are stored on-chain without exposing private media content.

---

## 🤝 Contributing

Contributions to NeuroShield are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/ForensicModule`).
3. Commit your changes (`git commit -m 'Add new audio deepfake feature'`).
4. Push to the branch (`git push origin feature/ForensicModule`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
