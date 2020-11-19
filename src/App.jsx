import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // write file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // run ffmpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    // read result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // create url
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(url);
  };

  return ready ? (
    <div className="app">
      {video && (
        <video
          className="video-wrap"
          controls
          width="250"
          src={URL.createObjectURL(video)}
        ></video>
      )}
      <input
        className="btn"
        type="file"
        onChange={(e) => setVideo(e.target.files?.item(0))}
      />

      <h3>Result:</h3>

      <button onClick={convertToGif}>Convert</button>

      {gif && <img className="video-wrap" src={gif} width="250" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
