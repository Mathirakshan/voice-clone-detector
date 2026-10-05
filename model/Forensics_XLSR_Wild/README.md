---
license: cc-by-nc-4.0
pipeline_tag: audio-classification
library_name: pytorch
language:
  - multilingual
base_model: facebook/wav2vec2-xls-r-300m
tags:
  - audio-classification
  - deepfake-detection
  - anti-spoofing
  - speech
  - aasist
  - wav2vec2
  - xls-r
  - generalization
---

# forensics_0.3B_xlsr_wild_deepfake_classifier

**Built for audio you don't control.** Most deepfake detectors are trained and tested on clean lab recordings, then fall apart on messy, real-world audio — phone recordings, compressed clips, unknown microphones, unknown everything. This model is the member of the Forensics family tuned specifically for that gap: an XLS-R + AASIST detector that leads the family on the In-the-Wild benchmark, the closest thing to "audio as it actually shows up in the real world."

- **Backbone:** `facebook/wav2vec2-xls-r-300m` (~300M params, fully unfrozen)
- **Pooling:** AASIST graph-attention

## Part of the Forensics family

| Model | Use it for |
|---|---|
| [`forensics_0.3B_base_deepfake_classifier`](https://huggingface.co/eliya/forensics_0.3B_base_deepfake_classifier) | general-purpose default |
| **`forensics_0.3B_xlsr_wild_deepfake_classifier`** (this model) | uncontrolled / real-world audio |
| [`forensics_0.3B_v2_deepfake_age_gender_classifier`](https://huggingface.co/eliya/forensics_0.3B_v2_deepfake_age_gender_classifier) 🆕 | speaker age/gender, hardened against the newest TTS threats — our latest release |
| [`forensics_0.3B_wavlm_oc_softmax_deepfake_classifier`](https://huggingface.co/eliya/forensics_0.3B_wavlm_oc_softmax_deepfake_classifier) | tighter bonafide boundary, ensembling |

Full family: [huggingface.co/collections/eliya/forensics-speech-deepfake-detection-family](https://huggingface.co/collections/eliya/forensics-speech-deepfake-detection-family)

## Training

Trained using an agentic training loop — see [eliyasegev/autotrain](https://github.com/eliyasegev/autotrain).

Weighted cross-entropy loss, Adam optimizer, large effective batch size, 9 synthetic fakes sampled per real utterance, backbone unfrozen from the very first step.

Trained on 5M+ speech samples spanning a mix of proprietary and publicly available data — some of our own self-created data has been open-sourced as well. Built for robustness against a wide range of TTS generation methods — including some of the most advanced synthesis techniques available today — and tuned specifically for generalization to real-world, out-of-domain audio. Same heavy augmentation stack as the rest of the family — codec transcoding, noise augmentation, RIR, RawBoost, SpecAugment, FreqMask, splice/mix, and cross-class splice.

## Results

| Eval set | EER % |
|---|---|
| Val (held-out) | 1.75 |
| MLAAD (v7) | 2.24 |
| CodecFake | 1.90 |
| DFADD | 0.30 |
| MD-CommonVoice | 0.17 |
| **In-the-Wild** | **1.03** |
| ASVspoof2019-LA | 1.48 |
| ASVspoof2021-LA | 2.81 |
| ASVspoof2024 | 12.66 |
| ADD2022-Track1 | 17.71 |
| ADD2022-Track3 | 4.41 |
| ADD2023-Round1 | 10.87 |
| ADD2023-Round2 | 12.86 |
| LibriSeVoc | 0.08 |
| SONAR | 3.05 |
| **Avg (all sets)** | **4.89** |
| **Avg (external only)** | **5.33** |

1.03% EER on In-the-Wild — the best real-world generalization result in the Forensics family.

## Files in this repo
| file | purpose |
|---|---|
| `checkpoint_epoch_4.safetensors` | model weights, safe format |
| `checkpoint_epoch_4.pt` | model weights, legacy pickle |
| `config.json` | minimal architecture metadata (also used by the Hub to track downloads) |
| `inference.py` | run script — prefers the `.safetensors` file automatically |
| `model.py` | architecture |
| `requirements.txt` | deps |

## Setup
```bash
pip install -r requirements.txt   # torch, torchaudio, transformers, safetensors
hf download eliya/forensics_0.3B_xlsr_wild_deepfake_classifier --local-dir .
```

## Run
```bash
python inference.py <audio.wav>
```
(Optionally override the checkpoint: `python inference.py <audio.wav> <checkpoint.pt>`.)

Audio is auto-converted to mono / 16 kHz and trimmed/padded to 5 s.

## Output
```
fake_probability: <0..1>      # threshold is domain-dependent — adjust to your use case; ~0.1-0.2 is usually the best range
bonafide_score:   <0..1>      # raw P(real)
verdict: REAL | FAKE
```

## Example
```
$ python inference.py real_human.wav
fake_probability: 0.1102
bonafide_score:   0.8898
verdict: REAL

$ python inference.py tts_fake.wav
fake_probability: 0.7366
bonafide_score:   0.2634
verdict: FAKE
```
Higher `fake_probability` = more likely a deepfake. Score is `1 − sigmoid(logit)`,
since the classifier is trained with label `1 = real, 0 = fake`.

## References

- XLS-R: Babu et al., 2021, *"XLS-R: Self-Supervised Cross-Lingual Speech Representation Learning at Scale"*, arXiv:2111.09296
- AASIST: Jung et al., 2021 (ICASSP 2022), *"AASIST: Audio Anti-Spoofing Using Integrated Spectro-Temporal Graph Attention Networks"*, arXiv:2110.01200
- RawBoost augmentation: Tak et al., 2021 (ICASSP 2022), arXiv:2111.04433
- FreqMask augmentation: Xie et al., 2024, arXiv:2408.06922
- SpeechFake dataset: ACL 2025, *"SpeechFake: A Large-Scale Multilingual Speech Deepfake Dataset Incorporating Cutting-Edge Generation Methods"*, arXiv:2507.21463 — this training recipe reproduces its Table 6

## License

CC-BY-NC-4.0 — free for personal and research use. For commercial use, contact eliya@vocos.io.
