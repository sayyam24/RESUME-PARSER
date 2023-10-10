import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface JobDescriptionData {
  jobId: number;
  jobTitle: string;
  recruiter: string;
  jobDescription: string;
  startingSalary: string;
  endingSalary: string;
  duration: string;
  education: string[];
  skills: string[];
  experience: string;
  language: string[];
  extraDetails: string[];
  location: string;
}

const JobDescription: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobDescriptionData>({
    jobId: 0,
    jobTitle: "",
    recruiter: "",
    jobDescription: "",
    startingSalary: "",
    endingSalary: "",
    duration: "",
    education: [],
    skills: [],
    experience: "",
    language: [],
    extraDetails: [],
    location: "",
  });
  const [newSkill, setNewSkill] = useState<string>("");
  const [newDetail, setNewDetail] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [uId, setUId] = useState(null);

  useEffect(() => {
    // Call the fetch function here
    fetch("http://127.0.0.1:5000/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const fetchedUId = data.uId;
        setUId(fetchedUId);
        console.log(uId);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddDetail = () => {
    if (newDetail && !formData.extraDetails.includes(newDetail)) {
      setFormData((prevData) => ({
        ...prevData,
        extraDetails: [...prevData.extraDetails, newDetail],
      }));
      setNewDetail("");
    }
  };

  const handleRemoveDetail = (detail: string) => {
    setFormData((prevData) => ({
      ...prevData,
      extraDetails: prevData.extraDetails.filter((d) => d !== detail),
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage && !formData.language.includes(newLanguage)) {
      setFormData((prevData) => ({
        ...prevData,
        language: [...prevData.language, newLanguage],
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData((prevData) => ({
      ...prevData,
      language: prevData.language.filter((lang) => lang !== language),
    }));
  };

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const apiData = {
      title: formData.jobTitle,
      recruiter: formData.recruiter,
      description: formData.jobDescription,
      salary: formData.endingSalary,
      duration: formData.duration,
      education: formData.education,
      skill: formData.skills,
      location: formData.location,
      experience: formData.experience,
      language: formData.language,
      extra: formData.extraDetails,
    };
    // Handle form submission here, e.g., call an API or update state
    // console.log("Form data submitted:", formData);
    try {
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("API call successful", responseData);
        alert("Job created successfully")
        navigate("/employerdashboard");
        // Handle further actions after successful API call
      } else {
        console.error("API call failed");

        // Handle error cases
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleAddEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [...prevData.education, ""],
    }));
  };

  const handleEducationInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = event.target.value;
    setFormData((prevData) => {
      const updatedEducation = [...prevData.education];
      updatedEducation[index] = newValue;
      return {
        ...prevData,
        education: updatedEducation,
      };
    });
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prevData) => {
      const updatedEducation = [...prevData.education];
      updatedEducation.splice(index, 1);
      return {
        ...prevData,
        education: updatedEducation,
      };
    });
  };

  // const handleEducationChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const { name, value } = event.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  return (
    <div className=" min-h-screen p-8 ">
      <div className="w-3/4 mx-auto bg-white p-6 rounded-2xl shadow-2xl">
        <Link to="/">
          {" "}
          <button className="mt-4 mb-4 bg-transparent text-blue-500 font-semibold text-lg  hover:text-gray-400">
            Back
          </button>
        </Link>
        <h2 className="text-3xl font-semibold mb-8">Create Job Description</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Recruiter
            </label>
            <input
              type="text"
              name="recruiter"
              value={formData.recruiter}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={6}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Salary/CTC
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                name="startingSalary"
                value={formData.startingSalary}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded"
                placeholder="Starting Salary"
              />
              <input
                type="number"
                name="endingSalary"
                value={formData.endingSalary}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded"
                placeholder="Ending Salary"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Education
            </label>
            <div>
              {formData.education.map((education, index) => (
                <div key={index} className="flex space-x-4 mb-2">
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => handleEducationInputChange(e, index)}
                    className="flex-1 p-2 border rounded"
                    placeholder={`Education ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="bg-gray-500 text-white px-2 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-10 bg-blue-500 text-white py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Skills
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type a skill"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="ml-2 w-1/4 bg-blue-500 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-gray-500 text-white p-2 rounded-xl flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-white font-semibold focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            {/* ... */}
            <label className="block text-gray-700 font-semibold mb-1">
              Extra Details
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Type an extra detail"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="ml-2 w-1/4 bg-blue-500 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.extraDetails.map((detail) => (
                <div
                  key={detail}
                  className="bg-gray-500 text-white p-2 rounded-xl flex items-center"
                >
                  {detail}
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(detail)}
                    className="ml-2 text-white font-semibold focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Experience
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            {/* ... */}
            <label className="block text-gray-700 font-semibold mb-1">
              Languages
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Type a language"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="ml-2 w-1/4 bg-blue-500 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.language.map((language) => (
                <div
                  key={language}
                  className="bg-gray-500 text-white p-2 rounded-xl flex items-center"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(language)}
                    className="ml-2 text-white font-semibold focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDescription;

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSkillsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedSkills = Array.from(
//       event.target.selectedOptions,
//       (option) => option.value
//     );
//     setFormData((prevData) => ({
//       ...prevData,
//       skills: selectedSkills,
//     }));
//   };

//   const handleRemoveSkill = (skill: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       skills: prevData.skills.filter((s) => s !== skill),
//     }));
//   };
