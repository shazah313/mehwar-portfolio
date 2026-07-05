(function () {
  'use strict';

  var RECIPIENT = 'coo@mehwartechnology.com';
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    var loading = form.querySelector('.loading');
    var errorEl = form.querySelector('.error-message');
    var sentEl = form.querySelector('.sent-message');
    var submitBtn = form.querySelector('button[type="submit"]');

    loading.classList.add('d-block');
    errorEl.classList.remove('d-block');
    sentEl.classList.remove('d-block');
    if (submitBtn) submitBtn.disabled = true;

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      _subject: 'Mehwar Technology — ' + form.subject.value.trim(),
      _replyto: form.email.value.trim(),
      _template: 'table',
      _captcha: 'false'
    };

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(RECIPIENT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Unable to send your message. Please try again.');
          }
          return data;
        });
      })
      .then(function () {
        sentEl.classList.add('d-block');
        form.reset();
      })
      .catch(function (err) {
        errorEl.textContent = err.message || ('Something went wrong. Email us directly at ' + RECIPIENT);
        errorEl.classList.add('d-block');
      })
      .finally(function () {
        loading.classList.remove('d-block');
        if (submitBtn) submitBtn.disabled = false;
      });
  }, true);
})();
