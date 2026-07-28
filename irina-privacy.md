---
layout: legal
title: Irina Privacy Policy
description: How Irina handles your information — it records and transcribes your meetings on your own device, and sends nothing to us.
permalink: /irina-privacy/
effective: 2026-07-28
updated: 2026-07-28
---

Irina is made by Byteshire LLC ("we," "us"). This policy explains what happens to your information when you use the Irina app on iPhone, iPad, and Mac.

## The short version

**Irina does not collect your personal data.** We have no servers, no user accounts, no analytics, no advertising, and no tracking. Irina records your meetings, transcribes them, and summarizes them using the models built into your own device, and it stores the results as files you own. We never receive your recordings, your transcripts, your summaries, or your voice. There is no Byteshire service for them to be sent to.

The two things worth reading past the short version are the one narrow case where a piece of a transcript reaches Apple's servers, and how the voice-recognition feature stores voice fingerprints. Both are covered below.

## Recording a call is your responsibility, not ours

On a Mac, Irina records both halves of a conversation: the audio coming out of your speakers, which is the other participants, and your own voice through the microphone. macOS requires your explicit permission for each of those before Irina can capture anything.

**The other people on the call are not notified.** Irina records the audio your Mac is already playing, so the app you are calling in never learns a recording is happening and never shows its own recording notice. Irina has no way to tell the other participants — it listens to your microphone rather than speaking into it.

Laws in many places require everyone on a call to agree before it is recorded, and some treat recording without that agreement as a criminal offence. Obtaining everyone's agreement is your responsibility as the person recording. Irina asks you to acknowledge this before your first recording and reminds you to announce it, but it cannot obtain consent for you, and using Irina does not transfer that duty to us.

## What happens to the audio

Transcription runs **on your device**, using the speech-recognition models built into Apple's operating system. Summarization also runs on your device, using Apple's on-device language model. Speaker separation — working out how many people spoke and which stretches belong to whom — runs on your device too, using models that ship inside the app itself and need no network connection.

Your recordings are not uploaded to us for any of this, and no third-party transcription or summarization service is involved at any point.

**The one exception, and it goes to Apple rather than to us.** Apple's on-device summarizer sometimes declines to process a passage — its safety filters occasionally misfire on ordinary business conversation. When that happens, Irina retries that single request using **Apple's Private Cloud Compute**, Apple's own server-based extension of the same model. In that case the text of that portion of the transcript is sent to Apple for processing. Apple states that Private Cloud Compute does not retain this data and that it is not accessible to Apple; their handling is governed by Apple's privacy policy, not ours. This is a fallback for one request, not the normal path, and it never sends your audio — only text. If you would rather it never happened, the summary can simply be left ungenerated.

**Irina does not currently delete your recordings after transcribing them.** The audio stays inside the meeting until you delete it, which you can do per take from the meeting window. We mention this explicitly because a transcript being finished does not mean the recording is gone.

## Where your meetings are stored

Each meeting is a file on your own storage — a `.irina` document holding the audio, the transcript, and the summary. Irina keeps no separate library, no database, and no account.

By default new meetings are created in an **Irina folder in your iCloud Drive**, which means Apple stores and syncs them under your own iCloud account, exactly as with any other document you keep there. On a Mac you can point Irina at a different folder instead, including a folder belonging to another cloud provider, in which case that provider stores and syncs the files under whatever terms you have with them. Either way the files are yours and they never pass through us.

The transcript and summary inside each meeting are ordinary Markdown text, readable by any editor, so nothing is locked into a format only Irina understands.

## Voice recognition and voice fingerprints

If you name a speaker, Irina can recognize that person's voice in later meetings. It does this by storing a **voice fingerprint**: a short list of numbers derived from the sound of their speech, roughly a kilobyte in size, alongside the name you gave. It is not a recording, and audio cannot be reconstructed from it — but it is designed to identify a specific person by voice, so we treat it as sensitive.

These fingerprints are stored in **your own private iCloud database**, in your iCloud account, so that recognition works across your devices. Byteshire has no access to that database and cannot read your fingerprints, your names, or anything else in it. They are not shared with anyone and are never used for advertising or analysis.

Bear in mind that a voice fingerprint you save may belong to **another person** — a colleague on a call, not you. Only name the voices you have a reason to, and remember that the underlying obligation to record and identify people lawfully is the same one described above.

You can review every stored voice in the app's Known Voices window, rename or delete any of them individually, or rebuild the whole set from your meeting files. Deleting a voice removes it from your iCloud database.

## Network activity

Irina makes no requests to Byteshire. The network is used only for these purposes:

- **Apple's speech models.** The first time you transcribe in a given language, the operating system downloads that language's speech-recognition assets from Apple.
- **Private Cloud Compute**, in the single fallback case described above.
- **iCloud**, to sync your meeting files and your voice fingerprints under your own account, if you keep them there.

Speaker-separation models are bundled inside the app and download nothing.

## No analytics or tracking

Irina contains no third-party analytics, advertising, or tracking software. It does not collect crash reports itself and builds no profile of you or your usage. If you have opted in to sharing diagnostics with Apple at the system level, Apple may send us anonymized crash reports through App Store Connect; those come from Apple, are not linked to your identity, and contain no meeting content.

## Children

Irina is not directed at children and collects no personal information from anyone, including children.

## Your control and data deletion

There is nothing of yours for us to delete, because we never receive anything.

Within the app you can delete an individual take's audio, delete a whole meeting as you would any other file, and delete any stored voice fingerprint. Deleting the app removes its preferences from your device; your meeting files remain wherever you keep them, and voice fingerprints stored in your iCloud database can be removed by deleting them in the app beforehand or by removing the app's data from your iCloud settings.

## Changes to this policy

If we change this policy, we will update the "Last updated" date above and post the new version at this address.

## Contact

Questions about this policy? Email us at **info@byteshire.com**.
