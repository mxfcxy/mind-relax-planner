// 心灵港湾 - 心理减压规划师
document.addEventListener('DOMContentLoaded', function() {
    // 用户数据
    let userData = JSON.parse(localStorage.getItem('userData')) || { isVip: false };
    
    // 导航功能
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            // 如果是VIP功能且不是VIP用户
            if (this.classList.contains('vip-item') && !userData.isVip) {
                document.getElementById('vip-modal').classList.add('active');
                return;
            }
            // 切换页面
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(page + '-page').classList.add('active');
        });
    });
    
    // 聊天功能
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // 快捷回复
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            chatInput.value = this.dataset.message;
            sendMessage();
        });
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        addMessage(message, 'user');
        chatInput.value = '';
        
        // AI回复
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'assistant');
        }, 800);
    }
    
    function addMessage(text, type) {
        const container = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="avatar">${type === 'user' ? '👤' : '🌸'}</div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    function generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('累') || lowerMsg.includes('疲惫')) {
            return "听起来您最近很疲惫。您能告诉我，最近是什么让您感到最累呢？";
        } else if (lowerMsg.includes('压力') || lowerMsg.includes('忙')) {
            return "压力确实是一个很普遍的问题。您能告诉我，最近是什么让您感到压力最大呢？";
        } else if (lowerMsg.includes('焦虑') || lowerMsg.includes('担心')) {
            return "焦虑是一种很正常的情绪反应。您能描述一下，是什么样的想法让您感到焦虑吗？";
        } else if (lowerMsg.includes('难过') || lowerMsg.includes('伤心')) {
            return "我能感受到您的低落情绪。有时候，允许自己难过也是一种勇气。";
        } else if (lowerMsg.includes('睡')) {
            return "睡眠问题确实会大大影响我们的生活质量。您是入睡困难，还是容易半夜醒来呢？";
        } else {
            return "我在认真听您说的每一句话。您能再和我多分享一些您的感受吗？";
        }
    }
    
    // 压力评估
    const questions = [
        {
            question: "在过去一周里，您多久会感到紧张或焦虑？",
            options: [
                { text: "几乎没有", score: 0 },
                { text: "偶尔，1-2天", score: 1 },
                { text: "有时，3-4天", score: 2 },
                { text: "经常，5-6天", score: 3 },
                { text: "几乎每天", score: 4 }
            ]
        },
        {
            question: "您是否发现自己难以放松或难以静下心来？",
            options: [
                { text: "从不", score: 0 },
                { text: "偶尔", score: 1 },
                { text: "有时", score: 2 },
                { text: "经常", score: 3 },
                { text: "总是如此", score: 4 }
            ]
        },
        {
            question: "您的睡眠质量如何？",
            options: [
                { text: "非常好，一觉到天亮", score: 0 },
                { text: "还不错，偶尔失眠", score: 1 },
                { text: "一般，有时难以入睡", score: 2 },
                { text: "较差，经常失眠", score: 3 },
                { text: "很差，严重失眠", score: 4 }
            ]
        },
        {
            question: "您是否感到疲惫或精力不足？",
            options: [
                { text: "精力充沛", score: 0 },
                { text: "偶尔疲惫", score: 1 },
                { text: "有时疲惫", score: 2 },
                { text: "经常疲惫", score: 3 },
                { text: "总是疲惫", score: 4 }
            ]
        },
        {
            question: "您最近与家人朋友的社交互动情况如何？",
            options: [
                { text: "很频繁，关系融洽", score: 0 },
                { text: "比较正常", score: 1 },
                { text: "有所减少", score: 2 },
                { text: "明显减少", score: 3 },
                { text: "几乎没有了", score: 4 }
            ]
        }
    ];
    
    let currentQuestion = 0;
    let assessmentScore = 0;
    let answers = [];
    
    document.getElementById('start-assessment').addEventListener('click', startAssessment);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('prev-question').addEventListener('click', prevQuestion);
    document.getElementById('retake-assessment').addEventListener('click', retakeAssessment);
    
    function startAssessment() {
        currentQuestion = 0;
        assessmentScore = 0;
        answers = [];
        document.getElementById('assessment-intro').style.display = 'none';
        document.getElementById('assessment-questions').style.display = 'block';
        showQuestion();
    }
    
    function showQuestion() {
        const question = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        
        document.getElementById('assessment-progress').style.width = progress + '%';
        
        let html = `<div class="question-item">
            <h4>问题 ${currentQuestion + 1}/${questions.length}</h4>
            <p style="font-size: 18px; margin: 20px 0;">${question.question}</p>
            <div class="options-list">`;
        
        question.options.forEach((option, index) => {
            const selected = answers[currentQuestion] === index ? 'selected' : '';
            html += `<button class="option-btn ${selected}" data-index="${index}">${option.text}</button>`;
        });
        
        html += '</div></div>';
        document.getElementById('question-container').innerHTML = html;
        
        // 绑定选项点击事件
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                answers[currentQuestion] = parseInt(this.dataset.index);
            });
        });
    }
    
    function nextQuestion() {
        if (answers[currentQuestion] === undefined) {
            alert('请选择一个选项');
            return;
        }
        
        assessmentScore += questions[currentQuestion].options[answers[currentQuestion]].score;
        
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            showResult();
        }
    }
    
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    }
    
    function showResult() {
        document.getElementById('assessment-questions').style.display = 'none';
        document.getElementById('assessment-result').style.display = 'block';
        
        const score = Math.min(assessmentScore * 5, 100);
        document.getElementById('score-value').textContent = score;
        
        let level, icon, description;
        
        if (score <= 20) {
            level = '压力较低';
            icon = '🌿';
            description = '您的心理状态良好，继续保持！';
        } else if (score <= 40) {
            level = '轻度压力';
            icon = '🍃';
            description = '有些小压力，注意适当放松。';
        } else if (score <= 60) {
            level = '中度压力';
            icon = '🍂';
            description = '压力较明显，建议采取减压措施。';
        } else if (score <= 80) {
            level = '高度压力';
            icon = '🍁';
            description = '压力较大，建议寻求专业帮助。';
        } else {
            level = '严重压力';
            icon = '🔴';
            description = '建议尽快寻求专业心理咨询。';
        }
        
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-title').textContent = level;
        document.getElementById('result-description').textContent = description;
    }
    
    function retakeAssessment() {
        document.getElementById('assessment-result').style.display = 'none';
        document.getElementById('assessment-intro').style.display = 'block';
    }
    
    // 减压方案
    const relaxMethods = {
        breathing: [
            { title: '方块呼吸法', description: '吸气4秒-屏息4秒-呼气4秒-屏息4秒', icon: '🌬️', duration: '5-10分钟', difficulty: '简单' },
            { title: '腹式深呼吸', description: '通过深度呼吸激活副交感神经', icon: '💨', duration: '10-15分钟', difficulty: '简单' }
        ],
        meditation: [
            { title: '身体扫描冥想', description: '从头到脚逐一感知身体各部位', icon: '🧘', duration: '15-20分钟', difficulty: '中等' },
            { title: '正念冥想', description: '培养当下觉察的能力', icon: '🎯', duration: '10-20分钟', difficulty: '中等' }
        ],
        exercise: [
            { title: '办公室拉伸', description: '简单的拉伸动作，缓解久坐不适', icon: '🙆', duration: '5-10分钟', difficulty: '简单' },
            { title: '正念行走', description: '将行走变成冥想', icon: '🚶', duration: '15-30分钟', difficulty: '简单' }
        ],
        lifestyle: [
            { title: '睡眠卫生', description: '改善睡眠质量的实用建议', icon: '😴', duration: '持续改善', difficulty: '需要坚持' },
            { title: '感恩日记', description: '每天记录感恩的事物', icon: '✨', duration: '每日10分钟', difficulty: '简单' }
        ]
    };
    
    function showRelaxCategory(category) {
        const methods = relaxMethods[category];
        let html = '';
        
        methods.forEach(method => {
            html += `
                <div class="relax-card">
                    <div class="card-icon">${method.icon}</div>
                    <h4>${method.title}</h4>
                    <p>${method.description}</p>
                    <div class="card-meta">
                        <span>⏱️ ${method.duration}</span>
                        <span>📊 ${method.difficulty}</span>
                    </div>
                </div>
            `;
        });
        
        document.getElementById('relax-content').innerHTML = html;
    }
    
    // 默认显示呼吸放松
    showRelaxCategory('breathing');
    
    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showRelaxCategory(this.dataset.category);
        });
    });
    
    // 心情日记
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
    
    function saveDiary() {
        const content = document.getElementById('diary-content').value;
        const date = document.getElementById('diary-date').value;
        const mood = document.querySelector('.mood-opt.active').dataset.mood;
        
        if (!content) {
            alert('请输入日记内容');
            return;
        }
        
        const diaries = JSON.parse(localStorage.getItem('diaries')) || [];
        diaries.unshift({
            date,
            mood,
            content,
            time: new Date().toISOString()
        });
        
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
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📔</span>
                    <p>暂无日记</p>
                    <p class="hint">开始记录您的第一份心情日记吧</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        const moodIcons = {
            happy: '😊',
            calm: '😌', 
            anxious: '😰',
            sad: '😔',
            angry: '😤'
        };
        
        diaries.slice(0, 10).forEach(diary => {
            html += `
                <div class="diary-item">
                    <div class="diary-item-header">
                        <span class="diary-date">${diary.date}</span>
                        <span class="diary-mood">${moodIcons[diary.mood] || '😐'}</span>
                    </div>
                    <div class="diary-preview">${diary.content.substring(0, 50)}...</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // 加载历史日记
    loadDiaryHistory();
    
    // 弹窗功能
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // VIP升级按钮
    document.getElementById('upgrade-btn').addEventListener('click', function() {
        document.getElementById('vip-modal').classList.add('active');
    });
    
    // 心情按钮
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // 更新用户UI
    function updateUserUI() {
        const statusFree = document.querySelector('.status-free');
        const statusVip = document.querySelector('.status-vip');
        
        if (userData.isVip) {
            if (statusFree) statusFree.style.display = 'none';
            if (statusVip) statusVip.style.display = 'flex';
        } else {
            if (statusFree) statusFree.style.display = 'flex';
            if (statusVip) statusVip.style.display = 'none';
        }
    }
    
    // 初始化UI
    updateUserUI();
});
