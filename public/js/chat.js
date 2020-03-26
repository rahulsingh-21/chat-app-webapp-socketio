const socket = io()

const $messages =document.querySelector('#messages')

//templates

const messagetemplate =document.querySelector('#msgtemplate').innerHTML
const locationtemplate =document.querySelector('#loctemplate').innerHTML
const sidebartemplate =document.querySelector('#sidetemp').innerHTML

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    const $newMsg = $messages.lastElementChild

    const newMsgstyle = getComputedStyle($newMsg)
    const newMsgmargin = parseInt(newMsgstyle.marginBottom)
    const newMsgheight = $newMsg.offsetHeight + newMsgmargin

    const visheight = $messages.offsetHeight
    const contheight = $messages.scrollHeight
    const scrolloffset = $messages.scrollTop+visheight

    if(contheight-newMsgheight<=scrolloffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createAt:moment(message.createAt).format('h:mm A')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationtemplate,{
        username:url.username,
        url:url.url,
        createAt:moment(url.createAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#sub').addEventListener('submit',(e)=>{
    e.preventDefault()
    const inputMsg=document.querySelector('.inp')
    const msg = inputMsg.value
    socket.emit('sendMessage',msg, (message)=>{
        inputMsg.value=''
        inputMsg.focus()
        console.log('message was been sent',message)
    })
})

document.querySelector('#sendloc').addEventListener('click',()=>{

    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position)
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(message)=>{
            console.log('location coords sent!',message)
        })
    })
})

socket.emit('join',{username,room})