import React, { useState } from 'react';
import { Youtube, FileText, Loader2 } from 'lucide-react';


export default function VideoSummarizer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
  
    if (!isValidYouTubeUrl(url)) {
      setLoading(false);
      setError('Please enter a valid YouTube URL.');
      return;
    }
  
    try {
      // Call OpenRouter API directly from the frontend
      const apik = import.meta.env.VITE_API_KEY;
 
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Summarize the transcript of this YouTube video: ${url}`,
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get a response from OpenRouter API.');
      }
  
      const data = await response.json();
  
      // Extract the summary from the API response
      setSummary(data.choices[0].message.content);
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'An error occurred while summarizing the video.');
    } finally {
      setLoading(false);
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Youtube className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            YouTube Video Summarizer
          </h1>
          <p className="text-lg text-gray-600">
            Get quick summaries of any YouTube video - save time while staying informed
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your YouTube video URL here..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
            <button
              type="submit"
              disabled={!isValidYouTubeUrl(url) || loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Summarize
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {summary && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Video Summary</h2>
            <div className="prose max-w-none text-gray-700">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}