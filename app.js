const app = document.getElementById("app");
const toast = document.getElementById("toast");
const state = { role: null, data: null, index: 0, selected: null };

function showToast(msg){
  if(!toast) return;
  toast.textContent = msg; toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2600);
}

function esc(s){ 
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m])); 
}

function loading(){
  app.innerHTML = `<main class="screen loading"><div class="loading-card">
    <div class="loading-title">⚖️ The Relationship Court</div>
    <div class="loading-sub">ENTERING SESSION... PLEASE WAIT</div>
    <div class="loading-line"></div>
  </div></main>`;
  setTimeout(showHome, 1700);
}

function showHome(){
  app.innerHTML = `<main class="screen choice-screen" style="background-image:url('assets/BG.png');background-size:cover;background-position:center">
    <div class="choice-wrap content">
      <h1 class="court-title">⚖️ The Relationship Court</h1>
      <h2 class="court-sub">The biggest communication problem is we do not listen to understand. We listen to reply.</h2>
      <div class="court-sub">Chalo This Time We Listen To Understand 😌.</div>
      <div class="court-sub">CHOOSE YOUR POINT OF VIEW</div>
      <div class="choices">
        <button class="choice" onclick="startRole('girl')">
          <img src="assets/Girl.png" alt="Girl"><div class="choice-name">Tulasi</div><div class="choice-hint">Her POV 💅</div>
        </button>
        <button class="choice" onclick="startRole('boy')">
          <img src="assets/Boy.png" alt="Boy"><div class="choice-name">Ajay</div><div class="choice-hint">His POV 🦁</div>
        </button>
      </div>
    </div>
  </main>`;
}

async function startRole(role){
  state.role = role;
  const isBoy = role === "boy";
  const msg = isBoy
    ? "Vammooo It's Really Shocking! 😲 Ponile okasari ina Na Mata Vinataniki Ready Iyyav... Last daka opika ga vinu mari! 😌✨"
    : "Anukuna As Usual ga Ni Point of View ne Chustav Ani Mundu! 🙄💅";
  app.innerHTML = `<main class="screen transition"><div class="transition-card">
    <img class="transition-avatar" src="assets/${isBoy ? "Boy" : "Girl"}.png">
    <div class="transition-message">${esc(msg)}</div>
    <button class="continue" onclick="loadRole()">Okay, Let's Hear It 💗</button>
  </div></main>`;
}

// Browser-side Excel reader using SheetJS
async function loadRole(){
  app.innerHTML=`<main class="screen loading"><div class="loading-card">
    <div class="loading-title">⚖ The Relationship Court</div><div class="loading-sub">LOADING YOUR SIDE...</div><div class="loading-line"></div>
  </div></main>`;
  
  try{
    const fileName = state.role === "boy" ? "Boy.xlsx" : "Girl.xlsx";
    const response = await fetch(fileName);
    if (!response.ok) throw new Error("Excel file not found");
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    let questions = [];
    let finalMsg = "";

    rows.forEach(r => {
      let finalVal = r.final || r.Final || r.FINAL;
      let pointVal = r.point || r.Point || r.POINT;

      if(finalVal) {
        finalMsg = finalVal;
      }
      // Only push valid questions and ignore empty/blank rows at the end of Excel
      if(pointVal && String(pointVal).trim() !== "") {
        questions.push({
          point: pointVal,
          button1: r["Reaction Button 1"] || r.button1 || r.Button1 || "",
          answer1: r["Reaction Button 1 Answer"] || r.answer1 || r.Answer1 || "",
          button2: r["Reaction Button 2"] || r.button2 || r.Button2 || "",
          answer2: r["Reaction Button 2 Answer"] || r.answer2 || r.Answer2 || ""
        });
      }
    });

    state.data = { questions, final: finalMsg };
    state.index = 0; 
    state.selected = null;

    if(!state.data.questions?.length){
      showToast(`No questions found in ${fileName}.`);
      setTimeout(showHome, 2200);
      return;
    }
    renderQuestion();
  }catch(e){
    console.error(e); 
    showToast("Could not load or parse the Excel data."); 
    setTimeout(showHome, 1800);
  }
}
function renderQuestion(){
  const q = state.data.questions[state.index];
  const bg = state.role === "boy" ? "Boy_Chat_BG.png" : "Girl_Chat_BG.png";
  
  const b1Html = q.button1 ? `<button class="reaction primary" onclick="chooseAnswer(1)">${esc(q.button1)}</button>` : "";
  const b2Html = q.button2 ? `<button class="reaction secondary" onclick="chooseAnswer(2)">${esc(q.button2)}</button>` : "";

  app.innerHTML = `<main class="screen chat-screen" style="background-image:url('assets/${bg}')">
    <div class="chat-overlay">
      <section class="chat-content">
        <div class="question-count">QUESTION ${state.index+1} OF ${state.data.questions.length}</div>
        <div class="question">${esc(q.point)}</div>
        <div class="reactions">
          ${b1Html}
          ${b2Html}
        </div>
        <div id="answerArea"></div>
      </section>
    </div>
  </main>`;
}

function chooseAnswer(which){
  const q = state.data.questions[state.index];
  state.selected = which;
  const answer = which === 1 ? q.answer1 : q.answer2;
  const buttons = document.querySelectorAll(".reaction");
  buttons.forEach((b, i) => b.classList.toggle("selected", i === which - 1));
  document.getElementById("answerArea").innerHTML = `<div class="answer">${esc(answer || "❤️")}</div>
    <button class="next" onclick="nextQuestion()">NEXT →</button>`;
}

function nextQuestion(){
  state.index++;
  if(state.index < state.data.questions.length) {
    renderQuestion();
  } else {
    showFinal(); // Ensure it cleanly triggers the final screen when questions are completed
  }
}

function showFinal(){
  const isBoy = state.role === "boy";
  const text = state.data.final || "";
  app.innerHTML = `<main class="screen final-screen">
    <section class="final-card">
      <img class="final-avatar" src="assets/${isBoy ? "Boy" : "Girl"}.png" alt="">
      <h1 class="final-title">${isBoy ? "A Few Words From His Side ❤️" : "A Few Words From Her Side ❤️"}</h1>
      <div class="heart">♥</div>
      ${text ? `<div class="final-text">${esc(text)}</div>` : ""}
      <div style="margin-top:24px;font-family:Georgia,serif;font-style:italic;color:#b24a5c">With Love ❤️</div>
      <div class="gift-area">
        <div class="gift-box" aria-hidden="true">🎁</div>
        <button class="open-gift" onclick="playFinalVideo()">Open ✨</button>
        <div class="gift-hint">A little surprise for you 💝</div>
      </div>
    </section>
  </main>`;
}

function playFinalVideo(){
  const modal = document.createElement("div");
  modal.className = "video-modal";
  modal.innerHTML = `<div class="video-box">
    <button class="close-video" aria-label="Close" onclick="this.closest('.video-modal').remove()">×</button>
    <video id="finalVideo" src="assets/Final.mp4" playsinline controls></video>
  </div>`;
  document.body.appendChild(modal);
  const v = modal.querySelector("video");
  v.addEventListener("ended", () => modal.remove());
  const p = v.play();
  if(p && p.catch) p.catch(() => showToast("Press Play on the video to start it."));
}

loading();
