import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function AudioPlayer() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElementRef = useRef(null);

  useEffect(() => {
    // Load last playing audio file and continue playing from the last position
    const lastTrackIndex = localStorage.getItem('lastTrackIndex');
    if (lastTrackIndex !== null) {
      setCurrentTrackIndex(parseInt(lastTrackIndex));
    }

    const audioTime = localStorage.getItem('audioTime');
    if (audioTime !== null && audioElementRef.current) {
      audioElementRef.current.currentTime = parseFloat(audioTime);
      setIsPlaying(true); // Auto-play is not possible due to browser restrictions
    }
  }, []);

  useEffect(() => {
    // Update localStorage with current track index
    localStorage.setItem('lastTrackIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const newPlaylist = [...playlist];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const audioURL = URL.createObjectURL(file);
      newPlaylist.push({ title: file.name, audioURL });
    }
    setPlaylist(newPlaylist);
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    if (audioElementRef.current) {
      audioElementRef.current.src = playlist[index].audioURL;
      setIsPlaying(true);
    }
  };

  const handlePlay = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    if (currentTrackIndex < playlist.length - 1) {
      playTrack(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/mp3" onChange={handleFileUpload} multiple />
      <div>
        <h2>Playlist</h2>
        <ul>
          {playlist.map((track, index) => (
            <li key={index} onClick={() => playTrack(index)}>{track.title}</li>
          ))}
        </ul>
      </div>
      <div>
        {isPlaying ? (
          <button onClick={handlePause}>Pause</button>
        ) : (
          <button onClick={handlePlay}>Play</button>
        )}
      </div>
      <div>
        <h2>Now Playing</h2>
        <p>{playlist[currentTrackIndex]?.title}</p>
        <audio
          src={playlist[currentTrackIndex]?.audioURL}
          controls
          onEnded={handleEnded}
          ref={audioElementRef}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
