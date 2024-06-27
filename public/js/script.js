


// Show Alert 
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    // console.log(showAlert);
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// END Show Alert 


//Button Go Back
const buttonsGoBack = document.querySelectorAll("[button-go-back]");
if(buttonsGoBack.length > 0){
    buttonsGoBack.forEach(button => {
        button.addEventListener("click", () => {
            history.back();
        })
    })
}
//End Button Go Back