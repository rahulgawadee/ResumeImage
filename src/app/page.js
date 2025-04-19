"use client";
import { useState } from "react";
import {
  Upload,
  Download,
  FileUp,
  Image,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";

export default function Home() {
  const [pdf, setPdf] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleUpload = async () => {
    if (!pdf || !photo) {
      setStatus("Please select both a PDF resume and a photo.");
      return;
    }

    setLoading(true);
    setStatus("Uploading files...");

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("photo", photo);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      setStatus("Merging PDF and photo...");

      const mergeRes = await fetch("/api/merge");
      if (!mergeRes.ok) {
        throw new Error("Merge failed");
      }

      setStatus("Merge successful. You can now download your file.");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (setter, fileType) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      setStatus("");
    }
  };

  const resetForm = () => {
    setPdf(null);
    setPhoto(null);
    setStatus("");
  };

  // Instructions and requirements
  const helpContent = (
    <div className="bg-blue-50 p-4 rounded-lg text-sm">
      <h3 className="font-semibold mb-2">How It Works:</h3>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Upload your resume (PDF format only)</li>
        <li>Upload a professional photo (JPG, PNG formats recommended)</li>
        <li>Click "Merge Files" to combine them</li>
        <li>Download your enhanced resume with photo</li>
      </ol>
      <h3 className="font-semibold mt-3 mb-1">Requirements:</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Resume must be in PDF format (max 5MB)</li>
        <li>Photo should be professional headshot (max 2MB)</li>
        <li>Recommended photo resolution: 300x300px or higher</li>
      </ul>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full space-y-6">
          <div className="text-center pb-3 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">
              Resume Photo Merger
            </h1>
            <p className="text-gray-600 mt-2">
              Professionally integrate your photo into your resume PDF with just
              a few clicks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <FileUp className="w-5 h-5" />
                  Upload Files
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume (PDF)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        pdf
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange(setPdf, "pdf")}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        {pdf ? (
                          <div className="text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>{pdf.name}</span>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <Upload className="w-10 h-10 mx-auto mb-2" />
                            <span>Click to upload resume PDF</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Photo
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        photo
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange(setPhoto, "photo")}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        {photo ? (
                          <div className="text-green-600 flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>{photo.name}</span>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <Image className="w-10 h-10 mx-auto mb-2" />
                            <span>Click to upload photo</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Merge Files
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              {status && (
                <div
                  className={`p-3 rounded-lg ${
                    status.includes("Error") ||
                    status.includes("failed") ||
                    status.includes("Please select")
                      ? "bg-red-50 text-red-700"
                      : status.includes("successful")
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status.includes("Error") ||
                    status.includes("failed") ||
                    status.includes("Please select") ? (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    ) : status.includes("successful") ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <Loader className="w-5 h-5 animate-spin flex-shrink-0" />
                    )}
                    <span>{status}</span>
                  </div>
                </div>
              )}

              {status.includes("download") && (
                <a
                  href="/api/download"
                  className="block text-center py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                  download
                >
                  <Download className="w-5 h-5" />
                  Download Enhanced Resume
                </a>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-3"
                >
                  <span>{showHelp ? "Hide" : "Show"} instructions</span>
                  <AlertCircle className="w-4 h-4" />
                </button>

                {showHelp && helpContent}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-3">
                  Why Add a Photo to Your Resume?
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Makes your application more memorable</li>
                  <li>✓ Adds a personal touch for certain industries</li>
                  <li>
                    ✓ Required for international job applications in many
                    countries
                  </li>
                  <li>
                    ✓ Perfect for CVs in academic, creative, and hospitality
                    fields
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="font-semibold mb-2">Photo Tips</h2>
                <p className="text-sm text-gray-600">
                  For best results, use a professional headshot with neutral
                  background. Your photo will be positioned in the top corner of
                  your resume without disrupting the existing layout.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center text-xs text-gray-500 border-t border-gray-200 mt-6">
            <p>
              All processing happens on our secure servers. Your files are
              automatically deleted after processing.
            </p>
            <p className="mt-1">
              © 2025 Resume Photo Merger. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
