import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { BACKEND_URL } from '../../../config/constant';


const App = () => {
  const [code, setCode] = useState("# Write your Python code here");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodide, setPyodide] = useState(null);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  useEffect(() => {
    const initializePyodide = async () => {
      try {
        setOutput("Initializing Python interpreter...");
        if (typeof window.loadPyodide !== "function") {
          throw new Error("Pyodide script not loaded properly");
        }

        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
        });
        await pyodideInstance.loadPackage(["numpy", "pandas"]);

        setPyodide(pyodideInstance);
        setPyodideReady(true);
        setOutput("Here is your output...");
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        setOutput("Failed to load Python interpreter: " + error.message);
        setPyodideReady(false);
      }
    };

    if (!window.loadPyodide) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      script.async = true;
      script.onload = () => initializePyodide();
      script.onerror = () => {
        setOutput(
          "Failed to load Pyodide script. Check your internet connection."
        );
        setPyodideReady(false);
      };
      document.body.appendChild(script);
    } else {
      initializePyodide();
    }

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/all-tests`, {
        withCredentials: true,
      });
      const data = response.data;
      const formattedQuestions = data.map((item, index) => ({
        id: item._id || index + 1,
        question: `${index + 1}. ${item.question}`,
        testCases: item.test.map((testCase) => ({
          input: testCase.input,
          output: testCase.output,
        })),
      }));
      setQuestions(formattedQuestions);
      if (formattedQuestions.length > 0) {
        setSelectedQuestion(formattedQuestions[0]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
      setSelectedQuestion(null);
    }
  };

  const convertReactStyleToHTML = (htmlCode) => {
    return htmlCode.replace(/style={{([^}]+)}}/g, (match, styleContent) => {
      const styles = styleContent
        .replace(/["']/g, "")
        .replace(/,\s*/g, ";")
        .replace(/([a-zA-Z]+)\s*:/g, "$1:")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();
      return `style="${styles}"`;
    });
  };

  const executeCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      switch (language) {
        case "javascript":
          const originalConsoleLog = console.log;
          const originalConsoleError = console.error;
          let consoleOutput = "";

          // Override console methods
          console.log = (...args) => {
            const formattedArgs = args.map((arg) => {
              if (typeof arg === "object" && arg !== null) {
                return JSON.stringify(arg, null, 2);
              }
              return String(arg);
            });
            consoleOutput += formattedArgs.join(" ") + "\n";
          };
          console.error = (...args) => {
            consoleOutput += "Error: " + args.join(" ") + "\n";
          };

          try {
            // Execute code in an async context
            const asyncCode = `
              return new Promise((resolve) => {
                const log = console.log;
                const error = console.error;
                ${code}
                // Resolve after a short delay to ensure all async operations complete
                setTimeout(resolve, 1000);
              });
            `;
            const executionFunction = new Function(asyncCode);
            const resultPromise = executionFunction();

            // Wait for the promise to resolve
            await resultPromise;

            // Restore console methods
            console.log = originalConsoleLog;
            console.error = originalConsoleError;

            // Set final output
            setOutput(
              consoleOutput || "Code executed successfully (no console output)"
            );
          } catch (error) {
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            setOutput(consoleOutput || `Error: ${error.message}`);
          }
          break;

        case "html":
          const convertedCode = convertReactStyleToHTML(code);
          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body>
                ${convertedCode}
              </body>
            </html>
          `;
          setOutput(htmlContent);
          break;

        case "css":
          const cssPreview = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <style>${code}</style>
              </head>
              <body>
                <div class="preview-content">
                  <h1>Sample Heading</h1>
                  <p>This is a sample paragraph to preview your CSS.</p>
                  <button>Sample Button</button>
                </div>
              </body>
            </html>
          `;
          setOutput(cssPreview);
          break;

        case "python":
          if (!pyodideReady || !pyodide) {
            setOutput(
              "Python interpreter is not ready yet. Please wait or check your connection."
            );
          } else {
            try {
              pyodide.runPython(`
                import sys
                import io
                sys.stdout = io.StringIO()
              `);

              if (selectedQuestion?.testCases?.length > 0) {
                const inputs = selectedQuestion.testCases[0].input.split(",");
                let inputIndex = 0;
                pyodide.globals.set("input", () => {
                  return inputIndex < inputs.length ? inputs[inputIndex++] : "";
                });
              }

              await pyodide.runPythonAsync(code);
              const stdout = pyodide.runPython("sys.stdout.getvalue()");
              setOutput(stdout || "Code executed successfully (no output)");
            } catch (error) {
              setOutput(`Python Error: ${error.message}`);
            }
          }
          break;

        case "java":
        case "cpp":
          let outputMessage = `Note: ${language} execution is not supported in this browser-based editor.\n`;
          outputMessage += `Your ${language} code:\n${code}\n\n`;
          if (selectedQuestion?.testCases?.length > 0) {
            const testResults = selectedQuestion.testCases
              .map(
                (testCase, index) =>
                  `Test Case ${index + 1}:\nInput: ${
                    testCase.input
                  }\nExpected Output: ${testCase.output}`
              )
              .join("\n\n");
            outputMessage += `Available Test Cases:\n${testResults}`;
          } else {
            outputMessage += "No test cases available for this question.";
          }
          setOutput(outputMessage);
          break;

        default:
          setOutput("Language not supported for execution");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-[40px] md:pb-0 mb-[50px] md:mb-0 text-white overflow-y-scroll">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">
          Code Editor {pyodideReady ? "" : "(Loading Python...)"}
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <button
            onClick={executeCode}
            disabled={loading || (language === "python" && !pyodideReady)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 disabled:bg-gray-400 transition-all"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      <div className="p-4 md:hidden">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          {showSidebar ? "Hide Questions" : "Show Questions"}
        </button>
      </div>

      <main className="p-4 flex flex-col md:flex-row gap-6 h-[calc(100vh-160px)]   overflow-y-auto pb-[150px] sm:pb-[2px]">
        <div
          className={`fixed md:static inset-y-0 left-0 w-64 bg-black rounded-lg overflow-y-auto p-4 transform transition-transform duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-10 shadow-2xl mt-16 md:mt-0`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              Coding Questions
            </h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="md:hidden text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div
                key={question.id}
                className={`p-4 mb-4 rounded-lg cursor-pointer transition-all hover:bg-gray-700 ${
                  selectedQuestion?.id === question.id
                    ? "bg-gray-700"
                    : "bg-gray-800"
                }`}
                onClick={() => setSelectedQuestion(question)}
              >
                <h3 className="font-semibold text-white">
                  {question.question}
                </h3>
                <div className="mt-2">
                  <h4 className="text-sm font-semibold text-white">
                    Test Cases:
                  </h4>
                  {question.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-400 mt-1 bg-gray-700 p-2 rounded"
                    >
                      <p>
                        <span className="font-semibold">Input:</span>{" "}
                        {testCase.input}
                      </p>
                      <p>
                        <span className="font-semibold">Output:</span>{" "}
                        {testCase.output}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No questions available.</p>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-[270px] sm:h-[400px]">
            <Editor
              height="100%"
              defaultLanguage={language}
              defaultValue={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 10 },
              }}
            />
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
            <div className="bg-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Output</h2>
              <button onClick={()=>{
                setOutput("")
              }} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors">
                Clear Console
              </button>
            </div>
            <div className="p-4 h-[250px] sm:h-[400px] overflow-y-auto border-[red]">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : language === "html" || language === "css" ? (
                <iframe
                  srcDoc={output}
                  title="output"
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white"
                />
              ) : (
                <pre className="whitespace-pre-wrap overflow-y-auto max-h-full">
                  {output}
                </pre>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
