const stages = [
  {
    name: "小学",
    title: "小学阶段 · 好奇心起点",
    story: "你正在探索兴趣、习惯与支持系统。今天的小决定，会在未来悄悄改变路线。",
    scene: 0,
  },
  {
    name: "初中",
    title: "初中阶段 · 自我认同萌芽",
    story: "学习压力、同伴关系和兴趣选择开始相互缠绕，微小偏好会形成路径依赖。",
    scene: 0,
  },
  {
    name: "高中",
    title: "高中阶段 · 分流与选择",
    story: "一次学科选择、一次竞赛尝试、一次和家人的谈话，都可能改变大学入口。",
    scene: 0,
  },
  {
    name: "大学",
    title: "大学阶段 · 专业与能力建模",
    story: "课程、实习、社团、恋爱和城市机会共同进入混沌系统，职业方向开始显影。",
    scene: 1,
  },
  {
    name: "研究生",
    title: "研究生阶段 · 深度探索",
    story: "你在学术、技术、产业之间寻找杠杆点，长期主义会放大复利。",
    scene: 1,
  },
  {
    name: "恋爱",
    title: "恋爱阶段 · 亲密关系变量",
    story: "亲密关系会影响幸福感、城市选择、风险偏好和家庭规划。",
    scene: 2,
  },
  {
    name: "工作",
    title: "工作阶段 · 职业复利曲线",
    story: "岗位、行业、健康、财富和家庭系统开始交叉反馈，每个决策都留下未来回声。",
    scene: 2,
  },
];

const state = {
  stage: "小学",
  year: 2030,
  seed: 7421,
  decisions: ["学习投入"],
  nickname: "",
  photoUrl: "",
  clothing: "campus",
  bodyShape: "balanced",
};

const form = document.querySelector("#profileForm");
const stageTabs = document.querySelectorAll(".stage-tab");
const yearSlider = document.querySelector("#yearSlider");
const yearOutput = document.querySelector("#yearOutput");
const panorama = document.querySelector("#panorama");
const chatFeed = document.querySelector("#chatFeed");
const metrics = document.querySelector("#metrics");
const impactTag = document.querySelector("#impactTag");
const seedLabel = document.querySelector("#seedLabel");
const studentName = document.querySelector("#studentName");
const registerDialog = document.querySelector("#registerDialog");
const registerForm = document.querySelector("#registerForm");
const photoUpload = document.querySelector("#photoUpload");
const dialogPhotoUpload = document.querySelector("#dialogPhotoUpload");
const userPhotoPreview = document.querySelector("#userPhotoPreview");
const futurePhoto = document.querySelector("#futurePhoto");
const studentAvatar = document.querySelector(".student-avatar");
const futurePerson = document.querySelector("#futurePerson");
const futureAgeLabel = document.querySelector("#futureAgeLabel");
const futureSceneLabel = document.querySelector("#futureSceneLabel");
const clothingStyle = document.querySelector("#clothingStyle");
const bodyShape = document.querySelector("#bodyShape");
const dialogClothingStyle = document.querySelector("#dialogClothingStyle");
const dialogBodyShape = document.querySelector("#dialogBodyShape");
const vrWindow = document.querySelector(".vr-window");

function getProfile() {
  const data = new FormData(form);
  return {
    age: Number(data.get("age")),
    appearance: Number(data.get("appearance")),
    housing: data.get("housing"),
    income: Number(data.get("income")),
    happiness: Number(data.get("happiness")),
    health: Number(data.get("health")),
    wealth: Number(data.get("wealth")),
    marriage: data.get("marriage"),
    family: Number(data.get("family")),
    children: Number(data.get("children")),
    grade: Number(data.get("grade")),
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function formatMoney(value) {
  if (value >= 10000) return `¥${Math.round(value / 10000)}万`;
  return `¥${Math.round(value).toLocaleString("zh-CN")}`;
}

function decisionScore() {
  return state.decisions.reduce((score, decision) => {
    const map = {
      学习投入: 9,
      社交拓展: 7,
      健康优先: 8,
      创业冒险: 6,
    };
    return score + (map[decision] || 0);
  }, 0);
}

function simulateFuture() {
  const profile = getProfile();
  const years = state.year - 2026;
  const stageIndex = stages.findIndex((item) => item.name === state.stage);
  const chaos = Math.sin((state.seed + years * 17 + stageIndex * 29) / 13) * 9;
  const score = decisionScore();
  const age = profile.age + years;
  const income = profile.income + years * (420 + profile.grade * 26 + score * 38) + chaos * 500;
  const wealth = profile.wealth + years * (profile.income * 3.2 + profile.grade * 900 + score * 1200);
  const happiness = clamp(profile.happiness + score * 0.8 + profile.family * 0.08 - years * 0.18 + chaos, 1, 100);
  const health = clamp(profile.health + (state.decisions.includes("健康优先") ? 10 : 0) - years * 0.32 + chaos * 0.25, 1, 100);
  const studyCareer = clamp(profile.grade + score * 0.9 + years * 0.35 + chaos * 0.4, 1, 100);
  const children = state.year > 2035 && ["恋爱", "工作"].includes(state.stage) ? Math.min(3, profile.children + 1) : profile.children;
  const marriage =
    state.stage === "恋爱" && state.year > 2030
      ? "恋爱中"
      : state.stage === "工作" && state.year > 2036
        ? "可进入婚育规划"
        : profile.marriage;
  const housing =
    wealth > 1200000 ? "核心城市自有住房" : wealth > 300000 ? "合租公寓 / 首付准备" : profile.housing;
  const impact = clamp(score + chaos + years * 0.9, -30, 88);

  return {
    age,
    income,
    wealth,
    happiness,
    health,
    studyCareer,
    children,
    marriage,
    housing,
    impact,
  };
}

function renderMetrics(result) {
  const rows = [
    ["年龄", `${result.age}岁`, "+5岁", "📅"],
    ["住房", result.housing, "+1等级", "🏢"],
    ["收入", `${formatMoney(result.income)} / 月`, `+${formatMoney(Math.max(0, result.income - getProfile().income))}`, "🪙"],
    ["幸福感", `${result.happiness} / 100`, "+6", "🙂"],
    ["身体状态", result.health > 70 ? "良好" : "需关注", "保持", "💚"],
    ["财富", formatMoney(result.wealth), `+${formatMoney(Math.max(0, result.wealth - getProfile().wealth))}`, "💰"],
    ["婚姻", result.marriage, "+1状态", "💍"],
    ["家庭", result.happiness > 70 ? "稳定" : "待修复", "与父母同住", "🏠"],
    ["子女", `${result.children}`, "暂无变化", "👶"],
    ["学习/职业", result.studyCareer > 86 ? "产品助理" : "探索中", "职场起步", "💼"],
  ];
  metrics.innerHTML = rows
    .map(
      ([label, value, delta, icon]) =>
        `<article class="metric"><span>${label}</span><b>${icon}</b><strong>${value}</strong><small>${delta}</small></article>`,
    )
    .join("");
  impactTag.textContent = `因果量子影响 ${result.impact >= 0 ? "+" : ""}${result.impact}`;
}

function renderChat(result) {
  const profile = getProfile();
  const name = state.nickname || "你";
  const recommendations = result.studyCareer > 86 ? ["产品经理", "数据分析师", "用户体验设计师"] : ["专业探索", "项目助理", "学习成长路线"];
  const advice =
    profile.grade < 70
      ? "学习成绩是当前最敏感变量，建议把每日深度学习稳定到 90 分钟。"
      : "你的学习变量处于优势区，可以把课程成绩转化为项目、竞赛或实习证据。";
  const risk =
    result.health < 65
      ? "健康状态已经压低未来收益曲线，请把睡眠、运动和体检设为高优先级决策。"
      : "健康变量稳定，适合尝试更高强度的实习、科研或创业探索。";

  chatFeed.innerHTML = [
    `<div class="message">你好！我是混沌生涯机器人 🤖<br />我可以帮你分析现状、预测未来、规划路径。</div>`,
    `<div class="message user">我适合做什么工作？</div>`,
    `<div class="message">根据 ${name} 的性格、兴趣和能力，推荐方向：<br />1. ${recommendations[0]} ★★★★<br />2. ${recommendations[1]} ★★★<br />3. ${recommendations[2]} ★★★★</div>`,
    `<div class="message user">帮我分析一下未来 ${Math.max(1, state.year - 2026)} 年的发展！</div>`,
    `<div class="message">${advice}<br />${risk}</div>`,
  ].join("");
}

function renderIdentity(result) {
  if (!futurePerson) return;

  const years = Math.max(0, state.year - 2026);
  const maturityScale = 0.84 + Math.min(years, 30) * 0.014;
  const appearanceBoost = (getProfile().appearance - 50) / 900;
  const stageIndex = Math.max(0, stages.findIndex((item) => item.name === state.stage));
  const x = 32 + stageIndex * 5 + Math.min(years, 30) * 0.48;

  futurePerson.classList.remove("campus", "formal", "research", "creative", "balanced", "slim", "athletic", "strong");
  futurePerson.classList.add(state.clothing, state.bodyShape);
  futurePerson.style.setProperty("--person-x", `${Math.min(74, x)}%`);
  futurePerson.style.setProperty("--person-scale", (maturityScale + appearanceBoost).toFixed(2));
  futurePerson.style.setProperty("--age-lines", Math.min(0.42, years / 70).toFixed(2));

  if (futurePhoto) {
    futurePhoto.style.filter = `saturate(${Math.max(0.78, 1 - years * 0.008).toFixed(2)}) contrast(${(1 + years * 0.004).toFixed(2)}) brightness(${Math.max(0.88, 1 - years * 0.003).toFixed(2)})`;
  }

  futureAgeLabel.textContent = `${result.age}岁未来形象`;
  if (state.photoUrl) {
    [userPhotoPreview, futurePhoto].forEach((img) => {
      if (img) img.src = state.photoUrl;
    });
    studentAvatar.classList.add("has-photo");
    futurePhoto.parentElement.classList.add("has-photo");
  }
}

function renderVR(result) {
  const stage = stages.find((item) => item.name === state.stage) || stages[0];
  const years = Math.max(0, state.year - 2026);
  const progress = years / 30;
  const drift = Math.round(progress * 72);
  const base = stage.scene * 33.333;

  panorama.style.transform = `translateX(calc(-${base}% - ${drift}px))`;
  vrWindow.style.setProperty("--vr-saturation", (1 + progress * 0.34).toFixed(2));
  vrWindow.style.setProperty("--vr-brightness", (1 + progress * 0.14).toFixed(2));
  vrWindow.style.setProperty("--future-glow", (0.2 + progress * 0.42).toFixed(2));
  vrWindow.style.setProperty("--future-light-x", `${28 + progress * 48}%`);

  const sceneLabels = ["校园成长视角", "大学 / 研究探索视角", "城市职场与家庭视角"];
  futureSceneLabel.textContent = `${state.year} · ${sceneLabels[stage.scene]} · ${result.housing}`;
}

function setPhotoFromFile(file) {
  if (!file) return;
  if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
  state.photoUrl = URL.createObjectURL(file);
  render();
}

function updateStage(stageName) {
  state.stage = stageName;
  stageTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.stage === stageName));
  render();
}

function render() {
  const result = simulateFuture();
  yearOutput.textContent = `${state.year}`;
  seedLabel.textContent = 80 + (state.seed % 90);
  renderMetrics(result);
  renderChat(result);
  renderVR(result);
  renderIdentity(result);
}

stageTabs.forEach((tab) => {
  tab.addEventListener("click", () => updateStage(tab.dataset.stage));
});

yearSlider.addEventListener("input", (event) => {
  state.year = Number(event.target.value);
  render();
});

form.addEventListener("input", render);

photoUpload.addEventListener("change", (event) => {
  setPhotoFromFile(event.target.files?.[0]);
});

dialogPhotoUpload.addEventListener("change", (event) => {
  setPhotoFromFile(event.target.files?.[0]);
});

clothingStyle.addEventListener("change", (event) => {
  state.clothing = event.target.value;
  dialogClothingStyle.value = state.clothing;
  render();
});

dialogClothingStyle.addEventListener("change", (event) => {
  state.clothing = event.target.value;
  clothingStyle.value = state.clothing;
  render();
});

bodyShape.addEventListener("change", (event) => {
  state.bodyShape = event.target.value;
  dialogBodyShape.value = state.bodyShape;
  render();
});

dialogBodyShape.addEventListener("change", (event) => {
  state.bodyShape = event.target.value;
  bodyShape.value = state.bodyShape;
  render();
});

document.querySelectorAll(".decision-pad button").forEach((button) => {
  button.addEventListener("click", () => {
    const decision = button.dataset.decision;
    if (state.decisions.includes(decision)) {
      state.decisions = state.decisions.filter((item) => item !== decision);
      button.classList.remove("selected");
    } else {
      state.decisions = [...state.decisions, decision];
      button.classList.add("selected");
    }
    render();
  });
});

document.querySelector("#openRegister").addEventListener("click", () => {
  if (typeof registerDialog.showModal === "function") registerDialog.showModal();
});

registerForm.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (submitter?.value === "default") {
    const data = new FormData(registerForm);
    state.nickname = data.get("nickname");
    studentName.textContent = state.nickname || "大一新生";
    state.seed = Math.abs(
      String(state.nickname)
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0) * 17, 4217),
    );
    state.clothing = dialogClothingStyle.value;
    state.bodyShape = dialogBodyShape.value;
    clothingStyle.value = state.clothing;
    bodyShape.value = state.bodyShape;
    render();
  }
});

render();
