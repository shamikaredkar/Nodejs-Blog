document.addEventListener("DOMContentLoaded", function() {
    const allButtons = document.querySelectorAll('.searchbtn');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('#search-input');
    const searchClose = document.querySelector('#search-close');
    const headerLogo = document.querySelector('.header-logo');
    const headerButton = document.querySelector('.header-button');
    const headerNav = document.querySelector('.header-nav');

    console.log('allButtons:', allButtons);
    console.log('searchBar:', searchBar);
    console.log('searchInput:', searchInput);
    console.log('searchClose:', searchClose);
    console.log('headerLogo:', headerLogo);
    console.log('headerButton:', headerButton);
    console.log('headerNav:', headerNav);

    if (allButtons.length > 0 && searchBar && searchInput && searchClose && headerLogo && headerButton && headerNav) {
        for (let i = 0; i < allButtons.length; i++) {
            allButtons[i].addEventListener('click', function() {
                searchBar.style.visibility = 'visible';
                headerLogo.style.visibility = 'hidden';
                headerButton.style.visibility = 'hidden';
                headerNav.style.visibility = 'hidden';
                searchBar.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                searchInput.focus();
            });
        }

        searchClose.addEventListener('click', function() {
            searchBar.classList.remove('open');
            this.setAttribute('aria-expanded', 'false');
            // Use a timeout to delay setting visibility to hidden until the transition is complete
            setTimeout(() => {
                searchBar.style.visibility = 'hidden';
                headerLogo.style.visibility = 'visible';
                headerButton.style.visibility = 'visible';
                headerNav.style.visibility = 'visible';
            }, 300); // Match this duration with your CSS transition duration
        });
    } else {
        console.error("One or more elements were not found in the DOM.");
    }
});
function splitTextIntoSpans(target) {
    let elements = document.querySelectorAll(target)
    elements.forEach((element) => {
        element.classList.add('split-text')
        let text = element.innerText
        let splitText = text
            .split(" ")
            .map(function (word) {
                let char = word.split('').map(char => {
                    return `<span class="split-char">${char}</span>`
                }).join('')
                return `<div class="split-word">${char}&nbsp</div>`
            }).join('')

        element.innerHTML = splitText
    })
}

splitTextIntoSpans('.bubble-text')
