import {Trigger} from './constants';

const iframeId = "booknshelf-popup-frame";
const iframeConstStyle = "height: 500px; width: 500px; " +
                         "margin: 0px; padding: 0px; " +
                         "position: fixed; right: 5px; top: 5px; " +
                         "z-index: 2147483647; display: block !important;";

function isFrameAdded() {
  return document.getElementById(iframeId) != null;
}

function removeFrame() {
  let iframe = <HTMLIFrameElement> document.getElementById(iframeId);
  if (iframe != null) iframe.parentNode.removeChild(iframe);
}

function addFrame() {
  // Avoid recursive frame insertion
  let extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
  if (!location.origin.includes(extensionOrigin)) {
    let iframe = <HTMLIFrameElement> document.getElementById(iframeId);
    if (iframe != null) iframe.parentNode.removeChild(iframe);
    iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('frame.html');
    iframe.frameBorder="0";
    iframe.id=iframeId;
    iframe.style.cssText = iframeConstStyle;
    document.body.appendChild(iframe);
  }
}

chrome.runtime.onMessage.addListener( function(request, sender) {
  console.log("Contentscript received : '" + Trigger[request.trigger] + "'");
  switch(request.trigger) {
    case Trigger.click_outside: {
      removeFrame();
      break;
    }
    case Trigger.selection_menu : {
      console.log(request.selection)
      // Searching for book using selected text
      // Show select book screen
      // Book found, show list screen
      addFrame();
      break;
    }
    case Trigger.browser_action: {
      if(isFrameAdded())
        removeFrame();
      else
      // Searching for book
      // Book found, show list screen
      // Book not found, show error screen
      addFrame();
      break;
    }
    case Trigger.page_menu: {
      // Searching for book
      // Book found, show list screen
      // Book not found, show error screen
      addFrame();
      break;
    }
  }
});
