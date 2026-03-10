// 心灵港湾 - 心理减压规划师
const PRICING = {
    'monthly': { name: '月度会员', price: 29.9, days: 30 },
    'yearly': { name: '年度会员', price: 199, days: 365 }
};
const PAYMENT_CONFIG = {
    method: 'wechat_personal',
    wechatId: 'm731843862',
    paymentNote: '请添加微信 m731843862 付款开通'
};
const AppData = {
    user: { isVip: false, vipExpire: null },
    assessmentQuestions: [
        { question: "在过去一周里，您多久会感到紧张或焦虑？", options: [{ text: "几乎没有", score: 0 }, { text: "偶尔", score: 1 }, { text: "有时", score: 2 }, { text: "经常", score: 3 }, { text: "几乎每天", score: 4 }] },
        { question: "您是否发现自己难以放松？", options: [{ text: "从不", score: 0 }, { text: "偶尔", score: 1 }, { text: "有时", score: 2 }, { text: "经常", score: 3 }, { text: "总是如此", score: 4 }] },
        { question: "您对自己的未来感到担忧吗？", options: [{ text: "从不", score: 0 }, { text: "偶尔", score: 1 }, { text: "有时", score: 2 }, { text: "经常", score: 3 }, { text: "总是", score: 4 }] },
        { question: "您的睡眠质量如何？", options: [{ text: "非常好", score: 0 }, { text: "还不错", score: 1 }, { text: "一般", score: 2 }, { text: "较差", score: 3 }, { text: "很差", score: 4 }] },
        { question: "您是否感到疲惫？", options: [{ text: "精力充沛", score: 0 }, { text: "偶尔疲惫", score: 1 }, { text: "有时疲惫", score: 2 }, { text: "经常疲惫", score: 3 }, { text: "总是疲惫", score: 4 }] }
    ],
    relaxMethods: {
        breathing: [
            { id: 'box', title: '方块呼吸法', description: '吸气4秒-屏息4秒-呼气4秒-屏息4秒', icon: '🌬️', duration: '5分钟', difficulty: '简单' },
            { id: 'deep', title: '腹式深呼吸', description: '深度呼吸缓解焦虑', icon: '💨', duration: '10分钟', difficulty: '简单' }
        ],
        meditation: [
            { id: 'body', title: '身体扫描冥想', description: '从头到脚释放紧张', icon: '🧘', duration: '15分钟', difficulty: '中等' },
            { id: 'mind', title: '正念冥想', description: '关注当下', icon: '🎯', duration: '10分钟', difficulty: '中等' }
        ],
        exercise: [
            { id: 'stretch', title: '办公室拉伸', description: '缓解久坐不适', icon: '🙆', duration: '5分钟', difficulty: '简单' },
            { id: 'walk', title: '正念行走', description: '将行走变成冥想', icon: '🚶', duration: '15分钟', difficulty: '简单' }
        ],
        lifestyle: [
            { id: 'sleep', title: '睡眠改善', description: '改善睡眠质量', icon: '😴', duration: '持续', difficulty: '需坚持' },
            { id: 'journal', title: '感恩日记', description: '记录美好事物', icon: '✨', duration: '10分钟', difficulty: '简单' }
        ]
    },
    chatResponses: {
        greeting: ["您好！今天过得怎么样？", "欢迎回来！有什么想分享的吗？"],
        tired: ["听起来您很疲惫，是什么让您最累呢？", "疲惫是身体在提醒我们要休息。"],
        stressed: ["压力很正常，您能说说是什么让您压力最大吗？", "面对压力，找到适合的应对方式很重要。"],
        anxious: ["焦虑是正常的情绪反应，能描述一下让您焦虑的想法吗？", "深呼吸可以帮助平静下来。"],
        sad: ["我能感受到您的低落，允许自己难过也是一种勇气。", "悲伤会过去的。"],
        default: ["我在认真听您说，能多分享一些吗？", "感谢您愿意和我分享。"],
        encouragement: ["您已经很勇敢了。", "寻求帮助是坚强的表现。", "允许自己感受这些情绪。"]
    }
};

let userData = JSON.parse(localStorage.getItem('userData')) || { isVip: false, vipExpire: null };
let chatHistory = [];
let currentQuestion = 0;
let assessmentScore = 0;
let answers = [];

function saveData() { localStorage.setItem('userData', JSON.stringify(userData)); }
function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initChat();
    initAssessment();
    initRelax();
    initDiary();
    initModals();
    updateUserUI();
});

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            if (this.classList.contains('vip-item') && !userData.isVip) {
                document.getElementById('vip-modal').classList.add('active');
                return;
            }
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(page + '-page').classList.add('active');
        });
    });
}

function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            input.value = this.dataset.message;
            sendMessage();
        });
    });
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    setTimeout(() => {
        const response = generateResponse(message);
        addMessage(response, 'assistant');
    }, 800);
}

function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<div class="avatar">${type === 'user' ? '👤' : '🌸'}</div><div class="message-content"><p>${text}</p></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function generateResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('累') || lower.includes('疲惫')) return getRandomItem(AppData.chatResponses.tired);
    if (lower.includes('压力') || lower.includes('忙')) return getRandomItem(AppData.chatResponses.stressed);
    if (lower.includes('焦虑') || lower.includes('担心')) return getRandomItem(AppData.chatResponses.anxious);
    if (lower.includes('难过') || lower.includes('伤心')) return getRandomItem(AppData.chatResponses.sad);
    return getRandomItem(AppData.chatResponses.default);
}

function initAssessment() {
    document.getElementById('start-assessment').addEventListener('click', startAssessment);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('prev-question').addEventListener('click', prevQuestion);
    document.getElementById('retake-assessment').addEventListener('click', () => {
        document.getElementById('assessment-result').style.display = 'none';
        document.getElementById('assessment-intro').style.display = 'block';
    });
}

function startAssessment() {
    currentQuestion = 0;
    assessmentScore = 0;
    answers = [];
    document.getElementById('assessment-intro').style.display = 'none';
    document.getElementById('assessment-questions').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = AppData.assessmentQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / AppData.assessmentQuestions.length) * 100;
    document.getElementById('assessment-progress').style.width = progress + '%';
    let html = `<div class="question-item"><h4>问题 ${currentQuestion + 1}/${AppData.assessmentQuestions.length}</h4><p style="font-size:18px;margin:20px 0;">${q.question}</p><div class="options-list">`;
    q.options.forEach((opt, i) => {
        const selected = answers[currentQuestion] === i ? 'selected' : '';
        html += `<button class="option-btn ${selected}" data-index="${i}">${opt.text}</button>`;
    });
    html += '</div></div>';
    document.getElementById('question-container').innerHTML = html;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            answers[currentQuestion] = parseInt(this.dataset.index);
        });
    });
}

function nextQuestion() {
    if (answers[currentQuestion] === undefined) { alert('请选择一个选项'); return; }
    assessmentScore += AppData.assessmentQuestions[currentQuestion].options[answers[currentQuestion]].score;
    if (currentQuestion < AppData.assessmentQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) { currentQuestion--; showQuestion(); }
}

function showResult() {
    document.getElementById('assessment-questions').style.display = 'none';
    document.getElementById('assessment-result').style.display = 'block';
    const score = Math.min(assessmentScore * 5, 100);
    document.getElementById('score-value').textContent = score;
    let level, icon, desc;
    if (score <= 20) { level = '压力较低'; icon = '🌿'; desc = '您的心理状态良好，继续保持！'; }
    else if (score <= 40) { level = '轻度压力'; icon = '🍃'; desc = '有些小压力，注意适当放松。'; }
    else if (score <= 60) { level = '中度压力'; icon = '🍂'; desc = '压力较明显，建议采取减压措施。'; }
    else if (score <= 80) { level = '高度压力'; icon = '🍁'; desc = '压力较大，建议寻求专业帮助。'; }
    else { level = '严重压力'; icon = '🔴'; desc = '建议尽快寻求专业心理咨询。'; }
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = level;
    document.getElementById('result-description').textContent = desc;
}

function initRelax() {
    showRelaxCategory('breathing');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showRelaxCategory(this.dataset.category);
        });
    });
}

function showRelaxCategory(category) {
    const methods = AppData.relaxMethods[category];
    let html = '';
    methods.forEach(m => {
        html += `<div class="relax-card"><div class="card-icon">${m.icon}</div><h4>${m.title}</h4><p>${m.description}</p><div class="card-meta"><span>⏱️ ${m.duration}</span><span>📊 ${m.difficulty}</span></div></div>`;
    });
    document.getElementById('relax-content').innerHTML = html;
}

function initDiary() {
    document.getElementById('diary-date').valueAsDate = new Date();
    document.getElementById('diary-content').addEventListener('input', function() {
        document.getElementById('word-count').textContent = this.value.length;
    });
    document.querySelectorAll('.mood-opt').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-opt').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    document.getElementById('save-diary').addEventListener('click', saveDiary);
    loadDiaryHistory();
}

function saveDiary() {
    const content = document.getElementById('diary-content').value;
    const date = document.getElementById('diary-date').value;
    const mood = document.querySelector('.mood-opt.active').dataset.mood;
    if (!content) { alert('请输入日记内容'); return; }
    const diaries = JSON.parse(localStorage.getItem('diaries')) || [];
    diaries.unshift({ date, mood, content, time: new Date().toISOString() });
    localStorage.setItem('diaries', JSON.stringify(diaries));
    alert('日记保存成功！');
    document.getElementById('diary-content').value = '';
    document.getElementById('word-count').textContent = '0';
    loadDiaryHistory();
}

function loadDiaryHistory() {
    const diaries = JSON.parse(localStorage.getItem('diaries')) || [];
    const container = document.getElementById('diary-history-list');
    if (diaries.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="empty-icon">📔</span><p>暂无日记</p></div>';
        return;
    }
    let html = '';
    diaries.slice(0, 10).forEach(d => {
        const moodIcons = { happy: '😊', calm: '😌', anxious: '😰', sad: '😔', angry: '😤' };
        html += `<div class="diary-item"><div class="diary-item-header"><span class="diary-date">${d.date}</span><span class="diary-mood">${moodIcons[d.mood] || '😐'}</span></div><div class="diary-preview">${d.content.substring(0, 50)}...</div></div>`;
    });
    container.innerHTML = html;
}

function initModals() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    document.getElementById('upgrade-btn').addEventListener('click', () => {
        document.getElementById('vip-modal').classList.add('active');
    });
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function updateUserUI() {
    const statusFree = document.querySelector('.status-free');
    const statusVip = document.querySelector('.status-vip');
    if (userData.isVip && (!userData.vipExpire || new Date(userData.vipExpire) > new Date())) {
        if (statusFree) statusFree.style.display = 'none';
        if (statusVip) statusVip.style.display = 'flex';
    } else {
        if (statusFree) statusFree.style.display = 'flex';
        if (statusVip) statusVip.style.display = 'none';
    }
}
