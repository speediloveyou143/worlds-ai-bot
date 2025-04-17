import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../config/constant";

function CreateTest() {
  const [formData, setFormData] = useState({
    question: "",
    test: [{ input: "", output: "" }],
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "question") {
      setFormData({ ...formData, question: value });
    } else {
      const updatedTest = [...formData.test];
      updatedTest[index][name] = value;
      setFormData({ ...formData, test: updatedTest });
    }
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      test: [...formData.test, { input: "", output: "" }],
    });
  };

  const removeTestCase = (index) => {
    const updatedTest = formData.test.filter((_, i) => i !== index);
    setFormData({ ...formData, test: updatedTest });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.question) {
        setFormError("Question is required.");
        return;
      }
      if (formData.test.length === 0) {
        setFormError("At least one test case is required.");
        return;
      }
      const invalidTest = formData.test.some(
        (item) => !item.input || !item.output
      );
      if (invalidTest) {
        setFormError("Each test case must have both input and output.");
        return;
      }

      setFormError("");
      setSuccessMessage("");
      const response = await axios.post(
        `${BACKEND_URL}/create-test`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccessMessage("Test created successfully!");
        setFormData({ question: "", test: [{ input: "", output: "" }] });
      } else {
        setFormError("Test not created.");
      }
    } catch (err) {
      setFormError("Something went wrong.");
      console.error("Error creating test:", err);
    }
  };

  return (
    <div className="h-full bg-gray-950 p-4 flex flex-col items-start">
      <div className=" w-full sm:w-2/3 bg-base-300 p-3 sm:p-7 rounded-2xl border-2 border-sky-500 s-form text-center mb-8">
        <h1 className="text-4xl">Create Test</h1>
        {successMessage && (
          <p className="text-success mt-3">{successMessage}</p>
        )}
        <label className="input input-bordered flex items-center gap-2 mt-3">
          Question:
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="grow"
          />
        </label>
        {formData.test.map((testCase, index) => (
          <div key={index} className="mt-3">
            <label className="input input-bordered flex items-center gap-2">
              Input:
              <input
                type="text"
                name="input"
                value={testCase.input}
                onChange={(e) => handleChange(e, index)}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-2">
              Output:
              <input
                type="text"
                name="output"
                value={testCase.output}
                onChange={(e) => handleChange(e, index)}
                className="grow"
              />
            </label>
            {formData.test.length > 1 && (
              <button
                onClick={() => removeTestCase(index)}
                className="btn btn-error btn-sm mt-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addTestCase}
          className="btn btn-secondary btn-sm mt-3"
        >
          Add Test Case
        </button>
        <p className="text-error">{formError}</p>
        <button onClick={handleSubmit} className="btn w-full mt-3 btn-info">
          Create Test
        </button>
      </div>
    </div>
  );
}

export default CreateTest;