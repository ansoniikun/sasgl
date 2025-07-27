import { useState } from "react";
import EventDetailsForm from "./EventDetailsForm";
import PackageForm from "./PackageForm";
import ConfirmationPage from "./ConfirmationPage";

const HostEventForm = () => {
  const [step, setStep] = useState("event"); // event → packages → confirm
  const [eventData, setEventData] = useState(null);
  const [packageCount, setPackageCount] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [packages, setPackages] = useState([]);

  const handleEventSubmit = (data, numPackages) => {
    setEventData(data);
    setPackageCount(numPackages);
    setStep("packages");
  };

  const handlePackageSubmit = (pkg) => {
    setPackages((prev) => [...prev, pkg]);

    if (currentPackageIndex + 1 < packageCount) {
      setCurrentPackageIndex(currentPackageIndex + 1);
    } else {
      setStep("confirmation");
    }
  };

  return (
    <div className="">
      {step === "event" && <EventDetailsForm onSubmit={handleEventSubmit} />}
      {step === "packages" && (
        <PackageForm
          packageIndex={currentPackageIndex}
          onSubmit={handlePackageSubmit}
        />
      )}
      {step === "confirmation" && (
        <ConfirmationPage eventData={eventData} packages={packages} />
      )}
    </div>
  );
};

export default HostEventForm;
