import {useEffect, useState} from 'react';
import Stepper from 'react-stepper-horizontal';

// Import for the 3 steps of the stepper
import Step1 from './step1/step1.component';
import Step2 from './step2/step2.component';
import Step3 from './step3/step3.component';

// Import for style
import './style/style.css';

export default function Root() {
  const [activeStep, setActiveStep] = useState(0); // for the current step
  const [currentPage, setCurrentPage] = useState(null); // for the current page

  // For step titles
  const steps = [
    {title: 'Add new pages or new apps'},
    {title: 'Select a page'},
    {title: 'Change the page layout'},
  ];

  useEffect(() => {
    // Listener to set the current page when a page has been selected in the second step
    const handleSelectedPage = (event: CustomEvent) => {
      setCurrentPage(event.detail.currentPage);
    };
    window.addEventListener('selectedAPage', handleSelectedPage);
  }, []);

  // To change the steps
  function getSectionComponent() {
    switch (activeStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 currPage={currentPage} />;
      case 2:
        return <Step3 currPage={currentPage} />;
      default:
        return null;
    }
  }

  return (
    <div id="layoutManagerDiv">
      <p id="layoutManagerTitle" data-testid="layoutManagerTitle">
        Layout Manager
      </p>
      <Stepper
        steps={steps}
        activeStep={activeStep}
        activeColor="#80ccff"
        defaultColor="#e6e6e6"
        completeColor="#80ccff"
        activeTitleColor="#ffffff"
        completeTitleColor="#e6e6e6"
        defaultTitleColor="#b3b3b3"
        circleFontColor="#000000"
        completeBarColor="#80ccff"
      />
      <div id="stepsDiv" data-testid="stepsDivLayoutManager">
        {getSectionComponent()}
        {activeStep !== 0 ? (
          <button id="prevButton" onClick={() => setActiveStep(activeStep - 1)}>
            Previous
          </button>
        ) : (
          <button id="prevButtonDisabled" disabled>
            Previous
          </button>
        )}
        {activeStep === 0 || (activeStep === 1 && currentPage !== null) ? (
          <button id="nextButton" onClick={() => setActiveStep(activeStep + 1)}>
            Next
          </button>
        ) : (
          <button id="nextButtonDisabled" disabled>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
