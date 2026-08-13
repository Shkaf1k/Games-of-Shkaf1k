function updateUI() {
    document.getElementById("chip-name").innerText = userState.name;
    document.getElementById("chip-avatar").src = userState.avatar;
    document.getElementById("modal-avatar").src = userState.avatar;
    document.getElementById("modal-display-name").innerText = userState.name;
    document.getElementById("modal-banner").style.backgroundImage = `url('${userState.banner}')`;
    
    document.getElementById("input-name").value = userState.name;
    document.getElementById("input-avatar-url").value = userState.avatar;
    document.getElementById("input-banner-url").value = userState.banner;
    document.getElementById("input-bio").value = userState.bio;

    let verBadges = [document.getElementById("chip-verified"), document.getElementById("modal-verified")];
    verBadges.forEach(el => el.style.display = userState.isVerified ? "inline" : "none");

    renderAchievements();
    renderFriends();
}

function openFriendModal(index) {
    let friend = userState.friends[index];
    if (!friend) return;

    document.getElementById("friend-modal-name").innerText = friend.name;
    document.getElementById("friend-modal-avatar").src = friend.avatar;
    document.getElementById("friend-modal-banner").style.backgroundImage = `url('${friend.banner}')`;
    document.getElementById("friend-modal-bio").innerText = friend.bio || "Нет описания.";
    document.getElementById("friend-modal-verified").style.display = friend.isVerified ? "inline" : "none";
    document.getElementById("friend-modal-ach").innerText = `Открыто достижений: ${friend.achCount || 0} / ${ACHIEVEMENTS.length}`;

    unlockAch('view_friend');
    openModal('friend-view-modal');
}

function renderFriends() {
    let container = document.getElementById("friends-list");
    container.innerHTML = "";

    if (!userState.friends || userState.friends.length === 0) {
        container.innerHTML = `<div style="color:#444; font-size:0.65rem;">Список пуст</div>`;
        return;
    }

    userState.friends.forEach((friend, idx) => {
        container.innerHTML += `
            <div class="friend-item" onclick="openFriendModal(${idx})">
                <div class="friend-info">
                    <img src="${friend.avatar}" class="friend-avatar" alt="avatar" onerror="this.src='https://picsum.photos/50'">
                    <span style="font-size:0.75rem;">${friend.name}</span>
                </div>
                <span class="friend-remove" onclick="event.stopPropagation(); removeFriend(${idx})">✕</span>
            </div>
        `;
    });
}

function unlockAch(id) {
    if (!userState.unlockedAch.includes(id)) {
        userState.unlockedAch.push(id);
        saveData();
        let ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) showAchievementPopup(ach.title);
    }
}

function showAchievementPopup(title) {
    let pop = document.getElementById("achievement");
    document.getElementById("ach-title").innerText = title;
    pop.classList.add("show");
    setTimeout(() => pop.classList.remove("show"), 3500);
}

function renderAchievements() {
    let container = document.getElementById("achievements-container");
    container.innerHTML = "";
    ACHIEVEMENTS.forEach(ach => {
        let unlocked = userState.unlockedAch.includes(ach.id);
        container.innerHTML += `
            <div class="ach-item ${unlocked ? 'unlocked' : ''}">
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-info">
                    <div class="ach-title">${ach.title}</div>
                    <div class="ach-desc">${ach.desc}</div>
                </div>
                <div class="ach-status">${unlocked ? '[ ПОЛУЧЕНО ]' : '[ ЗАКРЫТО ]'}</div>
            </div>
        `;
    });
}

function verifyCode() {
    let code = document.getElementById("input-code").value.trim();
    if (code === "GODOT2026") {
        userState.isVerified = true;
        unlockAch('verified');
        saveData();
        showAchievementPopup("Галочка получена!");
    } else {
        alert("Неверный код верификации!");
    }
}

function saveProfileData() {
    userState.name = document.getElementById("input-name").value;
    userState.avatar = document.getElementById("input-avatar-url").value;
    userState.banner = document.getElementById("input-banner-url").value;
    userState.bio = document.getElementById("input-bio").value;
    
    unlockAch('profile_setup');
    saveData();
    closeModal('profile-modal');
}

function openModal(id) {
    document.getElementById(id).classList.add("active");
    if (id === 'ach-modal') unlockAch('ach_viewer');
}

function closeModal(id) { 
    document.getElementById(id).classList.remove("active"); 
}

let secretClicks = 0;
function clickSecret() {
    secretClicks++;
    if (secretClicks >= 5) unlockAch('secret_click');
}

function clickPlay() { 
    unlockAch('play_click'); 
}

let sec = 0;
setInterval(() => {
    sec++;
    document.getElementById("timer").innerText = sec;
    if (sec === 60) unlockAch('time_1m');
    if (sec === 300) unlockAch('time_5m');
}, 1000);

document.getElementById("year").innerText = new Date().getFullYear();

// Инициализация при загрузке страницы
loadData();
