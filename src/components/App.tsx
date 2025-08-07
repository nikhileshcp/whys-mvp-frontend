import React from 'react';
import { useState } from 'react';
import styles from './App.module.css';
import logo from '../assets/logo.jpeg';

export default function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [inference, setInference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setTranscript('Loading transcript...');
    setInference('Loading inference...');
    setLoading(true);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze audio');

      const data = await response.json();
      setTranscript(data.transcript);
      setInference(data.emotions);
    } catch (err) {
      console.error(err);
      setTranscript('Error during transcription.');
      setInference('Error during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <img src={logo} alt="Whys Logo" className={styles.logo} />
      <h1 className={styles.title}>Welcome to Whys</h1>

      <div className={styles.card}>
        <label className={styles.uploadLabel}>
          Upload an audio file
          <input
            type="file"
            accept="audio/*"
            className={styles.uploadInput}
            onChange={handleAudioChange}
          />
        </label>

        <div className={styles.textSection}>
          <h2>Transcript</h2>
          <textarea
            className={styles.textArea}
            value={transcript}
            readOnly
            placeholder="Transcript will appear here"
          />
        </div>

        <div className={styles.textSection}>
          <h2>Inference</h2>
          <textarea
            className={styles.textArea}
            value={inference}
            readOnly
            placeholder="Inference will appear here"
          />
        </div>

        {loading && <p>Analyzing audio... please wait.</p>}
      </div>
    </div>
  );
}
