const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const baseURL = "https://inshare-application-2cjbykj4n-yashvardhansingh460-gmailcom.vercel.app";
// const baseURL = "http://localhost:3000"
// const baseURL = "https://innshare.herokuapp.com"
//    const baseURL ="https://inshare-application-r9uaxf4xd-yashvardhansingh460-gmailcom.vercel.app"
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; 
//100mb


browseBtn.addEventListener("click", () => {
    fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    //   console.log("dropped", e.dataTransfer.files[0].name);
    const files = e.dataTransfer.files;
    if (files.length != 0) {
        if (files[0].size < maxAllowedSize) {
            fileInput.files = files;
            uploadFile();
        } else {
            showToast("Max file size is 100MB");
        }
    } else if (files.length == 0) {
        showToast("You can't upload multiple files");
    }
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragged");

    // dropping file
});

dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragged");

    console.log("drag ended");
});

// file input change and uploader
fileInput.addEventListener("change", () => {
    if (fileInput.files[0].size > maxAllowedSize) {
        showToast("Max file size is 100MB");
        fileInput.value = ""; // reset the input
        return;
    }
    uploadFile();
});

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
    fileURL.select();
    // console.log("yoyo");
    document.execCommand("copy");
    showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => {
    fileURL.select();
});

const uploadFile = () => {
    console.log("file added uploading");

    const files = fileInput.files;
    const formData = new FormData();
    for (const f of files)
        formData.append("myfile", f);

    //show the uploader
    progressContainer.style.display = "block";

    // upload file
    const xhr = new XMLHttpRequest();

    // listen for upload progress
    xhr.upload.onprogress = function (event) {
        // find the percentage of uploaded
        let percent = Math.round((100 * event.loaded) / event.total);
        progressPercent.innerText = percent;
        const scaleX = `scaleX(${percent / 100})`;
        bgProgress.style.transform = scaleX;
        progressBar.style.transform = scaleX;
    };

    // handle error
    xhr.upload.onerror = function () {
        showToast(`Error in upload: ${xhr.status}.`);
        fileInput.value = ""; // reset the input
    };

    // listen for response which will give the link
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onFileUploadSuccess(xhr.responseText);
        }
    };

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const onFileUploadSuccess = (res) => {
    // console.log("hello_yoyo");
    fileInput.value = ""; // reset the input
    status.innerText = "Uploaded";

    // remove the disabled attribute from form btn & make text send
    emailForm[2].removeAttribute("disabled");
    emailForm[2].innerText = "Send";
    progressContainer.style.display = "none"; // hide the box

    const { file: url } = JSON.parse(res);
    console.log(url);
    sharingContainer.style.display = "block";
    fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
    // stop submission
    e.preventDefault(); 

    // disable the button
    emailForm[2].setAttribute("disabled", "true");
    emailForm[2].innerText = "Sending";

    const url = fileURL.value;

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };
    console.log(formData);
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                showToast("Email Sent");
                sharingContainer.style.display = "none"; 
                // hide the box
            }
        });
});

let toastTimer;
// the toast function
const showToast = (msg) => {
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
};


let themeToggler = document.querySelector('#theme-toggler');

themeToggler.onclick = () => {
    if (themeToggler.classList.contains('fa-moon')) {
        themeToggler.classList.remove('fa-moon');
        themeToggler.classList.add('fa-sun');
    }
    else {
        themeToggler.classList.remove('fa-sun');
        themeToggler.classList.add('fa-moon');

    }
    // themeToggler.classList.toggle('fa-moon');
    if (themeToggler.classList.contains('fa-moon')) {
        document.body.classList.add('active');
    } else {
        document.body.classList.remove('active');
    }
}




const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}
