
  function openAbout() {
    document.getElementById("aboutModal").style.display = "block";
  }

  function closeAbout() {
    document.getElementById("aboutModal").style.display = "none";
  }

  // Optional: Close modal when clicking outside of it
  window.onclick = function(event) {
    const modal = document.getElementById("aboutModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


//   Gallery-----------

  function openGallery() {
    document.getElementById("galleryModal").style.display = "block";
  }

  function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
  }

  function openAbout() {
    document.getElementById("aboutModal").style.display = "block";
  }

  function closeAbout() {
    document.getElementById("aboutModal").style.display = "none";
  }

  window.onclick = function(event) {
    const aboutModal = document.getElementById("aboutModal");
    const galleryModal = document.getElementById("galleryModal");

    if (event.target == aboutModal) {
      aboutModal.style.display = "none";
    }

    if (event.target == galleryModal) {
      galleryModal.style.display = "none";
    }
  }

// ----------------------------------------

