
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import axios from "axios";

const CertificateCard = ({ data, type, onDownload }) => {
  const getTitle = () => {
    switch (type) {
      case "program":
        return "Certificate of Course Completion";
      case "participation":
        return "Certificate of Participation";
      case "internship":
        return "Internship Certificate";
      default:
        return "Certificate";
    }
  };

  return (
    <div className="w-full bg-black text-center pb-0 border border-[#09B6FF]">
      <div className="relative w-full aspect-[1/1.414] bg-[#f7f7f7] border-2 text-center border-[#1c3faa] p-6">
        <div className="absolute inset-0 m-3 border border-[#2962ff]" />

        <div className="flex flex-col items-center justify-between">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border border-[#2962ff] h-[fit-content]" />
            <h4 className="text-xl font-bold text-[#1c3faa] mb-2">
              {data.companyName}
            </h4>
            <h3 className="text-2xl font-bold">{getTitle()}</h3>
            <p className="text-gray-600 italic">This is to certify that</p>
            <p className="text-xl mt-2 font-bold text-auto break-all whitespace-normal w-full">
              {data.recipientName.toUpperCase()} {/* Uppercase name */}
            </p>

            {type === "program" && (
              <>
                <p className="text-gray-700">
                  has successfully completed the program in
                </p>
                <p className="text-lg font-bold text-[#1c3faa]">
                  {data.courseName} {/* Dynamic course name */}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {data.startDate} to {data.endDate}
                </p>
              </>
            )}

            {type === "participation" && (
              <>
                <p className="text-gray-700">
                  has actively participated in the event
                </p>
                <p className="text-lg font-bold text-[#1c3faa]">
                  {data.courseName}Bootcamp {/* Dynamic course name */}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {data.startDate} to {data.endDate}
                </p>
              </>
            )}

            {type === "internship" && (
              <>
                <p className="text-gray-700">
                  has successfully completed internship as
                </p>
                <p className="text-lg font-bold text-[#1c3faa]">
                  {data.courseName} Intern{/* Dynamic course name */}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {data.startDate} to {data.endDate}
                </p>
              </>
            )}
          </div>

          <div className="w-full text-center">
            <p className="text-sm text-gray-600 mb-8">{data.credentials}</p>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Issued Date: {data.endDate}</span>
              <span>ID: {data.certificateId}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm">{data.programDirector}</p>
              <div className="w-32 mx-auto border-t border-gray-400" />
              <p className="text-xs text-gray-600">Program Director</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="px-6 mt-5 py-2 bg-[#1c3faa] text-white rounded hover:bg-[#2962ff] transition-colors cursor-pointer duration-200"
        onClick={onDownload}
      >
        Download Certificate
      </button>
    </div>
  );
};

function Awards() {
  const { user } = useSelector((state) => state.user || {});
  const id = user?._id || "null";
  const [certificates, setCertificates] = useState({
    pCertificates: [],
    iCertificates: [],
    cCertificates: [],
  });

  const programCertificateData = {
    companyName: "Java Home Cloud",
    name: "Certified Python Developer",
    recipientName: "Nandharapu Prasanth Kumar",
    description:
      "Awarded for successfully completing the comprehensive Python Full Stack Development Program with excellence.",
    startDate: "01-Jan-2023",
    endDate: "30-Jun-2023",
    courseName: "Python Full Stack Web Development",
    certificateId: "JHC-2023-PY-001",
    programDirector: "N.Prasanth Kumar",
    credentials:
      "This e-certificate validates the successful completion of the program, including practical projects and assessments.",
  };

  const participationCertificateData = {
    companyName: "Java Home Cloud",
    recipientName: "John Doe",
    eventName: "Python Full Stack Development Bootcamp",
    startDate: "01-Jan-2023",
    endDate: "05-Jan-2023",
    certificateId: "JHC-2023-BT-001",
    programDirector: "N.Prasanth Kumar",
    credentials:
      "This e-certificate is awarded for active participation in the event.",
  };

  const internshipCertificateData = {
    companyName: "Java Home Cloud",
    recipientName: "John Doe",
    position: "Full Stack Developer Intern",
    startDate: "01-Jan-2023",
    endDate: "30-Jun-2023",
    certificateId: "JHC-2023-IN-001",
    programDirector: "N.Prasanth Kumar",
    credentials:
      "This e-certificate is awarded for successfully completing the internship program.",
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/show-user/${id}`);
        setCertificates(response.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    if (id !== "null") {
      fetchCertificates();
    }
  }, [id]);

  const generateCertificate = (certificate, type) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFillColor(247, 247, 247);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setDrawColor(28, 63, 170);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setDrawColor(41, 98, 255);
    doc.setLineWidth(0.5);
    doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

    doc.setDrawColor(28, 63, 170);
    doc.setLineWidth(1);
    doc.line(10, 20, 30, 20);
    doc.line(20, 10, 20, 30);
    doc.line(pageWidth - 30, 20, pageWidth - 10, 20);
    doc.line(pageWidth - 20, 10, pageWidth - 20, 30);
    doc.line(10, pageHeight - 20, 30, pageHeight - 20);
    doc.line(20, pageHeight - 30, 20, pageHeight - 10);
    doc.line(pageWidth - 30, pageHeight - 20, pageWidth - 10, pageHeight - 20);
    doc.line(pageWidth - 20, pageHeight - 30, pageWidth - 20, pageHeight - 10);

    doc.setDrawColor(41, 98, 255);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth / 2 - 15, 30, 30, 30);

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(28, 63, 170);
    doc.text(certificate.companyName.toUpperCase(), pageWidth / 2, 80, { align: "center" });

    doc.setFontSize(32);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    let title = "";
    switch (type) {
      case "program":
        title = "Certificate of Excellence";
        break;
      case "participation":
        title = "Certificate of Participation";
        break;
      case "internship":
        title = "Internship Certificate";
        break;
      default:
        title = "Certificate";
    }
    doc.text(title, pageWidth / 2, 100, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", pageWidth / 2, 120, { align: "center" });

    doc.setFontSize(28);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(certificate.recipientName.toUpperCase(), pageWidth / 2, 135, { align: "center" }); // Uppercase name

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    if (type === "program") {
      doc.text("has successfully completed the program in", pageWidth / 2, 150, { align: "center" });
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(28, 63, 170);
      doc.text(certificate.courseName.toUpperCase(), pageWidth / 2, 165, { align: "center" }); // Dynamic course name
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`Duration: ${certificate.startDate} to ${certificate.endDate}`, pageWidth / 2, 180, { align: "center" });
    } else if (type === "participation") {
      doc.text("has actively participated in the event", pageWidth / 2, 150, { align: "center" });
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(28, 63, 170);
      doc.text(`${(certificate.courseName.toUpperCase())} BOOTCAMP`, pageWidth / 2, 165, { align: "center" }); // Dynamic course name
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`Duration: ${certificate.startDate} to ${certificate.endDate}`, pageWidth / 2, 180, { align: "center" });
    } else if (type === "internship") {
      doc.text("has successfully completed internship as", pageWidth / 2, 150, { align: "center" });
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(28, 63, 170);
      doc.text(`${(certificate.courseName.toUpperCase())} INTERN`, pageWidth / 2, 165, { align: "center" }); // Dynamic course name
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`Duration: ${certificate.startDate} to ${certificate.endDate}`, pageWidth / 2, 180, { align: "center" });
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(certificate.credentials, pageWidth / 2, 195, { align: "center", maxWidth: 150 });

    doc.setFontSize(12);
    doc.text(`Issued Date: ${certificate.endDate}`, 40, pageHeight - 40);
    doc.text(`Certificate ID: ${certificate.certificateId}`, pageWidth - 40, pageHeight - 40, { align: "right" });

    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, pageHeight - 50, pageWidth / 2 + 40, pageHeight - 50);

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("Program Director", pageWidth / 2, pageHeight - 45, { align: "center" });

    doc.setFontSize(11);
    doc.text(certificate.programDirector, pageWidth / 2, pageHeight - 55, { align: "center" });

    doc.save(`${certificate.recipientName}_${type}_Certificate.pdf`);
  };

  const renderCertificates = () => {
    if (
      certificates.pCertificates.length === 0 &&
      certificates.iCertificates.length === 0 &&
      certificates.cCertificates.length === 0
    ) {
      return (
        <>
          <CertificateCard
            data={programCertificateData}
            type="program"
            onDownload={() =>
              generateCertificate(programCertificateData, "program")
            }
          />
          <CertificateCard
            data={participationCertificateData}
            type="participation"
            onDownload={() =>
              generateCertificate(participationCertificateData, "participation")
            }
          />
          <CertificateCard
            data={internshipCertificateData}
            type="internship"
            onDownload={() =>
              generateCertificate(internshipCertificateData, "internship")
            }
          />
        </>
      );
    } else {
      return (
        <>
          {certificates.pCertificates.map((cert, index) => (
            <CertificateCard
              key={index}
              data={{
                companyName: "Java Home Cloud",
                recipientName: cert.name,
                courseName: cert.courseName || cert.programName, // Use API field
                startDate: cert.startDate,
                endDate: cert.endDate,
                certificateId: `JHC-2023-PY-00${index + 1}`,
                programDirector: "N.Prasanth Kumar",
                credentials:
                  "This e-certificate validates the successful completion of the program, including practical projects and assessments.",
              }}
              type="program"
              onDownload={() =>
                generateCertificate(
                  {
                    companyName: "Java Home Cloud",
                    recipientName: cert.name,
                    courseName: cert.courseName || cert.programName, // Use API field
                    startDate: cert.startDate,
                    endDate: cert.endDate,
                    certificateId: `JHC-2023-PY-00${index + 1}`,
                    programDirector: "N.Prasanth Kumar",
                    credentials:
                      "This e-certificate validates the successful completion of the program, including practical projects and assessments.",
                  },
                  "program"
                )
              }
            />
          ))}
          {certificates.iCertificates.map((cert, index) => (
            <CertificateCard
              key={index}
              data={{
                companyName: "Java Home Cloud",
                recipientName: cert.name,
                courseName: cert.courseName || cert.programName, // Use API field
                startDate: cert.startDate,
                endDate: cert.endDate,
                certificateId: `JHC-2023-IN-00${index + 1}`,
                programDirector: "N.Prasanth Kumar",
                credentials:
                  "This e-certificate is awarded for successfully completing the internship program.",
              }}
              type="internship"
              onDownload={() =>
                generateCertificate(
                  {
                    companyName: "Java Home Cloud",
                    recipientName: cert.name,
                    courseName: cert.courseName || cert.programName, // Use API field
                    startDate: cert.startDate,
                    endDate: cert.endDate,
                    certificateId: `JHC-2023-IN-00${index + 1}`,
                    programDirector: "N.Prasanth Kumar",
                    credentials:
                      "This e-certificate is awarded for successfully completing the internship program.",
                  },
                  "internship"
                )
              }
            />
          ))}
          {certificates.cCertificates.map((cert, index) => (
            <CertificateCard
              key={index}
              data={{
                companyName: "Java Home Cloud",
                recipientName: cert.name,
                courseName: cert.courseName || cert.eventName, // Use API field
                startDate: cert.startDate,
                endDate: cert.endDate,
                certificateId: `JHC-2023-BT-00${index + 1}`,
                programDirector: "N.Prasanth Kumar",
                credentials:
                  "This e-certificate is awarded for active participation in the event.",
              }}
              type="participation"
              onDownload={() =>
                generateCertificate(
                  {
                    companyName: "Java Home Cloud",
                    recipientName: cert.name,
                    courseName: cert.courseName || cert.eventName, // Use API field
                    startDate: cert.startDate,
                    endDate: cert.endDate,
                    certificateId: `JHC-2023-BT-00${index + 1}`,
                    programDirector: "N.Prasanth Kumar",
                    credentials:
                      "This e-certificate is awarded for active participation in the event.",
                  },
                  "participation"
                )
              }
            />
          ))}
        </>
      );
    }
  };

  return (
    <div className="p-2 h-full overflow-y-scroll">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Your Certificates
      </h2>
      <div className="grid h-full md:grid-cols-3 gap-2">{renderCertificates()}</div>
    </div>
  );
}

export default Awards;