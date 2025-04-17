import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config/constant";

function UpdateTest() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    question: "",
    test: [{ input: "", output: "" }],
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchTest() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/show-test/${id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          const { _id, __v, ...filteredData } = response.data;
          setFormData(filteredData);
        }
      } catch (err) {
        setFormError("Failed to load test data.");
        console.error("Error fetching test:", err);
      }
    }
    fetchTest();
  }, [id]);

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
      const response = await axios.put(
        `${BACKEND_URL}/update-test/${id}`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccessMessage("Updated successfully");
      } else {
        setFormError("Test not updated.");
      }
    } catch (err) {
      setFormError("Something went wrong.");
      console.error("Error updating test:", err);
    }
  };

  return (
    <div className="h-full bg-gray-950 overflow-y-auto p-4 flex flex-col items-start pb-[100px] sm:pb-[0px]">
      <div className="w-full sm:w-2/3 bg-base-300 p-3 sm:p-7 rounded-2xl border-2 border-sky-500 s-form text-center">
        <h1 className="text-4xl">Update Test</h1>
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
          Update Test
        </button>
      </div>
    </div>
  );
}

export default UpdateTest;