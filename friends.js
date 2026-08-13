function utf8_to_b64(str) {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => 
            String.fromCharCode('0x' + p1)
        ));
    } catch (e) {
        return "";
    }
}

function b64_to_utf8(str) {
    try {
        let cleanB64 = str.replace(/\s+/g, '');
        return decodeURIComponent(Array.prototype.map.call(atob(cleanB64), c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
    } catch (e) {
        return null;
    }
}

function generateMyBase64Code() {
    let payload = {
        name: userState.name,
        avatar: userState.avatar,
        banner: userState.banner,
        bio: userState.bio,
        isVerified: userState.isVerified,
        achCount: userState.unlockedAch.length
    };
    return utf8_to_b64(JSON.stringify(payload));
}

function copyMyCode() {
    let code = generateMyBase64Code();
    if (!code) return alert("Ошибка сгенерированного кода!");
    prompt("Твой код друга! Скопируй его и отправь другу:", code);
}

function addFriendByCode() {
    let rawInput = prompt("Вставь Base64-код друга сюда:");
    if (!rawInput) return;

    let decodedJson = b64_to_utf8(rawInput);
    if (!decodedJson) {
        alert("❌ Неверный или поврежденный код!");
        return;
    }

    try {
        let friendObj = JSON.parse(decodedJson);
        if (!friendObj || !friendObj.name) return alert("❌ Неверные данные.");
        if (friendObj.name === userState.name) return alert("⚠️ Нельзя добавить самого себя!");
        if (userState.friends.some(f => f.name === friendObj.name)) return alert("⚠️ Игрок уже в списке!");

        userState.friends.push(friendObj);
        unlockAch('first_friend');
        if (userState.friends.length >= 3) unlockAch('squad');
        
        saveData();
        alert(`✅ Игрок ${friendObj.name} добавлен!`);
    } catch (e) {
        alert("❌ Ошибка при чтении кода.");
    }
}

function removeFriend(index) {
    if (confirm(`Удалить ${userState.friends[index].name} из друзей?`)) {
        userState.friends.splice(index, 1);
        saveData();
    }
}
