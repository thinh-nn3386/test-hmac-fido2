const salt1 = document.getElementById('salt1')
const rawId = document.getElementById('rawid')
const secret = document.getElementById('secret')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const hmacCreateSecret = async () => {
    const response = await window.fido2.hmacCreateSecret()
    rawId.innerText = `RawId (v${response.rawId})`
    salt1.innerText = `Secret salt1 (v${response.salt1})`
}

const hmacGetSecret = async () => {
    const response = await window.fido2.hmacGetSecret()
    secret.innerText = `Secret: (v${response})`
}

const setButton1 = document.getElementById('btn1')
setButton1.addEventListener('click', () => {
    hmacCreateSecret()
});

const setButton2 = document.getElementById('btn2')
setButton2.addEventListener('click', () => {
    secret.innerText = `Secret: ...`
    hmacGetSecret()
});





