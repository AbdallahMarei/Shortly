let shortForm = document.getElementById("shortener-form");
let urlInput = document.querySelector(".input-link");
let showError = document.querySelector(".show-url-error");
let showLinks = document.getElementById("show-links");
let showErrorMobile = document.querySelector(".show-url-error-mobile");
let checkEmailRegex= /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;

window.onload = ()=>{
    if(localStorage.getItem("short-links")){
        showShortLinks();
    };
};

shortForm.addEventListener("submit", function(e){
    e.preventDefault();
    if(!urlInput.value.match(checkEmailRegex)){
        urlEnteredIncorreclty("Please Enter a valid url");
        return
    } 
    urlShort(urlInput.value);  
});


const urlShort = async(url) => {
    const res = await fetch(`https://www.shareaholic.com/v2/share/shorten_link?apikey=8943b7fd64cd8b1770ff5affa9a9437b&url=${url}`);
    const result = await res.json();
    if(!localStorage.getItem("short-links")){
        let shortLinks = [];
        let newObjUrl = {
            link: urlInput.value,
            id: new Date(),
            shortLink: result.data
        };
        shortLinks.push(newObjUrl);
        localStorage.setItem("short-links",JSON.stringify(shortLinks));
    } else {
        let flag = false;
        let shortLinksLocal = JSON.parse(localStorage.getItem("short-links"));
        shortLinksLocal.forEach(link => {
            if(link.link == urlInput.value){
                flag = true;
            }
        })
        if(flag){
            urlEnteredIncorreclty("url already entered");
            return
        }
        let newObjUrl = {
            link: urlInput.value,
            id: new Date(),
            shortLink: result.data
        };
        shortLinksLocal.push(newObjUrl);
        localStorage.setItem("short-links",JSON.stringify(shortLinksLocal));
    }
    urlEnteredSuccessfully();
    showShortLinks();
}


function urlEnteredSuccessfully(){
    urlInput.style.borderColor = "green";
    showError.innerHTML = "Url shortened successfully";
    showError.style.color = "#2bd0d0";
    showErrorMobile.innerHTML = "Url shortened successfully";
    showErrorMobile.style.color = "#2bd0d0";
};


function urlEnteredIncorreclty (msg){
    showError.innerHTML = msg;
    showErrorMobile.innerHTML = msg;
    showErrorMobile.style.color = "red"
    showError.style.color = "red";
    urlInput.style.borderColor = "red";
    urlInput.value = "";
};


function showShortLinks(){
    let html = `<div>`;
    let shortLinksLocalStorage = JSON.parse(localStorage.getItem("short-links")).reverse();
    shortLinksLocalStorage.forEach(link => {
        html += `<div class="short-links-div">
        <span class="link">${link.link}</span>
        <hr />
        <div class="individualShortLink">
          <a href="${link.shortLink}" target="_blank">${link.shortLink}</a>
          <button class="copy-link">Copy</button>
        </div>
      </div>`
    });
    html+=`</div>`;
    showLinks.innerHTML = html;
};


showLinks.addEventListener("click", function(e){
    if(e.target.classList.contains("copy-link")){
        e.target.innerText = 'Copied';
        e.target.style.background = 'green';
        let copiedLink = e.target.parentElement.firstElementChild.href;
        navigator.clipboard.writeText(copiedLink);
        setTimeout(() => {
            e.target.innerText = "Copy";
            e.target.style.background = '#2bd0d0';
        }, 4000);
    };
});

