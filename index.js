







//login and log out section and clue




document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const loginSection = document.getElementById("section");
  const lessonSection = document.getElementById("section-2");
  const faqSection = document.getElementById("faq");

  const learnBtn = document.getElementById("learnBtn");
  const faqBtn = document.getElementById("faqBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let isLoggedIn = false;

  //  Toast Function
   
  function showToast(message, type = "info") {
    const colors = {
      info: "bg-blue-500",
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
    };

    const toast = document.createElement("div");
    toast.className = `${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 transition-all duration-500 opacity-0 translate-y-[-10px]`;
    toast.innerText = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-y-[-10px]");
      toast.classList.add("opacity-100", "translate-y-0");
    }, 50);

    // Remove after 2.5s
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-[-10px]");
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }

  //  page hide
  [lessonSection, faqSection].forEach(sec => {
    if (sec) {
      sec.style.display = "none";
      sec.style.opacity = "0";
      sec.style.transition = "opacity 0.5s ease";
    }
  });
  if (loginSection) loginSection.style.transition = "opacity 0.5s ease";

  //  helper function
  function hideAllSections() {
    const sections = [loginSection, lessonSection, faqSection];
    sections.forEach(sec => {
      if (sec) {
        sec.style.opacity = "0";
        setTimeout(() => (sec.style.display = "none"), 300);
      }
    });
  }

  function showLessons() {
    isLoggedIn = true;
    hideAllSections();
    setTimeout(() => {
      lessonSection.style.display = "block";
      setTimeout(() => (lessonSection.style.opacity = "1"), 30);
    }, 300);
    showToast("Welcome back, Fahim!", "success");
  }

  function showFAQ() {
    hideAllSections();
    setTimeout(() => {
      faqSection.style.display = "block";
      setTimeout(() => (faqSection.style.opacity = "1"), 30);
    }, 300);
  }

  function showLogin() {
    isLoggedIn = false;
    hideAllSections();
    setTimeout(() => {
      loginSection.style.display = "block";
      setTimeout(() => (loginSection.style.opacity = "1"), 30);
      usernameInput.value = "";
      passwordInput.value = "";
    }, 300);
    showToast("Logged out successfully.", "info");
  }

  //  Login
  if (loginBtn) {
    loginBtn.addEventListener("click", e => {
      e.preventDefault?.();
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (username === "fahim" && password === "1234") {
        showLessons();
      } else {
        showToast("Invalid username or password!", "error");
      }
    });
  }

  //  Learn button
  if (learnBtn) {
    learnBtn.addEventListener("click", e => {
      e.preventDefault?.();
      if (!isLoggedIn) {
        showToast("Please login first!", "warning");
      } else {
        showLessons();
      }
    });
  }

  // 🔹 FAQ button
  if (faqBtn) {
    faqBtn.addEventListener("click", e => {
      e.preventDefault?.();
      if (!isLoggedIn) {
        showToast("Please login first!", "warning");
      } else {
        showFAQ();
      }
    });
  }

 

  //  API teke button asbe 
  document.addEventListener("click", e => {
    const target = e.target;
    if (!target) return;

    if (target.id === "logoutBtn" || target.dataset.action === "logout") {
      e.preventDefault?.();
      showLogin();
    }

    if (target.id === "faqBtn" || target.dataset.action === "faq") {
      e.preventDefault?.();
      if (!isLoggedIn) {
        showToast("Please login first!", "warning");
      } else {
        showFAQ();
      }
    }
  });
});



//API section ------

//  Dynamic Lessons + Word Cards + Modal 

async function loadLessons() {
  const lessonContainer = document.getElementById("lessonContainer");
  const wordContainer = document.getElementById("wordContainer");
  const modal = document.getElementById("wordModal");

  // Loading placeholder for lessons
  lessonContainer.innerHTML = `<span class="loading loading-dots loading-lg text-blue-600"></span>`;

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/levels/all");
    const data = await res.json();
    lessonContainer.innerHTML = "";

    if (data.status && Array.isArray(data.data)) {
      data.data.forEach((lesson) => {
        const btn = document.createElement("button");
        btn.className =
          " border-1 border-blue-600  mt-4 btn text-blue-700 text-semibold  transition delay-150 duration-400 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-blue-600";
        btn.innerHTML = `<img src="fa-book-open.png" alt="" class="w-5 h-5"> Lesson-${lesson.level_no}`;

        // Button Click-
        btn.addEventListener("click", async () => {
          // highlight active button--
          document.querySelectorAll("#lessonContainer button").forEach((b) =>
            b.classList.remove("bg-blue-600", "text-white")
          );
          btn.classList.add("bg-blue-600", "text-white");

          // Show loading spinner for words--
          wordContainer.innerHTML = `
            <div class="flex justify-center py-10">
              <span class="loading loading-dots loading-lg text-blue-600"></span>
            </div>
          `;

          try {
            // Fetch all words once and filter by level-----
            const resWords = await fetch("https://openapi.programming-hero.com/api/words/all");
            const allWordsData = await resWords.json();

            if (allWordsData.status && Array.isArray(allWordsData.data)) {
              const words = allWordsData.data.filter(
                (w) => w.level === lesson.level_no
              );

              wordContainer.innerHTML = "";

              if (words.length > 0) {
                words.forEach((word) => {
                  const card = document.createElement("div");
                  card.className =
                    "card bg-base-300 border border-blue-200 shadow-md hover:shadow-xl transition-all duration-400 cursor-pointer";
                  card.innerHTML = `
                    <div class="card-body text-center">
                      <h2 class="text-xl font-bold text-blue-600"><span class="text-black">Detect Word</span><span class="text-gray-600">:</span> ${word.word}</h2>
                      <p class="text-gray-500">ID: ${word.id}</p>
                      <p class="text-gray-700"><span class="text-black">Bangla</span><span class="text-gray-600">:</span> ${word.pronunciation || "N/A"}</p>
                    </div>
                  `;

                  // Open modal on click---
                  card.addEventListener("click", () => {
                    document.getElementById("modalWord").innerText =
                      word.word || "N/A";
                    document.getElementById(
                      "modalPronunciation"
                    ).innerText = `Pronunciation: ${
                      word.pronunciation || "N/A"
                    }`;
                    document.getElementById(
                      "modalMeaning"
                    ).innerText = `Meaning: ${
                      word.meaning || "Meaning not available"
                    }`;
                    modal.showModal();
                  });

                  wordContainer.appendChild(card);
                });
              } else {
                wordContainer.innerHTML =   ` 
          <div class="col-span-3 grid grid-rows-2 items-center justify-center gap-2  mt-5 ">

<img class="pl-50" src="alert-error.png" alt="" srcset="">
<p class='text-center text-red-500 text-2xl  font-bold text-center'>Faild to load words <span class="text-black">${lesson.lessonName}!</span></p>

  </div>`;
              
              }
            }
          } catch (err) {
            console.error(err);
            wordContainer.innerHTML =
                  ` 
          <div class="grid grid-rows-2  justify-center gap-2 px-10 py-10 mt-5 ">

<img class="pl-15" src="alert-error.png" alt="" srcset="">
<p class='text-center text-red-500 text-2xl  font-bold text-center'>Faild to load words</p>

  </div>`;
          }
        });

        lessonContainer.appendChild(btn);
      });
    } else {
      lessonContainer.innerHTML =
        ` 
          <div class="grid grid-rows-2  justify-center gap-2 px-10 py-10 mt-5 ">

<img class="pl-15" src="alert-error.png" alt="" srcset="">
<p class='text-center text-red-500 text-2xl  font-bold text-center'>No lessons are found !</p>

  </div>`;
    }
  } catch (err) {
    console.error(err);
    lessonContainer.innerHTML =
      ` <div class="grid grid-rows-2  justify-center gap-2 px-10 py-10 mt-5 ">

<img class="pl-15" src="alert-error.png" alt="" srcset="">
<p class='text-center text-red-500 text-2xl  font-bold text-center'>Faild to load lessons !</p>

  </div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadLessons);



//Name : Naimur Rahaman Fahim
//cse batch 24(dhaka city college)
