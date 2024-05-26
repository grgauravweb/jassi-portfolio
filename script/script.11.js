window.mobileCheck = function () {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; }(navigator.userAgent || navigator.vendor || window.opera));
  return check;
};

const loadImage = async (imageUrl) => new Promise((resolve, reject) => {
  try {
    // eslint-disable-next-line no-undef
    fabric.Image.fromURL(imageUrl, (img) => {
      resolve(img);
    }, { crossOrigin: 'anonymous' });
  } catch (ex) {
    reject(ex);
  }
});
// eslint-disable-next-line no-promise-executor-return
const loadWebFont = (config) => new Promise((resolve) => window.WebFont.load({
  ...config,
  active() {
    resolve();
  },
}));

let qrCodeImageBrochureCanvas;
async function generateQrCodeImageBrochure() {
  const shouldLoadImageBlocking = true;
  const width = 1080;
  const height = 1920;
  const main = '/templates/common/img/qr-code-template.png';
  const { companyName } = window.cardData;
  const { cardLink } = window.cardData;
  const { agencyLinkDomainName } = window.cardData;
  const agencySite = `${agencyLinkDomainName}`;

  await loadWebFont({
    google: {
      families: ['Lato:400,700,900'],
    },
  });

  // eslint-disable-next-line no-undef
  qrCodeImageBrochureCanvas = new fabric.StaticCanvas();
  qrCodeImageBrochureCanvas.setWidth(width);
  qrCodeImageBrochureCanvas.setHeight(height);

  // Loading main image
  if (shouldLoadImageBlocking) {
    const mainImage = await loadImage(main);
    qrCodeImageBrochureCanvas.add(mainImage);
  } else {
    loadImage(main).then((mainImage) => {
      qrCodeImageBrochureCanvas.add(mainImage);
    });
  }

  // Loading QR code
  const qrCode = window.cardData.qrCodeImageUrl;
  // QR code image variables
  const qrX = 330;
  const qrY = 750;
  if (shouldLoadImageBlocking) {
    const qrCodeImage = await loadImage(qrCode);
    qrCodeImage.scaleToWidth(420).set({
      left: qrX,
      top: qrY,
    });
    qrCodeImageBrochureCanvas.add(qrCodeImage);
  } else {
    loadImage(qrCode).then((qrCodeImage) => {
      qrCodeImage.set({
        left: qrX,
        top: qrY,
      });
      qrCodeImageBrochureCanvas.add(qrCodeImage);
    });
  }

  // Company name
  // eslint-disable-next-line no-undef
  let companyNameVal;
  try {
    companyNameVal = companyName.toUpperCase();
  } catch (ex) {
    companyNameVal = companyName;
  }
  const companyNameText = new fabric.Textbox(companyNameVal, {
    fontSize: 60,
    fontFamily: 'Lato',
    fontWeight: 700,
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    fill: '#000000',
    width: 900,
  });
  const companyTextY = 400;
  companyNameText.set('top', companyTextY);
  companyNameText.set('left', width / 2);

  qrCodeImageBrochureCanvas.add(companyNameText);

  // Card link
  // eslint-disable-next-line no-undef
  const cardLinkText = new fabric.Textbox(cardLink, {
    fontSize: 36,
    fontFamily: 'Lato',
    fontWeight: 500,
    textAlign: 'left',
    originX: 'left',
    originY: 'center',
    fill: '#ffffff',
    width: 800,
    splitByGrapheme: true,
    underline: true,
  });
  const cardLinkTextY = 1390;
  cardLinkText.set('top', cardLinkTextY);
  cardLinkText.set('left', 180);

  qrCodeImageBrochureCanvas.add(cardLinkText);

  // Footer text
  // eslint-disable-next-line no-undef
  const footerText = new fabric.Textbox(`Powered by: ${agencySite}`, {
    fontSize: 36,
    fontFamily: 'Lato',
    fontWeight: 500,
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    fill: '#2D9BEA',
    width: 800,
    splitByGrapheme: true,
  });
  const footerTextY = 1813;
  footerText.set('top', footerTextY);
  footerText.set('left', width / 2);

  qrCodeImageBrochureCanvas.add(footerText);
}

// set Country code
const input = document.querySelector('#whatsapp-input');
let iti;
if (input) {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  iti = window.intlTelInput(input, {
    initialCountry: 'auto',
    geoIpLookup: (success) => {
      fetch('https://ipinfo.io', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const countryCode = (data && data.country) ? data.country : '';
          success(countryCode);
        });
    },
  });
}

function openSnackbar(id) {
  const snackbar = document.getElementById(id);
  snackbar.classList.add('show');
  setTimeout(() => { snackbar.classList.remove('show'); }, 3000);
}

function handleWhatsappShare(element, cardLink, event) {
  element.href = `https://wa.me/${iti.getNumber()}?text=${cardLink}`;
}

const shareOnWhatsappButton = document.getElementById('share-on-whatsapp-button');
if (shareOnWhatsappButton) {
  shareOnWhatsappButton.addEventListener('click', function (event) {
    handleWhatsappShare(this, window.cardData.cardLink, event);
  });
}

// Get the modal
const imageModal = document.getElementById('imageModal');
const shareModal = document.getElementById('shareModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == imageModal || event.target == shareModal) {
    imageModal.style.display = 'none';
    shareModal.style.display = 'none';
  }
};

const modalImg = document.getElementById('img01');
const captionText = document.getElementById('caption');

function openImageModal(e) {
  imageModal.style.display = 'block';
  modalImg.src = e.src;
  captionText.innerHTML = e.alt;
}

// Get the <span> element that closes the modal
const imageModalClose = document.getElementById('imageModalClose');

// When the user clicks on <span> (x), close the modal
imageModalClose.onclick = function () {
  imageModal.style.display = 'none';
};

function openShareModal(e, title, cardLink) {
  if (navigator.share) {
    navigator.share({
      title,
      url: cardLink,
    }).then(() => {
      console.log('Thanks for sharing!');
    })
      .catch(console.error);
  } else {
    shareModal.style.display = 'flex';
  }
}

const shareButton = document.getElementById('share-button');
if (shareButton) {
  shareButton.addEventListener('click', function (event) {
    openShareModal(event, this.dataset.title, window.cardData.cardLink);
  });
}

// Get the <span> element that closes the modal
const shareModalClose = document.getElementById('shareModalClose');

// When the user clicks on <span> (x), close the modal
shareModalClose.onclick = function () {
  shareModal.style.display = 'none';
};

function handleDirectWhatsappShare(e, whatsappNumberWithCountryCode) {
  const { cardLink } = window.cardData;
  if (window.mobileCheck()) {
    e.href = `whatsapp:\/\/send?text=${cardLink}`;
  } else if (whatsappNumberWithCountryCode) {
    e.href = `https://wa.me/${whatsappNumberWithCountryCode}?text=${cardLink}`;
  } else {
    e.href = `whatsapp:\/\/send?text=${cardLink}`;
  }
}

function sendEnquiry(ele, mailTo) {
  ele.value = 'Sending...';
  ele.disabled = true;
  const name = document.getElementById('enquiryName');
  const phoneNumber = document.getElementById('phoneNumber');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const data = {};
  data.mailTo = mailTo;
  data.name = name.value;
  data.phoneNumber = phoneNumber.value;
  data.email = email.value;
  data.message = message.value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (this.status === 200) {
        alert('Success: Mail sent Successfuly');
        name.value = '';
        phoneNumber.value = '';
        email.value = '';
        message.value = '';
      } else {
        alert(`Error in send enquiry: ${response.data.message}`);
      }
      ele.value = 'Send';
      ele.disabled = false;
    }
  };
  xhr.open('POST', '/api/v1/sendEnquiry');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));
}

// Feedback code
const starRatingControl = new StarRating('.star-rating', {
  maxStars: 5,
});

function sendFeedback(ele, cardId) {
  ele.value = 'Sending...';
  ele.disabled = true;
  const feedbackList = document.getElementsByClassName('feedback-list')[0];
  const rating = document.getElementById('rating');
  const name = document.getElementById('feedbackName');
  const feedback = document.getElementById('feedback');
  const data = {};
  data.cardId = cardId;
  data.rating = rating.value;
  data.name = name.value;
  data.feedback = feedback.value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (this.status === 200) {
        openSnackbar('success-feedback-snackbar');
        rating.value = '';
        name.value = '';
        feedback.value = '';

        // Pushing new feedback in the list
        const feedbackResponse = response.data.feedback;
        const newFeedback = `<div class="feedback-wrapper">
                    <span class="feedback-name-wrapper"><span class="feedback-name">${feedbackResponse.name}</span> on ${feedbackResponse.date} </span>
                    <div><span class="gl-star-rating-stars s${feedbackResponse.rating}0"><span data-value="1" data-text="Terrible"></span><span data-value="2" data-text="Poor"></span><span data-value="3" data-text="Average"></span><span data-value="4" data-text="Very Good"></span><span data-value="5" data-text="Excellent"></span></span></div>
                    <div>${feedbackResponse.feedback}</div>
                    <hr />
                </div>`;
        feedbackList.insertAdjacentHTML('afterbegin', newFeedback);
      } else {
        alert(`Error in sending feedback: ${response.data.message}`);
      }
      ele.value = 'Give Feedback';
      ele.disabled = false;
    }
  };
  xhr.open('POST', '/api/v1/feedback');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(
    () => {
      console.log('Service Worker Registered');
    },
  );
}

let feedbacks = [];
let totalFeedbacks = 0;
let currentFeedbackPage = 0;
const feedbackLimit = 5;

const getFeedbacks = (cardId, page, limit) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (this.status === 200) {
        resolve(response.data);
      } else {
        reject(response.data.message);
      }
    }
  };
  xhr.open('GET', `/api/v1/feedback?cardId=${cardId}&limit=${limit}&page=${page}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send();
});
const renderFeedbacks = (feedbacksArr) => {
  const feedbackList = document.getElementById('feedback-list');
  feedbackList.innerHTML = '';
  const elements = feedbacksArr.map((feedback) => `<div class="feedback-wrapper">
            <span class="feedback-name-wrapper"><span class="feedback-name">${feedback.name}</span> on ${feedback.date} </span>
            <div><span class="gl-star-rating-stars s${feedback.rating}0"><span data-value="1" data-text="Terrible"></span><span data-value="2" data-text="Poor"></span><span data-value="3" data-text="Average"></span><span data-value="4" data-text="Very Good"></span><span data-value="5" data-text="Excellent"></span></span></div>
            <div>${feedback.feedback}</div>
            <hr />
        </div>`);
  for (let i = 0; i < elements.length; i += 1) {
    feedbackList.insertAdjacentHTML('beforeend', elements[i]);
  }
};

const getAndRenderFeedbacks = async (cardId, element) => {
  try {
    if (element) {
      element.value = 'Loading...';
      element.disabled = true;
    }
    currentFeedbackPage += 1;
    const response = await getFeedbacks(cardId, currentFeedbackPage, feedbackLimit);
    totalFeedbacks = response.total;
    feedbacks = feedbacks.concat(
      response.list,
    );
    renderFeedbacks(feedbacks);

    if (totalFeedbacks <= feedbacks.length) {
      const loadMoreBtn = document.getElementById('load-more-feedback-btn');
      loadMoreBtn.style.display = 'none';
    }
    if (element) {
      element.value = 'Load more feedbacks';
      element.disabled = false;
    }
  } catch (ex) {
    alert(`Error in getting feedbacks: ${ex}`);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  let deferredPrompt;
  const saveBtn = document.querySelector('.save-card-button');
  saveBtn.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    saveBtn.style.display = 'block';

    saveBtn.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      saveBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
    });
  });

  const feedbackList = document.getElementById('feedback-list');
  if (feedbackList) {
    getAndRenderFeedbacks(window.cardId);

    document.getElementById('load-more-feedback-btn')
      .addEventListener('click', (event) => {
        getAndRenderFeedbacks(window.cardId, event.target);
      });
  }

  const logoImage = document.getElementsByClassName('profile-pic-img')[0];
  logoImage.onload = function () {
    if (this.naturalHeight < 120) {
      this.style.maxWidth = 240;
      if (logoImage.classList.contains('template5')) {
        this.style.borderRadius = '12px';
      }
    }
  };
});

window.addEventListener('load', () => {
  generateQrCodeImageBrochure();
});

const downloadImage = (ele, cardId, productName, productUrl) => {
  const downloadingEle = document.getElementById('downloading');
  const downloadLabelEle = document.getElementById('download-label');
  downloadingEle.style.display = 'inline';
  downloadLabelEle.style.display = 'none';
  ele.disabled = true;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (this.status === 200) {
        const a = document.createElement('a'); // Create <a>
        a.href = response.data; // Image Base64 Goes here
        a.download = 'product_card.png'; // File name Here
        a.click(); // Downloaded file
      } else {
        alert('Error in downloading image');
      }
      downloadingEle.style.display = 'none';
      downloadLabelEle.style.display = 'inline';
      ele.disabled = false;
    }
  };
  xhr.open('GET', `/api/v1/download-product-image?cardId=${encodeURIComponent(cardId)}&productName=${encodeURIComponent(productName)}&productUrl=${encodeURIComponent(productUrl)}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send();
};

const productsImage = document.getElementsByClassName('product-image');
for (var i = 0; i < productsImage.length; i += 1) {
  (function () {
    productsImage[i].addEventListener('click', function () {
      openImageModal(this);
    });
  }());
}

const productDownloadButtons = document.getElementsByClassName('product-download-button');
for (var i = 0; i < productDownloadButtons.length; i += 1) {
  (function () {
    productDownloadButtons[i].addEventListener('click', function () {
      downloadImage(this, window.cardId, this.dataset.productname, this.dataset.productimage);
    });
  }());
}

const galleryImages = document.getElementsByClassName('gallery-image');
for (var i = 0; i < galleryImages.length; i += 1) {
  (function () {
    galleryImages[i].addEventListener('click', function () {
      openImageModal(this);
    });
  }());
}

const giveFeedbackButton = document.getElementById('give-feedback-button');
if (giveFeedbackButton) {
  giveFeedbackButton.addEventListener('click', function () {
    sendFeedback(this, window.cardId);
  });
}

const sendEnquiryButton = document.getElementById('send-enquiry-button');
if (sendEnquiryButton) {
  sendEnquiryButton.addEventListener('click', function () {
    sendEnquiry(this, this.dataset.mailtosend);
  });
}

const directWhatsappShareButton = document.getElementById('direct-whatsapp-share-button');
if (directWhatsappShareButton) {
  directWhatsappShareButton.addEventListener('click', function () {
    handleDirectWhatsappShare(this, this.dataset.whatsappnumber);
  });
}

function copyLink(textToCopy) {
  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  openSnackbar('copy-link-snackbar');
}

const copyLinkButton = document.getElementById('copy-link-button');
if (copyLinkButton) {
  copyLinkButton.addEventListener('click', () => {
    copyLink(window.cardData.cardLink);
  });
}

const downloadCanvasImage = (fabicCanvas) => {
  const a = document.createElement('a');
  let dt = fabicCanvas.toDataURL({
    format: 'png',
    quality: 1,
  });
  dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  dt = dt.replace(
    /^data:application\/octet-stream/,
    'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png',
  );

  a.href = dt;
  a.download = 'qr_code.png';
  a.click();
};

async function saveQrCodeImageBrochureCanvas() {
  downloadCanvasImage(qrCodeImageBrochureCanvas);
}

const saveQrButton = document.getElementById('save-qr-button');
if (saveQrButton) {
  saveQrButton.addEventListener('click', () => {
    saveQrCodeImageBrochureCanvas();
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const productContainers = document.querySelectorAll('.product-card');

  productContainers.forEach((productContainer, index) => {
    const slideshowContainer = productContainer.querySelector('.product-slideshow-container');
    if (!slideshowContainer) return;

    let slideIndex = 1;

    function showSlides(n) {
      let count;
      const slides = slideshowContainer.getElementsByClassName('product-slide');
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      for (count = 0; count < slides.length; count += 1) {
        slides[count].style.display = 'none';
      }

      slides[slideIndex - 1].style.display = 'block';
    }

    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides((slideIndex += n));
    }

    const prevButton = productContainer.querySelector('.product-slide-previous');
    prevButton.addEventListener('click', () => {
      plusSlides(-1);
    });

    const nextButton = productContainer.querySelector('.product-slide-next');
    nextButton.addEventListener('click', () => {
      plusSlides(1);
    });
  });
});
