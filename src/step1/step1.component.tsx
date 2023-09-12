import {useEffect, useState} from 'react';

import {RotatingLines} from 'react-loader-spinner';

// Import for image
import plusImg from '../assets/plus.png';

// Import for style
import './style/step1.style.css';

// Import from .json file for backend endpoints
import configEndpoints from '../assets/configurationEndpoints/configuration.json';

export default function Step1() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSidebarSectionsList();
  }, []);

  /* To get list of sidebar sections and create options in
  select field for sidebar section selection */
  const getSidebarSectionsList = () => {
    fetch(configEndpoints.getSidebarSectionsList)
      .then(response => response.json())
      .then(sidebarSectionsListData => {
        // sidebarSectionsListData is parsed json object received from url
        for (let i = 0; i < sidebarSectionsListData.length; i++) {
          const optionSidebarSec = document.createElement('option');
          optionSidebarSec.innerHTML = sidebarSectionsListData[i].name;
          optionSidebarSec.value = sidebarSectionsListData[i].id;
          document
            .getElementById('sidebarSecNewPage')
            .appendChild(optionSidebarSec);
        }
      })
      .catch(error => console.error(error));
  };

  // To create a new page
  const insertNewPage = () => {
    setLoading(true);
    const inputNewPage = document.getElementById(
      'inputNewPage'
    ) as HTMLInputElement;
    const loadingDiv = document.getElementById('loadingDiv');
    if (inputNewPage.value === null) {
      setLoading(false);
      loadingDiv.innerHTML = 'Error: The path to the new page is null';
      loadingDiv.style.color = 'red';
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      return;
    }
    const pagePath = inputNewPage.value.replace(/\s+/g, '-'); // to have no spaces
    const sidebarSection = document.getElementById(
      'sidebarSecNewPage'
    ) as HTMLSelectElement;
    const sidebar = document.getElementById(
      'sidebarNewPage'
    ) as HTMLSelectElement;
    if (
      sidebarSection.value !== null &&
      sidebar.value !== null &&
      pagePath.trim() !== '' &&
      sidebarSection.value.trim() !== '' &&
      sidebar.value.trim() !== ''
    ) {
      fetch(
        configEndpoints.insertNewPage +
          '?pagePath=' +
          pagePath +
          '&sidebarSection=' +
          sidebarSection.value +
          '&sidebar=' +
          sidebar.value
      )
        .then(response => response.text())
        .then(insAPageData => {
          // insAPageData is a text received from url
          setLoading(false);
          if (insAPageData === 'Success') {
            loadingDiv.innerHTML = 'Success';
            loadingDiv.style.color = '#00e600';
          } else {
            loadingDiv.innerHTML = 'Error';
            loadingDiv.style.color = 'red';
          }
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
          loadingDiv.innerHTML = 'Error';
          loadingDiv.style.color = 'red';
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    } else {
      setLoading(false);
      loadingDiv.innerHTML = 'Error: Some fields are null or empty';
      loadingDiv.style.color = 'red';
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  // To add a new app in the database
  const insertNewApp = () => {
    setLoading(true);
    const inputNewAppName = document.getElementById(
      'inputNewAppName'
    ) as HTMLInputElement;
    const inputNewAppPath = document.getElementById(
      'inputNewAppPath'
    ) as HTMLInputElement;
    const loadingDiv = document.getElementById('loadingDiv');
    if (
      inputNewAppName.value !== null &&
      inputNewAppPath.value !== null &&
      inputNewAppName.value.trim() !== '' &&
      inputNewAppPath.value.trim() !== ''
    ) {
      fetch(
        configEndpoints.insertNewApp +
          '?appName=' +
          inputNewAppName.value.trim() +
          '&appPath=' +
          inputNewAppPath.value.trim()
      )
        .then(response => response.text())
        .then(insAnAppData => {
          // insAnAppData is a text received from url
          setLoading(false);
          if (insAnAppData === 'Success') {
            loadingDiv.innerHTML = 'Success';
            loadingDiv.style.color = '#00e600';
          } else if (insAnAppData === 'Error1') {
            loadingDiv.innerHTML =
              'Error: Some fields for creating a new app are null or empty';
            loadingDiv.style.color = 'red';
          } else {
            loadingDiv.innerHTML = 'Error';
            loadingDiv.style.color = 'red';
          }
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
          loadingDiv.innerHTML = 'Error';
          loadingDiv.style.color = 'red';
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    } else {
      setLoading(false);
      loadingDiv.innerHTML =
        'Error: Some fields for creating a new app are null or empty';
      loadingDiv.style.color = 'red';
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <>
      <div id="addNewPagesDiv">
        <p id="addNewPagesP" data-testid="addNewPagesP">
          Add new pages
        </p>
        <input
          id="inputNewPage"
          type="text"
          placeholder="Insert the path to the new page"
          data-testid="inputNewPage"
        ></input>
        <select id="sidebarSecNewPage" data-testid="sidebarSecNewPage">
          <option value="0">No sidebar section</option>
        </select>
        <select id="sidebarNewPage" data-testid="sidebarNewPage">
          <option value="1">With Sidebar</option>
          <option value="0">Without Sidebar</option>
        </select>
        <img
          id="buttonNewPage"
          src={plusImg}
          alt="Add new page"
          onClick={insertNewPage}
          data-testid="buttonNewPage"
        ></img>
      </div>
      <div id="addNewAppsDiv">
        <p id="addNewAppsP" data-testid="addNewAppsP">
          Add new apps
        </p>
        <input
          id="inputNewAppName"
          type="text"
          placeholder="Insert the name of the new app"
          data-testid="inputNewAppName"
        ></input>
        <input
          id="inputNewAppPath"
          type="text"
          placeholder="Insert the path to the new app"
          data-testid="inputNewAppPath"
        ></input>
        <img
          id="buttonNewApp"
          src={plusImg}
          alt="Add new app"
          onClick={insertNewApp}
          data-testid="buttonNewApp"
        ></img>
      </div>
      <div id="loadingDiv" data-testid="loadingDiv">
        <RotatingLines
          strokeColor="#80ccff"
          strokeWidth="5"
          animationDuration="0.75"
          width="30px"
          visible={loading}
        />
      </div>
    </>
  );
}
