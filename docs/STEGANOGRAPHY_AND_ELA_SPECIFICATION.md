# NeuroShield Steganography & Error Level Analysis (ELA) Architectural Blueprint

## Executive Overview
This specification details the detection algorithms implemented within **NeuroShield** for uncovering spatial steganography and JPEG re-compression error artifacts.

---

## 1. Steganographic LSB Payload Detection
- **Bit-Entropy Scanning**: Scans least-significant bits (LSB) across RGB color channels.
- **Statistical Thresholds**: Natural imagery maintains structured bit-channel patterns; high uniform entropy (>0.88) signifies encrypted payload embedding.

```
[ Input Image ] ──► [ Spatial LSB Extraction ] ──► [ Bit-Entropy Calculator ] ──► [ Verdict ]
```

---

## 2. Error Level Analysis (ELA)
- **JPEG Error Grids**: Computes local compression variance when saving media at known quantization levels.
- **Highlight Maps**: Spliced or modified regions exhibit significantly higher error levels compared to surrounding original imagery.

---

## 3. Merkle Audit & Evidence Integrity
- All ELA maps, steganography verdicts, and voiceprint biometrics are converted into SHA-256 leaves and signed into the **Merkle Audit Tree**.
