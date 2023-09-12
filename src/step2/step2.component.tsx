import {useEffect} from 'react';

// Import for image
import trashImg from '../assets/trash.png';

// Import for style
import './style/step2.style.css';

// Import from .json file for backend endpoints
import configEndpoints from '../assets/configurationEndpoints/configuration.json';

export default function Step2(props) {
  useEffect(() => {
    showAllPages();
  }, []);

  // To get the list of pages and display it
  const showAllPages = () => {
    fetch(configEndpoints.getPagesList)
      .then(response => response.json())
      .then(pagesListData => {
        // pagesListData is parsed json object received from url
        for (let i = 0; i < pagesListData.length; i++) {
          const div = document.createElement('div');
          div.id = 'singlePageDiv_' + pagesListData[i].id;
          const span = document.createElement('span');
          span.innerHTML =
            pagesListData[i].path === ''
              ? 'DEFAULT PAGE'
              : pagesListData[i].path;
          div.appendChild(span);
          const trash = document.createElement('img');
          trash.src = trashImg;
          trash.onclick = () => deletePage(pagesListData[i].id);
          div.appendChild(trash);
          div.style.border = '2px solid #333333';
          div.onclick = () => selectPage(pagesListData[i].id);
          document.getElementById('selectPageDiv').appendChild(div);
        }
        if (props.currPage !== null)
          document.getElementById(
            'singlePageDiv_' + props.currPage
          ).style.border = '2px solid #80ccff';
      })
      .catch(error => console.error(error));
  };

  // To delete a page
  const deletePage = pageId => {
    fetch(configEndpoints.deleteAPage + '?pageId=' + pageId)
      .then(response => response.text())
      .then(delAPageData => {
        // delAPageData is parsed json object received from url
        if (delAPageData === 'Success') window.location.reload();
      })
      .catch(error => console.error(error));
  };

  // To select a page
  const selectPage = pageId => {
    const innerDiv = document
      .getElementById('selectPageDiv')
      .getElementsByTagName('div');
    for (let i = 0; i < innerDiv.length; i++)
      innerDiv[i].style.border = '2px solid #333333';
    document.getElementById('singlePageDiv_' + pageId).style.border =
      '2px solid #80ccff';
    // Now the EventListener is called to tell the root component which page has been selected
    window.dispatchEvent(
      new CustomEvent('selectedAPage', {
        detail: {
          currentPage: pageId,
        },
      })
    );
  };

  return (
    <>
      <div id="selectPageExternalDiv" data-testid="selectPageExternalDiv">
        <p id="selectPageP" data-testid="selectPageP">
          Select a page
        </p>
        <div id="selectPageDiv" data-testid="selectPageDiv" />
      </div>
    </>
  );
}
