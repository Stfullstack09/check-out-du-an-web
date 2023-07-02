let HeaderWp = document.querySelector(".header-wrapper");

function handleScroll() {
    console.log("lot");
    if (window.scrollY <= 70) {
        HeaderWp.classList.remove("header__slide__down");
    } else if (window.scrollY >= 200) {
        HeaderWp.classList.add("header__slide__down");
    }
}

window.addEventListener("scroll", handleScroll);
