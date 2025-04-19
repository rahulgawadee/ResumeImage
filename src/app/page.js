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
  Info,
  X,
  HelpCircle,
  FileType,
  Eye
} from "lucide-react";

export default function Home() {
  const [pdf, setPdf] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [position, setPosition] = useState("top-right");
  const [size, setSize] = useState("medium");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [step, setStep] = useState(1);

  const handleUpload = async () => {
    if (!pdf || !photo) {
      setStatus("Please select both a PDF resume and a photo.");
      return;
    }

    setLoading(true);
    setStatus("Uploading files...");
    setStep(3);

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("photo", photo);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      setStatus("Merging PDF and photo...");

      const mergeRes = await fetch(`/api/merge?position=${position}&size=${size}`);
      if (!mergeRes.ok) throw new Error("Merge failed");

      setStatus("Merge successful! Your resume with photo is ready to download.");
      setStep(4);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (setter, nameSetter, previewSetter = null) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      nameSetter(file.name);
      setStatus("");
      
      // For image preview
      if (previewSetter && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => previewSetter(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const resetForm = () => {
    setPdf(null);
    setPhoto(null);
    setPosition("top-right");
    setSize("medium");
    setStatus("");
    setPhotoPreview(null);
    setPdfName("");
    setPhotoName("");
    setStep(1);
  };

  const nextStep = () => {
    if (step === 1 && pdf) setStep(2);
    else if (step === 2 && photo) setStep(3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Resume Photo Merger</h1>
              <button 
                onClick={() => setShowHelp(!showHelp)} 
                className="p-2 rounded-full hover:bg-white/20 transition"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-2 opacity-90">Enhance your resume with a professional photo in just a few steps</p>
          </div>
          
          {/* Help Dialog */}
          {showHelp && (
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Info className="w-5 h-5" /> How it works
                </h3>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-800">
                <li>Upload your resume in PDF format</li>
                <li>Add a professional headshot photo (JPG, PNG)</li>
                <li>Choose where to place your photo (top-left or top-right)</li>
                <li>Select the size of your photo</li>
                <li>Process the files to merge them together</li>
                <li>Download your enhanced resume</li>
              </ol>
              <p className="mt-4 text-sm text-blue-800">
                The app processes everything locally on your device - your files remain private and secure.
              </p>
            </div>
          )}

          {/* Steps Indicator */}
          <div className="flex justify-center py-6 border-b border-gray-100">
            <div className="flex items-center w-full max-w-2xl">
              <div className={`flex-1 flex flex-col items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  <FileType className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 font-medium">Upload Resume</span>
              </div>
              <div className={`flex-1 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex-1 flex flex-col items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  <Image className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 font-medium">Add Photo</span>
              </div>
              <div className={`flex-1 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex-1 flex flex-col items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 font-medium">Process</span>
              </div>
              <div className={`flex-1 h-1 ${step >= 4 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex-1 flex flex-col items-center ${step >= 4 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  <Download className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 font-medium">Download</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Form */}
              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <FileType className="w-5 h-5 text-blue-600" /> Upload Your Resume
                    </h2>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer bg-gray-50">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange(setPdf, setPdfName)}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FileUp className="w-10 h-10 mx-auto text-blue-500 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Click to select or drag your PDF resume here</p>
                        <p className="text-xs text-gray-500">Accepted format: PDF</p>
                      </label>
                    </div>
                    
                    {pdfName && (
                      <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <FileType className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{pdfName}</span>
                        </div>
                        <button 
                          onClick={() => {setPdf(null); setPdfName("");}}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        onClick={nextStep}
                        disabled={!pdf}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        Next: Add Photo
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <Image className="w-5 h-5 text-blue-600" /> Add Your Photo
                    </h2>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange(setPhoto, setPhotoName, setPhotoPreview)}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Image className="w-10 h-10 mx-auto text-blue-500 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Click to select or drag your photo here</p>
                        <p className="text-xs text-gray-500">Recommended: Professional headshot (JPG, PNG)</p>
                      </label>
                    </div>
                    
                    {photoName && !photoPreview && (
                      <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <Image className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{photoName}</span>
                        </div>
                        <button 
                          onClick={() => {setPhoto(null); setPhotoName(""); setPhotoPreview(null);}}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Photo Position
                        </label>
                        <select
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="text-gray-500 block w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Photo Size
                        </label>
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          className="block w-full text-gray-500 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border text-gray-600 border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!photo}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        Next: Process Files
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <Upload className="w-5 h-5 text-blue-600" /> Process Files
                    </h2>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-green-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileType className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">{pdfName}</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">{photoName}</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">Position: {position.replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">Size: {size}</span>
                        </div>
                      </div>
                    </div>

                    {status && (
                      <div
                        className={`p-3 rounded-lg ${
                          status.includes("Error") || status.includes("failed")
                            ? "bg-red-50 text-red-700"
                            : status.includes("successful")
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {status.includes("Error") || status.includes("failed") ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : status.includes("successful") ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Loader className="w-5 h-5 animate-spin" />
                          )}
                          <span>{status}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(2)}
                        disabled={loading}
                        className="px-4 text-gray-500 py-2 border border-gray-300 rounded-lg  hover:bg-gray-50 "
                      >
                        Back
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={loading || !pdf || !photo}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
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
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                      <h3 className="text-lg font-semibold text-green-800">Success!</h3>
                      <p className="text-green-700 mt-1">Your resume with photo is ready to download</p>
                    </div>
                    
                    <a
                      href="/api/download"
                      className=" block w-full flex text-center py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition items-center justify-center gap-2"
                      download={`${pdfName.replace('.pdf', '')}_with_photo.pdf`}
                    >
                      <Download className="ml-8  w-5 h-5" />
                      Download Enhanced Resume
                    </a>
                    
                    <button
                      onClick={resetForm}
                      className="block w-full text-center py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition"
                    >
                      Create Another
                    </button>
                  </div>
                )}
              </div>
              
              {/* Right Column: Preview */}
              <div className="hidden md:block">
                <div className="bg-gray-50 rounded-lg h-full p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                  
                  {photoPreview ? (
                    <div className="relative w-full border bg-white rounded-lg shadow-sm p-8">
                      <div className="w-full aspect-[210/297] bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="bg-gray-100 h-28 w-full"></div>
                        <div className="p-5">
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3 mb-6"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-100 rounded w-full"></div>
                            <div className="h-2 bg-gray-100 rounded w-full"></div>
                            <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                          </div>
                        </div>
                        
                        {/* Photo preview positioned according to user selection */}
                        <div 
                          className={`absolute ${
                            position === 'top-left' ? 'top-6 left-6' : 'top-6 right-6'
                          } overflow-hidden rounded-lg border-2 border-white shadow-md ${
                            size === 'small' ? 'w-16 h-16' : 
                            size === 'medium' ? 'w-24 h-24' : 'w-32 h-32'
                          }`}
                        >
                          <img 
                            src={photoPreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-center text-xs text-gray-500 mt-3">
                        Resume preview with {position.replace('-', ' ')} positioned photo ({size} size)
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Image className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">Upload your files to see the preview</p>
                      <p className="text-xs text-gray-400 mt-1">Your photo will be positioned at the {position.replace('-', ' ')} of your resume</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Your files are processed locally - we respect your privacy
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}