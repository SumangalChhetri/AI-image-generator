'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageUrl('');
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Error generating image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'ai-image.png';
    link.click();
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <div className="w-full max-w-2xl bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-700 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg">
          ✨ AI Image Generator
        </h1>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your imagination..."
          className="w-full p-4 text-lg rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={generateImage}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-cyan-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {loading ? '🔄 Generating...' : '🚀 Generate'}
          </button>

          <button
            onClick={copyPrompt}
            className="border border-cyan-500 text-cyan-400 px-4 py-2 rounded-xl hover:bg-cyan-600 hover:text-white transition-all"
          >
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 font-medium mb-4">{error}</p>
        )}

        {imageUrl && (
          <div className="flex flex-col items-center gap-4">
            <img
              src={imageUrl}
              alt="Generated AI"
              className="rounded-xl border-4 border-purple-700 shadow-xl max-w-full"
            />
            <button
              onClick={downloadImage}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all shadow-md hover:scale-105"
            >
              📥 Download Image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
