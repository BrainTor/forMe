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
            if (res.status === 'ok') checker = true
            else {
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
        localStorage.setItem('token', result.token)
        await loadLvl(lvl + 1)
        lvl++
        document.querySelector('.floatingActionButton').classList.remove('n-class')
        document.querySelector('.floatingActionButton').classList.add('f-class')

    } else alert('Бан через 3 попытки')

}

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
    if (state == 'add' || state == 'delete') {
        if (document.querySelector('.' + state).classList.contains('n-class'))
            document.querySelector('.' + state).classList.remove('n-class')
        document.querySelector('.' + state).classList.add('f-class')
    }

    document.querySelector('.' + lvls[lvl - 1]).classList.remove('f-class')
    document.querySelector('.' + lvls[lvl - 1]).classList.add('n-class')

}