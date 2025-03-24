# Video Player Project

## Overview
This project is a custom video player built with React TS. It includes features such as video playback, trimming functionality, and a timeline for seeking. The application is designed to provide a user-friendly interface for interacting with video content.

---

## Components

### 1. VideoPlayer
- **Description**: The main component that manages the video playback, state, and interactions between other components.
- **Key Features**:
  - Handles video playback (`play`, `pause`, `mute`).
  - Manages the trimming range (`trimStart` and `trimEnd`).
  - Passes state and callbacks to child components (`Timeline` and `TrimBar`).

---

### 2. Timeline
- **Description**: Displays the video progress and allows the user to seek to a specific time.
- **Props**:
  - `currentTime`: The current playback time of the video.
  - `duration`: The total duration of the trimmed video.
  - `isPlaying`: Indicates whether the video is playing.
  - `isMuted`: Indicates whether the video is muted.
  - `togglePlay`: Callback to toggle playback.
  - `toggleMute`: Callback to toggle mute.
  - `seekTo`: Callback to seek to a specific time.
  - `trimStart`: The start of the trimmed range.
- **Key Features**:
  - Displays the progress bar.
  - Allows seeking by clicking on the timeline.

---

### 3. TrimBar
- **Description**: Allows the user to set the start and end points of the video trimming range.
- **Props**:
  - `trimStart`: The start of the trimmed range.
  - `trimEnd`: The end of the trimmed range.
  - `frames`: An array of video thumbnails.
  - `duration`: The total duration of the video.
  - `handleTrimStateChange`: Callback to update the trimming range.
  - `currentTime`: The current playback time of the video.
- **Key Features**:
  - Displays draggable handles for adjusting the trimming range.
  - Shows a black line to indicate the current playback time.

---

## Important Functions

### 1. `handleTimeUpdate` (VideoPlayer)
- **Description**: Updates the `currentTime` state as the video plays.
- **Key Logic**:
  - Clamps `currentTime` to the trimmed range (`trimStart` to `trimEnd`).
  - Pauses the video if it exceeds `trimEnd`.

---

### 2. `seekTo` (VideoPlayer)
- **Description**: Seeks the video to a specific time.
- **Key Logic**:
  - Clamps the seek time to the trimmed range (`trimStart` to `trimEnd`).
  - Updates the `currentTime` state.

---

### 3. `handleTrimStateChange` (VideoPlayer)
- **Description**: Updates the trimming range (`trimStart` or `trimEnd`) when the user adjusts the trim handles.
- **Key Logic**:
  - Ensures `currentTime` stays within the new trimmed range.
  - Updates the video element's `currentTime` if necessary.


## How to Run the Project
1. Clone the repository.
2. npm install
3. npm run dev