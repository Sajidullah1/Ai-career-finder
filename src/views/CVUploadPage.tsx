import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_CV_RAW_TEXT } from '../data/sampleCV';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  FileCode, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const CVUploadPage: React.FC = () => {
  const { analyzeCV, isAnalyzing, analyzingStep, setRoute, loadDemoMode } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ];

  const handleFile = (file: File) => {
    setErrorMessage(null);

    // Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB. Please upload a smaller PDF or DOCX resume.');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isDocx = file.name.endsWith('.docx') || file.type.includes('word');
    const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');

    if (!isPdf && !isDocx && !isTxt) {
      setErrorMessage('Unsupported file format. Please upload a PDF or DOCX file.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix if base64
      const base64 = result.split(',')[1] || result;
      setBase64File(base64);
    };
    reader.onerror = () => {
      setErrorMessage('Could not read the uploaded file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setBase64File(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setPasteMode(true);
    setPastedText(SAMPLE_CV_RAW_TEXT);
    setSelectedFile(null);
    setBase64File(null);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    setErrorMessage(null);

    if (pasteMode) {
      if (!pastedText.trim() || pastedText.trim().length < 50) {
        setErrorMessage('Please paste at least 50 characters of CV content.');
        return;
      }
      await analyzeCV({
        text: pastedText.trim(),
        filename: 'Pasted_Candidate_CV.txt'
      });
    } else {
      if (!selectedFile || !base64File) {
        setErrorMessage('Please select a PDF or DOCX file to analyze.');
        return;
      }
      await analyzeCV({
        base64File,
        mimeType: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        filename: selectedFile.name
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multimodal Gemini 3.8 Flash CV Engine</span>
        </div>
        <h1 className="mt-2 font-['Space_Grotesk'] text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Upload Your CV for AI Analysis
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-500">
          Our intelligent pipeline extracts your skills, benchmarks ATS readability, identifies high-priority gaps, and scores job matches.
        </p>
      </div>

      {/* Mode Switch: Upload File vs Paste Text */}
      <div className="mt-6 flex justify-center">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setPasteMode(false)}
            className={`rounded-lg px-4 py-2 transition ${
              !pasteMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Document (PDF / DOCX)
          </button>
          <button
            onClick={() => setPasteMode(true)}
            className={`rounded-lg px-4 py-2 transition ${
              pasteMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Resume Text
          </button>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        {!pasteMode ? (
          <div>
            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
                }`}
                id="dropzone-cv"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
                  <UploadCloud className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  Drag & drop your CV here, or <span className="text-indigo-600 underline">browse</span>
                </h3>
                <p className="mt-1.5 text-xs text-slate-500">
                  Supports PDF or DOCX up to 15MB
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">PDF</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">DOCX</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">TXT</span>
                </div>
              </div>
            ) : (
              /* File Selected Preview State */
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
                        {selectedFile.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB · Ready for analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      title="Replace file"
                    >
                      Replace
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      className="rounded-lg border border-rose-200 bg-white p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>File validated. Ready to send to Gemini for structured profile extraction.</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Paste Text Mode */
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                Paste Resume / CV Plain Text
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                Insert Sample CV (Alex Chen)
              </button>
            </div>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your CV text here (summary, education, skills, projects, experience)..."
              rows={10}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600"
          >
            <FileCode className="h-4 w-4" />
            <span>Load Sample Full-Stack CV</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || (!selectedFile && !pastedText.trim())}
              className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold text-white shadow-md transition active:scale-98 ${
                isAnalyzing || (!selectedFile && !pastedText.trim())
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
              id="btn-analyze-cv"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze CV with AI</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay / Progression Status */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <RefreshCw className="h-7 w-7 animate-spin" />
            </div>

            <h3 className="mt-4 font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              AI Analysis in Progress
            </h3>

            <p className="mt-1 text-xs text-indigo-600 font-semibold">
              {analyzingStep || 'Processing your document...'}
            </p>

            <div className="mt-5 space-y-2 text-left text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Reading document tokens & structure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Parsing education, experience, and project metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500 animate-pulse" />
                <span>Comparing against target market requirements</span>
              </div>
            </div>

            <p className="mt-5 text-[11px] text-slate-400">
              This usually takes 3–5 seconds using Gemini 3.8 Flash.
            </p>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-slate-400" />
        <span>Your CV is parsed securely in-memory and will never be shared without permission.</span>
      </div>
    </div>
  );
};
