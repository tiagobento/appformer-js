console.log("Content script being executed!!");
//hide current editor
document.querySelector('.js-code-editor').style.display='none';
// var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
// if (!location.ancestorOrigins.contains(extensionOrigin)) {
  var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resourcess in manifest.json
  iframe.src = chrome.runtime.getURL('frame.html');
 
  iframe.style.cssText = 'width:100%;height:100%;';

  var oldEditor = document.querySelector('.file');
  oldEditor.parentElement.insertBefore(iframe, oldEditor);

// }