import React, { useState } from "react";
import axios from "axios";

const UploadResume: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedText, setCopiedText] = useState<string>("");
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
  const [isTextSelected, setIsTextSelected] = useState<boolean>(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setCopiedText(text);
    setIsTextSelected(text !== "");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  };

  const handleTermsAcceptance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsTermsAccepted(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isTermsAccepted) {
      window.alert("Please accept the terms and conditions.");
      return;
    }

    if (isFileSelected && isTextSelected) {
      window.alert("Please select either a file or enter text, not both.");
      return;
    }

    if (!isFileSelected && !isTextSelected) {
      window.alert("Please select either a file or enter text.");
      return;
    }

    if (isFileSelected) {
      if (!selectedFile) {
        window.alert("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setParsedData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (isTextSelected) {
      try {
        const response = await axios.post("http://127.0.0.1:5000/upload_text", {
          text: copiedText,
        });

        setParsedData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setCopiedText("");
    setIsFileSelected(false);
    setIsTextSelected(false);
    setParsedData(null);
  };

  return (
    <div className="mt-8 mb-8 flex flex-col items-center justify-center h-screen">
      <div className="p-12 bg-white rounded-lg shadow-2xl w-full md:w-4/5 lg:w-3/5">
        <h1 className="text-3xl font-semibold mb-8">UPLOAD YOUR RESUME</h1>
        <form onSubmit={handleSubmit}>
          <div
            className="grid grid-cols-3 gap-4"
            style={{ gridTemplateColumns: "3fr 1fr 3fr" }}
          >
            <div className="col-span-1 mt-4">
              <h2 className="text-base font-bold mb-10 text-center">
                Select a file from your device
              </h2>
              <label className="relative w-full h-40 flex items-center justify-center bg-blue-100 border border-gray-300 rounded-lg shadow-lg cursor-pointer">
                <span
                  className={`material-symbols-outlined ${selectedFile ? "opacity-0" : ""
                    }`}
                >
                  open_in_browser
                </span>
                {selectedFile ? (
                  <span className="ml-2">{selectedFile.name}</span>
                ) : (
                  <span className="ml-2">Browse</span>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 w-full h-full"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </label>

              <p className="text-xs text-gray-500 mt-4">
                * We accept .DOC, .DOCX, and .PDF files
              </p>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center mt-12">
              <div className="h-12 w-0.5 bg-gray-400 border-l"></div>
              <p className="my-4 text-gray-600">or</p>
              <div className="h-12 w-0.5 bg-gray-400 border-l"></div>
            </div>
            <div className="col-span-1 mt-4">
              <h2 className="text-base font-bold mb-10 text-center">
                Copy and paste
              </h2>
              <textarea
                className="w-full h-40 p-2 border border-gray-300 rounded-lg resize-none shadow-lg"
                value={copiedText}
                onChange={handleTextChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="mt-4 bg-transparent text-gray-700 font-semibold hover:text-gray-400"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          <div className="flex items-center justify-start mb-4 mt-8">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={isTermsAccepted}
              onChange={handleTermsAcceptance}
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to the terms and conditions
            </label>
          </div>
          <div className="flex justify-end">
            <button
              className={`px-5 py-2 bg-blue-500 border border-blue-500 text-white font-semibold rounded-2xl ${!isTermsAccepted ? "opacity-50 cursor-not-allowed" : ""
                } hover:text-blue-500 hover:bg-white`}
              type="submit"
              disabled={!isTermsAccepted}
            >
              Upload Resume
            </button>
          </div>
          {/* Conditional rendering of the message */}
          {isFileSelected && isTextSelected && (
            <p className="text-red-500 mt-4 text-center">
              Please select either a file or enter text, not both.
            </p>
          )}
          {parsedData && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Parsed Details</h2>
              <pre>{JSON.stringify(parsedData, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
