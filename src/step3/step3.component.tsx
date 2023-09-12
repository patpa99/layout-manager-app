import {useEffect, useState} from 'react';

import {RotatingLines} from 'react-loader-spinner';

// Import for style
import './style/step3.style.css';

// Import from .json file for backend endpoints
import configEndpoints from '../assets/configurationEndpoints/configuration.json';

export default function Step3(props) {
  const [loading, setLoading] = useState(false);

  let currLayout = null; // for the current layout
  let numInserts = 0; // to count the number of inserts to update the layout of a page

  useEffect(() => {
    /* Initialize the current layout variable and the whole page by
    reading data from the database */
    fetch(configEndpoints.getLayoutImgList)
      .then(response => response.json())
      .then(layoutImgData => {
        fetch(configEndpoints.getPageLayout + '?pageId=' + props.currPage)
          .then(response => response.json())
          .then(pageLayoutData => {
            currLayout = pageLayoutData.layoutId;
            getDynamicLayouts(layoutImgData);
            createAppsSelectorBasedOnLayout();
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }, []);

  // To load layout images (saved in database in base64)
  const getDynamicLayouts = layoutImgData => {
    const layoutImageDiv = document.getElementById('layoutImageDiv');
    for (let i = 0; i < layoutImgData.length; i++) {
      const div = document.createElement('div');
      div.id = 'layout' + layoutImgData[i].id + 'Div';
      div.onclick = () => handleClickLayout(layoutImgData[i].id);
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + layoutImgData[i].image;
      img.alt = 'layout' + layoutImgData[i].id;
      div.appendChild(img);
      const input = document.createElement('input');
      input.type = 'hidden';
      input.id = 'layout' + layoutImgData[i].id;
      input.value = layoutImgData[i].id;
      div.appendChild(input);
      div.style.border = '2px solid #333333';
      layoutImageDiv.appendChild(div);
    }
    if (currLayout !== null)
      document.getElementById('layout' + currLayout + 'Div').style.border =
        '2px solid #80ccff';
  };

  // To manage click on a layout image to select a layout
  const handleClickLayout = layoutId => {
    const innerDiv = document
      .getElementById('layoutImageDiv')
      .getElementsByTagName('div');
    for (let i = 0; i < innerDiv.length; i++)
      innerDiv[i].style.border = '2px solid #333333';
    document.getElementById('layout' + layoutId + 'Div').style.border =
      '2px solid #80ccff';
    currLayout = layoutId;
    createAppsSelectorBasedOnLayout();
  };

  // To create drop-down menus for app selection based on page layouts
  const createAppsSelectorBasedOnLayout = () => {
    if (currLayout !== null) {
      fetch(configEndpoints.getLayoutJson + '?layoutId=' + currLayout)
        .then(response => response.json())
        .then(layoutJsonData => {
          fetch(configEndpoints.getAppsList)
            .then(response => response.json())
            .then(appsListData => {
              // To count the number of apps that must be in a layout
              const numApps = JSON.stringify(layoutJsonData).match(
                /\$\$\$ APP \d+ \$\$\$/g
              );
              createDynamicAppsSelector(numApps, appsListData);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
  };

  // To create drop-down menus for app selection based on page layouts
  const createDynamicAppsSelector = (numApps, appsList) => {
    const layoutAppsDiv = document.getElementById('layoutAppsDiv');
    layoutAppsDiv.innerHTML = '';
    const p1 = document.createElement('p');
    p1.innerHTML = 'Select apps:';
    layoutAppsDiv.appendChild(p1);
    for (let i = 0; i < numApps.length; i++) {
      numApps[i] = numApps[i].replace('$$$ ', '').replace(' $$$', '');
      const p2 = document.createElement('p');
      const label = document.createElement('label');
      label.innerHTML = numApps[i] + ': ';
      p2.appendChild(label);
      const select = document.createElement('select');
      select.id = 'selectApp' + i;
      select.style.cursor = 'pointer';
      for (let j = 0; j < appsList.length; j++) {
        const option = document.createElement('option');
        option.id = 'appId' + appsList[j].id + '_' + i;
        option.value = appsList[j].id;
        option.innerHTML = appsList[j].name;
        select.appendChild(option);
      }
      p2.appendChild(select);
      layoutAppsDiv.appendChild(p2);
    }
    // To load the apps that are currently part of the page into the drop-down menus
    fetch(configEndpoints.getAppsInAPage + '?pageId=' + props.currPage)
      .then(response => response.json())
      .then(appsInAPageData => {
        const layoutAppsDiv = document.getElementById('layoutAppsDiv');
        for (
          let i = 0;
          i <
          Math.min(appsInAPageData.length, layoutAppsDiv.children.length - 1);
          i++
        ) {
          const option = document.getElementById(
            'appId' + appsInAPageData[i].appId + '_' + i
          ) as HTMLOptionElement;
          option.defaultSelected = true;
        }
      })
      .catch(error => console.error(error));
  };

  /* Clicking the 'Apply Changes' button will change the layout in the database (if necessary),
  delete the relationship between the apps and the page whose layout you want to change from
  the database and insert the relationships between the new chosen apps in the database
  (which must be in the correct position) and the current page.
  If everything goes well, the message "Success" will be displayed, otherwise "Error".
  In any case, after a few seconds the page will be refreshed */
  const applyChanges = () => {
    setLoading(true);
    const loadingDiv = document.getElementById('loadingDiv');
    fetch(configEndpoints.deleteAppsInAPage + '?pageId=' + props.currPage)
      .then(response => response.text())
      .then(delAppsInAPageData => {
        if (delAppsInAPageData === 'Success') {
          fetch(
            configEndpoints.updatePageLayout +
              '?pageId=' +
              props.currPage +
              '&newLayoutId=' +
              currLayout
          )
            .then(response => response.text())
            .then(updatePageLayoutData => {
              if (updatePageLayoutData === 'Success') {
                const layoutAppsDiv = document.getElementById('layoutAppsDiv');
                for (let i = 0; i < layoutAppsDiv.children.length - 1; i++) {
                  const label = layoutAppsDiv.children[i + 1]
                    .children[0] as HTMLLabelElement;
                  const select = layoutAppsDiv.children[i + 1]
                    .children[1] as HTMLSelectElement;
                  const appOrder = label.innerHTML
                    .replace('APP ', '')
                    .replace(': ', '');
                  const appId = select.value;
                  fetch(
                    configEndpoints.insertAppsInAPage +
                      '?newPageId=' +
                      props.currPage +
                      '&newAppId=' +
                      appId +
                      '&newAppOrder=' +
                      appOrder
                  )
                    .then(response => response.text())
                    .then(insAppsInAPageData => {
                      if (insAppsInAPageData === 'Success') {
                        numInserts++;
                        if (numInserts === layoutAppsDiv.children.length - 1) {
                          numInserts = 0;
                          setLoading(false);
                          loadingDiv.innerHTML = 'Success';
                          loadingDiv.style.color = '#00e600';
                          setTimeout(() => {
                            window.location.reload();
                          }, 3000);
                        }
                      } else {
                        numInserts = 0;
                        setLoading(false);
                        loadingDiv.innerHTML = 'Error';
                        loadingDiv.style.color = 'red';
                        setTimeout(() => {
                          window.location.reload();
                        }, 3000);
                      }
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
                }
              } else {
                setLoading(false);
                loadingDiv.innerHTML = 'Error';
                loadingDiv.style.color = 'red';
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }
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
          loadingDiv.innerHTML = 'Error';
          loadingDiv.style.color = 'red';
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
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
  };

  return (
    <>
      <p id="changeLayoutPageP" data-testid="changeLayoutPageP">
        Change the page layout
      </p>
      <div id="layoutDiv">
        <div id="layoutImageDiv" data-testid="layoutImageDiv">
          <p> Select a layout: </p>
        </div>
        <div id="layoutAppsDiv" data-testid="layoutAppsDiv"></div>
      </div>
      <button
        id="applyChangesLayoutButton"
        data-testid="applyChangesLayoutButton"
        onClick={applyChanges}
      >
        Apply Changes
      </button>
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
