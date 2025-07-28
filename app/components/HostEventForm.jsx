import { useState } from "react";
import EventDetailsForm from "./EventDetailsForm";
import PackageForm from "./PackageForm";
import ConfirmationPage from "./ConfirmationPage";

const HostEventForm = ({ setActiveTab }) => {
  const [step, setStep] = useState("event"); // event → packages → confirm
  const [eventData, setEventData] = useState(null);
  const [packageCount, setPackageCount] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [packages, setPackages] = useState([]);

  const handleEventSubmit = (data) => {
    const numPackages = parseInt(data.packages, 10); // Convert to number
    setEventData(data);
    setPackageCount(numPackages);
    setStep("packages");
  };

  const handlePackageSubmit = (pkg) => {
    setPackages((prev) => [...prev, pkg]);

    if (currentPackageIndex + 1 < packageCount) {
      setCurrentPackageIndex((prev) => prev + 1);
    } else {
      setStep("confirmation");
    }
  };

  return (
    <div>
      {step === "event" && <EventDetailsForm onSubmit={handleEventSubmit} />}
      {step === "packages" && (
        <PackageForm
          key={currentPackageIndex} // 🔑 Forces remount
          packageIndex={currentPackageIndex}
          onSubmit={handlePackageSubmit}
        />
      )}
      {step === "confirmation" && (
        <ConfirmationPage
          eventData={eventData}
          packages={packages}
          onFinalSubmit={() => {
            // example: navigate away or reset UI
            alert("Event successfully submitted!");
            setActiveTab("My Dashboard");
          }}
        />
      )}
    </div>
  );
};

export default HostEventForm;
