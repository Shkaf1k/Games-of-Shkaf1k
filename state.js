let userState = {
    name: "Игрок_" + Math.floor(Math.random() * 1000),
    avatar: "https://picsum.photos/id/1025/100/100",
    banner: "https://picsum.photos/id/1060/500/200",
    bio: "Игрок системы.",
    isVerified: false,
    unlockedAch: [],
    friends: []
};

function loadData() {
    let saved = localStorage.getItem("user_system_data_b64");
    if (saved) {
        try {
            userState = Object.assign(userState, JSON.parse(saved));
        } catch(e) {
            console.error("Ошибка чтения памяти", e);
        }
    }
    unlockAch('first_visit');
    updateUI();
}

function saveData() {
    localStorage.setItem("user_system_data_b64", JSON.stringify(userState));
    updateUI();
}
