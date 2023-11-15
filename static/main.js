var getValue;
var lvl = 0;
var lvls = ['secret', 'control', 'switch', 'days', 'info']
var state
var typeOfLesson
var day

async function checkJwt() {
    let checker
    if (localStorage.getItem('token') === null) return false
    await fetch('/checkToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: localStorage.getItem('token') })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === 'ok') {
                window.jwt = localStorage.getItem('token')

                checker = true
            } else {
                localStorage.clear()
                checker = false
            }
        }).catch((error) => {
            alert('Ошибка связи с сервером' + error)
            checker = false
        })
    return checker | false
}

document.querySelector('body').onload = async() => {
    if (!await checkJwt())
        return
    await loadLvl(lvl + 1)
    lvl++
    document.querySelector('.floatingActionButton').classList.remove('n-class')
    document.querySelector('.floatingActionButton').classList.add('f-class')
}

document.querySelector('#buttonSend').onclick = async() => {
    getValue = document.querySelector('#inputSecret').value
    var result = await fetch('/checkPas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: getValue })
    }).then((res) => res.json())
    if (result.status === 'ok') {
        window.jwt = result.token
        localStorage.setItem('token', result.token)
        await loadLvl(lvl + 1)
        lvl++
        document.querySelector('.floatingActionButton').classList.remove('n-class')
        document.querySelector('.floatingActionButton').classList.add('f-class')

    } else alert('Бан через 3 попытки')

}

let _onloads = {}

async function loadLvl(lvlGets) {
    lvls.forEach((element, index) => {
        if (index == lvlGets) {
            document.querySelector('.' + lvls[index - 1]).classList.remove('f-class')
            document.querySelector('.' + lvls[index - 1]).classList.add('n-class')
            if (document.querySelector('.' + lvls[index]).classList.contains('n-class'))
                document.querySelector('.' + lvls[index]).classList.remove('n-class')
            document.querySelector('.' + lvls[index]).classList.add('f-class')
        }
    })
}

document.querySelector('.floatingActionButton').onclick = () => {
    if (lvl == 1) {
        alert('Достигнут максимум')
        return
    }

    lvls.forEach((element, index) => {
        if (lvl == index) {
            document.querySelector('.' + lvls[index]).classList.remove('f-class')
            document.querySelector('.' + lvls[index]).classList.add('n-class')
            if (document.querySelector('.' + lvls[index - 1]).classList.contains('n-class'))
                document.querySelector('.' + lvls[index - 1]).classList.remove('n-class')
            document.querySelector('.' + lvls[index - 1]).classList.add('f-class')
        }
    })
    lvl--
    showCont.classList.remove("f-class")
    showCont.classList.add("n-class")
}

async function clickControlButton(type) {
    state = type
    lvl++
    await loadLvl(lvl)

}

async function switchButtonClick(type) {
    typeOfLesson = type
    lvl++
    await loadLvl(lvl)
}

async function dayButtonClick(type) {
    day = type
    lvl++
    if (state == 'add') {
        if (document.querySelector('.add').classList.contains('n-class'))
            document.querySelector('.add').classList.remove('n-class')
        document.querySelector('.add').classList.add('f-class')
    } else if (state === "show") _onloads["show"]()
    alert(state)
    document.querySelector('.' + lvls[lvl - 1]).classList.remove('f-class')
    document.querySelector('.' + lvls[lvl - 1]).classList.add('n-class')

}

// Function to get events by JWT
async function getEvents() {
    const response = await fetch('/events', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    const data = await response.json();
    return data;
}

// Function to add an event by JWT
async function addEvent(eventData) {
    const response = await fetch('/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(eventData)
    });
    const data = await response.json();
    return data;
}

// Function to remove an event by JWT and event ID
async function removeEvent(eventId) {
    const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    const data = await response.json();
    return data;
}

_onloads["show"] = () => {
    document.querySelector(".show").classList.remove("n-class")
    document.querySelector(".show").classList.add("f-class")
    mount.innerHTML = '';
    getEvents().then(ev => {
        ev.forEach(e => {
            if (typeOfLesson !== "Все" && e.name !== typeOfLesson) return;
            if (day !== e.date) return;
            mount.innerHTML += `<div class="item">
        <p class = "timeShow">${e.date} ${e.time}</p>
        <p class = "nameShow">${e.name} - ${e.extra}</p>
        <button class = "buttonShow"  onclick="removeHandler('${e._id}')">Удалить</button>
</div>`
        })
    })
}

function addHandler() {
    addEvent({ name: typeOfLesson, "date": day, extra: nameAdd.value, time: dateAdd.value });
    alert("Добавлено");
    location.reload();
}

function removeHandler(id) {
    removeEvent(id);
    alert("Удалено");
    location.reload();
}