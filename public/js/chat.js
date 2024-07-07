import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';


// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        // e.preventDefault();

        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray || [];

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            }); // server nhận
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
//END CLIENT_SEND_MESSAGE


//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {

    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".inner-list-typing");
    const div = document.createElement("div");

    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId = data.userID) {
        div.classList.add("inner-outgoing");
    }
    else {
        div.classList.add("inner-ingoing");
        htmlFullName = ` <div class="inner-name">${data.fullName}</div> `
    }

    if (data.content) {
        htmlContent = `
            <div class="inner-content">${data.content}</div>        
        `;
    }

    if (data.images) {
        htmlImages += `<div class="innger-images">`;

        for(const image of data.images)
        {
            htmlImages += `<img src="${image}">`;
        }
        htmlImages += `</div>`;


    }

    div.classList.add("inner-incoming"); 
    div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight; // scroll đến vị trí cuối cùng
})
// END SERVER_RETURN_MESSAGE

// Scroll chat 
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//END Scroll chat 


// Show Tooltip emoji
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle('shown');
    })
}
// End Show Tooltip emoji

// emoji-picker
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();
        inputChat.value = inputChat.value + icon;
        showTyping();
    });

    inputChat.addEventListener("keyup", () => {
        showTyping();
    })
}
// End emoji-picker

// Typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}
// End Typing

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
        const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

        if (!existBoxTyping) {
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);
            boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

            elementListTyping.appendChild(boxTyping);
        }
    } else {
        const existBoxRemove = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
        if (existBoxRemove) {
            elementListTyping.removeChild(existBoxRemove);
        }
    }
})
// End SERVER_RETURN_TYPING

// FileUploadWithPreview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
});
// END FileUploadWithPreview

