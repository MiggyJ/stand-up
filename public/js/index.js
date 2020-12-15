const { ipcRenderer } = require('electron/renderer')

//? Event Emitters
const quitBtn    = document.getElementById('quitBtn')
const startBtn   = document.getElementById('startBtn')
const resetBtn   = document.getElementById('resetBtn')
const hideBtn    = document.getElementById('hideBtn')
const confirmBtn = document.getElementById('confirmBtn')

//? Timer Toggle
let sitting = true

//? Timer Text
const timer = document.getElementById('timer')
const stand = document.getElementById('stand')

//? Timer Alarm
var alarm = new Audio('asset/alarm.mp3')

//? Message Text
const message = document.getElementById('message')

//? Time in Minutes
let sittingTime  = 25
let standingTime = 5

//? Initialize Page 
timer.innerText = sittingTime > 10 ? `${sittingTime}m 00s` : `0${sittingTime}m 00s`
stand.innerText = standingTime > 10 ? `${standingTime}m 00s` : `0${standingTime}m 00s`

//? Event Functions
//* Timer for Sitting
const sittingFunction = () => {
    alarm.pause()
    alarm.currentTime = 0
    startBtn.classList.replace('btn-outline-success', 'btn-outline-secondary')
    startBtn.setAttribute('disabled', 'true')
    stand.parentElement.classList.add('text-secondary')
    timer.parentElement.classList.remove('text-secondary')
    sitting = true
    let seconds = 0
    let minutes = sittingTime
    const sitTimer = setInterval(() => {
        if (seconds === 0 && minutes === 0) {
            clearInterval(sitTimer)
            alarm.play()
            ipcRenderer.send('TIME_UP')
            message.innerText = 'Stop sitting, STAND UP!'
            confirmBtn.innerText = "I'm Standing"
            $('#confirmModal').modal('show') //? BOOTSTRAP FUNCTION
        } else {
            if (seconds === 0 && minutes !== 0) {
                seconds = 59
                minutes--
            } else {
                seconds--
            }
        }
        timer.innerText = minutes > 10 ? `${minutes}m ${seconds}s` : `0${minutes}m 0${seconds}s`
        resetBtn.onclick = function() {
            clearInterval(sitTimer)
            timer.innerText = sittingTime > 10 ? `${sittingTime}m 00s` : `0${sittingTime}m 00s`
            stand.innerText = standingTime > 10 ? `${standingTime}m 00s` : `0${standingTime}m 00s`
            startBtn.classList.replace('btn-outline-secondary', 'btn-outline-success')
            startBtn.removeAttribute('disabled')
            stand.parentElement.classList.remove('text-secondary')
            timer.parentElement.classList.remove('text-secondary')
            resetBtn.removeEventListener('click', this)
        }
    }, 1000)
}

//* Timer for Standing
const standingFunction = () => {
    alarm.pause()
    alarm.currentTime = 0
    timer.parentElement.classList.add('text-secondary')
    stand.parentElement.classList.remove('text-secondary')
    sitting = false
    let seconds = 0
    let minutes = standingTime
    const standTimer = setInterval(() => {
        if (seconds === 0 && minutes === 0) {
            clearInterval(standTimer)
            alarm.play()
            ipcRenderer.send('TIME_UP')
            message.innerText = 'You can sit.'
            confirmBtn.innerText = "I'm Sitting"
            $('#confirmModal').modal('show') //? BOOTSTRAP FUNCTION
        } else {
            if (seconds === 0 && minutes !== 0) {
                seconds = 59
                minutes--
            } else {
                seconds--
            }
        }
        stand.innerText = minutes > 10 ? `${minutes}m ${seconds}s` : `0${minutes}m 0${seconds}s`
        resetBtn.onclick = () => {
            clearInterval(standTimer)
            timer.innerText = sittingTime > 10 ? `${sittingTime}m 00s` : `0${sittingTime}m 00s`
            stand.innerText = standingTime > 10 ? `${standingTime}m 00s` : `0${standingTime}m 00s`
            startBtn.classList.replace('btn-outline-secondary', 'btn-outline-success')
            startBtn.removeAttribute('disabled')
            stand.parentElement.classList.remove('text-secondary')
            timer.parentElement.classList.remove('text-secondary')
            resetBtn.removeEventListener('click')
        }
    }, 1000)
}

/**
 * TODO: modify confirmBtn with toggle variable
 */

//? Timer Events
//* Start Sitting Timer
startBtn.addEventListener('click', sittingFunction)

//* Start Standing Timer
confirmBtn.addEventListener('click', () => {
    sitting === true ? standingFunction() : sittingFunction()
})

//? Window Controllers
//* Quit
quitBtn.addEventListener('click', () => {
    ipcRenderer.send('QUIT_APP')
})

//* Hide/Minimize
hideBtn.addEventListener('click', () => {
    ipcRenderer.send('HIDE_APP')
})

