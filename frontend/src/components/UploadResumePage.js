import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './UploadResumePage.css';

function UploadResumePage() {
    const [resume, setResume] = useState(null);
    const [message, setMessage] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [animation, setAnimation] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setAnimation(true);
    }, []);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
        setUploadSuccess(true); // Set uploadSuccess to true immediately after file selection
        setMessage("");
        setErrorMessage("");
    };

    const handleUpload = async () => {
        if (!resume) {
            setMessage("Please select a file first.");
            return;
        }

        setIsLoading(true);
        setMessage("");
        setRecommendations([]);
        setErrorMessage("");
        // setUploadSuccess(false); // No need to set it to false here, as it's already true after file selection

        const formData = new FormData();
        formData.append("file", resume);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Response from server:", response.data);
            setMessage(response.data.message);
            setRecommendations(response.data.recommendations.recommendations || []);
            // setUploadSuccess(true); // No need to set it again, it's already set
        } catch (error) {
            console.error("Error uploading file:", error);
            if (error.response) {
                setErrorMessage(`Upload failed: ${error.response.data.message}. Details: ${JSON.stringify(error.response.data.error)}`);
            } else if (error.request) {
                setErrorMessage("Upload failed: No response from server.");
            } else {
                setErrorMessage("Upload failed: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={`upload-resume-page ${animation ? 'fade-in' : ''}`}>
            <div className="upload-container">
                <header className="upload-header">
                    <h1>Resume Analyzer</h1>
                    <p>Upload your resume and get personalized job recommendations.</p>
                </header>

                <div className="upload-form">
                    <input
                        type="file"
                        id="file-upload"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isLoading}
                    />
                    <button className="file-upload-label" onClick={handleChooseFile} disabled={isLoading}>
                        {resume ? resume.name : "Upload Resume"}
                    </button>
                    {uploadSuccess && <p className="success-message">File uploaded successfully!</p>}
                    <button onClick={handleUpload} disabled={isLoading || !resume} className="upload-button">
                        {isLoading ? "Analyzing..." : "Generate"}
                    </button>


                    
                    {message && <p className="message">{message}</p>}
                    {errorMessage && <p className="error">{errorMessage}</p>}
                </div>

                {recommendations.length > 0 && (
                    <div className="recommendations">
                        <h2>Recommended Jobs:</h2>
                        <ul className="job-list">
                            {recommendations.map((job, index) => (
                                <li key={index} className="job-item">{job}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadResumePage;
