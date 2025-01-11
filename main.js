// ==UserScript==
// @name         IL.XDF.CN 自定义浮窗
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  浮窗支持悬停展开与收回，完整表单项和数据导出功能，支持快速选择学生姓名
// @author       您的名字
// @match        https://il.xdf.cn/plus/feedback/*
// @match        https://il.xdf.cn/plus/vip/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 创建浮窗
    const floatWindow = document.createElement('div');
    floatWindow.id = 'custom-float-window';
    floatWindow.style.position = 'fixed';
    floatWindow.style.bottom = '20px';
    floatWindow.style.right = '-350px';
    floatWindow.style.width = '350px';
    floatWindow.style.backgroundColor = 'white';
    floatWindow.style.border = '1px solid #ccc';
    floatWindow.style.borderRadius = '10px';
    floatWindow.style.padding = '15px';
    floatWindow.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    floatWindow.style.zIndex = '10000';
    floatWindow.style.fontSize = '14px';
    floatWindow.style.transition = 'right 0.3s ease';

    // 创建悬停标签
    const floatTab = document.createElement('div');
    floatTab.id = 'custom-float-tab';
    floatTab.textContent = '编辑';
    floatTab.style.position = 'fixed';
    floatTab.style.bottom = '20px';
    floatTab.style.right = '0px';
    floatTab.style.width = '40px';
    floatTab.style.height = '40px';
    floatTab.style.backgroundColor = '#01b289';
    floatTab.style.color = 'white';
    floatTab.style.textAlign = 'center';
    floatTab.style.lineHeight = '40px';
    floatTab.style.borderRadius = '10px 0 0 10px';
    floatTab.style.cursor = 'pointer';
    floatTab.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    floatTab.style.zIndex = '9999';

    // 表单内容
    floatWindow.innerHTML = `

    <div style="display: grid; gap: 15px; ">
        <!-- 学生姓名 -->
        <div>
            <label style="font-size: 14px; color: #333;">学生姓名：</label>
            <input type="text" id="student-name" style="width: 80%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
            <div id="stuName_add" style="margin-top: 5px;"></div>
        </div>

        <!-- 上课表现 -->
        <div>
            <label style="font-size: 14px; color: #333;">上课表现:</label>
            <input type="range" min="0" max="5" value="3" id="class-performance-range" style="width: 100%; appearance: none; height: 8px; border-radius: 10px; background: #01b289;">
            <div id="class-performance-value" style="text-align: center; margin-top: 5px; color: #666;">一般</div>
            <!-- <textarea id="class-performance-info" style="width: 80%; height: 60px; resize: none; border: 1px solid #ccc; border-radius: 5px; padding: 8px;" placeholder="课上表现补充"></textarea> -->
        </div>

        <!-- 复习表现 -->
        <div>
            <label style="font-size: 14px; color: #333;">复习表现:</label>
            <input type="range" min="0" max="5" value="3" id="review-performance-range" style="width: 100%; appearance: none; height: 8px; border-radius: 10px; background: #E5E7EB;">
            <div id="review-performance-value" style="text-align: center; margin-top: 5px; color: #666;">一般</div>
            <textarea id="review-performance-info" style="width: 80%; height: 60px; resize: none; border: 1px solid #ccc; border-radius: 5px; padding: 8px;" placeholder="课上综合表现补充信息"></textarea>
        </div>

        <!-- 口语表现 -->
        <div>
            <label style="font-size: 14px; color: #333;">口语</label><br>
            <label style="font-size: 14px; color: #666;">流利度:</label>
            <input type="range" min="0" max="5" value="3" id="fluency-range" style="width: 100%; appearance: none; height: 8px; border-radius: 10px; background: #E5E7EB;">
            <div id="fluency-value" style="text-align: center; margin-top: 5px; color: #666;">一般</div>
            <input type="checkbox" id="fluency-progress" style="margin-top: 5px;"> 比上节课有进步
            <br>

            <label style="font-size: 14px; color: #666; margin-top: 10px;">词汇量:</label>
            <input type="range" min="0" max="5" value="3" id="vocabulary-range" style="width: 100%; appearance: none; height: 8px; border-radius: 10px; background: #E5E7EB;">
            <div id="vocabulary-value" style="text-align: center; margin-top: 5px; color: #666;">一般</div>
            <input type="checkbox" id="vocabulary-progress" style="margin-top: 5px;"> 比上节课有进步

            <textarea id="oral-performance-info" style="width: 80%; height: 60px; resize: none; border: 1px solid #ccc; border-radius: 5px; padding: 8px; margin-top: 10px;" placeholder="口语补充信息"></textarea>
        </div>

        <!-- 听力表现 -->
        <div>
            <label style="font-size: 14px; color: #333;">听力表现:</label>
            <input type="range" min="0" max="5" value="3" id="listening-performance-range" style="width: 100%; appearance: none; height: 8px; border-radius: 10px; background: #E5E7EB;">
            <div id="listening-performance-value" style="text-align: center; margin-top: 5px; color: #666;">一般</div>
            <textarea id="listening-performance-info" style="width: 80%; height: 60px; resize: none; border: 1px solid #ccc; border-radius: 5px; padding: 8px;" placeholder="听力补充信息"></textarea>
        </div>

        <!-- 按钮 -->
        <div style="text-align: center; margin-top: 10px;">
            <button id="copy-instruction-button" style="background-color: white; color: #0973fd; padding: 10px 20px; border-radius: 5px; border: solid 2px #0973fd; cursor: pointer;">复制指令</button>
            <button id="export-button" style="background-color: white; color: #f39802; padding: 10px 20px; border-radius: 5px; border: solid 2px #f39802; cursor: pointer; margin-left: 10px;">复制数据</button>
            <p style="color: gray">点击后将自动复制文字到你的剪切板中</p>
        </div>
    </div>
`;

    document.body.appendChild(floatWindow);
    document.body.appendChild(floatTab);

    // 更新滑动条文字和填充效果
    function updateSlider(sliderId, displayId) {
        const labels = ["此项不参与评价", "薄弱", "还需加油", "一般", "尚可", "很棒"];
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(displayId);

        function update() {
            const value = slider.value;
            const percentage = (value / 5) * 100;
            display.textContent = labels[value];
            slider.style.background = `linear-gradient(to right, #F39801 ${percentage}%, #E5E7EB ${percentage}%)`;
        }

        slider.addEventListener('input', update);
        update();
    }

    updateSlider('class-performance-range', 'class-performance-value');
    updateSlider('review-performance-range', 'review-performance-value');
    updateSlider('fluency-range', 'fluency-value');
    updateSlider('vocabulary-range', 'vocabulary-value');
    updateSlider('listening-performance-range', 'listening-performance-value');

    let isHovering = false;
    let expandTimeout = null;
    const expandedPosition = '20px';
    const collapsedPosition = '-350px';

    function addStuButton() {
        // 获取学生姓名
        const checkForStudentNames = () => {
            // 查找学生姓名
            const studentNameElements = document.querySelectorAll('.studentNameBox.active span');

            if (studentNameElements.length > 0) {
                // 获取所有学生姓名
                const studentNames = Array.from(studentNameElements).map(el => el.textContent.trim());
                console.log('学生姓名:', studentNames);

                // 过滤掉可能的 null 值
                const filteredNames = studentNames.filter(name => name !== null);
                if (filteredNames.length === 0) {
                    filteredNames.push("全体同学");
                } else {
                    filteredNames.unshift("全体同学");
                }
                console.log(filteredNames);

                var stuNameInput = document.getElementById("stuName_add");
                stuNameInput.innerHTML = ''; // 清空之前的按钮
                filteredNames.forEach(name => {
                    var stuButton = document.createElement("button");
                    stuButton.textContent = name;
                    stuButton.style.margin = "0 5px 5px 0";
                    stuButton.style.padding = "5px 10px";
                    //stuButton.style.border = "solid 2px #F39801";
                    stuButton.style.borderRadius = "5px";
                    stuButton.style.backgroundColor = "#F39801";
                    stuButton.style.color = "white";
                    stuButton.style.cursor = "pointer";
                    stuButton.style.fontSize = "14px";
                    stuButton.addEventListener('click', () => {
                        document.getElementById('student-name').value = name;
                    });
                    stuNameInput.appendChild(stuButton);
                });
            } else {
                // 如果没有找到数据，稍后再次尝试
                console.log('数据尚未加载，稍后重试...');
                setTimeout(checkForStudentNames, 500); // 500 毫秒后重试
            }
        };

        // 开始轮询
        checkForStudentNames();
    }

    function expandWindow() {
        clearTimeout(expandTimeout);
        floatWindow.style.right = expandedPosition;
        isHovering = true;
    }

    function collapseWindow() {
        expandTimeout = setTimeout(() => {
            if (!isHovering) {
                floatWindow.style.right = collapsedPosition;
            }
        }, 300);
        isHovering = false;
    }

    window.onload = function () {
        addStuButton();
    }

    floatTab.addEventListener('mouseenter', expandWindow);
    floatTab.addEventListener('mouseleave', collapseWindow);
    floatWindow.addEventListener('mouseenter', expandWindow);
    floatWindow.addEventListener('mouseleave', collapseWindow);

    document.getElementById('copy-instruction-button').addEventListener('click', () => {
        const instruction = `我的指令是否能被你合理的理解，如果不行的话请你帮我重新组织、调整：
我会给你有关我的学生上课表现的打分的数据。请你根据打分给出面向家长的学生学情反馈。
要求：
1. 用语专业化，但是要有亲和力。避免使用“学生”，“她”“他”这个词，而应当使用学生的真实姓名，或者去掉姓只说名字更好。
2. 给出切实可行的、用语简洁的建议。给不同学生建议时，要和之前的建议用语不同
3. 如果学生某一方面做的不好，给予评价的时候要充分尊重学生、用语谨慎。同时用语注意符合中文习惯，比如“表现稳定”这种就很诡异。
4. 200字以内，不要分点或者使用书信的格式或者问候家长等等，客观、直接书写即可
5. 如果有打分，则该项满分5分，最低分1分，3分代表还行。如果为0则说明此项不需要参考，直接忽略这个字段，并且禁止在输出的文本中提及此字段的任何内容。此外，如果有补充信息，则补充信息的优先级小于评分。
6. 如果“xxx进步”为false，仅代表不和之前的表现进行对比，不代表没有进步或者进步缓慢。遇到这种情况直接忽略这个字段即可，禁止输出到文本中。`;
        navigator.clipboard.writeText(instruction).then(() => console.log('复制成功！'));
    });

    document.getElementById('export-button').addEventListener('click', () => {
        const data = {
            姓名: document.getElementById('student-name').value,
            课上表现: document.getElementById('class-performance-range').value,
            //课上表现补充信息: document.getElementById('class-performance-info').value,
            复习表现: document.getElementById('review-performance-range').value,
            课上表现补充信息: document.getElementById('review-performance-info').value,
            口语流利度: document.getElementById('fluency-range').value,
            口语流利度进步: document.getElementById('fluency-progress').checked,
            口语词汇量: document.getElementById('vocabulary-range').value,
            口语词汇量进步: document.getElementById('vocabulary-progress').checked,
            口语表现补充说明: document.getElementById('oral-performance-info').value,
            听力表现: document.getElementById('listening-performance-range').value,
            听力表现补充信息: document.getElementById('listening-performance-info').value
        };

        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
            .then(() => console.log('导出成功！已复制到剪贴板'))
            .catch(err => console.error('导出失败:', err));
    });
})();
