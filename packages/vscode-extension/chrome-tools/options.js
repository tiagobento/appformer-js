let page = document.getElementById('buttonDiv');
const kButtonColors = ['#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      console.log("click");
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (item==='#4688f1'){
            chrome.tabs.executeScript(
              tabs[0].id,
              {code: 'window.open("http://ederign.me","_blank");'});
            
          }
          else{
          chrome.tabs.executeScript(
              tabs[0].id,
              {code: 'document.body.style.backgroundColor = "' + item + '"; console.log("dorinha");'});
            }
        });
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);