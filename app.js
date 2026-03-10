// 心灵港湾 - 简化版
document.addEventListener('DOMContentLoaded', function() {
    let userData = JSON.parse(localStorage.getItem('userData')) || { isVip: false };
    
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
    
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            chatInput.value = this.dataset.message;
            sendMessage();
        });
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        addMessage(message, 'user');
        chatInput.value = '';
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'assistant');
        }, 800);
    }
    
    function addMessage(text, type) {
        const container = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<div class="avatar">${type === 'user' ? '👤' : '🌸'}</div><div class="message-content"><p>${text}</p></div>`;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    function generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('累') || lowerMsg.includes('疲惫')) return "听起来您最近很疲惫。您能告诉我，最近是什么让您感到最累呢？";
        else if (lowerMsg.includes('压力') || lowerMsg.includes('忙')) return "压力确实是一个很普遍的问题。您能告诉我，最近是什么让您感到压力最大呢？";
        else if (lowerMsg.includes('焦虑') || lowerMsg.includes('担心')) return "焦虑是一种很正常的情绪反应。您能描述一下，是什么样的想法让您感到焦虑吗？";
        else if (lowerMsg.includes('难过') || lowerMsg.includes('伤心')) return "我能感受到您的低落情绪。有时候，允许自己难过也是一种勇气。";
        else if (lowerMsg.includes('睡')) return "睡眠问题确实会大大影响我们的生活质量。您是入睡困难，还是容易半夜醒来呢？";
        else return "我在认真听您说的每一句话。您能再和我多分享一些您的感受吗？";
    }
    
    const questions = [
        { question: "在过去一周里，您多久会感到紧张或焦虑？", options: [{ text: "几乎没有", score: 0 }, { text: "偶尔", score: 1 }, { text: "有时", score: 2 }, { text: "经常", score: 3 }, { text: "几乎每天", score: 4 }] },
        { question: "您是否发现自己难以放松？", options: [{ text: "从不", score: 0 }, { text: "偶尔", score: 1 }, { text: "有时", score: 2 }, { text: "经常", score: 3 }, { text: "总是如此", score: 4 }] },
        { question: "您的睡眠质量如何？", options: [{ text: "非常好", score: 0 }, { text: "还不错", score: 1 }, { text: "一般", score: 2 }, { text: "较差", score: 3 }, { text: "很差", score: 4 }] },
        { question: "您是否感到疲惫？", options: [{ text: "精力充沛", score: 0 }, { text: "偶尔疲惫", score: 1 }, { text: "有时疲惫", score: 2 }, { text: "经常疲惫", score: 3 }, { text: "总是疲惫", score: 4 }] },
        { question: "您对自己的未来感到担忧吗？", options: [{ text: "从不", score: 0 }, { text: "偶尔", score: 1 }, { text: "有时", score: 2 }, { text: "经常", score: 3 }, { text: "总是", score: 4 }] }
    ];
    let currentQuestion = 0, assessmentScore = 0, answers = [];
    
    document.getElementById('start-assessment').addEventListener('click', function() {
        currentQuestion = 0; assessmentScore = 0; answers = [];
        document.getElementById('assessment-intro').style.display = 'none';
        document.getElementById('assessment-questions').style.display = 'block';
        showQuestion();
    });
    
    document.getElementById('next-question').addEventListener('click', function() {
        if (answers[currentQuestion] === undefined) { alert('请选择一个选项'); return; }
        assessmentScore += questions[currentQuestion].options[answers[currentQuestion]].score;
        if (currentQuestion < questions.length - 1) { currentQuestion++; showQuestion(); }
        else showResult();
    });
    
    document.getElementById('prev-question').addEventListener('click', function() {
        if (currentQuestion > 0) { currentQuestion--; showQuestion(); }
    });
    
    document.getElementById('retake-assessment').addEventListener('click', function() {
        document.getElementById('assessment-result').style.display = 'none';
        document.getElementById('assessment-intro').style.display = 'block';
    });
    
    function showQuestion() {
        const q = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        document.getElementById('assessment-progress').style.width = progress + '%';
        let html = `<div class="question-item"><h4>问题 ${currentQuestion + 1}/${questions.length}</h4><p style="font-size:18px;margin:20px 0;">${q.question}</p><div class="options-list">`;
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
    
    const relaxMethods = {
        breathing: [{ title: '方块呼吸法', description: '吸气4秒-屏息4秒-呼气4秒', icon: '🌬️', duration: '5分钟' }, { title: '腹式深呼吸', description: '深度呼吸缓解焦虑', icon: '💨', duration: '10分钟' }],
        meditation: [{ title: '身体扫描冥想', description: '从头到脚释放紧张', icon: '🧘', duration: '15分钟' }, { title: '正念冥想', description: '关注当下', icon: '🎯', duration: '10分钟' }],
        exercise: [{ title: '办公室拉伸', description: '缓解久坐不适', icon: '🙆', duration: '5分钟' }, { title: '正念行走', description: '将行走变成冥想', icon: '🚶', duration: '15分钟' }],
        lifestyle: [{ title: '睡眠改善', description: '改善睡眠质量', icon: '😴', duration: '持续' }, { title: '感恩日记', description: '记录美好事物', icon: '✨', duration: '10分钟' }]
    };
    
    function showRelaxCategory(category) {
        const methods = relaxMethods[category];
        let html = '';
        methods.forEach(m => {
            html += `<div class="relax-card"><div class="card-icon">${m.icon}</div><h4>${m.title}</h4><p>${m.description}</p><div class="card-meta"><span>⏱️ ${m.duration}</span></div></div>`;
        });
        document.getElementById('relax-content').innerHTML = html;
    }
    
    showRelaxCategory('breathing');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showRelaxCategory(this.dataset.category);
        });
    });
    
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
    document.getElementById('save-diary').addEventListener('click', function() {
        const content = document.getElementById('diary-content').value;
        const date = document.getElementById('diary-date').value;
        if (!content) { alert('请输入日记内容'); return; }
        const diaries = JSON.parse(localStorage.getItem('diaries')) || [];
        diaries.unshift({ date, content });
        localStorage.setItem('diaries', JSON.stringify(diaries));
        alert('日记保存成功！');
        document.getElementById('diary-content').value = '';
        document.getElementById('word-count').textContent = '0';
        loadDiaryHistory();
    });
    
    function loadDiaryHistory() {
        const diaries = JSON.parse(localStorage.getItem('diaries')) || [];
        const container = document.getElementById('diary-history-list');
        if (diaries.length === 0) {
            container.innerHTML = '<div class="empty-state"><span class="empty-icon">📔</span><p>暂无日记</p></div>';
            return;
        }
        let html = '';
        diaries.slice(0, 10).forEach(d => {
            html += `<div class="diary-item"><div class="diary-item-header"><span class="diary-date">${d.date}</span></div><div class="diary-preview">${d.content.substring(0, 50)}...</div></div>`;
        });
        container.innerHTML = html;
    }
    loadDiaryHistory();
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    document.getElementById('upgrade-btn').addEventListener('click', function() {
        document.getElementById('vip-modal').classList.add('active');
    });
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    if (userData.isVip) {
        document.querySelector('.status-free').style.display = 'none';
        document.querySelector('.status-vip').style.display = 'flex';
    }
});
